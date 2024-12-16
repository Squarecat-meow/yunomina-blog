"use client";

import { FaGithub, FaInfoCircle, FaUserCircle } from "react-icons/fa";
import Editor from "./editor";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { initialConfig } from "@/app/(pages)/writer/_initialConfig";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { GithubProfileDto } from "@/app/_dto/replyGithubProfile.dto";
import { reply } from "@prisma/client";
import remarkGfm from "remark-gfm";
import { compileMDX, CompileMDXResult } from "next-mdx-remote/rsc";
import DialogModalOneButton from "../modalOneButton";
import SingleReply from "./singleReply";

export default function Reply() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [githubProfile, setGithubProfile] = useState<GithubProfileDto | null>();
  const [reply, setReply] = useState<reply[] | null>(null);
  const [compiledReply, setCompiledReply] = useState<
    CompileMDXResult<Record<string, unknown>>[] | null
  >(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const replySuccessModalRef = useRef<HTMLDialogElement>(null);
  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const pathname = usePathname();
  const postId = pathname.match(/(?<=posts\/).+/)?.[0];

  const tooltip =
    "마크다운 문법을 지원하며\n :키를 눌러 커모지도 입력할 수 있어요.";

  const onLoginEv = useCallback((ev: CustomEvent<GithubProfileDto>) => {
    sessionStorage.setItem("githubLogin", JSON.stringify(ev.detail));
    setIsLoggedIn(true);
  }, []);

  const fetchReply = useCallback(async () => {
    const replyes = await fetch(`/api/web/post/reply?id=${postId}`);
    const parsedReplyes = (await replyes.json()) as reply[];
    const compileMarkdown = await Promise.all(
      parsedReplyes.map((el) => {
        return compileMDX({
          source: el.text!,
          options: {
            mdxOptions: {
              remarkPlugins: [remarkGfm],
            },
          },
        });
      })
    );
    return { compileMarkdown, parsedReplyes };
  }, [postId]);

  const initialize = useCallback(async () => {
    const githubSessionLogin = sessionStorage.getItem("githubLogin");

    if (!githubSessionLogin) {
      setIsLoggedIn(false);
      setGithubProfile(null);
    } else {
      setIsLoggedIn(true);
      setGithubProfile(JSON.parse(githubSessionLogin));
    }

    const { compileMarkdown, parsedReplyes } = await fetchReply();

    setCompiledReply(compileMarkdown);
    setReply(parsedReplyes);
  }, [fetchReply]);

  const onReplyEv = useCallback(() => {
    fetchReply().then(({ compileMarkdown, parsedReplyes }) => {
      setCompiledReply(compileMarkdown);
      setReply(parsedReplyes);
      setIsReady(false);
    });
  }, [fetchReply]);

  useEffect(() => {
    onReplyEv();
  }, [isReady, onReplyEv]);

  useEffect(() => {
    window.addEventListener("reply", onReplyEv as EventListener);
    window.addEventListener("replyDelete", onReplyEv as EventListener);
    window.addEventListener("github-login", onLoginEv as EventListener);

    initialize();

    return () => {
      window.removeEventListener("reply", onReplyEv as EventListener);
      window.removeEventListener("replyDelete", onReplyEv as EventListener);
      window.removeEventListener("github-login", onLoginEv as EventListener);
    };
  }, [initialize, onLoginEv, onReplyEv, isLoggedIn]);

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <h2 className="text-xl font-bold">댓글</h2>
        <div className="tooltip" data-tip={tooltip}>
          <FaInfoCircle />
        </div>
      </div>
      {reply &&
        reply.map((el, key) => (
          <SingleReply
            key={key}
            replyKey={key}
            reply={el}
            compiledReply={compiledReply!}
            github={githubProfile}
          />
        ))}
      <div className="flex items-center space-x-2">
        {githubProfile !== undefined ? (
          <>
            {githubProfile !== null ? (
              <img
                src={githubProfile.avatar_url}
                className="h-12 rounded-full"
              />
            ) : (
              <FaUserCircle size={48} fill="gray" />
            )}
          </>
        ) : (
          <div className="w-12 h-12 flex items-center justify-center">
            <span className="loading loading-spinner" />
          </div>
        )}

        <LexicalComposer initialConfig={initialConfig}>
          <Editor
            enable={isLoggedIn}
            setIsReady={setIsReady}
            modalRef={replySuccessModalRef}
          />
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
      <DialogModalOneButton
        title={"성공"}
        body={"댓글을 성공적으로 달았어!"}
        buttonText={"알겠어요"}
        ref={replySuccessModalRef}
      />
    </div>
  );
}
