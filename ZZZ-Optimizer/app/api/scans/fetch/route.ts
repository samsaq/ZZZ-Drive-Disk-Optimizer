import { db } from "@/db/db";
import { eq, inArray } from "drizzle-orm";
import { diskDriveTable, diskRandomStatTable, userTable } from "@/db/schema";
import { authConfig } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { DiskScan } from "@/lib/utils";

//API route for fetching scan data from the database
export async function GET(request: NextRequest) {
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

  try {
    // Get user and their latest upload time
    const user = await db
      .select({
        id: userTable.id,
        latestUploadTime: userTable.latestUploadTime,
      })
      .from(userTable)
      .where(eq(userTable.userEmail, userEmail))
      .limit(1);

    if (!user || user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = user[0].id;

    // Update last activity
    await db
      .update(userTable)
      .set({ lastActivity: new Date() })
      .where(eq(userTable.id, userId));

    // Get all disk drives for the user
    const drives = await db
      .select()
      .from(diskDriveTable)
      .where(eq(diskDriveTable.userId, userId));

    // Get all random stats for these drives
    const driveIds = drives.map((drive) => drive.id);
    const randomStats = await db
      .select()
      .from(diskRandomStatTable)
      .where(inArray(diskRandomStatTable.diskDriveId, driveIds));

    // Transform the data into DiskScan format
    const diskScans: DiskScan[] = drives.map((drive) => {
      const driveRandomStats = randomStats.filter(
        (stat) => stat.diskDriveId === drive.id,
      );

      //check that the partition number is indeed a string number between 1 and 6
      if (
        drive.partitionNumber !== "1" &&
        drive.partitionNumber !== "2" &&
        drive.partitionNumber !== "3" &&
        drive.partitionNumber !== "4" &&
        drive.partitionNumber !== "5" &&
        drive.partitionNumber !== "6"
      ) {
        throw new Error("Invalid partition number");
      }

      //check that drive rarity is indeed an "B", "A", or "S"
      if (
        drive.driveRarity !== "B" &&
        drive.driveRarity !== "A" &&
        drive.driveRarity !== "S"
      ) {
        throw new Error("Invalid drive rarity");
      }

      return {
        set_name: drive.setName,
        partition_number: drive.partitionNumber,
        drive_rarity: drive.driveRarity,
        drive_current_level: drive.driveCurrentLevel,
        drive_max_level: drive.driveMaxLevel,
        drive_base_stat: drive.driveBaseStat,
        drive_base_stat_number: drive.driveBaseStatNumber,
        random_stats: driveRandomStats.map((stat) => ({
          baseStat: stat.statName,
          upgradeNum: stat.statUpgradeLevel,
          value: stat.statValue,
        })),
      };
    });

    return NextResponse.json({
      diskScans,
      lastUploadTime: user[0].latestUploadTime?.toISOString() ?? null,
    });
  } catch (error) {
    console.error("Error fetching scan data:", error);
    return NextResponse.json(
      { error: "Failed to fetch scan data" },
      { status: 500 },
    );
  }
}
