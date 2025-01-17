import "@/styles/CRTEffect.css";

export default function CRTEffect({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="bgEffectCRT h-full min-h-full w-full">{children}</div>;
}
