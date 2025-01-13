import { Icon } from "@iconify/react";

export const DiskWheelWireframe = () => {
  return (
    <div className="relative flex h-[400px] w-[400px] items-center justify-center">
      {/* Center circle */}
      <Icon
        icon="material-symbols-light:circle-outline"
        className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 text-2xl"
        width={128}
        height={128}
      />

      {/* Left side circles */}
      <Icon
        icon="material-symbols-light:circle-outline"
        className="absolute left-[50%] top-[50%] -translate-x-[200%] -translate-y-[200%] text-2xl"
        width={64}
        height={64}
      />
      <Icon
        icon="material-symbols-light:circle-outline"
        className="absolute left-[50%] top-[50%] -translate-x-[250%] -translate-y-1/2 text-2xl"
        width={64}
        height={64}
      />
      <Icon
        icon="material-symbols-light:circle-outline"
        className="absolute left-[50%] top-[50%] -translate-x-[200%] translate-y-[100%] text-2xl"
        width={64}
        height={64}
      />

      {/* Right side circles */}
      <Icon
        icon="material-symbols-light:circle-outline"
        className="absolute left-[50%] top-[50%] -translate-y-[200%] translate-x-[100%] text-2xl"
        width={64}
        height={64}
      />
      <Icon
        icon="material-symbols-light:circle-outline"
        className="absolute left-[50%] top-[50%] -translate-y-1/2 translate-x-[150%] text-2xl"
        width={64}
        height={64}
      />
      <Icon
        icon="material-symbols-light:circle-outline"
        className="absolute left-[50%] top-[50%] translate-x-[100%] translate-y-[100%] text-2xl"
        width={64}
        height={64}
      />
    </div>
  );
};
