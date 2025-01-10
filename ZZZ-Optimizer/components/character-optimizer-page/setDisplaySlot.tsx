import { DiskDriveSet } from "@/lib/diskStats";
import { cn } from "@/lib/utils";

interface SetDisplaySlotProps {
  set?: DiskDriveSet;
  onClick: () => void;
  className?: string;
}

export const SetDisplaySlot: React.FC<SetDisplaySlotProps> = ({
  set,
  onClick,
  className,
}) => {
  const noSelectionIcon = "/ZZZ-Disk-Drive-Images/No_Selection.png";
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-fit w-full flex-col items-center gap-4 border border-gray-300 p-2",
        "hover:bg-accent/50 active:bg-accent/70",
        "transition-colors duration-200",
        className,
      )}
    >
      {set ? (
        <>
          <img
            src={set.setIcon}
            alt={set.setName}
            className="h-12 w-12 object-contain"
          />
          <span className="font-DOS text-sm">{set.setName}</span>
        </>
      ) : (
        <>
          <img
            src={noSelectionIcon}
            alt="No set selected"
            className="h-12 w-12 object-contain"
          />
          <span className="font-DOS text-sm text-muted-foreground">
            Select Set
          </span>
        </>
      )}
    </button>
  );
};
