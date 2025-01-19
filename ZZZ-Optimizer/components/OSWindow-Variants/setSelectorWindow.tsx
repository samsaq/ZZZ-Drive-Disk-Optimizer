import { OSWindow, Position, RelativePosition } from "@/components/OSWindow";
import { DiskDriveSet, setData } from "@/lib/diskStats";
import { cn } from "@/lib/utils";

interface SetSelectorWindowProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  onSetSelect: (set: DiskDriveSet) => void;
  className?: string;
  position?: Position | RelativePosition;
  defaultPosition?: Position;
  maxHeight?: string;
  maxWidth?: string;
}

export const SetSelectorWindow: React.FC<SetSelectorWindowProps> = ({
  id,
  isOpen,
  onClose,
  onSetSelect,
  className,
  position,
  defaultPosition,
  maxHeight = "max-h-[60vh]",
  maxWidth = "max-w-[40vw]",
}) => {
  const sets = setData;
  return (
    <OSWindow
      id={id}
      title="Disk Set Selector"
      isOpen={isOpen}
      onClose={onClose}
      className={className}
      position={position}
      defaultPosition={defaultPosition}
    >
      <div className={cn("flex flex-col gap-4", maxHeight)}>
        <div className="flex flex-col gap-4 overflow-y-auto pr-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sets.map((set) => (
            <button
              key={set.setName}
              onClick={() => onSetSelect(set)}
              className={cn(
                "flex flex-row items-center gap-4 rounded-lg border border-gray-300 p-4",
                "hover:bg-accent/50 active:bg-accent/70",
                "transition-colors duration-200",
              )}
            >
              {/* Set Icon */}
              <img
                src={set.setIcon}
                alt={set.setName}
                className="h-16 w-16 object-contain"
              />

              {/* Set Details */}
              <div
                className={cn(
                  "flex flex-1 flex-col items-start text-left",
                  maxWidth,
                )}
              >
                <h4 className="font-DOS text-base">{set.setName}</h4>
                <p className="font-DOS text-sm text-muted-foreground">
                  2pc: {set.twoPieceDesc}
                </p>
                <p className="font-DOS text-sm text-muted-foreground">
                  4pc: {set.fourPieceDesc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </OSWindow>
  );
};
