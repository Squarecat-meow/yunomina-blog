export default function EditorDivider({ className }: { className?: string }) {
  return (
    <div className={`w-4 h-6 grid grid-cols-2 ${className}`}>
      <div className="border-r border-base-300" />
      <div />
    </div>
  );
}
