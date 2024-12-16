"use client";

import { useCallback, useEffect, useState } from "react";
import { emojis } from "@prisma/client";
import { fetchEmojiArray } from "../actions/action";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createKeomojiNode } from "../nodes/keomojiNode";
import { $getSelection, $isRangeSelection } from "lexical";

export default function EmojiSelector() {
  const [emojiCategory, setEmojiCategory] = useState<
    Partial<Record<string, emojis[]>>
  >({});
  const [editor] = useLexicalComposerContext();

  const onEmojiClick = useCallback(
    (url: string, name: string) => {
      editor.update(() => {
        const selection = $getSelection();

        if (!$isRangeSelection(selection)) return;

        selection.insertNodes([
          $createKeomojiNode({
            name: name,
            src: url,
            width: 28,
            height: 28,
          }),
        ]);
      });
    },
    [editor]
  );

  const fetchEmoji = useCallback(async () => {
    const array = await fetchEmojiArray();
    const groupByCategory = Object.groupBy(
      array,
      ({ category }) => category ?? ""
    );

    setEmojiCategory(groupByCategory);
  }, []);
  useEffect(() => {
    fetchEmoji();
  }, [fetchEmoji]);

  return (
    <div
      tabIndex={0}
      className="dropdown-content menu bg-base-100 rounded-box z-[1] w-[26rem] h-[28rem] overflow-y-scroll p-2 shadow"
    >
      <div className="join join-vertical w-full">
        {Object.entries(emojiCategory).map(([key, value]) => (
          <div
            className="collapse collapse-arrow join-item border-base-300 border"
            key={key}
          >
            <input type="checkbox" />
            <div className="collapse-title">{key}</div>
            <div className="collapse-content">
              <div className="grid grid-cols-8 gap-2">
                {value?.map((val) => (
                  <div
                    className="rounded-md hover:bg-base-200 active:scale-90 transition-all w-10 h-10 p-1"
                    key={val.id}
                    onClick={() => onEmojiClick(val.url, val.name)}
                  >
                    <img src={val.url} alt={val.name} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
