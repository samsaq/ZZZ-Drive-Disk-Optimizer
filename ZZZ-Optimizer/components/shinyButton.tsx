"use client";

import shinyStyles from "../styles/shinyButton.module.scss";

// a shiny button to replace the terminal input to start the scan now that we have a seperate settings page

interface ShinyButtonProps {
  onClick?: () => void;
  text: string;
  textClasses?: string;
}

export const ShinyButton = ({
  onClick,
  text,
  textClasses,
}: ShinyButtonProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      className={`bg-black text-white border-2 border-white font-bold mt-2 py-2 px-4 rounded-none overflow-hidden relative ${shinyStyles.shineButton} ${shinyStyles.animateShine}`}
      onClick={handleClick}
    >
      <span className={textClasses}>{text}</span>
    </button>
  );
};
