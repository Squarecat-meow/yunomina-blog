"use client";

import dynamic from "next/dynamic";
import { LexicalComposer } from "@lexical/react/LexicalComposer";

const LexicalEditor = dynamic(() => import("./_components/editor"), {
  ssr: false,
});

export default function Writer() {
  const theme = {
    ltr: "ltr",
    rtl: "rtl",
    paragraph: "editor-paragraph",
    quote: "editor-quote",
    heading: {
      h1: "editor-heading-h1",
      h2: "editor-heading-h2",
      h3: "editor-heading-h3",
      h4: "editor-heading-h4",
      h5: "editor-heading-h5",
      h6: "editor-heading-h6",
    },
    list: {
      nested: {
        listitem: "editor-nested-listitem",
      },
      ol: "editor-list-ol",
      ul: "editor-list-ul",
      listitem: "editor-listItem",
      listitemChecked: "editor-listItemChecked",
      listitemUnchecked: "editor-listItemUnchecked",
    },
    hashtag: "editor-hashtag",
    image: "editor-image",
    link: "editor-link",
    text: {
      bold: "editor-textBold",
      code: "editor-textCode",
      italic: "editor-textItalic",
      strikethrough: "line-through",
      subscript: "editor-textSubscript",
      superscript: "editor-textSuperscript",
      underline: "underline",
      underlineStrikethrough: "[text-decoration:underline_line-through]",
    },
    code: "editor-code",
    codeHighlight: {
      atrule: "editor-tokenAttr",
      attr: "editor-tokenAttr",
      boolean: "editor-tokenProperty",
      builtin: "editor-tokenSelector",
      cdata: "editor-tokenComment",
      char: "editor-tokenSelector",
      class: "editor-tokenFunction",
      "class-name": "editor-tokenFunction",
      comment: "editor-tokenComment",
      constant: "editor-tokenProperty",
      deleted: "editor-tokenProperty",
      doctype: "editor-tokenComment",
      entity: "editor-tokenOperator",
      function: "editor-tokenFunction",
      important: "editor-tokenVariable",
      inserted: "editor-tokenSelector",
      keyword: "editor-tokenAttr",
      namespace: "editor-tokenVariable",
      number: "editor-tokenProperty",
      operator: "editor-tokenOperator",
      prolog: "editor-tokenComment",
      property: "editor-tokenProperty",
      punctuation: "editor-tokenPunctuation",
      regex: "editor-tokenVariable",
      selector: "editor-tokenSelector",
      string: "editor-tokenSelector",
      symbol: "editor-tokenProperty",
      tag: "editor-tokenProperty",
      url: "editor-tokenOperator",
      variable: "editor-tokenVariable",
    },
  };

  function onError(err: Error) {
    console.error(err);
  }
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
  };
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full desktop:w-[60%] mb-4">
        <LexicalComposer initialConfig={initialConfig}>
          <LexicalEditor />
        </LexicalComposer>
      </div>
    </div>
  );
}
