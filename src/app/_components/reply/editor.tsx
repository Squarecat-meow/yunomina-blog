"use client";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import CodeHighlightPlugin from "@/app/(pages)/writer/_components/utils/codeHighlightPlugin";
import {
  DEFAULT_TRANSFORMERS,
  MarkdownShortcutPlugin,
} from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";
import { MATCHERS } from "@/app/(pages)/writer/_components/utils/autoLinkMatchers";
import EmojiPickerPlugin, {
  KEOMOJI,
} from "@/app/(pages)/writer/_components/plugins/emojiPickerPlugin";
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { GithubProfileDto } from "@/app/_dto/replyGithubProfile.dto";
import { usePathname, useRouter } from "next/navigation";
import { $getRoot } from "lexical";

export default function Editor({
  enable,
  setIsReady,
  modalRef,
}: {
  enable: boolean;
  setIsReady: Dispatch<SetStateAction<boolean>>;
  modalRef: RefObject<HTMLDialogElement>;
}) {
  const [editor] = useLexicalComposerContext();
  const markdown = useRef<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const postId = pathname.match(/(?<=posts\/).+/)?.[0];

  const onReplyEv = useCallback(async () => {
    editor.update(() => {
      markdown.current = $convertToMarkdownString([KEOMOJI, ...TRANSFORMERS]);
    });

    const profile = sessionStorage.getItem("githubLogin");
    if (!profile) {
      alert("깃헙 프로파일이 없어요!");
      return;
    }
    if (markdown.current === "") {
      alert("댓글이 비어있어요!");
      return;
    }
    if (!postId) {
      alert("포스트가 없어요!");
      return;
    }
    const parsedProfile = JSON.parse(profile) as GithubProfileDto;
    const payload = {
      postId: parseInt(postId),
      avatar: parsedProfile.avatar_url,
      name: parsedProfile.name,
      reply: markdown.current,
      githubId: parsedProfile.id,
    };

    const res = await fetch(`/api/web/post/reply`, {
      method: "POST",
      headers: {
        url: parsedProfile.url,
        id: JSON.stringify(parsedProfile.id),
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      alert(`댓글을 다는데 실패했어요!, ${await res.text()}`);
      return;
    }
    editor.update(() => {
      const root = $getRoot();
      root.clear();
    });
    modalRef.current?.showModal();
    setIsReady(true);
  }, [editor]);

  useEffect(() => {
    editor.setEditable(enable);
    router.refresh();
  }, [enable, editor]);

  useEffect(() => {
    window.addEventListener("reply", onReplyEv as EventListener);

    return () => {
      window.removeEventListener("reply", onReplyEv as EventListener);
    };
  }, []);
  return (
    <div className="relative flex-grow">
      <RichTextPlugin
        contentEditable={
          <div className="rounded-box border border-base-300 p-2">
            <ContentEditable
              disabled={enable}
              className={`focus:outline-none ${
                !enable && "cursor-not-allowed"
              }`}
              aria-placeholder={
                enable
                  ? "댓글을 입력해 주세요..."
                  : "로그인 후에 댓글을 달아주세요!"
              }
              placeholder={
                enable ? (
                  <span className="absolute top-2 left-2 select-none -z-[1] text-slate-400">
                    댓글을 입력해 주세요...
                  </span>
                ) : (
                  <span className="absolute top-2 left-2 select-none -z-[1] text-slate-400">
                    로그인 후에 댓글을 달아주세요!
                  </span>
                )
              }
            />
          </div>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <AutoFocusPlugin />
      <ListPlugin />
      <CodeHighlightPlugin />
      <MarkdownShortcutPlugin transformers={DEFAULT_TRANSFORMERS} />
      <AutoLinkPlugin matchers={MATCHERS} />
      <EmojiPickerPlugin />
    </div>
  );
}
