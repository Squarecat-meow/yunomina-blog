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
import { useCallback, useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { GithubProfileDto } from "@/app/_dto/replyGithubProfile.dto";
import { usePathname } from "next/navigation";

export default function Editor({ enable }: { enable: boolean }) {
  const [editor] = useLexicalComposerContext();
  const markdown = useRef<string | null>(null);
  const pathname = usePathname();
  const postId = pathname.match(/(?<=posts\/).+/)?.[0];

  const onEv = useCallback(async () => {
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
    }
    const parsedProfile = JSON.parse(profile) as GithubProfileDto;
    const payload = {
      postId: postId,
      avatar: parsedProfile.avatar_url,
      name: parsedProfile.name,
      reply: markdown.current,
    };

    const res = await fetch(`/api/web/post/reply`, {
      method: "POST",
      headers: {
        url: parsedProfile.url,
        id: JSON.stringify(parsedProfile.id),
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) alert("댓글을 다는데 실패했어요!");
    console.log(res.json());
  }, [editor]);

  useEffect(() => {
    editor.setEditable(enable);
  }, [enable, editor]);

  useEffect(() => {
    window.addEventListener("reply", onEv as EventListener);

    return () => {
      window.removeEventListener("reply", onEv as EventListener);
    };
  }, [onEv]);
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
