import React, { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import DuotoneTab from "./duotoneTab";
import ImageTab from "./imageTab";
import { Factions } from "@/lib/agentStats";
import { useOptimizer } from "@/components/character-optimizer-page/optimizerContext";
import { agentStats } from "@/lib/agentStats";

interface CharacterReelProps {
  forwardOnly?: boolean;
  useImageTabs?: boolean;
  onLevelChange?: (maxLevel: number, currentLevel: number) => void;
}

export default function CharacterReel({
  forwardOnly = false,
  useImageTabs = false,
  onLevelChange,
}: Readonly<CharacterReelProps>) {
  const factionFolders = Factions;
  const noCharacterImage = "/ZZZ-Agent-Images/No_Char.png";

  const { selectedAgent, setSelectedAgent } = useOptimizer();

  const [selectedFaction, setSelectedFaction] = React.useState<string>(
    Object.keys(factionFolders)[0],
  );
  const [selectedCharacter, setSelectedCharacter] = React.useState<
    string | null
  >(nameFromImagePath(factionFolders[selectedFaction].images[0]));

  // Initialize Embla Carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: true,
    containScroll: false,
    align: "start",
    slidesToScroll: 1,
    watchDrag: true,
    skipSnaps: false,
    inViewThreshold: 0.7,
  });

  // Add new state for levels
  const [maxLevel, setMaxLevel] = React.useState<number>(60);
  const [currentLevel, setCurrentLevel] = React.useState<number>(60);

  // Add level selection handler
  const handleLevelChange = useCallback(
    (newMax: number | null, newCurrent: number | null) => {
      if (newMax !== null) {
        setMaxLevel(newMax);
        // Ensure current level doesn't exceed new max
        if (currentLevel > newMax) {
          setCurrentLevel(newMax);
          onLevelChange?.(newMax, newMax);
          if (selectedAgent) {
            setSelectedAgent({
              ...selectedAgent,
              agentLevel: newMax,
              agentMaxLevel: newMax,
            });
          }
        } else {
          onLevelChange?.(newMax, currentLevel);
          if (selectedAgent) {
            setSelectedAgent({
              ...selectedAgent,
              agentLevel: newMax,
            });
          }
        }
      }
      if (newCurrent !== null && newCurrent <= maxLevel) {
        setCurrentLevel(newCurrent);
        onLevelChange?.(maxLevel, newCurrent);
        if (selectedAgent) {
          setSelectedAgent({
            ...selectedAgent,
            agentLevel: newCurrent,
          });
        }
      }
    },
    [currentLevel, maxLevel, selectedAgent],
  );

  // Handle faction selection via tabs
  const handleFactionClick = useCallback(
    (clickedFaction: string) => {
      if (!emblaApi) return;

      if (clickedFaction === selectedFaction) return;

      const factions = Object.keys(factionFolders);
      const currentIndex = emblaApi.selectedScrollSnap();
      const targetFactionIndex = factions.indexOf(clickedFaction);

      // Calculate all possible positions of this faction in the tripled list
      const positions = [
        targetFactionIndex, // First instance
        targetFactionIndex + factions.length, // Second instance
        targetFactionIndex + factions.length * 2, // Third instance
      ];

      if (forwardOnly) {
        // Find the first position that's ahead of the current index
        const nextPosition =
          positions.find((pos) => pos > currentIndex) ?? positions[0];
        emblaApi.scrollTo(nextPosition);
      } else {
        // Find the closest position (original behavior)
        const closestPosition = positions.reduce(
          (prev, curr) =>
            Math.abs(curr - currentIndex) < Math.abs(prev - currentIndex)
              ? curr
              : prev,
          positions[0],
        );
        emblaApi.scrollTo(closestPosition);
      }

      setSelectedFaction(clickedFaction);
    },
    [emblaApi, factionFolders, forwardOnly, selectedFaction],
  );

  // Update selected faction when scrolling
  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", () => {
      const index = emblaApi.selectedScrollSnap();
      const factions = Object.keys(factionFolders);
      // Get the actual faction by using modulo to wrap around to the original list
      const actualIndex = index % factions.length;
      setSelectedFaction(factions[actualIndex]);
    });
  }, [emblaApi, factionFolders]);

  // Create duplicated slides for proper looping - embla needs it to be long to loop
  const slides = [
    ...Object.keys(factionFolders),
    ...Object.keys(factionFolders),
    ...Object.keys(factionFolders),
  ];

  //take the image paths of the characters and return the name of the character
  function nameFromImagePath(imagePath: string) {
    // Remove the prefix (e.g., "BHI-", "CN-") and extension
    const nameWithoutPrefix = imagePath
      .split("-")
      .slice(1)
      .join("-")
      .split(".")[0];
    // Replace both hyphens and underscores with spaces
    return nameWithoutPrefix.replace(/[-_]/g, " ");
  }

  function getFactionForCharacter(characterName: string): string | null {
    for (const [faction, info] of Object.entries(factionFolders)) {
      if (
        info.images.some((image) => nameFromImagePath(image) === characterName)
      ) {
        return faction;
      }
    }
    return null;
  }

  return (
    <div className="fixed bottom-[3vh] left-[2vw] right-[2vw]">
      <div className="absolute left-2 right-0 top-0 flex translate-y-[-100%] justify-between px-4">
        <div className="flex gap-1">
          {Object.keys(factionFolders).map((faction) =>
            useImageTabs ? (
              <ImageTab
                key={`tab-${faction}`}
                primaryColor={factionFolders[faction].primaryColor}
                secondaryColor={factionFolders[faction].secondaryColor}
                onClick={() => handleFactionClick(faction)}
                isSelected={selectedFaction === faction}
                hasBottomBorder={false}
                imageSrc={`/ZZZ-Agent-Images/Faction_Icons/${factionFolders[faction].factionIconImage}`}
                imageAlt={`${faction} icon`}
              />
            ) : (
              <DuotoneTab
                key={`tab-${faction}`}
                text={factionFolders[faction].shortName}
                primaryColor={factionFolders[faction].primaryColor}
                secondaryColor={factionFolders[faction].secondaryColor}
                onClick={() => handleFactionClick(faction)}
                isSelected={selectedFaction === faction}
                hasBottomBorder={false}
              />
            ),
          )}
        </div>

        <div className="flex translate-x-[-10%] items-center gap-2 rounded-t-lg border-l-2 border-r-2 border-t-2 border-white px-2">
          <div className="flex items-center gap-2">
            <span className="font-DOS text-sm">Lv.</span>
            <input
              type="number"
              min={1}
              max={maxLevel}
              value={currentLevel}
              onChange={(e) => {
                const value = Math.min(
                  Math.max(1, parseInt(e.target.value) || 1),
                  maxLevel,
                );
                handleLevelChange(null, value);
              }}
              className="w-[3ch] border-b border-white bg-transparent text-center font-DOS text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <span className="font-DOS text-sm">/</span>
          </div>
          <select
            className="rounded border border-white bg-transparent font-DOS text-sm hover:bg-white/10 [&>option]:bg-zinc-900"
            value={maxLevel}
            onChange={(e) => handleLevelChange(parseInt(e.target.value), null)}
          >
            {[10, 20, 30, 40, 50, 60].map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-full border-t-2 border-white bg-gray-400 bg-opacity-20">
        <div className="w-full px-4 py-[2px]">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-1">
              {slides.map((faction, index) => {
                const { images, primaryColor, secondaryColor } =
                  factionFolders[faction];
                return (
                  <div
                    key={`${faction}-${index}`}
                    className="flex-[0_0_auto] rounded-lg p-1"
                  >
                    <div className="flex gap-3">
                      {images.map((image) => {
                        const characterName = nameFromImagePath(image);
                        const isSelected = selectedCharacter === characterName;
                        return (
                          <div
                            key={`${faction}-${image}-${index}`}
                            className="relative flex-[0_0_auto] cursor-pointer"
                          >
                            <div
                              className="pointer-events-none absolute inset-0"
                              style={{
                                content: '""',
                                transform: "skewX(16deg) scale(1.15)",
                                border: `3px solid ${isSelected ? secondaryColor : primaryColor}10`,
                                borderTopRightRadius: "0.24rem",
                                borderBottomLeftRadius: "0.24rem",
                                opacity: isSelected ? 1 : 0.85,
                                transition:
                                  "opacity 0.2s ease-in-out, background-color 0.2s ease-in-out, border-color 0.2s ease-in-out",
                                backgroundColor: isSelected
                                  ? `${secondaryColor}90`
                                  : `${primaryColor}60`,
                              }}
                            />

                            <button
                              type="button"
                              className="relative z-10 h-16 w-16"
                              onClick={() => {
                                const newCharacterName = isSelected
                                  ? null
                                  : characterName;
                                setSelectedCharacter(newCharacterName);

                                if (newCharacterName) {
                                  // Case-insensitive partial name matching since file names aren't always the same
                                  const agentData = agentStats.find((a) => {
                                    const searchName =
                                      newCharacterName.toLowerCase();
                                    const fullName = a.name.toLowerCase();
                                    const briefName =
                                      a.briefName?.toLowerCase();

                                    return (
                                      fullName.includes(searchName) ||
                                      (briefName &&
                                        briefName.includes(searchName))
                                    );
                                  });

                                  setSelectedAgent(
                                    agentData
                                      ? {
                                          agentStats: agentData,
                                          agentLevel: currentLevel,
                                          agentMaxLevel: maxLevel,
                                        }
                                      : null,
                                  );
                                } else {
                                  setSelectedAgent(null);
                                  console.log(
                                    "selected agent is null with name: ",
                                    newCharacterName,
                                  );
                                }

                                if (newCharacterName) {
                                  const characterFaction =
                                    getFactionForCharacter(newCharacterName);
                                  if (characterFaction) {
                                    handleFactionClick(characterFaction);
                                  }
                                }
                              }}
                            >
                              <img
                                src={`/ZZZ-Agent-Images/${faction}/${image}`}
                                alt={`${faction} character`}
                                className="h-full w-full select-none object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = noCharacterImage;
                                }}
                                draggable={false}
                              />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
