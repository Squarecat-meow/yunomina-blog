"use client";

import { Login, Menu } from "@carbon/icons-react";
import HeaderButton from "./components/headerButton";
import PostsList from "../(pages)/posts/_sidebar/postsList";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import LoggedinIcons from "./components/loggedInIcons";
import { purgeCookies } from "./action";
import { useRouter } from "next/navigation";
import { ProfileDto } from "../_dto/profile.dto";
import headerImage from "../../../public/header-image.gif";
import Image from "next/image";
import DialogModalTwoButton from "../_components/modalTwoButton";

export default function Header() {
  const [profile, setProfile] = useState<ProfileDto | null | undefined>();
  const logoutModalRef = useRef<HTMLDialogElement>(null);

  const router = useRouter();

  const handleLogout = async () => {
    await purgeCookies();
    localStorage.clear();
    setProfile(null);
    router.refresh();
  };

  useEffect(() => {
    const menuItem = document.querySelectorAll(".menu_item");
    const drawer = document.getElementById("menu_drawer") as HTMLInputElement;

    const localProfile = localStorage.getItem("profile");
    if (localProfile) {
      const parsedLocalProfile = JSON.parse(localProfile);
      setProfile(parsedLocalProfile);
    } else {
      setProfile(null);
    }

    menuItem.forEach((item) => {
      item.addEventListener("click", () => {
        drawer.checked = false;
      });
    });

    window.addEventListener("profile", () => {
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
      window.removeEventListener("profile", () => {
        const localProfile = localStorage.getItem("profile");
        if (localProfile) {
          setProfile(null);
        }
      });
    };
  }, []);

  return (
    <div className="w-full desktop:w-[90%] h-12 flex justify-between items-center p-2">
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
        <Image
          src={headerImage}
          alt="header yunomina"
          unoptimized
          className="absolute left-1/2 transform -translate-x-1/2 desktop:relative desktop:left-16"
        />
        <div className="hidden desktop:flex flex-col desktop:flex-row items-center">
          <HeaderButton href="/">Home</HeaderButton>
          <HeaderButton href="/posts">Posts</HeaderButton>
          <HeaderButton href="/about">About</HeaderButton>
        </div>
      </div>
      {profile !== undefined ? (
        <>
          {profile !== null ? (
            <>
              <LoggedinIcons
                avatarUrl={profile.avatarUrl ?? ""}
                nickname={profile.nickname ? profile.nickname : profile.userId}
                userId={profile.userId}
                logoutModalRef={logoutModalRef.current}
              />
            </>
          ) : (
            <>
              <button className="btn btn-circle btn-outline border-transparent">
                <Link href={"/login"}>
                  <Login size={24} />
                </Link>
              </button>
            </>
          )}
        </>
      ) : (
        <>
          <div>
            <span className="loading loading-spinner loading-sm" />
          </div>
        </>
      )}
      <DialogModalTwoButton
        title={"로그아웃"}
        body={"로그아웃하고 나중에 다시 볼까?"}
        confirmButtonColor={"btn-primary"}
        confirmButtonText={"나중에 봐~"}
        onClick={handleLogout}
        cancelButtonText={"잠깐만!"}
        ref={logoutModalRef}
      />
    </div>
  );
}
