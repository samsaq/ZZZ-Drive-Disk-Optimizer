import {
  OPTIMIZER_STATS,
  useOptimizer,
} from "@/components/character-optimizer-page/optimizerContext";
import StatBoundRow from "@/components/character-optimizer-page/statBoundRow";
import type { StatGoalsData } from "@/components/character-optimizer-page/optimizerContext";

interface StatGoalsProps {
  containerClasses?: string;
}

type StatName = keyof StatGoalsData;

export const StatGoals = ({ containerClasses }: StatGoalsProps) => {
  const { statGoals, setStatGoals } = useOptimizer();

  const handleMinChange = (statName: StatName, value: number | null) => {
    const newStatGoals = {
      ...statGoals,
      [statName]: {
        ...statGoals[statName],
        min: value,
      },
    };
    setStatGoals(newStatGoals);
  };

  const handleMaxChange = (statName: StatName, value: number | null) => {
    const newStatGoals = {
      ...statGoals,
      [statName]: {
        ...statGoals[statName],
        max: value,
      },
    };
    setStatGoals(newStatGoals);
  };

  const handleRankChange = (statName: StatName, value: number) => {
    setStatGoals({
      ...statGoals,
      [statName]: {
        ...statGoals[statName],
        rank: value,
      },
    });
  };

  const handleMinMaxChange = (
    //used for when both need to be set at once to avoid race condition
    statName: StatName,
    min: number | null,
    max: number | null,
  ) => {
    const newStatGoals = {
      ...statGoals,
      [statName]: {
        ...statGoals[statName],
        min,
        max,
      },
    };
    setStatGoals(newStatGoals);
  };

  return (
    <div
      className={`grid grid-cols-[1fr_1fr] gap-x-4 gap-y-2 p-2 ${containerClasses}`}
    >
      <div className="grid auto-cols-fr grid-cols-[auto_1fr] content-start items-start gap-2">
        {OPTIMIZER_STATS.slice(0, 5).map((statName) => (
          <StatBoundRow
            key={statName}
            statName={statName}
            defaultRank={statGoals[statName].rank ?? 1}
            defaultMin={statGoals[statName].min ?? undefined}
            defaultMax={statGoals[statName].max ?? undefined}
            onMinChange={(value) => handleMinChange(statName, value)}
            onMaxChange={(value) => handleMaxChange(statName, value)}
            onMinMaxChange={(min, max) =>
              handleMinMaxChange(statName, min, max)
            }
            onRankChange={(value) => handleRankChange(statName, value)}
          />
        ))}
      </div>
      <div className="grid auto-cols-fr grid-cols-[auto_1fr] content-start items-start gap-2">
        {OPTIMIZER_STATS.slice(5).map((statName) => (
          <StatBoundRow
            key={statName}
            statName={statName}
            defaultRank={statGoals[statName].rank ?? 1}
            defaultMin={statGoals[statName].min ?? undefined}
            defaultMax={statGoals[statName].max ?? undefined}
            onMinChange={(value) => handleMinChange(statName, value)}
            onMaxChange={(value) => handleMaxChange(statName, value)}
            onMinMaxChange={(min, max) =>
              handleMinMaxChange(statName, min, max)
            }
            onRankChange={(value) => handleRankChange(statName, value)}
          />
        ))}
      </div>
    </div>
  );
};
