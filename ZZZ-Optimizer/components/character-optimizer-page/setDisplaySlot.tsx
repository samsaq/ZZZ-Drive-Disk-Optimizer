import { DiskDriveSet } from "@/lib/diskStats";
import { cn } from "@/lib/utils";

interface SetDisplaySlotProps {
  set?: DiskDriveSet;
  onClick: () => void;
  className?: string;
  position: {
    isFirst: boolean;
    isLast: boolean;
  };
}

export const SetDisplaySlot: React.FC<SetDisplaySlotProps> = ({
  set,
  onClick,
  className,
  position,
}) => {
  const noSelectionIcon = "/ZZZ-Disk-Drive-Images/No_Selection.png";
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-fit w-full flex-col items-center gap-1 py-2",
        position.isFirst && "border",
        !position.isFirst && !position.isLast && "border-x border-b",
        position.isLast && "border",
        "border-gray-300",
        "hover:bg-white/30 active:bg-white/70",
        "transition-colors duration-200",
        className,
      )}
    >
      {set ? (
        <>
          <img
            src={set.setIcon}
            alt={set.setName}
            className="h-10 w-10 object-contain"
          />
          <span className="font-DOS text-sm">{set.setName}</span>
        </>
      ) : (
        <>
          <img
            src={noSelectionIcon}
            alt="No set selected"
            className="h-10 w-10 object-contain"
          />
          <span className="font-DOS text-sm text-muted-foreground">
            Select Set
          </span>
        </>
      )}
    </button>
  );
};
