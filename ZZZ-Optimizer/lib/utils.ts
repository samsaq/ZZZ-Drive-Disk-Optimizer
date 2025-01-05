import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// code for scan data ingestion
export interface ScanData {
  disk_scans: DiskScan[];
}

const valid_set_names = [
  "Swing Jazz",
  "Chaotic Metal",
  "Hormone Punk",
  "Fanged Metal",
  "Shockstar Disco",
  "Thunder Metal",
  "Woodpecker Electro",
  "Soul Rock",
  "Puffer Electro",
  "Inferno Metal",
  "Freedom Blues",
  "Polar Metal",
  "Astral Voice",
  "Branch & Blade Song",
  "Chaos Jazz",
  "Proto Punk",
];

const valid_base_stats = [
  "HP",
  "ATK",
  "DEF",
  "CRIT Rate",
  "CRIT DMG",
  "Anomaly Proficiency",
  "PEN Ratio",
  "Physical DMG Bonus",
  "Fire DMG Bonus",
  "Ice DMG Bonus",
  "Electric DMG Bonus",
  "Ether DMG Bonus",
  "Anomaly Mastery",
  "Impact",
  "Energy Regen",
];

const valid_random_stats = [
  "HP",
  "ATK",
  "DEF",
  "CRIT Rate",
  "CRIT DMG",
  "Anomaly Proficiency",
  "PEN",
];

export const DiskScanSchema = z.object({
  set_name: z.enum(valid_set_names as [string, ...string[]]),
  partition_number: z.enum(["1", "2", "3", "4", "5", "6"]),
  drive_rarity: z.enum(["B", "A", "S"]),
  drive_current_level: z.number().int().min(0).max(15),
  drive_max_level: z.number().int().min(0).max(15),
  drive_base_stat: z.enum(valid_base_stats as [string, ...string[]]), //NOTE: we aren't checking base stats based on parition, just in general
  drive_base_stat_number: z.union([
    z.number(),
    z.string().regex(/^\d+(\.\d+)?%$/),
  ]),
  random_stats: z.array(
    z.object({
      baseStat: z.enum(valid_random_stats as [string, ...string[]]),
      upgradeNum: z.number().int().min(0).max(5),
      value: z.union([z.number(), z.string().regex(/^\d+(\.\d+)?%$/)]),
    }),
  ),
});

export type DiskScan = z.infer<typeof DiskScanSchema>;

//ingest scan data from json
export function processScanData(jsonData: any[]): ScanData {
  const validatedScans = jsonData.map((scan) => {
    // Remove drive_base_stat_combined as it's not in the schema & can be assembled from whats in the schema
    const { drive_base_stat_combined, ...scanData } = scan;

    // Transform random_stats format
    const transformedRandomStats = scanData.random_stats.map(
      ([statWithSuffix, value]: [string, any]) => {
        const [baseStat, suffixNum] = statWithSuffix.split("+");
        return {
          baseStat,
          upgradeNum: suffixNum ? parseInt(suffixNum, 10) : 0,
          value,
        };
      },
    );

    const processedScan = {
      ...scanData,
      random_stats: transformedRandomStats,
      drive_current_level: Number(scan.drive_current_level),
      drive_max_level: Number(scan.drive_max_level),
      // Convert percentage strings to numbers if needed in the base stat number
      drive_base_stat_number: scan.drive_base_stat_number
        .toString()
        .includes("%")
        ? scan.drive_base_stat_number
        : Number(scan.drive_base_stat_number),
    };

    // Validate against our schema
    const result = DiskScanSchema.safeParse(processedScan);
    if (!result.success) {
      throw new Error(`Invalid disk scan data: ${result.error.message}`);
    }

    return result.data;
  });

  return {
    disk_scans: validatedScans,
  };
}
