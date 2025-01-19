// a component that overlays the screen with a CRT monitor shell mask around the edge of the screen
// use the crt_amber_mask.png image as the mask
import Image from "next/image";

import CRTStyles from "@/styles/crt.module.css";

export default function CRTOverlay() {
  return (
    <>
      {/* CRT Mask - stays on very top */}
      <div className="pointer-events-none absolute inset-0 z-[60] overflow-hidden">
        <Image fill alt="CRT Monitor Mask" src="/crt_amber_mask.png" />
      </div>
      {/* CRT Effect - goes between mask and content */}
      <div
        className={`pointer-events-none absolute inset-0 z-[50] overflow-hidden ${CRTStyles.crt}`}
      />
    </>
  );
}
