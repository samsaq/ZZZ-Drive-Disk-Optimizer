interface SwitchProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export function Switch({
  id,
  checked,
  onCheckedChange,
  className = "",
}: SwitchProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={() => onCheckedChange(!checked)}
      className={`relative h-6 w-12 rounded-sm border border-black bg-white bg-opacity-20 transition-colors ${className}`}
    >
      <span
        className={`block h-5 w-5 transform border border-black bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
