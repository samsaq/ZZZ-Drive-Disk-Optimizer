import { OSWindow, Position, RelativePosition } from "@/components/OSWindow";
import { DiskScan } from "@/lib/utils";

interface DiskViewWindowProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  disk: DiskScan;
  className?: string;
  position?: Position | RelativePosition;
  defaultPosition?: Position;
}

export const DiskViewWindow: React.FC<DiskViewWindowProps> = ({
  id,
  isOpen,
  onClose,
  disk,
  className,
  position,
  defaultPosition,
}) => {
  //determine the set image based on the disk scan
  const setName = disk.set_name.replace(/ /g, "_"); //add underscores to the set name
  const setImage = `/ZZZ-Disk-Drive-Images/Disk_Images/${setName}.png`;

  return (
    <OSWindow
      id={id}
      title={`Disk View - ${disk.set_name} P${disk.partition_number}`}
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
            src={setImage}
            alt={disk.set_name}
            width={100}
            height={100}
            className="object-contain"
          />
          <div className="space-y-2">
            <p className="font-DOS">Rarity: {disk.drive_rarity}</p>
            <p className="font-DOS">
              Level: {disk.drive_current_level}/{disk.drive_max_level}
            </p>
          </div>
        </div>

        {/* Right side - Stats */}
        <div className="flex-1 space-y-4 text-base">
          {/* Main stat */}
          <div className="border-b border-gray-300 pb-2">
            <h3 className="font-DOS text-lg">Main Stat</h3>
            <p className="font-DOS">
              {disk.drive_base_stat}: {disk.drive_base_stat_number}
            </p>
          </div>

          {/* Sub stats */}
          <div>
            <h3 className="mb-2 font-DOS text-base">Sub Stats</h3>
            <div className="space-y-1">
              {disk.random_stats.map((stat, index) => (
                <p key={index} className="text-nowrap font-DOS text-sm">
                  {stat.baseStat}
                  {stat.upgradeNum > 0 ? `+${stat.upgradeNum}` : ""}:{" "}
                  {stat.value}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </OSWindow>
  );
};
