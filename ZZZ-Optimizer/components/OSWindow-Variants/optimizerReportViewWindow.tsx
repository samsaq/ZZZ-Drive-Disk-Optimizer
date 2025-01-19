import type { OptimizerReport } from "@/components/character-optimizer-page/optimizerReport";
import { OSWindow, Position, RelativePosition } from "@/components/OSWindow";

interface OptimizerReportViewWindowProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  report: OptimizerReport;
  className?: string;
  position?: Position | RelativePosition;
  defaultPosition?: Position;
}

export const OptimizerReportViewWindow = ({
  id,
  isOpen,
  onClose,
  report,
  className,
  position,
  defaultPosition,
}: OptimizerReportViewWindowProps) => {
  const sortedErrors = [...report.errors].sort((a, b) =>
    a.title.localeCompare(b.title),
  );
  const sortedWarnings = [...report.warnings].sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  return (
    <OSWindow
      id={id}
      title="Optimizer Report"
      isOpen={isOpen}
      onClose={onClose}
      className={className}
      position={position}
      defaultPosition={defaultPosition}
    >
      <div className="max-h-[600px] max-w-[400px] overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sortedErrors.length === 0 && sortedWarnings.length === 0 ? (
          <div className="text-center text-green-400">
            <span className="font-medium">No issues found!</span>
          </div>
        ) : (
          <>
            {sortedErrors.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-col gap-2">
                  {sortedErrors.map((error) => (
                    <div
                      key={error.title + error.description}
                      className="text-red-400"
                    >
                      <span className="font-medium">{error.title}</span>
                      <span className="mx-2">-</span>
                      <span>{error.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sortedWarnings.length > 0 && (
              <div className="flex flex-col gap-2">
                {sortedWarnings.map((warning) => (
                  <div
                    key={warning.title + warning.description}
                    className="text-orange-400"
                  >
                    <span className="font-medium">{warning.title}</span>
                    <span className="mx-2">-</span>
                    <span>{warning.description}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </OSWindow>
  );
};
