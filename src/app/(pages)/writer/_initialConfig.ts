import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ImageNode } from "./_components/nodes/imageNode";
import { KeomojiNode } from "./_components/nodes/keomojiNode";

const theme = {
  ltr: "ltr",
  rtl: "rtl",
  placeholder: "editor-placeholder",
  paragraph: "mb-2 relative",
  quote: "border-l border-l-4 ml-4 pl-2",
  heading: {
    h1: "text-3xl font-extrabold dark:text-white",
    h2: "text-2xl font-bold dark:text-white",
    h3: "text-xl font-bold dark:text-white",
    h4: "text-lg font-bold dark:text-white",
    h5: "font-bold dark:text-white",
  },
  list: {
    nested: {
      listitem: "pl-5 mt-2 space-y-1 list-decimal list-inside dark:text-white",
    },
    ol: "max-w-md space-y-1 text-gray-500 list-decimal list-inside dark:text-white",
    ul: "max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-white",
    listitem: "dark:text-white",
  },
  image: "editor-image",
  keomoji: "align-middle inline-block",
  link: "font-medium text-blue-600 dark:text-blue-500 hover:underline",
  text: {
    bold: "font-bold",
    italic: "italic",
    overflowed: "editor-text-overflowed",
    hashtag: "editor-text-hashtag",
    underline: "underline",
    strikethrough: "line-through",
    underlineStrikethrough: "underline line-through",
    code: "font-mono text-[94%] bg-gray-100 dark:bg-gray-600 dark:text-white p-1 rounded",
  },
  code: "bg-gray-100 dark:bg-gray-600 font-mono block py-2 pl-12 leading-1 m-0 mt-2 mb-2 tab-2 overflow-x-auto relative before:absolute before:content-[attr(data-gutter)] before:bg-gray-200 dark:before:bg-gray-700 before:left-0 before:top-0 before:p-2 before:min-w-[25px] before:whitespace-pre-wrap before:text-right after:content-[attr(data-highlight-language)] after:invisible after:right-3 transition after:top-0 after:absolute",
  codeHighlight: {
    atrule: "text-[#07a] dark:text-cyan-400",
    attr: "text-[#07a] dark:text-cyan-400",
    boolean: "text-pink-700 dark:text-pink-400",
    builtin: "text-[#690]",
    cdata: "bg-slate-600",
    char: "text-[#690]",
    class: "text-[#dd4a68]",
    "class-name": "text-[#dd4a68]",
    comment: "bg-slate-600 dark:bg-gray-600",
    constant: "text-pink-700 dark:text-pink-400",
    deleted: "text-pink-700 dark:text-pink-400",
    doctype: "bg-slate-600",
    entity: "text-[#9a6e3a]",
    function: "text-[#dd4a68]",
    important: "text-[#e90]",
    inserted: "text-[#690]",
    keyword: "text-[#07a] dark:text-cyan-400",
    namespace: "text-[#e90] dark:text-blue-400",
    number: "text-pink-700 dark:text-pink-400",
    operator: "text-[#9a6e3a]",
    prolog: "bg-slate-600",
    property: "text-pink-700 dark:text-pink-400",
    punctuation: "text-[#999]",
    regex: "text-[#e90] dark:text-blue-400",
    selector: "text-[#690]",
    string: "text-[#690] dark:text-orange-500",
    symbol: "text-pink-700 dark:text-pink-400",
    tag: "text-pink-700 dark:text-pink-400",
    url: "text-[#9a6e3a]",
    variable: "text-[#e90] dark:text-blue-400",
  },
};

function onError(err: Error) {
  console.error(err);
}
export const initialConfig = {
  namespace: "MyEditor",
  theme,
  onError,
  nodes: [
    LinkNode,
    AutoLinkNode,
    ListNode,
    ListItemNode,
    HorizontalRuleNode,
    CodeNode,
    CodeHighlightNode,
    HeadingNode,
    LinkNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    ImageNode,
    KeomojiNode,
  ],
};
