export default function AboutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="w-full desktop:w-[90%] p-6">{children}</div>;
}
