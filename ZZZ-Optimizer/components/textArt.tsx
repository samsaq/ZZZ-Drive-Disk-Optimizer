interface TextArtProps {
  readonly label: string;
  readonly text: string;
  readonly className?: string;
}

export function TextArt({ label, text, className }: TextArtProps) {
  return (
    <pre
      aria-label={label}
      className={className + " overflow-auto whitespace-pre font-mono"}
    >
      {text}
    </pre>
  );
}
