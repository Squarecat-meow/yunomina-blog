import Image from "next/image";
import Link from "next/link";

type loggedInProps = {
  avatarUrl: string | null;
  nickname: string | null;
  userId: string;
  logoutModalRef: HTMLDialogElement | null;
};

export default function LoggedinIcons({
  avatarUrl,
  nickname,
  userId,
  logoutModalRef,
}: loggedInProps) {
  return (
    <div className="cursor-pointer">
      <div tabIndex={0} className="dropdown dropdown-bottom">
        <div className="rounded-lg hover:shadow transition-shadow flex items-center px-4 py-2 gap-2">
          {avatarUrl && avatarUrl !== "" ? (
            <>
              <Image
                width={48}
                height={48}
                quality={50}
                style={{ aspectRatio: 1, objectFit: "cover" }}
                src={avatarUrl}
                alt="profile avatar"
                className="rounded-full"
              />
            </>
          ) : (
            <div tabIndex={0} className="rounded-full border-base-300">
              <div className="w-10 desktop:w-12 rounded-full">
                <span className="text-3xl">{userId.substring(0, 1)}</span>
              </div>
            </div>
          )}
          {nickname && <span className="text-lg">{nickname}</span>}
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu rounded-box z-[1] mt-2 w-36 p-2 shadow"
        >
          <li>
            <span>글쓰기</span>
          </li>
          <li>
            <Link href={"/setting"}>
              <span>설정</span>
            </Link>
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
