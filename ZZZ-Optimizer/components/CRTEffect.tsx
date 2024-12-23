import "@/styles/altCRTEffect.css";

export default function CRTEffect({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="bgEffectCRT">{children}</div>;
}
