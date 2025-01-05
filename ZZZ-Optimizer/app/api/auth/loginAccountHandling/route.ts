//API route for handling login & account creation (auth is handled via next-auth)

import { authConfig } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

//Handles getting a uuid we can use to fetch user data by
//creating a new user if they don't exist or just grabbing their uuid if they do
export async function POST(request: NextRequest) {
  //for now, we're assuming all our OAuth options allow give us an email to work with
  const session = await getServerSession(authConfig);
  const userEmail = session?.user?.email;
  //throw an error if the user doesn't have an email
  if (!userEmail) {
    return NextResponse.json(
      { error: "Account has no email" },
      { status: 401 },
    );
  } //NOTE: Temporary & just for testing since I want to confirm every oauth provider gives me an email

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  //Check if the user already exists
  const user = await db
    .select()
    .from(userTable)
    .where(eq(userTable.userEmail, userEmail))
    .limit(1);

  console.log("User:", user);

  //if the user doesn't exist, create a new user
  if (user.length === 0) {
    //we just need to populate the email, everything else is auto-generated or added at upload time
    const newUser = await db
      .insert(userTable)
      .values({
        userEmail: userEmail,
      })
      .returning();

    console.log("New user created:", newUser);

    if (newUser[0]?.uuid) {
      return NextResponse.json({ uuid: newUser[0].uuid });
    } else {
      console.log("Failed to create user");
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 },
      );
    }
  }

  //if the user already exists, just set the login data
  else if (user[0]?.uuid) {
    return NextResponse.json({ uuid: user[0].uuid });
  } else {
    console.log("Failed to get user uuid");
    return NextResponse.json(
      { error: "Failed to get user uuid" },
      { status: 500 },
    );
  }
}
