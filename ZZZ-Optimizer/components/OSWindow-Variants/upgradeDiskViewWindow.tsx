import { useState } from "react";
import { OSWindow, Position, RelativePosition } from "@/components/OSWindow";
import { DiskScan, cn } from "@/lib/utils";

interface UpgradeDiskViewWindowProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  disks: DiskScan[];
  className?: string;
  position?: Position | RelativePosition;
  defaultPosition?: Position;
  containerClassName?: string;
  diskGridClassName?: string;
  diskStatsClassName?: string;
}

export const UpgradeDiskViewWindow: React.FC<UpgradeDiskViewWindowProps> = ({
  id,
  isOpen,
  onClose,
  disks,
  className,
  position,
  defaultPosition,
  containerClassName,
  diskGridClassName,
  diskStatsClassName,
}) => {
  // Get unique partition numbers
  const partitions = Array.from(
    new Set(disks.map((disk) => disk.partition_number)),
  ).sort((a, b) => parseInt(a) - parseInt(b));

  // State for selected partition and disk
  const [selectedPartition, setSelectedPartition] = useState(partitions[0]);
  const [selectedDisk, setSelectedDisk] = useState<DiskScan | null>(
    disks.find((disk) => disk.partition_number === partitions[0]) ?? null,
  );

  // Filter disks by partition
  const filteredDisks = disks.filter(
    (disk) => disk.partition_number === selectedPartition,
  );

  return (
    <OSWindow
      id={id}
      title="Disk Upgrade Recommendations"
      isOpen={isOpen}
      onClose={onClose}
      className={className}
      position={position}
      defaultPosition={defaultPosition}
    >
      <div className={cn("flex gap-4", containerClassName)}>
        {/* Left side - Disk selection */}
        <div className="flex w-fit flex-col border-r border-gray-300 pr-4">
          {/* Partition filters */}
          <div className="mb-4 flex flex-none gap-2">
            {partitions.map((partition) => (
              <button
                key={partition}
                onClick={() => setSelectedPartition(partition)}
                className={cn(
                  "border border-gray-300 px-2 py-1 font-DOS text-lg",
                  selectedPartition === partition
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent",
                )}
              >
                P{partition}
              </button>
            ))}
          </div>

          {/* Disk grid with scrolling */}
          <div className="flex-1">
            <div
              className={cn(
                "grid h-56 auto-rows-[4rem] gap-2 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                "grid-cols-2",
                diskGridClassName,
              )}
            >
              {filteredDisks.map((disk, index) => {
                const setName = disk.set_name.replace(/ /g, "_");
                const setImage = `/ZZZ-Disk-Drive-Images/Disk_Images/${setName}.png`;

                return (
                  <button
                    key={`${disk.set_name}-${disk.partition_number}-${index}`} //its fine to use an index here as we aren't manipulating the array at any point
                    onClick={() => setSelectedDisk(disk)}
                    className={cn(
                      "flex h-16 w-16 items-center justify-center rounded border border-gray-300 p-1",
                      selectedDisk === disk
                        ? "bg-accent"
                        : "hover:bg-accent/50",
                    )}
                  >
                    <img
                      src={setImage}
                      alt={disk.set_name}
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

        {/* Right side - Disk stats */}
        {selectedDisk && (
          <div className={cn("flex-1", diskStatsClassName)}>
            <div className="flex gap-4 text-base">
              {/* Left side - Image and basic info */}
              <div className="flex flex-1 flex-col items-center space-y-4 border-r border-gray-300 pr-4">
                <img
                  src={`/ZZZ-Disk-Drive-Images/Disk_Images/${selectedDisk.set_name.replace(/ /g, "_")}.png`}
                  alt={selectedDisk.set_name}
                  width={100}
                  height={100}
                  className="object-contain"
                />
                <div className="space-y-2">
                  <p className="font-DOS">{selectedDisk.set_name}</p>
                  <p className="font-DOS">
                    Rarity: {selectedDisk.drive_rarity}
                  </p>
                  <p className="font-DOS">
                    Level: {selectedDisk.drive_current_level}/
                    {selectedDisk.drive_max_level}
                  </p>
                </div>
              </div>

              {/* Right side - Stats */}
              <div className="flex-1 space-y-4 text-base">
                {/* Main stat */}
                <div className="border-b border-gray-300 pb-2">
                  <h3 className="font-DOS text-lg">Main Stat</h3>
                  <p className="font-DOS">
                    {selectedDisk.drive_base_stat}:{" "}
                    {selectedDisk.drive_base_stat_number}
                  </p>
                </div>

                {/* Sub stats */}
                <div>
                  <h3 className="mb-2 font-DOS text-base">Sub Stats</h3>
                  <div className="space-y-1">
                    {selectedDisk.random_stats.map((stat, index) => (
                      <div
                        key={`${stat.baseStat}-${stat.value}-${stat.upgradeNum}-${index}`}
                        className="grid grid-cols-[1fr,auto] gap-2 font-DOS text-sm"
                      >
                        <span className="text-nowrap text-left">
                          {stat.baseStat}
                          {stat.upgradeNum > 0 ? `+${stat.upgradeNum}` : ""}:
                        </span>
                        <span className="text-right">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </OSWindow>
  );
};
