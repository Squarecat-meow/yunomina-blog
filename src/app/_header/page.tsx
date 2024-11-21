"use client";

import { Login, Menu } from "@carbon/icons-react";
import HeaderButton from "./components/headerButton";
import PostsList from "../posts/_sidebar/postsList";
import Link from "next/link";
import { useEffect } from "react";

export default function Header() {
  useEffect(() => {
    const menuItem = document.querySelectorAll(".menu_item");
    const drawer = document.getElementById("menu_drawer") as HTMLInputElement;

    menuItem.forEach((item) => {
      item.addEventListener("click", () => {
        drawer.checked = false;
      });
    });

    return () => {
      menuItem.forEach((item) => {
        item.removeEventListener("click", () => {
          drawer.checked = false;
        });
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
        <Link href={"/login"}>
          <Login size={24} />
        </Link>
      </div>
    </div>
  );
}
