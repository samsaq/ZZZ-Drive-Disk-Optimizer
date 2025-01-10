import { useState } from "react";
import StatBoundRow from "./statBoundRow";

export interface StatBounds {
  min: number | null;
  max: number | null;
}

export interface StatGoalsState {
  [key: string]: StatBounds;
}

interface StatGoalsProps {
  onStatBoundsChange?: (bounds: StatGoalsState) => void;
  containerClasses?: string;
}

export default function StatGoals({
  onStatBoundsChange,
  containerClasses,
}: StatGoalsProps) {
  const [statBounds, setStatBounds] = useState<StatGoalsState>({
    ATK: { min: null, max: null },
    HP: { min: null, max: null },
    DEF: { min: null, max: null },
    "CRIT Rate": { min: null, max: null },
    "CRIT DMG": { min: null, max: null },
    ER: { min: null, max: null },
    AP: { min: null, max: null },
    AM: { min: null, max: null },
    PEN: { min: null, max: null },
  });

  const handleMinChange = (statName: string, value: number | null) => {
    setStatBounds((prev) => {
      const newBounds = {
        ...prev,
        [statName]: { ...prev[statName], min: value },
      };
      onStatBoundsChange?.(newBounds);
      return newBounds;
    });
  };

  const handleMaxChange = (statName: string, value: number | null) => {
    setStatBounds((prev) => {
      const newBounds = {
        ...prev,
        [statName]: { ...prev[statName], max: value },
      };
      onStatBoundsChange?.(newBounds);
      return newBounds;
    });
  };

  return (
    <div className={`grid grid-cols-2 gap-x-4 gap-y-2 p-4 ${containerClasses}`}>
      <div className="grid auto-cols-fr grid-cols-[auto_1fr] items-start gap-2">
        {Object.entries(statBounds)
          .slice(0, 5)
          .map(([statName, bounds]) => (
            <StatBoundRow
              key={statName}
              statName={statName}
              defaultRank={1}
              defaultMin={bounds.min ?? undefined}
              defaultMax={bounds.max ?? undefined}
              onMinChange={(value) => handleMinChange(statName, value)}
              onMaxChange={(value) => handleMaxChange(statName, value)}
            />
          ))}
      </div>
      <div className="grid auto-cols-fr grid-cols-[auto_1fr] content-start items-start gap-2">
        {Object.entries(statBounds)
          .slice(5)
          .map(([statName, bounds]) => (
            <StatBoundRow
              key={statName}
              statName={statName}
              defaultRank={1}
              defaultMin={bounds.min ?? undefined}
              defaultMax={bounds.max ?? undefined}
              onMinChange={(value) => handleMinChange(statName, value)}
              onMaxChange={(value) => handleMaxChange(statName, value)}
            />
          ))}
      </div>
    </div>
  );
}
