import { X } from "lucide-react";
import { useState } from "react";

interface StatBoundRowProps {
  statName: string;
  defaultRank: number;
  defaultMin?: number;
  defaultMax?: number;
  onMinChange?: (min: number | null) => void;
  onMaxChange?: (max: number | null) => void;
  onRankChange?: (rank: number) => void;
  onMinMaxChange?: (min: number | null, max: number | null) => void;
}

export default function StatBoundRow({
  statName,
  defaultRank,
  defaultMin,
  defaultMax,
  onMinChange,
  onMaxChange,
  onRankChange,
  onMinMaxChange,
}: Readonly<StatBoundRowProps>) {
  const [showMin, setShowMin] = useState(defaultMin !== undefined);
  const [showMax, setShowMax] = useState(defaultMax !== undefined);
  const maxChars = Math.max(
    defaultMin?.toString().length ?? 0,
    defaultMax?.toString().length ?? 0,
    1,
  );

  const StatNameSection = (
    <div className="col-start-1 flex h-10 w-full items-center">
      <div className="flex w-full flex-row items-center gap-2">
        <div className="border border-white p-[7px] text-base">
          <input
            type="number"
            defaultValue={defaultRank}
            onChange={(e) => onRankChange?.(Number(e.target.value))}
            className="w-[1ch] border-b border-white text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>
        <span className="flex-1 text-nowrap border border-white p-2 text-base">
          {statName}:
        </span>
      </div>
    </div>
  );

  if (!showMin && !showMax) {
    return (
      <>
        {StatNameSection}
        <div className="col-start-2 flex h-10 items-center justify-start">
          <button
            onClick={() => {
              setShowMin(true);
              setShowMax(true);
              if (onMinMaxChange) {
                onMinMaxChange(0, 0);
              }
            }}
            className="flex h-10 w-10 items-center justify-center border border-white text-3xl"
          >
            +
          </button>
        </div>
      </>
    );
  }

  const ControlsSection = (
    <div className="col-start-2 flex h-10 flex-row items-center gap-2">
      {!showMin && (
        <button
          onClick={() => {
            setShowMin(true);
            onMinChange?.(defaultMin ?? 0);
          }}
          className="flex h-10 w-6 items-center justify-center border border-white text-center text-2xl"
        >
          +
        </button>
      )}

      {showMin && (
        <div className="relative flex flex-row gap-2 border border-white p-2 px-4 text-base">
          <button
            onClick={() => {
              setShowMin(false);
              onMinChange?.(null);
            }}
            className="absolute right-0 top-0 bg-white"
          >
            <X className="h-3 w-3 text-black" />
          </button>
          <span>Min:</span>
          <input
            type="number"
            value={defaultMin ?? ""}
            onChange={(e) => onMinChange?.(Number(e.target.value))}
            className="border-b border-white text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            style={{ width: `${maxChars}ch` }}
          />
        </div>
      )}

      {showMax && (
        <div className="relative flex flex-row gap-2 border border-white p-2 px-4 text-base">
          <button
            onClick={() => {
              setShowMax(false);
              onMaxChange?.(null);
            }}
            className="absolute right-0 top-0 bg-white"
          >
            <X className="h-3 w-3 text-black" />
          </button>
          <span>Max:</span>
          <input
            type="number"
            value={defaultMax ?? ""}
            onChange={(e) => onMaxChange?.(Number(e.target.value))}
            className="border-b border-white text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            style={{ width: `${maxChars}ch` }}
          />
        </div>
      )}

      {!showMax && showMin && (
        <button
          onClick={() => {
            setShowMax(true);
            onMaxChange?.(defaultMax ?? 0);
          }}
          className="flex h-10 w-6 items-center justify-center border border-white text-center text-2xl"
        >
          +
        </button>
      )}
    </div>
  );

  return (
    <>
      {StatNameSection}
      {ControlsSection}
    </>
  );
}
