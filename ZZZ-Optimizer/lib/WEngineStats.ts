import { z } from "zod";
import { valid_base_stats } from "./artifactStats";
import { stat } from "fs";

const valid_WEngineSubStats = [
  "ATK", //since attack is the only base stat as an integer, it is always a percentage
  "CRIT Rate",
  "CRIT DMG",
  "Anomaly Proficiency", //the only WEngine substat that is not a percentage
  "DEF",
  "HP",
  "Impact",
  "PEN Ratio",
  "Energy Regen",
];

const valid_ability_stats = valid_base_stats.concat(["Shield", "DMG Taken"]);

export const WEngineStatsSchema = z.object({
  name: z.string(),
  type: z.enum(["Attack", "Anomaly", "Defense", "Stun", "Support"]),
  rank: z.enum(["B", "A", "S"]),
  baseStat: z.object({
    //the only type of base stat is ATK (not percent)
    baseValues: z.tuple([
      z.tuple([z.number(), z.number()]), //for mod level 0 (0-10) - first is at the start of the mod level, second is at the end of the mod level
      z.tuple([z.number(), z.number()]), //for mod level 1 (10-20)
      z.tuple([z.number(), z.number()]), //for mod level 2 (20-30)
      z.tuple([z.number(), z.number()]), //for mod level 3 (30-40)
      z.tuple([z.number(), z.number()]), //for mod level 4 (40-50)
      z.tuple([z.number(), z.number()]), //for mod level 5 (50-60)
    ]), //base value at the start ofeach modification level (there are 6 for each set of 10 levels - mod level 0 to 5)
  }),
  subStat: z.object({
    subStat: z.enum(valid_WEngineSubStats as [string, ...string[]]),
    subStatValues: z.tuple([
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
    ]), //values of the substat at each modification level (it doesn't change within it)
  }),
  ability: z.object({
    abilityName: z.string(),
    abilityDescription: z.string(),
    abilityStats: z
      .array(
        z.object({
          //any hard stats given by the ability, and that scale by weapon upgrade
          stat: z.enum(valid_ability_stats as [string, ...string[]]),
          percentStat: z.boolean(),
          upgradeValues: z.tuple([
            z.number(),
            z.number(),
            z.number(),
            z.number(),
            z.number(),
          ]), //One value for each weapon upgrade (1-5)
        }),
      )
      .optional(),
  }),
});

export const WEngines: WEngineStats[] = [
  {
    name: "[Lunar] Pleniluna",
    type: "Attack",
    rank: "B",
    baseStat: {
      baseValues: [
        [32, 82],
        [110, 160],
        [189, 239],
        [268, 318],
        [346, 397],
        [425, 475],
      ],
    },
    subStat: {
      subStat: "ATK",
      subStatValues: [8, 10.4, 12.8, 15.2, 17.6, 20],
    },
    ability: {
      abilityName: "Full Moon",
      abilityDescription:
        "Basic Attack, Dash Attack, and Dodge Counter DMG increases by 12%-20%",
    },
  },
  {
    name: "[Lunar] Noviluna",
    type: "Attack",
    rank: "B",
    baseStat: {
      baseValues: [
        [32, 82],
        [110, 160],
        [189, 239],
        [268, 318],
        [346, 397],
        [425, 475],
      ],
    },
    subStat: {
      subStat: "CRIT Rate",
      subStatValues: [6.4, 8.3, 10.2, 12.2, 14.1, 16],
    },
    ability: {
      abilityName: "New Moon",
      abilityDescription:
        "Launching an EX Special Attack generates 3-5 Energy for the equipper. This effect can trigger once every 12s.",
    },
  },
  {
    name: "[Lunar] Decrescent",
    type: "Attack",
    rank: "B",
    baseStat: {
      baseValues: [
        [32, 82],
        [110, 160],
        [189, 239],
        [268, 318],
        [346, 397],
        [425, 475],
      ],
    },
    subStat: {
      subStat: "ATK",
      subStatValues: [8, 10.4, 12.8, 15.2, 17.6, 20],
    },
    ability: {
      abilityName: "Waning Moon",
      abilityDescription:
        "Launching a Chain Attack or Ultimate increases the equipper's DMG by 15%-25% for 6s.",
    },
  },
  {
    name: "Street Superstar",
    type: "Attack",
    rank: "A",
    baseStat: {
      baseValues: [
        [40, 102],
        [138, 201],
        [236, 299],
        [335, 397],
        [433, 496],
        [532, 594],
      ],
    },
    subStat: {
      subStat: "ATK",
      subStatValues: [10, 13, 16, 19, 22, 25],
    },
    ability: {
      abilityName: "Flaming Bars",
      abilityDescription:
        "Whenever a squad member launches a Chain Attack, the equipper gains a Charge stack, stacking up to 3 times. Upon activating their own Ultimate, the equipper consumes all Charge stacks, and each stack increases the skill's DMG by 15%-24%.",
    },
  },
  {
    name: "Starlight Engine Replica",
    type: "Attack",
    rank: "A",
    baseStat: {
      baseValues: [
        [42, 107],
        [145, 211],
        [248, 314],
        [352, 417],
        [455, 521],
        [558, 624],
      ],
    },
    subStat: {
      subStat: "ATK",
      subStatValues: [10, 13, 16, 19, 22, 25],
    },
    ability: {
      abilityName: "Knight Beam: Change",
      abilityDescription:
        "Increases the equipper's Physical DMG by 36%-57.5% for 8s upon hitting an enemy at least 6 meters away with a Basic Attack or Dash Attack.",
      abilityStats: [
        {
          stat: "Physical DMG Bonus",
          percentStat: true,
          upgradeValues: [36, 41, 46.5, 52, 57.5],
        },
      ],
    },
  },
  {
    name: "Marcato Desire",
    type: "Attack",
    rank: "A",
    baseStat: {
      baseValues: [
        [40, 102],
        [138, 201],
        [236, 299],
        [335, 397],
        [433, 496],
        [532, 594],
      ],
    },
    subStat: {
      subStat: "CRIT Rate",
      subStatValues: [8, 10.4, 12.8, 15.2, 17.6, 20],
    },
    ability: {
      abilityName: "Get Everyone Fired Up",
      abilityDescription:
        "When an EX Special Attack or Chain Attack hits an enemy, the equipper's ATK increases by 6%-9.6% for 8s. While the target is under an Attribute Anomaly, this effect is increased by an additional 6%-9.6%.",
    },
  },
  {
    name: "Housekeeper",
    type: "Attack",
    rank: "A",
    baseStat: {
      baseValues: [
        [42, 107],
        [145, 211],
        [248, 314],
        [352, 417],
        [455, 521],
        [558, 624],
      ],
    },
    subStat: {
      subStat: "ATK",
      subStatValues: [10, 13, 16, 19, 22, 25],
    },
    ability: {
      abilityName: "Safe Household Saw",
      abilityDescription:
        "While off-field, the equipper's Energy Regen increases by 0.45/s-0.72/s. When an EX Special Attack hits an enemy, the equipper's Physical DMG increases by 3%-4.8%, stacking up to 15 times and lasting 1s. Repeated triggers reset the duration.",
    },
  },
  {
    name: "Gilded Blossom",
    type: "Attack",
    rank: "A",
    baseStat: {
      baseValues: [
        [40, 102],
        [138, 201],
        [236, 299],
        [335, 397],
        [433, 496],
        [532, 594],
      ],
    },
    subStat: {
      subStat: "ATK",
      subStatValues: [10, 13, 16, 19, 22, 25],
    },
    ability: {
      abilityName: "Extraordinary Anti-Theft Measures",
      abilityDescription:
        "ATK increases by 6%-9.6%, and DMG dealt by EX Special Attacks increases by 15%-24%",
    },
  },
  {
    name: "Drill Rig - Red Axis",
    type: "Attack",
    rank: "A",
    baseStat: {
      baseValues: [
        [42, 107],
        [145, 211],
        [248, 314],
        [352, 417],
        [455, 521],
        [558, 624],
      ],
    },
    subStat: {
      subStat: "Energy Regen",
      subStatValues: [20, 26, 32, 38, 44, 50],
    },
    ability: {
      abilityName: "Hell's Generator",
      abilityDescription:
        "When launching an EX Special Attack or Chain Attack, Electric DMG from Basic Attacks and Dash Attacks increases by 50%-80% for 10s. This effect can trigger once every 15s.",
    },
  },
  {
    name: "Cannon Rotor",
    type: "Attack",
    rank: "A",
    baseStat: {
      baseValues: [
        [40, 102],
        [138, 201],
        [236, 299],
        [335, 397],
        [433, 496],
        [532, 594],
      ],
    },
    subStat: {
      subStat: "CRIT Rate",
      subStatValues: [8, 10.4, 12.8, 15.2, 17.6, 20],
    },
    ability: {
      abilityName: "Oversized Barrel",
      abilityDescription:
        "Increases ATK by 7.5%-12%. Attacks that land a CRIT on an enemy will inflict an additional 200% of ATK as DMG. This effect can only be triggered once every 8s-6s.",
    },
  },
  {
    name: "Zanshin Herb Case",
    type: "Attack",
    rank: "S",
    baseStat: {
      baseValues: [
        [48, 123],
        [166, 241],
        [284, 359],
        [402, 477],
        [520, 595],
        [638, 713],
      ],
    },
    subStat: {
      subStat: "CRIT DMG",
      subStatValues: [19.2, 25, 30.7, 36.5, 42.2, 48],
    },
    ability: {
      abilityName: "Growth Through Adversity",
      abilityDescription:
        "CRIT Rate increases by 10%-16%. Dash Attack Electric DMG increases by 40%-64%. When any squad member applies an Attribute Anomaly or Stuns an enemy, the equipper's CRIT Rate increases by an additional 10%-16% for 12s.",
      abilityStats: [
        {
          stat: "CRIT Rate",
          percentStat: true,
          upgradeValues: [10, 11.5, 13, 14.5, 16],
        },
      ],
    },
  },
  {
    name: "The Brimstone",
    type: "Attack",
    rank: "S",
    baseStat: {
      baseValues: [
        [46, 118],
        [159, 231],
        [272, 344],
        [385, 457],
        [498, 570],
        [611, 684],
      ],
    },
    subStat: {
      subStat: "ATK",
      subStatValues: [12, 15.6, 19.2, 22.8, 26.4, 30],
    },
    ability: {
      abilityName: "Scorching Breath",
      abilityDescription:
        "Upon hitting an enemy with a Basic Attack, Dash Attack, or Dodge Counter, the equipper's ATK increases by 3.5%-7% for 8s, stacking up to 8 times. This effect can trigger once every 0.5s. The duration of each stack is calculated separately.",
    },
  },
  {
    name: "Steel Cushion",
    type: "Attack",
    rank: "S",
    baseStat: {
      baseValues: [
        [46, 118],
        [159, 231],
        [272, 344],
        [385, 457],
        [498, 570],
        [611, 684],
      ],
    },
    subStat: {
      subStat: "CRIT Rate",
      subStatValues: [9.6, 12.5, 15.4, 18.2, 21.1, 24],
    },
    ability: {
      abilityName: "Metal Cat Claws",
      abilityDescription:
        "Increases Physical DMG by 20%-40%. The equipper's DMG increases by 25%-50% when attacking the enemy from behind.",
      abilityStats: [
        {
          stat: "Physical DMG Bonus",
          percentStat: true,
          upgradeValues: [20, 25, 30, 35, 40],
        },
      ],
    },
  },
  {
    name: "Riot Suppressor Mark VI",
    type: "Attack",
    rank: "S",
    baseStat: {
      baseValues: [
        [48, 123],
        [166, 241],
        [284, 359],
        [402, 477],
        [520, 595],
        [638, 713],
      ],
    },
    subStat: {
      subStat: "CRIT DMG",
      subStatValues: [19.2, 25, 30.7, 36.5, 42.2, 48],
    },
    ability: {
      abilityName: "Binding Chains",
      abilityDescription:
        "Increases CRIT Rate by 15%-30%. Launching an EX Special Attack grants the equipper 8 Charge stacks, stacking up to 8 times, up to a maximum of 8 stacks. Whenever the equipper's Basic Attack deals Ether DMG, consumes a Charge stack and increases the skill's DMG by 35%-70%.",
      abilityStats: [
        {
          stat: "CRIT Rate",
          percentStat: true,
          upgradeValues: [15, 18.8, 22.6, 26.4, 30],
        },
      ],
    },
  },
  {
    name: "Deep Sea Visitor",
    type: "Attack",
    rank: "S",
    baseStat: {
      baseValues: [
        [48, 123],
        [166, 241],
        [284, 359],
        [402, 477],
        [520, 595],
        [638, 713],
      ],
    },
    subStat: {
      subStat: "CRIT Rate",
      subStatValues: [9.6, 12.5, 15.4, 18.2, 21.1, 24],
    },
    ability: {
      abilityName: "Lord of Seas",
      abilityDescription:
        "Increases Ice DMG by 25%-50%. Dealing Ice DMG using Dash Attacks or Dodge Counters increases the equipper's CRIT Rate by 10%-20% for 8s. When Dealing Ice DMG with a Dash Attack, the equipper's CRIT Rate increases by an additional 10%-20% for 15s. The duration of each effect is calculated separately.",
      abilityStats: [
        {
          stat: "Ice DMG Bonus",
          percentStat: true,
          upgradeValues: [25, 31.5, 38, 44.5, 50],
        },
      ],
    },
  },
  {
    name: "[Magnetic Storm] Charlie",
    type: "Anomaly",
    rank: "B",
    baseStat: {
      baseValues: [
        [32, 82],
        [110, 160],
        [189, 239],
        [268, 318],
        [346, 397],
        [425, 475],
      ],
    },
    subStat: {
      subStat: "PEN Ratio",
      subStatValues: [6.4, 8.3, 10.2, 12.2, 14.1, 16],
    },
    ability: {
      abilityName: "Charge Overload",
      abilityDescription:
        "Whenever a squad member inflicts an Attribute Anomaly on an enemy, the equipper generates 3.5-5.5 Energy. This effect can trigger once every 12s.",
    },
  },
  {
    name: "[Magnetic Storm] Bravo",
    type: "Anomaly",
    rank: "B",
    baseStat: {
      baseValues: [
        [32, 82],
        [110, 160],
        [189, 239],
        [268, 318],
        [346, 397],
        [425, 475],
      ],
    },
    subStat: {
      subStat: "Anomaly Proficiency",
      subStatValues: [24, 31.2, 38.4, 45.6, 52.8, 60],
    },
    ability: {
      abilityName: "High-Voltage Surge",
      abilityDescription:
        "Accumulating Anomaly Buildup increases the equipper's Anomaly Proficiency by 25-40 for 10s. This effect can trigger once every 20s.",
    },
  },
  {
    name: "[Magnetic Storm] Alpha",
    type: "Anomaly",
    rank: "B",
    baseStat: {
      baseValues: [
        [32, 82],
        [110, 160],
        [189, 239],
        [268, 318],
        [346, 397],
        [425, 475],
      ],
    },
    subStat: {
      subStat: "ATK",
      subStatValues: [8, 10.4, 12.8, 15.2, 17.6, 20],
    },
    ability: {
      abilityName: "Disordered Current",
      abilityDescription:
        "Accumulating Anomaly Buildup increases the equipper's Anomaly Mastery by 25-40 for 10s. This effect can trigger once every 20s.",
    },
  },
  {
    name: "Weeping Gemini",
    type: "Anomaly",
    rank: "A",
    baseStat: {
      baseValues: [
        [40, 102],
        [138, 201],
        [236, 299],
        [335, 397],
        [433, 496],
        [532, 594],
      ],
    },
    subStat: {
      subStat: "ATK",
      subStatValues: [10, 13, 16, 19, 22, 25],
    },
    ability: {
      abilityName: "Lingering Cries",
      abilityDescription:
        "Whenever a squad member inflicts an Attribute Anomaly on an enemy, the equipper gains a buff that increases Anomaly Proficiency by 30-46, stacking up to 4 times. This effect expires when the target recovers from Stun or is defeated. The duration of each stack is calculated separately.",
    },
  },
  {
    name: "Roaring Ride",
    type: "Anomaly",
    rank: "A",
    baseStat: {
      baseValues: [
        [42, 107],
        [145, 211],
        [248, 314],
        [352, 417],
        [455, 521],
        [558, 624],
      ],
    },
    subStat: {
      subStat: "ATK",
      subStatValues: [10, 13, 16, 19, 22, 25],
    },
    ability: {
      abilityName: "Collision Potential",
      abilityDescription:
        "When EX special Attack hits an enemy, one of three possible effects is randomly triggered for 5 seconds. This effect can trigger once every 0.3s. the same types of effects cannot stack. Repeated triggers reset the duration, allowing several effects to be active at once: Increases the equipper's ATK by 8%-12.8%, increases the equipper's Anomaly Proficiency by 40-64, or increases the equipper's Anomaly Buildup Rate by 25%-40%",
    },
  },
  {
    name: "Rainforest Gourmet",
    type: "Anomaly",
    rank: "A",
    baseStat: {
      baseValues: [
        [40, 102],
        [138, 201],
        [236, 299],
        [335, 397],
        [433, 496],
        [532, 594],
      ],
    },
    subStat: {
      subStat: "Anomaly Proficiency",
      subStatValues: [30, 39, 48, 57, 66, 75],
    },
    ability: {
      abilityName: "Dinner's Ready!",
      abilityDescription:
        "For every 10 Energy consumed, the equipper gains a buff that increases ATK by 2.5%-4% for 10s, stacking up to 10 times. The duration of each stack is calculated separately.",
    },
  },
  {
    name: "Electro-Lip Gloss",
    type: "Anomaly",
    rank: "A",
    baseStat: {
      baseValues: [
        [40, 102],
        [138, 201],
        [236, 299],
        [335, 397],
        [433, 496],
        [532, 594],
      ],
    },
    subStat: {
      subStat: "Anomaly Proficiency",
      subStatValues: [30, 39, 48, 57, 66, 75],
    },
    ability: {
      abilityName: "Kiss of Death",
      abilityDescription:
        "When there are enemies inflicted with Attribute Anomaly on the field, the equipper's ATK increases by 10%-16% and they deal an additional 15%-25% more DMG to the target.",
    },
  },
  {
    name: "Timeweaver",
    type: "Anomaly",
    rank: "S",
    baseStat: {
      baseValues: [
        [48, 123],
        [166, 241],
        [284, 359],
        [402, 477],
        [520, 595],
        [638, 713],
      ],
    },
    subStat: {
      subStat: "ATK",
      subStatValues: [12, 15.6, 19.2, 22.8, 26.4, 30],
    },
    ability: {
      abilityName: "Time-Devouring Stratagem",
      abilityDescription:
        "The equipper's Electric Anomaly Buildup Rate increases by 30%-50%. When Special Attacks or EX Special Attacks hit enemies under Attribute Anomalies, the equipper's Anomaly Proficiency increases by 75-115 for 15s. When the equipper's Anomaly Proficiency is greater than or equal to 375, Disorder DMG inflicted by the equipper increases by 25%-35%.",
    },
  },
  {
    name: "Sharpened Stinger",
    type: "Anomaly",
    rank: "S",
    baseStat: {
      baseValues: [
        [48, 123],
        [166, 241],
        [284, 359],
        [402, 477],
        [520, 595],
        [638, 713],
      ],
    },
    subStat: {
      subStat: "Anomaly Proficiency",
      subStatValues: [36, 46.8, 57.6, 68.4, 79.2, 90],
    },
    ability: {
      abilityName: "Indulge in the Hunt",
      abilityDescription:
        "Upon activating a Dash Attack, gain 1 stack of Predatory Instinct. Each stack of Predatory Instinct increases the equipper's Physical DMG by 12%-24% for 10s, stacking up to 3 times. This effect can trigger once every 0.5s and repeated triggers reset the duration. When entering combat or triggering Perfect Dodge, gain 3 stacks of Predatory Instinct. While Predatory Instinct is at maximum stacks, the equipper's Anomaly Buildup Rate increases by 40%-80%.",
    },
  },
  {
    name: "Hailstorm Shrine",
    type: "Anomaly",
    rank: "S",
    baseStat: {
      baseValues: [
        [50, 128],
        [173, 251],
        [296, 374],
        [419, 497],
        [542, 620],
        [665, 743],
      ],
    },
    subStat: {
      subStat: "CRIT Rate",
      subStatValues: [9.6, 12.5, 15.4, 18.2, 21.1, 24],
    },
    ability: {
      abilityName: "Frost-Stained Star",
      abilityDescription:
        "CRIT DMG increases by 50%-80%. When using an EX Special Attack or when any squad member applies an Attribute Anomaly to an enemy, the equipper's Ice DMG increases by 20%-32%, stacking up to 2 times and lasting 15s. The duration of each stack is calculated separately",
      abilityStats: [
        {
          stat: "CRIT DMG",
          percentStat: true,
          upgradeValues: [50, 57, 65, 72, 80],
        },
      ],
    },
  },
  {
    name: "Fusion Compiler",
    type: "Anomaly",
    rank: "S",
    baseStat: {
      baseValues: [
        [46, 118],
        [159, 231],
        [272, 344],
        [385, 457],
        [498, 570],
        [611, 684],
      ],
    },
    subStat: {
      subStat: "PEN Ratio",
      subStatValues: [9.6, 12.5, 15.4, 18.2, 21.1, 24],
    },
    ability: {
      abilityName: "Data Flood",
      abilityDescription:
        "Increases ATK by 12%-24%. When using a Special Attack or EX Special Attack, the equipper's Anomaly Proficiency is increased by 25-50 for 8s, stacking up to 3 times. The duration of each stack is calculated separately.",
      abilityStats: [
        {
          stat: "ATK",
          percentStat: true,
          upgradeValues: [12, 15, 18, 21, 24],
        },
      ],
    },
  },
  {
    name: "Flamemaker Shaker",
    type: "Anomaly",
    rank: "S",
    baseStat: {
      baseValues: [
        [48, 123],
        [166, 241],
        [284, 359],
        [402, 477],
        [520, 595],
        [638, 713],
      ],
    },
    subStat: {
      subStat: "ATK",
      subStatValues: [12, 15.6, 19.2, 22.8, 26.4, 30],
    },
    ability: {
      abilityName: "Fuel on the Rocks",
      abilityDescription:
        "While off-field, the equipper's Energy Regen increases by 0.6/s-1.2/s. When hitting an enemy with an EX Special Attack or Assist Attack, the equipper's DMG increases by 3.5%-7%, stacking up to 10 times and lasting for 6s. This effect can trigger once every 0.3s. While off-field, the stack effect is doubled. Repeated triggers reset the duration. Upon obtaining the DMG increase effect, if the number of current stacks is greater than or equal to 5, then the equipper's Anomaly Proficiency increases by 50-100. This Anomaly Proficiency increase does not stack and lasts for 6s.",
    },
  },
  {
    name: "[Identity] Inflection",
    type: "Defense",
    rank: "B",
    baseStat: {
      baseValues: [
        [32, 82],
        [110, 160],
        [189, 239],
        [268, 318],
        [346, 397],
        [425, 475],
      ],
    },
    subStat: {
      subStat: "DEF",
      subStatValues: [12.8, 16.6, 20.5, 24.3, 28.2, 32],
    },
    ability: {
      abilityName: "Dazzle",
      abilityDescription:
        "When attacked, reduces the attacker's DMG by 6%-10% for 12s.",
    },
  },
  {
    name: "[Identity] Base",
    type: "Defense",
    rank: "B",
    baseStat: {
      baseValues: [
        [32, 82],
        [110, 160],
        [189, 239],
        [268, 318],
        [346, 397],
        [425, 475],
      ],
    },
    subStat: {
      subStat: "DEF",
      subStatValues: [12.8, 16.6, 20.5, 24.3, 28.2, 32],
    },
    ability: {
      abilityName: "Sinking Strike",
      abilityDescription:
        "When attacked, equipper's DEF increases by 20%-32% for 8s.",
    },
  },
  {
    name: "Spring Embrace",
    type: "Defense",
    rank: "A",
    baseStat: {
      baseValues: [
        [40, 102],
        [138, 201],
        [236, 299],
        [335, 397],
        [433, 496],
        [532, 594],
      ],
    },
    subStat: {
      subStat: "ATK",
      subStatValues: [10, 13, 16, 19, 22, 25],
    },
    ability: {
      abilityName: "Hot Spring Soup",
      abilityDescription:
        "Reduces DMG taken by 7.5%-12%. When attacked, the equipper's Energy Generation Rate increased by 10%-16% for 12s. When the equipper switches off-field, this buff will be transferred to the new on-field character with its duration refreshed. Passive effects of the same name do not stack.",
      abilityStats: [
        {
          stat: "DMG Taken",
          percentStat: true,
          upgradeValues: [-7.5, -8.5, -9.5, -10.5, -12],
        },
      ],
    },
  },
  {
    name: "Peacekeeper - Specialized",
    type: "Defense",
    rank: "A",
    baseStat: {
      baseValues: [
        [42, 107],
        [145, 211],
        [248, 314],
        [352, 417],
        [455, 521],
        [558, 624],
      ],
    },
    subStat: {
      subStat: "ATK",
      subStatValues: [10, 13, 16, 19, 22, 25],
    },
    ability: {
      abilityName: "Standard Blocking Technique",
      abilityDescription:
        "While Shielded, the equipper's Energy Regen increases by 0.4/s-0.64/s. The Anomaly Buildup of EX Special Attacks and Assist Follow-Ups increases by 36%-55%.",
    },
  },
  {
    name: "Original Transmorpher",
    type: "Defense",
    rank: "A",
    baseStat: {
      baseValues: [
        [40, 102],
        [138, 201],
        [236, 299],
        [335, 397],
        [433, 496],
        [532, 594],
      ],
    },
    subStat: {
      subStat: "HP",
      subStatValues: [10, 13, 16, 19, 22, 25],
    },
    ability: {
      abilityName: "Starlight Knight Flying Kick",
      abilityDescription:
        "Increases Max HP by 8%-12.5%. When attacked, the equipper's Impact is increased by 10%-16% for 12s.",
      abilityStats: [
        {
          stat: "HP",
          percentStat: true,
          upgradeValues: [8, 9, 10, 11, 12.5],
        },
      ],
    },
  },
  {
    name: "Bunny Band",
    type: "Defense",
    rank: "A",
    baseStat: {
      baseValues: [
        [40, 102],
        [138, 201],
        [236, 299],
        [335, 397],
        [433, 496],
        [532, 594],
      ],
    },
    subStat: {
      subStat: "DEF",
      subStatValues: [16, 20.8, 25.6, 30.4, 35.2, 40],
    },
    ability: {
      abilityName: "Pet the Bunny",
      abilityDescription:
        "Increases Max HP by 8%-12.8%. Increases the equipper's ATK by 10%-16% when they are shielded.",
      abilityStats: [
        {
          stat: "HP",
          percentStat: true,
          upgradeValues: [8, 9.2, 10.4, 11.6, 12.8],
        },
      ],
    },
  },
  {
    name: "Big Cylinder",
    type: "Defense",
    rank: "A",
    baseStat: {
      baseValues: [
        [42, 107],
        [145, 211],
        [248, 314],
        [352, 417],
        [455, 521],
        [558, 624],
      ],
    },
    subStat: {
      subStat: "DEF",
      subStatValues: [16, 20.8, 25.6, 30.4, 35.2, 40],
    },
    ability: {
      abilityName: "Ten Top Ten",
      abilityDescription:
        "Reduces DMG taken by 7.5%-12%. After being attacked, the next attack to hit an enemy will trigger a critical hit and deal 600%-960% of the equipper's DEF as additional DMG. This effect can be triggered once every 7.5s.",
      abilityStats: [
        {
          stat: "DMG Taken",
          percentStat: true,
          upgradeValues: [-7.5, -8.5, -9.5, -10.5, -12],
        },
      ],
    },
  },
  {
    name: "Tusks of Fury",
    type: "Defense",
    rank: "S",
    baseStat: {
      baseValues: [
        [48, 123],
        [166, 241],
        [284, 359],
        [402, 477],
        [520, 595],
        [638, 713],
      ],
    },
    subStat: {
      subStat: "Impact",
      subStatValues: [7.2, 9.4, 11.5, 13.7, 15.8, 18],
    },
    ability: {
      abilityName: "Invincible Rider",
      abilityDescription:
        "The Shield value provided by the equipper increases by 30%-60%. When any squad member triggers Interrupt or Perfect Dodge, all squad members' DMG increases by 18%-36% and Daze dealt increases by 12%-24% for 20s. Passive effects of the same name do not stack.",
      abilityStats: [
        {
          stat: "Shield",
          percentStat: true,
          upgradeValues: [30, 38, 46, 54, 60],
        },
      ],
    },
  },
  {
    name: "[Vortex] Revolver",
    type: "Stun",
    rank: "B",
    baseStat: {
      baseValues: [
        [32, 82],
        [110, 160],
        [189, 239],
        [268, 318],
        [346, 397],
        [425, 475],
      ],
    },
    subStat: {
      subStat: "ATK",
      subStatValues: [8, 10.4, 12.8, 15.2, 17.6, 20],
    },
    ability: {
      abilityName: "Undercurrent",
      abilityDescription: "EX Special Attacks inflict 10%-16% more Daze.",
    },
  },
  {
    name: "[Vortex] Hatchet",
    type: "Stun",
    rank: "B",
    baseStat: {
      baseValues: [
        [32, 82],
        [110, 160],
        [189, 239],
        [268, 318],
        [346, 397],
        [425, 475],
      ],
    },
    subStat: {
      subStat: "Energy Regen",
      subStatValues: [16, 20.8, 25.6, 30.4, 35.2, 40],
    },
    ability: {
      abilityName: "Riptide",
      abilityDescription:
        "Upon entering combat or switching in, the equipper's Impact increases by 9%-13% for 10s. This effect can trigger once every 20s.",
    },
  },
  {
    name: "[Vortex] Arrow",
    type: "Stun",
    rank: "B",
    baseStat: {
      baseValues: [
        [32, 82],
        [110, 160],
        [189, 239],
        [268, 318],
        [346, 397],
        [425, 475],
      ],
    },
    subStat: {
      subStat: "Impact",
      subStatValues: [4.8, 6.2, 7.7, 9.1, 10.6, 12],
    },
    ability: {
      abilityName: "Tsunami",
      abilityDescription:
        "The equipper's attacks inflict 8%-12% more Daze on their main target.",
      abilityStats: [
        {
          stat: "Daze",
          percentStat: true,
          upgradeValues: [8, 9, 10, 11, 12],
        },
      ],
    },
  },
  {
    name: "Steam Oven",
    type: "Stun",
    rank: "A",
    baseStat: {
      baseValues: [
        [40, 102],
        [138, 201],
        [236, 299],
        [335, 397],
        [433, 496],
        [532, 594],
      ],
    },
    subStat: {
      subStat: "Energy Regen",
      subStatValues: [20, 26, 32, 38, 44, 50],
    },
    ability: {
      abilityName: "Thick Broth",
      abilityDescription:
        "For every 10 Energy accumulated, the equipper's Impact is increased by 2%-3.2%, stacking up to 8 times. After Energy is consumed, this bonus remains for 8 more seconds. The duration of each stack is calculated separately.",
    },
  },
  {
    name: "Six Shooter",
    type: "Stun",
    rank: "A",
    baseStat: {
      baseValues: [
        [40, 102],
        [138, 201],
        [236, 299],
        [335, 397],
        [433, 496],
        [532, 594],
      ],
    },
    subStat: {
      subStat: "Impact",
      subStatValues: [6, 7.8, 9.6, 11.4, 13.2, 15],
    },
    ability: {
      abilityName: "Fire!",
      abilityDescription:
        "The equipper gains a Charge stack every 3s, stacking up to 6 times. When launching an EX Special Attack, consumes all Charge stacks, and each stack increases the Daze inflicted by 4%-6.4%.",
    },
  },
  {
    name: "Precious Fossilized Core",
    type: "Stun",
    rank: "A",
    baseStat: {
      baseValues: [
        [40, 102],
        [138, 201],
        [236, 299],
        [335, 397],
        [433, 496],
        [532, 594],
      ],
    },
    subStat: {
      subStat: "Impact",
      subStatValues: [6, 7.8, 9.6, 11.4, 13.2, 15],
    },
    ability: {
      abilityName: "Behemoth Hunter",
      abilityDescription:
        "When the target's HP is no lower than 50%, the equipper inflicts 10%-16% more Daze. When the target's HP is no lower than 75%, this bonus is further enhanced by 10%-16%.",
    },
  },
  {
    name: "Demara Battery Mark II",
    type: "Stun",
    rank: "A",
    baseStat: {
      baseValues: [
        [42, 107],
        [145, 211],
        [248, 314],
        [352, 417],
        [455, 521],
        [558, 624],
      ],
    },
    subStat: {
      subStat: "Impact",
      subStatValues: [6, 7.8, 9.6, 11.4, 13.2, 15],
    },
    ability: {
      abilityName: "In a Flash of Light",
      abilityDescription:
        "Increases Electric DMG by 15%-24%. When the equipper hits an enemy with Dodge Counter or Assist Attack, their Energy Generation Rate increases by 18%-27.5% for 8s.",
      abilityStats: [
        {
          stat: "Electric DMG Bonus",
          percentStat: true,
          upgradeValues: [15, 17.5, 20, 22, 24],
        },
      ],
    },
  },
  {
    name: "The Restrained",
    type: "Stun",
    rank: "S",
    baseStat: {
      baseValues: [
        [46, 118],
        [159, 231],
        [272, 344],
        [385, 457],
        [498, 570],
        [611, 684],
      ],
    },
    subStat: {
      subStat: "Impact",
      subStatValues: [7.2, 9.4, 11.5, 13.7, 15.8, 18],
    },
    ability: {
      abilityName: "Binding Chains",
      abilityDescription:
        "When an attack hits an enemy, DMG and Daze from Basic Attacks increase by 6%-12% for 8s, stacking up to 5 times. This effect can trigger at most once during each skill. The duration of each stack is calculated separately.",
    },
  },
  {
    name: "Ice-Jade Teapot",
    type: "Stun",
    rank: "S",
    baseStat: {
      baseValues: [
        [48, 123],
        [166, 241],
        [284, 359],
        [402, 477],
        [520, 595],
        [638, 713],
      ],
    },
    subStat: {
      subStat: "Impact",
      subStatValues: [7.2, 9.4, 11.5, 13.7, 15.8, 18],
    },
    ability: {
      abilityName: "Ringing Melody",
      abilityDescription:
        "When a Basic Attack hits an enemy, gain 1 stack of Tea-riffic. Each stack of Tea-riffic increases the user's Impact by 0.7%-1.4%, stacking up to 30 times, and lasting for 8s. The duration of each stack is calculated separately. Upon acquiring Tea-riffic, if the equipper possesses stacks of Tea-riffic greater than or equal to 15, all squad members' DMG is increased by 20%-32% for 10s. Passive effects of the same name do not stack.",
    },
  },
  {
    name: "Hellfire Gears",
    type: "Stun",
    rank: "S",
    baseStat: {
      baseValues: [
        [46, 118],
        [159, 231],
        [272, 344],
        [385, 457],
        [498, 570],
        [611, 684],
      ],
    },
    subStat: {
      subStat: "Impact",
      subStatValues: [7.2, 9.4, 11.5, 13.7, 15.8, 18],
    },
    ability: {
      abilityName: "Passionate Construction",
      abilityDescription:
        "When off-field, the equipper's Energy Regen increases by 0.6/s-1.2/s. When using an EX Special Attack, the equipper's Impact is increased by 10%-20% for 10s, stacking up to 2 times. The duration of each stack is calculated separately.",
    },
  },
  {
    name: "Blazing Laurel",
    type: "Stun",
    rank: "S",
    baseStat: {
      baseValues: [
        [48, 123],
        [166, 241],
        [284, 359],
        [402, 477],
        [520, 595],
        [638, 713],
      ],
    },
    subStat: {
      subStat: "Impact",
      subStatValues: [7.2, 9.4, 11.5, 13.7, 15.8, 18],
    },
    ability: {
      abilityName: "Flowing Flame",
      abilityDescription:
        "Upon launching a Quick Assist or Perfect Assist, the equipper's Impact increases by 25%-40% for 8s. When the equipper launches and hits an enemy with a Basic Attack, apply Wilt to the target for 30s, stacking up to 20 times, repeated triggers reset the duration. When any squad member hits an enemy, for every stack of Wilt applied to the target, the CRIT DMG of the Ice DMG and Fire DMG dealt by that attack increases by 1.5%-2.4%. Only one of this effect can be active at a time in the same squad.",
    },
  },
  {
    name: "[Reverb] Mark III",
    type: "Support",
    rank: "B",
    baseStat: {
      baseValues: [
        [32, 82],
        [110, 160],
        [189, 239],
        [268, 318],
        [346, 397],
        [425, 475],
      ],
    },
    subStat: {
      subStat: "HP",
      subStatValues: [8, 10.4, 12.8, 15.2, 17.6, 20],
    },
    ability: {
      abilityName: "Booming Sound",
      abilityDescription:
        "Launching a Chain Attack or Ultimate increases all squad members' ATK by 8%-12% for 10s. This effect can trigger once every 20s. Passive effects of the same name do not stack.",
    },
  },
  {
    name: "[Reverb] Mark II",
    type: "Support",
    rank: "B",
    baseStat: {
      baseValues: [
        [32, 82],
        [110, 160],
        [189, 239],
        [268, 318],
        [346, 397],
        [425, 475],
      ],
    },
    subStat: {
      subStat: "Energy Regen",
      subStatValues: [16, 20.8, 25.6, 30.4, 35.2, 40],
    },
    ability: {
      abilityName: "Roaring Waves",
      abilityDescription:
        "Launching an EX Special Attack or Chain Attack increases all squad members' Anomaly Mastery and Anomaly Proficiency by 10-16 for 10s. This effect can trigger once every 20s. Passive effects of the same name do not stack.",
    },
  },
  {
    name: "[Reverb] Mark I",
    type: "Support",
    rank: "B",
    baseStat: {
      baseValues: [
        [32, 82],
        [110, 160],
        [189, 239],
        [268, 318],
        [346, 397],
        [425, 475],
      ],
    },
    subStat: {
      subStat: "ATK",
      subStatValues: [8, 10.4, 12.8, 15.2, 17.6, 20],
    },
    ability: {
      abilityName: "Changing Tides",
      abilityDescription:
        "Launching an EX Special Attack increases all squad members' Impact by 8%-12% for 10s. This effect can trigger every 20s. Passive effects of the same name do not stack.",
    },
  },
  {
    name: "Unfettered Game Ball",
    type: "Support",
    rank: "A",
    baseStat: {
      baseValues: [
        [40, 102],
        [138, 201],
        [236, 299],
        [335, 397],
        [433, 496],
        [532, 594],
      ],
    },
    subStat: {
      subStat: "Energy Regen",
      subStatValues: [20, 26, 32, 38, 44, 50],
    },
    ability: {
      abilityName: "Game Start!",
      abilityDescription:
        "Whenever the equipper's attack triggers an Attribute Counter effect, all squad members' CRIT Rate against the struck enemy increases by 12%-20% for 12s. The bonuses triggered by the same type of passive effects do not stack.",
    },
  },
  {
    name: "The Vault",
    type: "Support",
    rank: "A",
    baseStat: {
      baseValues: [
        [42, 107],
        [145, 211],
        [248, 314],
        [352, 417],
        [455, 521],
        [558, 624],
      ],
    },
    subStat: {
      subStat: "Energy Regen",
      subStatValues: [20, 26, 32, 38, 44, 50],
    },
    ability: {
      abilityName: "Money-Lover",
      abilityDescription:
        "Dealing Ether DMG using an EX Special Attack, Chain Attack, or Ultimate increases all squad members' DMG against the target by 15%-24% and increases the equipper's Energy Regen by 0.5/s-0.8/s for 2s. Passive effects of the same name do not stack.",
    },
  },
  {
    name: "Slice of Time",
    type: "Support",
    rank: "A",
    baseStat: {
      baseValues: [
        [40, 102],
        [138, 201],
        [236, 299],
        [335, 397],
        [433, 496],
        [532, 594],
      ],
    },
    subStat: {
      subStat: "PEN Ratio",
      subStatValues: [10, 13, 16, 19, 22, 25],
    },
    ability: {
      abilityName: "Say Cheese",
      abilityDescription:
        "Any squad members' Dodge Counter, EX Special Attack, Assist Attack, or Chain Attack respectively generates 20-32/25-40/30-48/35-55 more Decibels and generates 0.7-1.1 Energy for the equipper. This effect can trigger once every 12s. The cooldown for each type of attack is independent of others. Passive effects of the same name do not stack.",
    },
  },
  {
    name: "Kaboom the Cannon",
    type: "Support",
    rank: "A",
    baseStat: {
      baseValues: [
        [42, 107],
        [145, 211],
        [248, 314],
        [352, 417],
        [455, 521],
        [558, 624],
      ],
    },
    subStat: {
      subStat: "Energy Regen",
      subStatValues: [20, 26, 32, 38, 44, 50],
    },
    ability: {
      abilityName: "Stampede Accident",
      abilityDescription:
        "When any friendly unit in the squad attacks and hits an enemy, all squad members' ATK increases by 2.5%-4% for 8s, stacking up to 4 times. The duration of each stack is calculated separately, and each friendly unit can provide 1 stack of the buff. Passive effects of the same name do not stack.",
    },
  },
  {
    name: "Bashful Demon",
    type: "Support",
    rank: "A",
    baseStat: {
      baseValues: [
        [42, 107],
        [145, 211],
        [248, 314],
        [352, 417],
        [455, 521],
        [558, 624],
      ],
    },
    subStat: {
      subStat: "ATK",
      subStatValues: [10, 13, 16, 19, 22, 25],
    },
    ability: {
      abilityName: "Visage of Greed",
      abilityDescription:
        "Increases Ice DMG by 15%-24%. When launching an EX Special Attack, all squad members' ATK increases by 2%-3.2% for 12s, stacking up to 4 times. Retriggering refreshes duration. Passive effects of the same name do not stack.",
      abilityStats: [
        {
          stat: "Ice DMG Bonus",
          percentStat: true,
          upgradeValues: [15, 17.5, 20, 22, 24],
        },
      ],
    },
  },
  {
    name: "Weeping Cradle",
    type: "Support",
    rank: "S",
    baseStat: {
      baseValues: [
        [46, 118],
        [159, 231],
        [272, 344],
        [385, 457],
        [498, 570],
        [611, 684],
      ],
    },
    subStat: {
      subStat: "PEN Ratio",
      subStatValues: [9.6, 12.5, 15.4, 18.2, 21.1, 24],
    },
    ability: {
      abilityName: "Punishment",
      abilityDescription:
        "While off-field, Energy Regen increases by 0.6/s-1.2/s. Attacks from the equipper enhance the squad's DMG against a struck target by 10%-20% for 3 seconds. During this period, this effect is further increased by 1.7%-3.3% every 0.5s, up to a maximum additional increase of 10.2%-19.8%. Repeated triggers only refresh its duration without refreshing the DMG increase effect. Passive effects of the same name do not stack.",
    },
  },
];

export type WEngineStats = z.infer<typeof WEngineStatsSchema>;
