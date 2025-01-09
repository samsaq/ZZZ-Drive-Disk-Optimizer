import { z } from "zod";
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

export { valid_set_names, valid_base_stats, valid_random_stats };

export const valid_ability_stats = valid_base_stats.concat([
  "Shield",
  "DMG Taken",
]);

//a schema for disk drive sets
export const diskDriveSetSchema = z.object({
  setName: z.enum(valid_set_names as [string, ...string[]]),
  twoPieceDesc: z.string(),
  fourPieceDesc: z.string(),
  setIcon: z.string(), //path within the public folder to the set icon
  stats: z.array(
    z.object({
      //for any hard (non combat) stats given by the set, and at what amount of pieces (2p and 4p) it becomes active
      stat: z.enum(valid_ability_stats as [string, ...string[]]), //only anomaly stats are not percentage based
      piecesNeeded: z.enum(["2p", "4p"]),
      value: z.number(),
      percentage: z.boolean(), //if the stat is a percentage
      condition: z.string().optional(), //optional condition for the stat to be active (eg: for 4p effects - if it shows out of combat)
    }),
  ),
});
export type DiskDriveSet = z.infer<typeof diskDriveSetSchema>;

export const setData: DiskDriveSet[] = [
  {
    setName: "Astral Voice",
    twoPieceDesc: "ATK +10%",
    fourPieceDesc:
      "Whenever any squad member enters the field using a Quick Assist, all squad members gain 1 stack of Astral, up to a maximum of 3 stacks, and lasting 15s. Repeated triggers reset the duration. Each stack of Astral increases the damage dealt by the character entering the field using a Quick Assist by 8%. Only one of this effect can be active at a time in the same squad.",
    setIcon: "/ZZZ-Disk-Drive-Images/Disk_Set_Images/Astral_Voice.png",
    stats: [
      {
        stat: "ATK",
        value: 10,
        percentage: true,
        piecesNeeded: "2p",
      },
    ],
  },
  {
    setName: "Branch & Blade Song",
    twoPieceDesc: "CRIT DMG +16%",
    //oddly the crit dmg bonus over 115 AM doesn't apply out of combat, so we won't be adding to to the stats section
    fourPieceDesc:
      "When Anomaly Mastery exceeds or equals 115 points, the equipper's CRIT damage increases by 30%. When any squad member applies Freeze or triggers the Shatter effect on an enemy, the equipper's CRIT Rate increases by 12%, lasting 15s.",
    setIcon: "/ZZZ-Disk-Drive-Images/Disk_Set_Images/Branch_&_Blade_Song.png",
    stats: [
      {
        stat: "CRIT DMG",
        value: 16,
        piecesNeeded: "2p",
        percentage: true,
      },
    ],
  },
  {
    setName: "Chaos Jazz",
    twoPieceDesc: "Anomaly Proficiency +30",
    //DMG bonus only active in combat on field
    fourPieceDesc:
      "Fire DMG and Electric DMG are increased by 15%. When off-field, DMG dealt by EX Special Attacks and Assist Attacks is increased by 20%. When the character switches back onto the field, this buff continues for 5s. The lasting effect can be triggered once every 7.55s.",
    setIcon: "/ZZZ-Disk-Drive-Images/Disk_Set_Images/Chaos_Jazz.png",
    stats: [
      {
        stat: "Anomaly Proficiency",
        value: 30,
        piecesNeeded: "2p",
        percentage: false,
      },
    ],
  },
  {
    setName: "Chaotic Metal",
    twoPieceDesc: "Increases Ether DMG by 10%",
    fourPieceDesc:
      "Whenever a squad member inflicts Corruption on an enemy, that enemy takes 18% more DMG for 12s. Passive effects of the same name do not stack.",
    setIcon: "/ZZZ-Disk-Drive-Images/Disk_Set_Images/Chaotic_Metal.png",
    stats: [
      {
        stat: "Ether DMG Bonus",
        value: 10,
        percentage: true,
        piecesNeeded: "2p",
      },
    ],
  },
  {
    setName: "Fanged Metal",
    twoPieceDesc: "Increases Physical DMG by 10%",
    fourPieceDesc:
      "Whenever a squad member inflicts Assault on an enemy, the equipper deals 35% additional DMG to the target for 12s.",
    setIcon: "/ZZZ-Disk-Drive-Images/Disk_Set_Images/Fanged_Metal.png",
    stats: [
      {
        stat: "Physical DMG Bonus",
        value: 10,
        piecesNeeded: "2p",
        percentage: true,
      },
    ],
  },
  {
    setName: "Freedom Blues",
    twoPieceDesc: "Increases Anomaly Proficiency by 30",
    fourPieceDesc:
      "When an EX Special Attack hits an enemy, reduce the target's Anomaly Buildup RES to the equipper's Attribute by 35% for 8s. This effect does not stack with others of the same attribute.",
    setIcon: "/ZZZ-Disk-Drive-Images/Disk_Set_Images/Freedom_Blues.png",
    stats: [
      {
        stat: "Anomaly Proficiency",
        value: 30,
        piecesNeeded: "2p",
        percentage: false,
      },
    ],
  },
  {
    setName: "Hormone Punk",
    twoPieceDesc: "ATK +10%",
    fourPieceDesc:
      "Upon entering or switching into combat, the equipper has their ATK increased by 25% for 8s. This effect can be triggered once every 20s.",
    setIcon: "/ZZZ-Disk-Drive-Images/Disk_Set_Images/Hormone_Punk.png",
    stats: [
      {
        stat: "ATK",
        value: 10,
        piecesNeeded: "2p",
        percentage: true,
      },
    ],
  },
  {
    setName: "Inferno Metal",
    twoPieceDesc: "Increases Fire DMG by 10%",
    fourPieceDesc:
      "Upon hitting a Burning enemy, the equipper's CRIT Rate is increased by 28% for 8s.",
    setIcon: "/ZZZ-Disk-Drive-Images/Disk_Set_Images/Inferno_Metal.png",
    stats: [
      {
        stat: "Fire DMG Bonus",
        value: 10,
        piecesNeeded: "2p",
        percentage: true,
      },
    ],
  },
  {
    setName: "Polar Metal",
    twoPieceDesc: "Increases Ice DMG by 10%",
    fourPieceDesc:
      "Basic Attack and Dash Attack DMG increases by 28%. Whenever a squad member Freezes or Shatters an enemy, the buff further increases by 28% for 12s.",
    setIcon: "/ZZZ-Disk-Drive-Images/Disk_Set_Images/Polar_Metal.png",
    stats: [
      {
        stat: "Ice DMG Bonus",
        value: 10,
        piecesNeeded: "2p",
        percentage: true,
      },
    ],
  },
  {
    setName: "Proto Punk",
    twoPieceDesc: "Shield effect +15%",
    fourPieceDesc:
      "When any squad member triggers a Defensive Assist or Evasive Assist, all squad members deal 15% increased DMG, lasting 10s. Passive effects of the same name do not stack.",
    setIcon: "/ZZZ-Disk-Drive-Images/Disk_Set_Images/Proto_Punk.png",
    stats: [
      {
        stat: "Shield",
        value: 15,
        piecesNeeded: "2p",
        percentage: true,
      },
    ],
  },
  {
    setName: "Puffer Electro",
    twoPieceDesc: "Increases PEN Ratio by 8%",
    fourPieceDesc:
      "Ultimate DMG increases by 20%. Launching an Ultimate increases the equipper's ATK by 15% for 12s.",
    setIcon: "/ZZZ-Disk-Drive-Images/Disk_Set_Images/Puffer_Electro.png",
    stats: [
      {
        stat: "PEN Ratio",
        value: 8,
        piecesNeeded: "2p",
        percentage: true,
      },
    ],
  },
  {
    setName: "Shockstar Disco",
    twoPieceDesc: "Increases Impact by 6%",
    fourPieceDesc:
      "Basic Attacks, Dash Attacks, Dodge Counter, Special Attacks, and EX Special Attacks inflict 15% more Daze upon the main target.",
    setIcon: "/ZZZ-Disk-Drive-Images/Disk_Set_Images/Shockstar_Disco.png",
    stats: [
      {
        stat: "Impact",
        value: 6,
        piecesNeeded: "2p",
        percentage: true,
      },
    ],
  },
  {
    setName: "Soul Rock",
    twoPieceDesc: "Increases DEF by 16%",
    fourPieceDesc:
      "Upon receiving an enemy attack and losing HP, the equipper takes 40% less DMG for 2.5s. This effect can trigger once every 15s.",
    setIcon: "/ZZZ-Disk-Drive-Images/Disk_Set_Images/Soul_Rock.png",
    stats: [
      {
        stat: "DEF",
        value: 16,
        piecesNeeded: "2p",
        percentage: true,
      },
    ],
  },
  {
    setName: "Swing Jazz",
    twoPieceDesc: "Energy Regen increases by 20%",
    fourPieceDesc:
      "Launching a Chain Attack or Ultimate increases all squad members' DMG by 15% for 12s. Passive effects of the same name do not stack.",
    setIcon: "/ZZZ-Disk-Drive-Images/Disk_Set_Images/Swing_Jazz.png",
    stats: [
      {
        stat: "Energy Regen",
        value: 20,
        piecesNeeded: "2p",
        percentage: true,
      },
    ],
  },
  {
    setName: "Thunder Metal",
    twoPieceDesc: "Increases Electric DMG by 10%",
    fourPieceDesc:
      "As long as an enemy in combat is Shocked, the equipper's ATK is increased by 27%.",
    setIcon: "/ZZZ-Disk-Drive-Images/Disk_Set_Images/Thunder_Metal.png",
    stats: [
      {
        stat: "Electric DMG Bonus",
        value: 10,
        piecesNeeded: "2p",
        percentage: true,
      },
    ],
  },
  {
    setName: "Woodpecker Electro",
    twoPieceDesc: "Increases CRIT Rate by 8%",
    fourPieceDesc:
      "Triggering a critical hit with a Basic Attack, Dodge Counter, or EX Special Attack increases the equipper's ATK by 9% for 6s. The buff duration for different skills are calculated seperately.",
    setIcon: "/ZZZ-Disk-Drive-Images/Disk_Set_Images/Woodpecker_Electro.png",
    stats: [
      {
        stat: "CRIT Rate",
        value: 8,
        piecesNeeded: "2p",
        percentage: true,
      },
    ],
  },
];
