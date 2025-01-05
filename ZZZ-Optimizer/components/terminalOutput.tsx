//create a command line style field for outputting scan log error messages

interface TerminalOutputProps {
  text?: string;
  className?: string;
  inputClassName?: string;
  textSize?: string;
}

export function TerminalOutput({
  text = "...",
  className,
  inputClassName = "text-white h-8", //Used to set defaults for the input field
  textSize = "text-xl",
}: Readonly<TerminalOutputProps>) {
  return (
    <div className={`flex w-full flex-row items-center ${className}`}>
      <span className={`my-4 font-DOS ${textSize}`}>&gt;</span>
      <input
        type="text"
        className={`flex-1 overflow-x-auto bg-transparent font-DOS focus:outline-none ${inputClassName} ${textSize}`}
        value={text}
        placeholder="..."
        readOnly={true}
      />
    </div>
  );
}
