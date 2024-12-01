import PostsSidebar from "./_sidebar/page";

export default function PostsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex w-full p-2 desktop:w-[90%] desktop:p-6">
      <PostsSidebar />
      {children}
    </div>
  );
}
