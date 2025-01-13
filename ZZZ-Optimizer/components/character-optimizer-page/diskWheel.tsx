export const DiskWheel = () => {
  const diskWheelImagePath =
    "/ZZZ-Disk-Drive-Images/disk_holder_no_bg_wengine_hole.png";
  return (
    <div className="flex h-fit w-fit items-center justify-center brightness-125">
      <img
        src={diskWheelImagePath}
        alt="Disk Wheel"
        className="pointer-events-none w-[400px] object-contain"
      />
    </div>
  );
};
