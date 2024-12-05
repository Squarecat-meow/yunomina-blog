interface buttonProps {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function EditorButton({
  children,
  disabled,
  onClick,
  className,
}: buttonProps) {
  return (
    <div
      className={`w-8 rounded-lg flex justify-center items-center ${
        !disabled && " hover:bg-base-200 active:scale-95"
      } cursor-default aspect-square ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
