"use client";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import ToolbarPlugin from "./toolbar";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useState } from "react";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import CodeHighlightPlugin from "./utils/codeHighlightPlugin";
import {
  DEFAULT_TRANSFORMERS,
  MarkdownShortcutPlugin,
} from "@lexical/react/LexicalMarkdownShortcutPlugin";
import ImagePlugin from "./plugins/imagePlugin";
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";
import { MATCHERS } from "./utils/autoLinkMatchers";
import EmojiPickerPlugin from "./plugins/emojiPickerPlugin";

export default function Editor() {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);

  return (
    <div className="shadow rounded-box">
      <ToolbarPlugin
        editor={editor}
        activeEditor={activeEditor}
        setActiveEditor={setActiveEditor}
      />
      <div className="p-4">
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="min-h-[calc(100vh-242px-48px)] focus:outline-none" />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <ListPlugin />
        <CodeHighlightPlugin />
        <ImagePlugin />
        <MarkdownShortcutPlugin transformers={DEFAULT_TRANSFORMERS} />
        <AutoLinkPlugin matchers={MATCHERS} />
        <EmojiPickerPlugin />
      </div>
    </div>
  );
}
