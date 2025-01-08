interface ImageTabProps {
  primaryColor: string;
  secondaryColor: string;
  onClick: () => void;
  imageSrc: string;
  imageAlt: string;
  isSelected?: boolean;
  hasBottomBorder?: boolean;
  imageWidth?: string;
  imageHeight?: string;
}

export default function ImageTab({
  primaryColor,
  secondaryColor,
  onClick,
  imageSrc,
  imageAlt,
  isSelected = false,
  hasBottomBorder = true,
  imageWidth = "2.5rem",
  imageHeight = "2.5rem",
}: Readonly<ImageTabProps>) {
  const currentPrimaryColor = isSelected ? secondaryColor : primaryColor;
  const currentSecondaryColor = isSelected ? primaryColor : secondaryColor;

  return (
    <button
      className="rounded-t-lg p-1 hover:bg-opacity-80"
      style={{
        backgroundColor: currentPrimaryColor,
        borderTop: `2px solid ${currentSecondaryColor}`,
        borderLeft: `2px solid ${currentSecondaryColor}`,
        borderRight: `2px solid ${currentSecondaryColor}`,
        borderBottom: hasBottomBorder
          ? `2px solid ${currentSecondaryColor}`
          : "none",
      }}
      onClick={onClick}
    >
      <img
        src={imageSrc}
        alt={imageAlt}
        style={{
          width: imageWidth,
          height: imageHeight,
          objectFit: "contain",
        }}
      />
    </button>
  );
}
