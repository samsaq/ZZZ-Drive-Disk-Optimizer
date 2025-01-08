import { X } from "lucide-react";
import { useState } from "react";

interface StatBoundRowProps {
  statName: string;
  defaultRank: number;
  defaultMin?: number;
  defaultMax?: number;
  onMinChange?: (min: number | null) => void;
  onMaxChange?: (max: number | null) => void;
}

export default function StatBoundRow({
  statName,
  defaultRank,
  defaultMin,
  defaultMax,
  onMinChange,
  onMaxChange,
}: Readonly<StatBoundRowProps>) {
  const [showMin, setShowMin] = useState(defaultMin !== undefined);
  const [showMax, setShowMax] = useState(defaultMax !== undefined);
  const maxChars = Math.max(
    defaultMin?.toString().length ?? 0,
    defaultMax?.toString().length ?? 0,
    1,
  );

  if (!showMin && !showMax) {
    return (
      <div className="flex flex-row items-center gap-2 text-base">
        <div className="border border-white p-[6px]">
          <input
            type="number"
            value={defaultRank}
            className="w-[1ch] border-b border-white text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>
        <span className="w-fit border border-white p-[6px] text-center text-xl">
          {statName}:
        </span>
        <button
          onClick={() => {
            setShowMin(true);
            setShowMax(true);
            onMinChange?.(defaultMin ?? 0);
            onMaxChange?.(defaultMax ?? 0);
          }}
          className="flex h-10 w-10 items-center justify-center border border-white text-3xl"
        >
          +
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center gap-2 text-base">
      <div className="border border-white p-[6px]">
        <input
          type="number"
          value={defaultRank}
          className="w-[1ch] border-b border-white text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
      </div>
      <span className="w-fit border border-white p-[6px] text-center text-xl">
        {statName}:
      </span>
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
        <div className="relative flex flex-row gap-2 border border-white p-2 px-4">
          <button
            onClick={() => {
              setShowMin(false);
              onMinChange?.(null);
            }}
            className="absolute -right-[6px] -top-[6px] bg-white"
          >
            <X className="h-3 w-3 text-black" />
          </button>
          <span>Min:</span>
          <input
            type="number"
            defaultValue={defaultMin}
            onChange={(e) => onMinChange?.(Number(e.target.value))}
            className="border-b border-white text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            style={{ width: `${maxChars}ch` }}
          />
        </div>
      )}

      {showMax && (
        <div className="relative flex flex-row gap-2 border border-white p-2 px-4">
          <button
            onClick={() => {
              setShowMax(false);
              onMaxChange?.(null);
            }}
            className="absolute -right-[6px] -top-[6px] bg-white"
          >
            <X className="h-3 w-3 text-black" />
          </button>
          <span>Max:</span>
          <input
            type="number"
            defaultValue={defaultMax}
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
}
