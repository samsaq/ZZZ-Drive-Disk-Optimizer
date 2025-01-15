import { useEffect, useState } from "react";
import { OSWindow, Position, RelativePosition } from "@/components/OSWindow";
import { WEngines, WEngineStats } from "@/lib/WEngineStats";
import { cn } from "@/lib/utils";

interface WEngineSearchSelectWindowProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  position?: Position | RelativePosition;
  defaultPosition?: Position;
  containerClassName?: string;
  wengineGridClassName?: string;
  wengineStatsClassName?: string;
  onSelect?: (wengine: WEngineStats) => void;
}

export const WEngineSearchSelectWindow: React.FC<
  WEngineSearchSelectWindowProps
> = ({
  id,
  isOpen,
  onClose,
  className,
  position,
  defaultPosition,
  containerClassName,
  wengineGridClassName,
  wengineStatsClassName,
  onSelect,
}) => {
  // Get unique wengine types from the imported WEngines array
  const types = Array.from(
    new Set(WEngines.map((wengine) => wengine.type)),
  ).sort();

  // States
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWEngine, setSelectedWEngine] = useState<WEngineStats | null>(
    null,
  );
  const [curLevel, setCurLevel] = useState(60);
  const [curMaxLevel, setCurMaxLevel] = useState(60);

  //trigger onSelect when a WEngine is selected
  useEffect(() => {
    if (selectedWEngine && onSelect) {
      onSelect(selectedWEngine);
    }
  }, [selectedWEngine, onSelect]);

  // Calculate stats when a WEngine is selected and levels are provided
  let modLevel = 0;
  let baseValue = 0;
  let currentSubStatValue = 0;

  if (selectedWEngine && curLevel && curMaxLevel) {
    // Calculate mod level
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

    // Calculate base value
    const currentBaseRange = selectedWEngine.baseStat.baseValues[modLevel];
    baseValue = Math.floor(
      currentBaseRange[0] +
        (currentBaseRange[1] - currentBaseRange[0]) * (curLevel / curMaxLevel),
    );

    // Get current sub stat value
    currentSubStatValue = selectedWEngine.subStat.subStatValues[modLevel];
  }

  // Filter wengines based on type and search query
  const filteredWEngines = WEngines.filter((wengine) => {
    const matchesType = selectedType ? wengine.type === selectedType : true;
    const matchesSearch = wengine.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <OSWindow
      id={id}
      title="WEngine Selection"
      isOpen={isOpen}
      onClose={onClose}
      className={className}
      position={position}
      defaultPosition={defaultPosition}
    >
      <div className={cn("flex gap-4", containerClassName)}>
        {/* Left side - WEngine selection */}
        <div
          className="flex w-fit flex-col pr-4"
          style={{
            borderRight: selectedWEngine
              ? "1px solid rgb(209 213 219)"
              : "none",
          }}
        >
          {/* Search input */}
          <input
            className="mb-4 font-DOS"
            placeholder="Search WEngines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Type filters */}
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedType(null)}
              className={cn(
                "border border-gray-300 px-2 py-1 font-DOS text-sm",
                !selectedType
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent",
              )}
            >
              All
            </button>
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={cn(
                  "border border-gray-300 px-2 py-1 font-DOS text-sm",
                  selectedType === type
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent",
                )}
              >
                {type}
              </button>
            ))}
          </div>

          {/* WEngine grid with scrolling */}
          <div className="flex-1">
            <div
              className={cn(
                "grid h-[18rem] auto-rows-[4rem] gap-2 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                "grid-cols-6",
                wengineGridClassName,
              )}
            >
              {filteredWEngines.map((wengine, index) => {
                const wengineName =
                  wengine.name
                    .replace(/\[([^\]]+)\]/g, "($1)")
                    .replace(/\s+/g, "_") +
                  "_" +
                  wengine.rank;
                const wengineImage = `/ZZZ-WEngine-Images/${wengine.type}/${wengineName}.png`;

                return (
                  <button
                    key={`${wengine.name}-${wengine.type}-${index}`}
                    onClick={() => setSelectedWEngine(wengine)}
                    className={cn(
                      "flex h-16 w-16 items-center justify-center rounded border border-gray-300 p-1",
                      selectedWEngine === wengine
                        ? "bg-accent"
                        : "hover:bg-accent/50",
                    )}
                  >
                    <img
                      src={wengineImage}
                      alt={wengine.name}
                      width={50}
                      height={50}
                      className="object-contain"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right side - WEngine stats */}
        {selectedWEngine && (
          <div className={cn("flex-1", wengineStatsClassName)}>
            <div className="flex flex-col gap-4 text-base">
              <div className="flex">
                {/* Left side - Image and basic info */}
                <div className="flex flex-1 flex-col items-center space-y-2 border-r border-gray-300 pr-4">
                  <img
                    src={`/ZZZ-WEngine-Images/${selectedWEngine.type}/${selectedWEngine.name
                      .replace(/\[([^\]]+)\]/g, "($1)")
                      .replace(/\s+/g, "_")}_${selectedWEngine.rank}.png`}
                    alt={selectedWEngine.name}
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                  <div className="w-full space-y-2">
                    <p className="text-center font-DOS">
                      {selectedWEngine.name}
                    </p>
                    <p className="text-center font-DOS">
                      Lvl. {curLevel}/{curMaxLevel}
                    </p>
                    <div className="grid grid-cols-[1fr,auto] gap-2 font-DOS">
                      <span className="text-nowrap text-left">Type:</span>
                      <span className="text-right">{selectedWEngine.type}</span>
                    </div>
                    <div className="grid grid-cols-[1fr,auto] gap-2 font-DOS">
                      <span className="text-nowrap text-left">Rank:</span>
                      <span className="text-right">{selectedWEngine.rank}</span>
                    </div>
                  </div>

                  {/* Stats Section */}
                  {curLevel && curMaxLevel && (
                    <div className="w-full space-y-2 border-t border-gray-300 pt-2">
                      <div className="grid grid-cols-[1fr,auto] gap-2 font-DOS text-sm">
                        <span className="text-nowrap text-left">Base ATK:</span>
                        <span className="text-right">{baseValue}</span>
                      </div>
                      <div className="grid grid-cols-[1fr,auto] gap-2 font-DOS text-sm">
                        <span className="text-nowrap text-left">
                          {selectedWEngine.subStat.subStat}:
                        </span>
                        <span className="text-right">
                          {currentSubStatValue}
                          {selectedWEngine.subStat.subStat !==
                            "Anomaly Proficiency" &&
                          selectedWEngine.subStat.subStat !== "Anomaly Mastery"
                            ? "%"
                            : ""}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right side - Ability */}
                <div className="flex-1 space-y-4 pl-4 text-base">
                  {/* Ability */}
                  <div className="flex max-h-[300px] flex-col items-center overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <h3 className="max-w-[200px] font-DOS text-lg">
                      {selectedWEngine.ability.abilityName}
                    </h3>
                    <p className="mx-auto max-w-[200px] whitespace-pre-wrap font-DOS text-sm">
                      {selectedWEngine.ability.abilityDescription}
                    </p>
                  </div>
                </div>
              </div>

              {/* Level selector and confirm button */}
              <div className="mt-auto flex items-center justify-between border-t border-gray-300 pt-4">
                <div className="flex items-center gap-2">
                  <span className="font-DOS text-sm">Lv.</span>
                  <input
                    type="number"
                    min={1}
                    max={curMaxLevel}
                    value={curLevel}
                    onChange={(e) => {
                      const value = Math.min(
                        Math.max(1, parseInt(e.target.value) || 1),
                        curMaxLevel ?? 60,
                      );
                      setCurLevel(value);
                      if (selectedWEngine && onSelect) {
                        onSelect(selectedWEngine);
                      }
                    }}
                    className="w-[3ch] border-b border-white bg-transparent text-center font-DOS text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <span className="font-DOS text-sm">/</span>
                  <select
                    className="rounded border border-white bg-transparent font-DOS text-sm hover:bg-white/10 [&>option]:bg-zinc-900"
                    value={curMaxLevel}
                    onChange={(e) => {
                      const newMax = parseInt(e.target.value);
                      setCurMaxLevel(newMax);

                      // Adjust current level to stay within 10 levels of max
                      const minAllowedLevel = Math.max(newMax - 10, 1);
                      if (curLevel < minAllowedLevel) {
                        setCurLevel(minAllowedLevel);
                      } else if (curLevel > newMax) {
                        setCurLevel(newMax);
                      }

                      if (selectedWEngine && onSelect) {
                        onSelect(selectedWEngine);
                      }
                    }}
                  >
                    {[10, 20, 30, 40, 50, 60].map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={onClose}
                  className="rounded border border-white bg-transparent px-4 py-1 font-DOS text-sm hover:bg-white/10"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </OSWindow>
  );
};
