import { OSWindow, Position, RelativePosition } from "@/components/OSWindow";
import { WEngineStats } from "@/lib/WEngineStats";

interface WEngineViewWindowProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  wengine: WEngineStats;
  curLevel: number;
  curMaxLevel: number;
  className?: string;
  position?: Position | RelativePosition;
  defaultPosition?: Position;
}

export const WEngineViewWindow: React.FC<WEngineViewWindowProps> = ({
  id,
  isOpen,
  onClose,
  wengine,
  curLevel,
  curMaxLevel,
  className,
  position,
  defaultPosition,
}) => {
  // Modify the name to match the image name format
  const wengineName =
    wengine.name
      .replace(/\[([^\]]+)\]/g, "($1)") // Replace square brackets with parentheses
      .replace(/\s+/g, "_") + // Replace spaces with underscores
    "_" +
    wengine.rank; // Add rank suffix
  const wengineImage = `/ZZZ-WEngine-Images/${wengine.type}/${wengineName}.png`;

  //calculate the mod (modification) level of the wengine
  //0 would be from 0/10 to 10/10
  //1 would be from 10/20 to 20/20
  //2 would be from 20/30 to 30/30
  //3 would be from 30/40 to 40/40
  //4 would be from 40/50 to 50/50
  //5 would be from 50/60 to 60/60
  //calculate mod level with checks
  let modLevel = 0;
  if (curLevel >= 10 && curLevel <= 20 && curMaxLevel == 20) {
    modLevel = 1;
  } else if (curLevel >= 20 && curLevel <= 30 && curMaxLevel == 30) {
    modLevel = 2;
  } else if (curLevel >= 30 && curLevel <= 40 && curMaxLevel == 40) {
    modLevel = 3;
  } else if (curLevel >= 40 && curLevel <= 50 && curMaxLevel == 50) {
    modLevel = 4;
  } else if (curLevel >= 50 && curLevel <= 60 && curMaxLevel == 60) {
    modLevel = 5;
  }

  // Get the current base stat range
  const currentBaseRange = wengine.baseStat.baseValues[modLevel];

  //calculate the base value based on how close the current level is to the max level
  const baseValue = Math.floor(
    currentBaseRange[0] +
      (currentBaseRange[1] - currentBaseRange[0]) * (curLevel / curMaxLevel),
  );

  // Get the current sub stat value
  const currentSubStatValue = wengine.subStat.subStatValues[modLevel];
  return (
    <OSWindow
      id={id}
      title={`WEngine View - ${wengine.name}`}
      isOpen={isOpen}
      onClose={onClose}
      className={className}
      position={position}
      defaultPosition={defaultPosition}
      overrideMinWidth="fit-content"
    >
      <div className="flex gap-4 text-base">
        {/* Left side - Image and basic info */}
        <div className="flex flex-1 flex-col items-center space-y-4 border-r border-gray-300 pr-4">
          <img
            src={wengineImage}
            alt={wengine.name}
            width={100}
            height={100}
            className="object-contain"
          />
          <div className="space-y-2">
            <p className="font-DOS">{wengine.name}</p>
            <p className="font-DOS">
              Lvl. {curLevel}/{curMaxLevel}
            </p>
            <p className="font-DOS">Type: {wengine.type}</p>
            <p className="font-DOS">Rank: {wengine.rank}</p>
          </div>
        </div>

        {/* Right side - Stats */}
        <div className="flex-1 space-y-4 text-base">
          {/* Base stat */}
          <div className="border-b border-gray-300 pb-2">
            <h3 className="font-DOS text-lg">Base ATK</h3>
            <p className="font-DOS text-sm">{baseValue}</p>
          </div>

          {/* Sub stat */}
          <div className="border-b border-gray-300 pb-2">
            <h3 className="font-DOS text-lg">Sub Stat</h3>
            <p className="font-DOS text-sm">
              {wengine.subStat.subStat}: {currentSubStatValue}
              {wengine.subStat.subStat !== "Anomaly Proficiency" &&
              wengine.subStat.subStat !== "Anomaly Mastery"
                ? "%"
                : ""}
            </p>
          </div>

          {/* Ability */}
          <div>
            <h3 className="font-DOS text-lg">{wengine.ability.abilityName}</h3>
            <p className="max-w-[200px] whitespace-pre-wrap font-DOS text-sm">
              {wengine.ability.abilityDescription}
            </p>
            {wengine.ability.abilityStats && (
              <div className="mt-2 space-y-1">
                {wengine.ability.abilityStats.map((stat, index) => (
                  <p key={index} className="font-DOS text-sm">
                    {stat.stat}:{" "}
                    {stat.upgradeValues.map((value, vIndex) => (
                      <span key={vIndex}>
                        {value}
                        {stat.percentStat ? "%" : ""}
                        {vIndex < stat.upgradeValues.length - 1 ? " → " : ""}
                      </span>
                    ))}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </OSWindow>
  );
};
