import "@/styles/altCRTEffect.css";

export default function CRTEffect({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bgEffectCRT w-full h-full min-h-full ">{children}</div>
  );
}
