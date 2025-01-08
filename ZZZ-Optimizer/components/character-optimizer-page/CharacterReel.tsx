import React, { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import DuotoneTab from "./duotoneTab";
import ImageTab from "./imageTab";

interface FactionInfo {
  images: string[];
  primaryColor: string;
  secondaryColor: string;
  shortName: string;
  factionIconImage: string; //path to the faction icon image in the ZZZ-Agent-Images/Faction_Icons folder
}

interface CharacterReelProps {
  forwardOnly?: boolean;
  useImageTabs?: boolean;
}

export default function CharacterReel({
  forwardOnly = false,
  useImageTabs = false,
}: Readonly<CharacterReelProps>) {
  // Keep your existing factionFolders data
  const factionFolders: { [faction: string]: FactionInfo } = {
    Belobog_Heavy_Industries: {
      images: [
        "BHI-Anton_Ivanov.png",
        "BHI-Ben_Bigger.png",
        "BHI-Grace_Howard.png",
        "BHI-Koleda_Belobog.png",
      ],
      primaryColor: "#ffba25",
      secondaryColor: "#181818",
      shortName: "BHI",
      factionIconImage: "Belobog_Heavy_Industries.png",
    },
    Cunning_Hares: {
      images: [
        "CN-Anby-Demara.png",
        "CN-Billy-Kid.png",
        "CN-Nekomiya-Mana.png",
        "CN-Nicole-Demara.png",
      ],
      primaryColor: "#ff80a1", //could also use "#ff80a1" (pink)
      secondaryColor: "#8830ff", //could also use ffffff (white) or "#8830ff" (purple)
      shortName: "CH",
      factionIconImage: "Cunning_Hares.png",
    },
    Hollow_Special_Operations_Six: {
      images: [
        "HSO6-Asaba_Harumasa.png",
        "HSO6-Hoshimi_Miyabi.png",
        "HSO6-Soukaku.png",
        "HSO6-Tsukishiro_Yanagi.png",
      ],
      primaryColor: "#42727b",
      secondaryColor: "#d8bb85", //also could use ffffff (white)
      shortName: "HSO6",
      factionIconImage: "HSO6.png",
    },
    New_Eridu_Public_Security: {
      images: [
        "NEPS-Jane_Doe.png",
        "NEPS-Qingyi.png",
        "NEPS-Seth.png",
        "NEPS-Zhu_Yuan.png",
      ],
      primaryColor: "#3c67aa",
      secondaryColor: "#c4cdd4",
      shortName: "NEPS",
      factionIconImage: "NEPS.png",
    },
    Sons_of_Calydon: {
      images: [
        "SoC-Burnice.png",
        "SoC-Caesar-King.png",
        "SoC-Lighter.png",
        "SoC-Lucy.png",
        "SoC-Piper-Wheel.png",
      ],
      primaryColor: "#af4947", //or red-orange "#cd4c31"
      secondaryColor: "#ffdd4f", //could do ffffff (white), black, "#ffdd4f" or darker "#d2d2d1"
      shortName: "SoC",
      factionIconImage: "Sons_of_Calydon.png",
    },
    Victoria_Housekeeping: {
      images: [
        "VH-Alexandrina.png",
        "VH-Corin_Wickes.png",
        "VH-Ellen_Joe.png",
        "VH-Von_Lycaon.png",
      ],
      primaryColor: "#241e2d",
      secondaryColor: "#cdc695",
      shortName: "VH",
      factionIconImage: "Victoria_Housekeeping.png",
    },
  };
  const noCharacterImage = "/ZZZ-Agent-Images/No_Char.png";

  const [selectedFaction, setSelectedFaction] = React.useState<string>(
    Object.keys(factionFolders)[0],
  );
  const [selectedCharacter, setSelectedCharacter] = React.useState<
    string | null
  >(null);

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

  // Handle faction selection via tabs
  const handleFactionClick = useCallback(
    (clickedFaction: string) => {
      if (!emblaApi) return;

      // Skip if we're already on the selected faction
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
    <div className="fixed bottom-4 left-6 right-6">
      <div className="absolute left-2 right-0 top-0 flex translate-y-[-100%] gap-1 px-4">
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
                                  ? `${secondaryColor}60`
                                  : `${primaryColor}60`,
                              }}
                            />
                            <img
                              src={`/ZZZ-Agent-Images/${faction}/${image}`}
                              alt={`${faction} character`}
                              className="relative z-10 h-16 w-16 select-none object-cover"
                              onError={(e) => {
                                e.currentTarget.src = noCharacterImage;
                              }}
                              draggable={false}
                              onClick={() => {
                                const newCharacterName = isSelected
                                  ? null
                                  : characterName;
                                setSelectedCharacter(newCharacterName);

                                if (newCharacterName) {
                                  const characterFaction =
                                    getFactionForCharacter(newCharacterName);
                                  if (characterFaction) {
                                    handleFactionClick(characterFaction);
                                  }
                                }
                              }}
                            />
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
