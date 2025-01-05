import { useState } from "react";

import { IconProps } from "./icons/DiscordIcon";

interface DuotoneIconProps {
  icon: React.FC<IconProps>;
  onClick?: () => void;
  primaryColor?: string;
  secondaryColor?: string;
  size?: number;
  buttonClasses?: string;
  iconTitle?: string;
}

export const DuotoneIcon = ({
  icon: Icon,
  onClick,
  primaryColor = "white",
  secondaryColor = "black",
  size = 24,
  buttonClasses = "",
  iconTitle,
}: DuotoneIconProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <button
      className={`group relative flex items-center justify-center rounded-none p-4 transition-colors duration-200 ${buttonClasses}`}
      style={{ backgroundColor: isHovered ? secondaryColor : primaryColor }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Icon
        className="relative z-10 transition-[filter] duration-200"
        color={isHovered ? primaryColor : secondaryColor}
        size={size}
        title={iconTitle}
      />
    </button>
  );
};
