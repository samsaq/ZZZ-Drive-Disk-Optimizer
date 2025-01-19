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
      className={`relative mt-2 overflow-hidden rounded-none border-2 border-white bg-black px-4 py-2 font-bold text-white ${shinyStyles.shineButton} ${shinyStyles.animateShine}`}
      onClick={handleClick}
    >
      <span className={textClasses}>{text}</span>
    </button>
  );
};
