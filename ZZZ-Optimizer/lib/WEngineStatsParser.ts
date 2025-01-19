import type { WEngineStats } from "./WEngineStats";
import { WEngineStatsSchema } from "./WEngineStats";

export function parseWEngineStats(text: string): WEngineStats {
  // Extract name, rank, and type from first line
  const firstLine = text.split("\n")[0];
  const name = firstLine.split(" is ")[0];
  const rankMatch = firstLine.match(/Rank ([ABS])-Rank/);
  const typeMatch = firstLine.match(/for (\w+)(?:\s+\w+)?/);

  if (!rankMatch || !typeMatch) {
    throw new Error("Could not parse rank or type from first line");
  }

  // Parse base stats and substats
  const baseValues: [number, number][] = [];
  let subStatValues: number[] = [];
  let subStat = "";

  // Find substat type from header
  const subStatMatch = text.match(/Sub Stat\s*\(([^)]+)\)/);
  if (subStatMatch) {
    subStat = subStatMatch[1];
  }

  // Parse stat table
  const lines = text.split("\n");
  let currentBaseValue: number | null = null;

  for (const line of lines) {
    // Match lines with stat values more flexibly
    const statMatch = line.match(/(\d+)\/(\d+)\s+(\d+)\s+([\d.]+)%?/);
    if (statMatch) {
      const [, currentLevel, maxLevel, baseStat, subStatValue] = statMatch;

      if (currentLevel === maxLevel) {
        // End of range
        if (baseValues.length > 0) {
          baseValues[baseValues.length - 1][1] = parseInt(baseStat);
        }
      } else {
        // Start of range
        baseValues.push([parseInt(baseStat), 0]);
        subStatValues.push(parseFloat(subStatValue));
      }
    }
  }

  // Validate parsed data
  if (baseValues.length !== 6 || subStatValues.length !== 6) {
    throw new Error(
      `Invalid number of stat entries. Expected 6, got ${baseValues.length} base values and ${subStatValues.length} sub stat values`,
    );
  }

  // Extract ability name and description
  let abilityName = "";
  let abilityDescription = "";

  // Find the ability section (it comes after the stat table)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line && !line.match(/[\d/%]/) && i > 5) {
      // Skip stat table section
      // First non-empty line without numbers/symbols is the ability name
      abilityName = line;
      // Next line(s) form the description
      const remainingLines = lines.slice(i + 1);
      abilityDescription = remainingLines
        .filter((l) => l.trim())
        .join(" ")
        .trim();
      break;
    }
  }

  if (!abilityName || !abilityDescription) {
    throw new Error("Could not parse ability name or description");
  }

  const result = {
    name,
    type: typeMatch[1] as "Attack" | "Anomaly" | "Defense" | "Stun" | "Support",
    rank: rankMatch[1] as "B" | "A" | "S",
    baseStat: {
      baseValues: baseValues as [
        [number, number],
        [number, number],
        [number, number],
        [number, number],
        [number, number],
        [number, number],
      ],
    },
    subStat: {
      subStat,
      subStatValues: subStatValues as [
        number,
        number,
        number,
        number,
        number,
        number,
      ],
    },
    ability: {
      abilityName,
      abilityDescription,
    },
  };

  // Validate the parsed result against the schema
  return WEngineStatsSchema.parse(result);
}

// Test code
// if (require.main === module) {
//   const text = `Starlight Engine Replica is an Rank A-Rank W-Engine for Attack Attack Agent's
//   Modification
//   Level	Level	Main Stat
//   (Base ATK)	Sub Stat
//   (ATK)
//   0—	0/10	42	10.0%
//   10/10	107	10.0%
//   1—	10/20	145	13.0%
//   20/20	211	13.0%
//   2—	20/30	248	16.0%
//   30/30	314	16.0%
//   3—	30/40	352	19.0%
//   40/40	417	19.0%
//   4—	40/50	455	22.0%
//   50/50	521	22.0%
//   5—	50/60	558	25.0%
//   60/60	624	25.0%
//   Increases the equipper's Physical DMG by 36%-57.5% for 8s upon hitting an enemy at least 6 meters away with a Basic Attack or Dash Attack.`;
//   console.log(parseWEngineStats(text));
// }
