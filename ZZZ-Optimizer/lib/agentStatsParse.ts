import type { AgentStats } from "./agentStats";
import { AgentStatsSchema, Factions } from "./agentStats";

export function parseAgentStats(text: string): AgentStats {
  // Extract name and basic info from first line
  const firstLine = text.split("\n")[0];
  // Split the name at the first occurrence of the name pattern
  const nameParts = firstLine.split(/\s*\(/)[0].split(/\s+/);
  const uniqueNameParts = Array.from(new Set(nameParts));
  const name = uniqueNameParts.join(" ").trim();

  const rankMatch = firstLine.match(/\(([AS])/);
  const elementMatch = firstLine.match(/Icon ([A-Za-z]+)/);
  const typeMatch = firstLine.match(
    /Icon [A-Za-z]+ [A-Za-z]+, Icon ([A-Za-z]+)/,
  );

  if (!name || !rankMatch || !elementMatch || !typeMatch) {
    throw new Error(
      `Could not parse basic info from first line. Found: 
      name: ${name}, 
      rank: ${rankMatch?.[1]}, 
      element: ${elementMatch?.[1]}, 
      type: ${typeMatch?.[1]}`,
    );
  }

  // Get brief name if it exists (in parentheses after "commonly referred to as")
  const briefNameMatch = text.match(/commonly referred to as ([^,]+)/);
  const briefName = briefNameMatch ? briefNameMatch[1].trim() : undefined;

  // Find faction by looking for matches with known faction names in the text before the stat table
  const headerText = text.split(/Promotion\s+Level/)[0];
  let faction = "";

  // Special case for CIST/NEPS
  if (headerText.includes("Criminal Investigation Special Response Team")) {
    faction = "New Eridu Public Security";
  } else {
    // Look for matching faction names
    for (const [, factionInfo] of Object.entries(Factions)) {
      if (headerText.includes(factionInfo.fullName)) {
        faction = factionInfo.fullName;
        break;
      }
    }
  }

  if (!faction) {
    throw new Error("Could not parse faction from text");
  }

  // Parse stat tables
  const stats: [number, number][][] = [[], [], []]; // HP, ATK, DEF
  const lines = text.split("\n");
  let currentPromotionLevel = -1;
  let startValues: [number, number, number] | null = null;

  for (const line of lines) {
    // Match lines with stat values
    const statMatch = line.match(/(\d+)\/(\d+)\s+([\d,]+)\s+(\d+)\s+(\d+)/);
    if (statMatch) {
      const [, currentLevel, maxLevel, hp, atk, def] = statMatch;
      const promotionLevel = Math.floor(parseInt(currentLevel) / 10);

      if (currentLevel === maxLevel) {
        // End of range - store end values
        if (startValues) {
          stats[0][currentPromotionLevel] = [
            startValues[0],
            parseInt(hp.replace(/,/g, "")),
          ];
          stats[1][currentPromotionLevel] = [startValues[1], parseInt(atk)];
          stats[2][currentPromotionLevel] = [startValues[2], parseInt(def)];
          startValues = null;
        }
      } else {
        // Start of range - store start values
        currentPromotionLevel = promotionLevel;
        startValues = [
          parseInt(hp.replace(/,/g, "")),
          parseInt(atk),
          parseInt(def),
        ];
      }
    }
  }

  // Validate parsed data
  if (stats[0].length !== 6 || stats[1].length !== 6 || stats[2].length !== 6) {
    throw new Error(
      `Invalid number of stat entries. Expected 6, got HP: ${stats[0].length}, ATK: ${stats[1].length}, DEF: ${stats[2].length}`,
    );
  }

  const result = {
    name,
    ...(briefName && { briefName }),
    type: typeMatch[1] as "Attack" | "Anomaly" | "Defense" | "Stun" | "Support",
    element: elementMatch[1],
    rank: rankMatch[1] as "A" | "S",
    faction,
    HP: stats[0] as [
      [number, number],
      [number, number],
      [number, number],
      [number, number],
      [number, number],
      [number, number],
    ],
    ATK: stats[1] as [
      [number, number],
      [number, number],
      [number, number],
      [number, number],
      [number, number],
      [number, number],
    ],
    DEF: stats[2] as [
      [number, number],
      [number, number],
      [number, number],
      [number, number],
      [number, number],
      [number, number],
    ],
  };

  // Validate the parsed result against the schema
  return AgentStatsSchema.parse(result);
}

// Test code
// if (require.main === module) {
//   const text = `Alexandrina Sebastiane (S, Icon Electric Electric, Icon Support Support), commonly referred to as Rina, is a playable Agent in Zenless Zone Zero. She is the Head Maid and most senior member of Victoria Housekeeping Co.
//   Victoria Housekeeping Co.
//   Promotion
//   Level	Level	Base
//   HP	Base
//   ATK	Base
//   DEF
//   0	1/10	692	103	48
//   10/10	1,537	157	106
//   1	10/20	2,012	194	139
//   20/20	2,951	254	205
//   2	20/30	3,426	291	238
//   30/30	4,366	351	304
//   3	30/40	4,841	388	337
//   40/40	5,780	448	402
//   4	40/50	6,255	484	436
//   50/50	7,194	544	502
//   5	50/60	7,669	581	535
//   60/60	8,609	642	600`;
//   console.log(parseAgentStats(text));
// }
