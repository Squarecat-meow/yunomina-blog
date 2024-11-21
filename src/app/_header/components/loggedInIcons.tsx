type loggedInProps = {
  avatarUrl: string | null;
  userId: string;
  logoutModalRef: HTMLDialogElement | null;
};

export default function LoggedinIcons({
  avatarUrl,
  userId,
  logoutModalRef,
}: loggedInProps) {
  return (
    <div className="cursor-pointer">
      <div className="dropdown dropdown-bottom dropdown-end">
        {avatarUrl !== "" && avatarUrl !== null ? (
          <div tabIndex={0} className="avatar">
            <div className="w-10 desktop:w-12 rounded">
              <img src={avatarUrl} alt="profile avatar" />
            </div>
          </div>
        ) : (
          <div tabIndex={0} className="avatar placeholder">
            <div className="border border-base-300 w-10 desktop:w-12 rounded-full">
              <span className="text-3xl">{userId.substring(0, 1)}</span>
            </div>
          </div>
        )}
        <ul
          tabIndex={0}
          className="dropdown-content menu rounded-box z-[1] w-36 p-2 shadow"
        >
          <li>
            <span>글쓰기</span>
          </li>
          <li>
            <span>설정</span>
          </li>
          <li className="border-b border-black"></li>
          <li onClick={() => logoutModalRef?.showModal()}>
            <span>로그아웃</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
