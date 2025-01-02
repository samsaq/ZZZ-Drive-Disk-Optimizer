// a component that overlays the screen with a CRT monitor shell mask around the edge of the screen
// use the crt_amber_mask.png image as the mask
import Image from "next/image";

import CRTStyles from "@/styles/crt.module.css";

export default function CRTOverlay() {
  return (
    <>
      {/* CRT Mask - stays on very top */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[60]">
        <Image fill alt="CRT Monitor Mask" src="/crt_amber_mask.png" />
      </div>
      {/* CRT Effect - goes between mask and content */}
      <div
        className={`absolute inset-0 pointer-events-none overflow-hidden z-[40] ${CRTStyles.crt}`}
      />
    </>
  );
}
