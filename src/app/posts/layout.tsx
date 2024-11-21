import PostsSidebar from "./_sidebar/page";

export default function PostsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex w-full desktop:w-[90%] p-6">
      <PostsSidebar />
      {children}
    </div>
  );
}
