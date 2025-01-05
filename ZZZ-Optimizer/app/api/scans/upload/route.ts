import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { diskDriveTable, diskRandomStatTable, userTable } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { DiskScan } from "@/lib/utils";

interface UploadRequestBody {
  scans: DiskScan[];
}

//API route for uploading scan data to the database
export async function POST(request: NextRequest) {
  const session = await getServerSession(authConfig);
  const userEmail = session?.user?.email;

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized / Not logged in" },
      { status: 401 },
    );
  }

  if (!userEmail) {
    return NextResponse.json(
      { error: "Account has no email" },
      { status: 401 },
    );
  }

  //get user from database
  const user = await db
    .select()
    .from(userTable)
    .where(eq(userTable.userEmail, userEmail))
    .limit(1);

  if (!user || user.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const userId = user[0].id;

  //get diskScans from the request body (its a scanData[] object)
  try {
    const { scans }: UploadRequestBody = await request.json();
    const lastUploadTime = new Date().toISOString();

    // Start a transaction to ensure all operations succeed or fail together
    await db.transaction(async (tx) => {
      // First, delete all existing disk drives and their random stats for this user
      const existingDrives = await tx
        .select({ id: diskDriveTable.id })
        .from(diskDriveTable)
        .where(eq(diskDriveTable.userId, userId));

      if (existingDrives.length > 0) {
        const driveIds = existingDrives.map((drive) => drive.id);

        // Delete associated random stats for the drives we're deleting
        await tx
          .delete(diskRandomStatTable)
          .where(inArray(diskRandomStatTable.diskDriveId, driveIds));

        // Then delete the drives for this user
        await tx
          .delete(diskDriveTable)
          .where(eq(diskDriveTable.userId, userId));
      }

      // Insert new disk drives
      for (const scan of scans) {
        // Insert the disk drive
        const [newDrive] = await tx
          .insert(diskDriveTable)
          .values({
            userId: userId,
            setName: scan.set_name,
            partitionNumber: scan.partition_number,
            driveRarity: scan.drive_rarity,
            driveCurrentLevel: scan.drive_current_level,
            driveMaxLevel: scan.drive_max_level,
            driveBaseStat: scan.drive_base_stat,
            driveBaseStatNumber: scan.drive_base_stat_number.toString(),
          })
          .returning({ id: diskDriveTable.id });

        // Insert random stats for this drive
        await tx.insert(diskRandomStatTable).values(
          scan.random_stats.map((stat) => ({
            diskDriveId: newDrive.id,
            statName: stat.baseStat,
            statUpgradeLevel: stat.upgradeNum,
            statValue: stat.value.toString(),
          })),
        );
      }

      // Update the user's latest upload time using the provided timestamp
      await tx
        .update(userTable)
        .set({ latestUploadTime: new Date(lastUploadTime) })
        .where(eq(userTable.id, userId));
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing scan data:", error);
    return NextResponse.json(
      { error: "Failed transaction to upload scan data" },
      { status: 500 },
    );
  }
}
