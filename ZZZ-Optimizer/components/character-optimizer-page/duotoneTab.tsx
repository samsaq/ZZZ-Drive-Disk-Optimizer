//a small rounded tab with text that that changes opacity when hovered and flips when clicked
//it will have a primary color and a secondary color (primary is initial background, and secondary is initial text color
//these will flip when clicked, and trigger an onClick passed in as a prop

import { useState } from "react";

interface DuotoneTabProps {
  primaryColor: string;
  secondaryColor: string;
  onClick: () => void;
  text: string;
  isSelected?: boolean;
  hasBottomBorder?: boolean;
}

export default function DuotoneTab({
  primaryColor,
  secondaryColor,
  onClick,
  text,
  isSelected = false,
  hasBottomBorder = true,
}: Readonly<DuotoneTabProps>) {
  const currentPrimaryColor = isSelected ? secondaryColor : primaryColor;
  const currentSecondaryColor = isSelected ? primaryColor : secondaryColor;

  return (
    <button
      className="rounded-t-lg px-2 py-1 text-sm hover:bg-opacity-80"
      style={{
        backgroundColor: currentPrimaryColor,
        color: currentSecondaryColor,
        borderTop: `2px solid ${currentSecondaryColor}`,
        borderLeft: `2px solid ${currentSecondaryColor}`,
        borderRight: `2px solid ${currentSecondaryColor}`,
        borderBottom: hasBottomBorder
          ? `2px solid ${currentSecondaryColor}`
          : "none",
      }}
      onClick={onClick}
    >
      <span>{text}</span>
    </button>
  );
}
