import { OSWindow, Position, RelativePosition } from "@/components/OSWindow";
import { WEngineStats } from "@/lib/WEngineStats";

interface WEngineViewWindowProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  wengine: WEngineStats;
  className?: string;
  position?: Position | RelativePosition;
  defaultPosition?: Position;
}

export const WEngineViewWindow: React.FC<WEngineViewWindowProps> = ({
  id,
  isOpen,
  onClose,
  wengine,
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
            <p className="font-DOS">Type: {wengine.type}</p>
            <p className="font-DOS">Rank: {wengine.rank}</p>
          </div>
        </div>

        {/* Right side - Stats */}
        <div className="flex-1 space-y-4 text-base">
          {/* Base stat */}
          <div className="border-b border-gray-300 pb-2">
            <h3 className="font-DOS text-lg">Base ATK Range</h3>
            <div className="space-y-1">
              {wengine.baseStat.baseValues.map((range, index) => (
                <p key={index} className="font-DOS text-sm">
                  Mod {index}: {range[0]} - {range[1]}
                </p>
              ))}
            </div>
          </div>

          {/* Sub stat */}
          <div className="border-b border-gray-300 pb-2">
            <h3 className="font-DOS text-lg">Sub Stat</h3>
            <p className="font-DOS text-sm">
              {wengine.subStat.subStat}:{" "}
              {wengine.subStat.subStatValues.map((value, index) => (
                <span key={index}>
                  {value}
                  {index < wengine.subStat.subStatValues.length - 1
                    ? " → "
                    : ""}
                </span>
              ))}
            </p>
          </div>

          {/* Ability */}
          <div>
            <h3 className="font-DOS text-lg">{wengine.ability.abilityName}</h3>
            <p className="whitespace-pre-wrap font-DOS text-sm">
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
