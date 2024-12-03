import PostsList from "./postsList";

export default function PostsSidebar() {
  return (
    <div className="hidden desktop:flex desktop:flex-col">
      <span>카테고리</span>
      <ul className="menu w-48">
        <PostsList />
      </ul>
    </div>
  );
}
