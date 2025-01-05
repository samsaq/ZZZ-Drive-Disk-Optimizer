import {
  pgTable,
  serial,
  timestamp,
  uuid,
  text,
  integer,
} from "drizzle-orm/pg-core";

// User Table, just used to track accounts and be referenced by other tables (eg: the disk drive table)
export const userTable = pgTable("user", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom(),
  userEmail: text("user_email").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  latestUploadTime: timestamp("latest_upload_time"),
});

//Disk Drive table, used to store all user's disk drives
export const diskDriveTable = pgTable("disk_drive", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => userTable.id),
  createdAt: timestamp("created_at").defaultNow(),

  setName: text("set_name").notNull(),
  partitionNumber: text("partition_number").notNull(),
  driveRarity: text("drive_rarity").notNull(),
  driveCurrentLevel: integer("drive_current_level").notNull(),
  driveMaxLevel: integer("drive_max_level").notNull(),
  driveBaseStat: text("drive_base_stat").notNull(),
  driveBaseStatNumber: text("drive_base_stat_number").notNull(),
});

//Sub stats are kept in a seperate table, and reference their drives in the diskDriveTable
export const diskRandomStatTable = pgTable("disk_random_stat", {
  id: serial("id").primaryKey(),
  diskDriveId: serial("disk_drive_id").references(() => diskDriveTable.id),
  statName: text("stat_name").notNull(), //should only by the base sub stat name (no suffix like +1 or +2)
  statUpgradeLevel: integer("stat_upgrade_level").notNull(), //the upgrade level of the stat (from the suffix)
  statValue: text("stat_value").notNull(), // Stored as text to handle both numbers and percentage values
});
