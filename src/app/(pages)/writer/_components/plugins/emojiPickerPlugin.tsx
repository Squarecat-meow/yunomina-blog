import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { emojis } from "@prisma/client";
import { $getSelection, $isRangeSelection, TextNode } from "lexical";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchEmojiArray } from "../actions/action";
import { createPortal } from "react-dom";
import { $createKeomojiNode, $isKeomojiNode } from "../nodes/keomojiNode";
import { TextMatchTransformer } from "@lexical/markdown";

class EmojiOption extends MenuOption {
  name: string;
  keywords: string[];
  url: string;

  constructor(
    name: string,
    url: string,
    options: {
      keywords?: string[];
    }
  ) {
    super(name);
    this.name = name;
    this.url = url;
    this.keywords = options.keywords || [];
  }
}

const MAX_EMOJI_SUGGESTION_COUNT = 10;

export const KEOMOJI: TextMatchTransformer = {
  export: (node) => {
    if (!$isKeomojiNode(node)) return null;

    // return `![${node.__name}](${node.getSrc()})`;
    return `<img src="${node.getSrc()}" alt="${
      node.__name
    }" width="28" height="28" style={{verticalAlign: "middle", display: "inline-block", marginTop: 0, marginBottom: 0}}/>`;
  },
  importRegExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))/,
  regExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))$/,
  replace: (textNode, match) => {
    const [, name, src] = match;
    const keomojiNode = $createKeomojiNode({
      name: name,
      src: src,
      width: 28,
      height: 28,
    });
    textNode.replace(keomojiNode);
  },
  trigger: ")",
  type: "text-match",
  dependencies: [],
};

function EmojiMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: EmojiOption;
}) {
  let className = "mb-1 rounded-md transition-all";
  if (isSelected) {
    className += " bg-base-300";
  }
  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={className}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={"typeahead-item-" + index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <div className="flex gap-2">
        <img src={option.url} alt="keomoji" className="w-6" />
        <span className="text-sm">{option.name}</span>
      </div>
    </li>
  );
}

export default function EmojiPickerPlugin() {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<string | null>(null);
  const [emojis, setEmojis] = useState<emojis[]>([]);

  const fetchEmoji = useCallback(async () => {
    const array = await fetchEmojiArray();

    setEmojis(array);
  }, []);

  useEffect(() => {
    fetchEmoji();
  }, [fetchEmoji]);

  const emojiOptions = useMemo(
    () =>
      emojis != null
        ? emojis.map(
            ({ name, aliases, url }) =>
              new EmojiOption(name, url, {
                keywords: [...aliases],
              })
          )
        : [],
    [emojis]
  );

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch(":", {
    minLength: 0,
  });

  const options: Array<EmojiOption> = useMemo(() => {
    return emojiOptions
      .filter((option: EmojiOption) => {
        return queryString !== null
          ? new RegExp(queryString, "gi").exec(option.name)
          : emojiOptions;
      })
      .slice(0, MAX_EMOJI_SUGGESTION_COUNT);
  }, [emojiOptions, queryString]);

  const onSelectOption = useCallback(
    (
      selectedOption: EmojiOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void
    ) => {
      editor.update(() => {
        const selection = $getSelection();

        if (!$isRangeSelection(selection) || selectedOption === null) return;
        if (nodeToRemove) nodeToRemove.remove();

        selection.insertNodes([
          $createKeomojiNode({
            name: selectedOption.name,
            src: selectedOption.url,
            width: 28,
            height: 28,
          }),
        ]);

        closeMenu();
      });
    },
    [editor]
  );

  return (
    <LexicalTypeaheadMenuPlugin
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForTriggerMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
      ) => {
        if (anchorElementRef.current === null || options.length === 0)
          return null;

        return anchorElementRef.current && options.length
          ? createPortal(
              <div className="min-w-48 p-2 bg-base-100 rounded-box shadow">
                <ul>
                  {options.map((option: EmojiOption, index) => (
                    <EmojiMenuItem
                      key={option.key}
                      index={index}
                      isSelected={selectedIndex === index}
                      onClick={() => {
                        setHighlightedIndex(index);
                        selectOptionAndCleanUp(option);
                      }}
                      onMouseEnter={() => {
                        setHighlightedIndex(index);
                      }}
                      option={option}
                    />
                  ))}
                </ul>
              </div>,
              anchorElementRef.current
            )
          : null;
      }}
    />
  );
}
