export interface IconProps {
  size?: number | string;
  color?: string;
  className?: string;
  title?: string;
  onClick?: () => void;
}

export const PixelatedRefreshIcon: React.FC<IconProps> = ({
  size = 32,
  color = "currentColor",
  className = "",
  title = "Sync Online Data",
  onClick,
}) => {
  return (
    <svg
      className={className}
      fill={color}
      height={size}
      role="img"
      viewBox="0 0 32 32"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
      <title>{title}</title>
      <path d="M 6 4 L 6 6 L 4 6 L 4 8 L 2 8 L 2 10 L 6 10 L 6 26 L 17 26 L 17 24 L 8 24 L 8 10 L 12 10 L 12 8 L 10 8 L 10 6 L 8 6 L 8 4 L 6 4 z M 15 6 L 15 8 L 24 8 L 24 22 L 20 22 L 20 24 L 22 24 L 22 26 L 24 26 L 24 28 L 26 28 L 26 26 L 28 26 L 28 24 L 30 24 L 30 22 L 26 22 L 26 6 L 15 6 z" />
    </svg>
  );
};
