"use client";

import { Login, Menu } from "@carbon/icons-react";
import HeaderButton from "./components/headerButton";
import PostsList from "../(pages)/posts/_sidebar/postsList";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import LoggedinIcons from "./components/loggedInIcons";
import { purgeCookies } from "./action";
import { getCookie } from "../_actions/getCookie";
import { checkAuth } from "../../utils/jwt/checkAuth";
import { useRouter } from "next/navigation";
import { ProfileWithAvatarDto } from "../_dto/profile.dto";

export default function Header() {
  const [profile, setProfile] = useState<ProfileWithAvatarDto | null>(null);
  const logoutModalRef = useRef<HTMLDialogElement>(null);

  const router = useRouter();

  const handleLogout = async () => {
    await purgeCookies();
    localStorage.clear();
    router.replace("/");
  };

  useEffect(() => {
    const menuItem = document.querySelectorAll(".menu_item");
    const drawer = document.getElementById("menu_drawer") as HTMLInputElement;

    (async () => {
      try {
        const jwtToken = await getCookie("jwtToken");
        if (jwtToken) {
          const id = await checkAuth(jwtToken.value);
          if (!id) {
            throw new Error("토큰 검증에 실패했어요!");
          }
          const localProfile = localStorage.getItem("profile");
          if (localProfile) {
            const parsedLocalProfile = JSON.parse(localProfile);
            setProfile(parsedLocalProfile);
            if (id !== parsedLocalProfile?.userId) {
              throw new Error(
                "쿠키가 변조되었거나 localStorage가 변조되었어요!"
              );
            }
          } else {
            setProfile(null);
            throw new Error("LocalStorage에 프로필이 없어요!");
          }
        }
      } catch (err) {
        alert(err);
        handleLogout();
      }
    })();

    menuItem.forEach((item) => {
      item.addEventListener("click", () => {
        drawer.checked = false;
      });
    });

    window.addEventListener("avatar", () => {
      const localProfile = localStorage.getItem("profile");
      if (localProfile) {
        setProfile(JSON.parse(localProfile));
      }
    });

    return () => {
      menuItem.forEach((item) => {
        item.removeEventListener("click", () => {
          drawer.checked = false;
        });
      });
      document.removeEventListener("avatar", () => {
        const localProfile = localStorage.getItem("profile");
        if (localProfile) {
          setProfile(null);
        }
      });
    };
  }, []);

  return (
    <div className="w-full desktop:w-[90%] h-12 flex justify-between items-center p-6">
      <div className="drawer w-fit desktop:hidden z-10">
        <input id="menu_drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <label htmlFor="menu_drawer">
            <Menu size={24} />
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="menu_drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          />
          <ul className="menu bg-base-100 text-base-content min-h-full w-56 p-4">
            <li className="menu_item">
              <Link href={"/"}>Home</Link>
            </li>
            <li>
              <details open>
                <summary>Posts</summary>
                <ul>
                  <PostsList />
                </ul>
              </details>
            </li>
            <li className="menu_item">
              <Link href={"/about"}>About</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex items-center gap-12">
        <span className="text-2xl">놋치미나의 아늑한 집</span>
        <div className="hidden desktop:flex flex-col desktop:flex-row items-center">
          <HeaderButton href="/">Home</HeaderButton>
          <HeaderButton href="/posts">Posts</HeaderButton>
          <HeaderButton href="/about">About</HeaderButton>
        </div>
      </div>
      <div className="flex gap-6">
        {profile ? (
          <>
            {profile.userId !== "" ? (
              <>
                <LoggedinIcons
                  avatarUrl={profile.avatarUrl}
                  nickname={
                    profile.nickname ? profile.nickname : profile.userId
                  }
                  userId={profile.userId}
                  logoutModalRef={logoutModalRef.current}
                />
              </>
            ) : (
              <div>
                <span className="loading loading-spinner loading-sm" />
              </div>
            )}
          </>
        ) : (
          <button className="btn btn-circle btn-outline border-transparent">
            <Link href={"/login"}>
              <Login size={24} />
            </Link>
          </button>
        )}
      </div>
      <dialog id="logout" ref={logoutModalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">로그아웃</h3>
          <p className="py-4">로그아웃하고 나중에 다시 볼까?</p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button className="btn btn-primary" onClick={handleLogout}>
                나중에 봐~
              </button>
              <button className="btn">잠깐만!</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
