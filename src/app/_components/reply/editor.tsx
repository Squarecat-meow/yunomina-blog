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
import { useCallback, useEffect, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";

export default function Editor({ enable }: { enable: boolean }) {
  const [editor] = useLexicalComposerContext();
  const markdown = useRef<string | null>(null);

  const onEv = useCallback(() => {
    editor.update(() => {
      markdown.current = $convertToMarkdownString([KEOMOJI, ...TRANSFORMERS]);
    });

    console.log(markdown.current);
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
