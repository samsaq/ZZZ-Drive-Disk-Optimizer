import { Icon } from "@iconify/react";
import { OptimizerReportViewWindow } from "@/components/OSWindow-Variants/optimizerReportViewWindow";
import { useState, useRef } from "react";

//TODO: make a full version of this report object for the optimizer code and then use it here later
export type OptimizerReport = {
  errors: {
    title: string;
    description: string;
  }[];
  warnings: {
    title: string;
    description: string;
  }[];
};

interface OptimizerReportProps {
  report: OptimizerReport;
  iconSize?: number;
}

export const OptimizerReport = ({
  report,
  iconSize = 32,
}: OptimizerReportProps) => {
  const { errors, warnings } = report;
  const hasErrors = errors.length > 0;
  const hasWarnings = warnings.length > 0;
  const [isReportOpen, setIsReportOpen] = useState(false);
  const reportContainerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        className="localEffectCRT z-10flex absolute cursor-pointer flex-col gap-0" //Needed here to have the character optimizer page allow the report to be positioned in the diskwheel image
        onClick={() => setIsReportOpen(true)}
      >
        <div className="flex flex-col items-center" ref={reportContainerRef}>
          <Icon
            icon="ant-design:warning-outlined"
            color={hasWarnings ? "orange" : "white"}
            width={iconSize}
            height={iconSize}
          />
          <span
            className="text-base"
            style={{ color: hasWarnings ? "#f97316" : "white" }}
          >
            {hasWarnings ? warnings.length : 0}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <Icon
            icon="codicon:error"
            color={hasErrors ? "red" : "white"}
            width={iconSize}
            height={iconSize}
          />
          <span
            className="text-base"
            style={{ color: hasErrors ? "#ef4444" : "white" }}
          >
            {hasErrors ? errors.length : 0}
          </span>
        </div>
      </div>

      <OptimizerReportViewWindow
        id="optimizer-report"
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        report={report}
        position={{
          targetRef: reportContainerRef,
          direction: "right",
          anchor: "center",
          offset: 20,
        }}
      />
    </>
  );
};
