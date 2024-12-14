"use client";

import { FaGithub, FaInfoCircle, FaUserCircle } from "react-icons/fa";
import Editor from "./editor";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { initialConfig } from "@/app/(pages)/writer/_initialConfig";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GithubProfileDto } from "@/app/_dto/replyGithubProfile.dto";

export default function Reply() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [githubProfile, setGithubProfile] = useState<GithubProfileDto | null>(
    null
  );
  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const url = process.env.NEXT_PUBLIC_WEB_URL;
  const router = useRouter();

  const tooltip =
    "마크다운 문법을 지원하며\n :키를 눌러 커모지도 입력할 수 있어요.";

  const onEv = useCallback(
    (ev: CustomEvent<GithubProfileDto>) => {
      sessionStorage.setItem("githubLogin", JSON.stringify(ev.detail));
      router.refresh();
    },
    [url]
  );

  const initializeGithubLogin = useCallback(() => {
    const githubSessionLogin = sessionStorage.getItem("githubLogin");
    if (!githubSessionLogin) {
      setIsLoggedIn(false);
      return;
    } else {
      setIsLoggedIn(true);
      setGithubProfile(JSON.parse(githubSessionLogin));
    }
  }, []);

  useEffect(() => {
    window.addEventListener("github-login", onEv as EventListener);

    initializeGithubLogin();

    return () => {
      window.removeEventListener("github-login", onEv as EventListener);
    };
  }, [url, initializeGithubLogin, onEv, isLoggedIn]);

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <h2 className="text-xl font-bold">댓글</h2>
        <div className="tooltip" data-tip={tooltip}>
          <FaInfoCircle />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {githubProfile ? (
          <img src={githubProfile.avatar_url} className="h-12 rounded-full" />
        ) : (
          <FaUserCircle size={48} fill="gray" />
        )}
        <LexicalComposer initialConfig={initialConfig}>
          <Editor enable={isLoggedIn} />
        </LexicalComposer>
      </div>
      <div className="w-full flex justify-end">
        {isLoggedIn ? (
          <button
            className="btn btn-sm bg-gray-600 text-white hover:bg-gray-700"
            onClick={() => {
              const replyEv = new CustomEvent("reply");
              window.dispatchEvent(replyEv);
            }}
          >
            댓글 쓰기
          </button>
        ) : (
          <button
            className="btn btn-sm bg-gray-600 text-white hover:bg-gray-700"
            onClick={() =>
              window.open(
                `https://github.com/login/oauth/authorize?client_id=${clientId}`,
                "",
                "width=600, height=800"
              )
            }
          >
            <FaGithub />
            Github으로 로그인
          </button>
        )}
      </div>
    </div>
  );
}
