import CRTStyles from "@/styles/crt.module.css";

export default function CRTEffect({ children }: { children: React.ReactNode }) {
  return <div className={CRTStyles.crt}>{children}</div>;
}
