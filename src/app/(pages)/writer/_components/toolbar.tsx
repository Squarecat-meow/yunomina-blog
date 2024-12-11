"use client";

import {
  Dispatch,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import EditorButton from "./components/button";
import {
  CarbonIconType,
  Redo,
  TextBold,
  TextItalic,
  TextStrikethrough,
  TextUnderline,
  Undo,
  ListBoxes,
  ListBulleted,
  ListNumbered,
  TextLongParagraph,
  Code,
  Quotes,
  Image,
  FaceSatisfied,
} from "@carbon/icons-react";
import { BsTypeH1, BsTypeH2, BsTypeH3 } from "react-icons/bs";
import EditorDivider from "./components/divider";
import {
  $getNearestNodeOfType,
  $wrapNodeInElement,
  mergeRegister,
} from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  RangeSelection,
  $getNodeByKey,
} from "lexical";
import {
  formatBulletList,
  formatCheckList,
  formatCode,
  formatHeading,
  formatNumberedList,
  formatParagraph,
  formatQuote,
} from "./utils/toolbarUtils";
import EditorDropdown from "./components/dropdown";
import { IconType } from "react-icons";
import { $isListNode, ListNode } from "@lexical/list";
import { $isHeadingNode } from "@lexical/rich-text";
import {
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  CODE_LANGUAGE_MAP,
} from "@lexical/code";
import { $isAtNodeEnd } from "@lexical/selection";
import { $isLinkNode } from "@lexical/link";
import { blockTypeToBlockName } from "./utils/toolbarUtils";
import EditorCodeDropdown from "./components/codeDropdown";
import { EditorContext } from "@/app/_context/contextProvider";
import { InsertImageDialog } from "./plugins/imagePlugin";
import EmojiSelector from "./components/emojiSelector";

export type DropdownType = {
  key: string;
  carbonIcon?: CarbonIconType;
  faIcon?: IconType;
  string: string;
  onClick?: () => void;
};

const LowPriority = 1;

function getSelectedNode(selection: RangeSelection) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

export default function ToolbarPlugin({
  editor,
  activeEditor,
  setActiveEditor,
}: {
  editor: LexicalEditor;
  activeEditor: LexicalEditor;
  setActiveEditor: Dispatch<LexicalEditor>;
}) {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] =
    useState<keyof typeof blockTypeToBlockName>("paragraph");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [selectedElementKey, setSelectedElementKey] = useState<string | null>(
    null
  );
  const [isCode, setIsCode] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState<string>("");
  const [isLink, setIsLink] = useState(false);
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const [misskeyAddress, setMisskeyAddress] = useState<string | null>(null);

  const ImageDialogModalRef = useRef<HTMLDialogElement>(null);

  const setEditor = useContext(EditorContext);

  const dropdownList: DropdownType[] = [
    {
      key: "paragraph",
      carbonIcon: TextLongParagraph,
      string: "Normal",
      onClick: () => formatParagraph(editor),
    },
    {
      key: "h1",
      faIcon: BsTypeH1,
      string: "Heading 1",
      onClick: () => formatHeading(editor, blockType, "h1"),
    },
    {
      key: "h2",
      faIcon: BsTypeH2,
      string: "Heading 2",
      onClick: () => formatHeading(editor, blockType, "h2"),
    },
    {
      key: "h3",
      faIcon: BsTypeH3,
      string: "Heading 3",
      onClick: () => formatHeading(editor, blockType, "h3"),
    },
    {
      key: "bullet",
      carbonIcon: ListBulleted,
      string: "Bulleted List",
      onClick: () => formatBulletList(editor, blockType),
    },
    {
      key: "number",
      carbonIcon: ListNumbered,
      string: "Numbered List",
      onClick: () => formatNumberedList(editor, blockType),
    },
    // {
    //   key: "check",
    //   carbonIcon: ListBoxes,
    //   string: "Check List",
    //   onClick: () => formatCheckList(editor, blockType),
    // },
    {
      key: "quote",
      carbonIcon: Quotes,
      string: "Quote",
      onClick: () => formatQuote(editor, blockType),
    },
    {
      key: "code",
      carbonIcon: Code,
      string: "Code Block",
      onClick: () => formatCode(editor, blockType),
    },
  ];

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName);
          }
          if ($isCodeNode(element)) {
            const language =
              element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
            setCodeLanguage(
              language ? CODE_LANGUAGE_MAP[language] || language : ""
            );
            return;
          }
        }
      }

      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  }, [activeEditor]);

  // 코드 언어 가져오기
  const onCodeLanguageSelect = useCallback(
    (value: string) => {
      activeEditor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(value);
          }
        }
      });
    },
    [activeEditor, selectedElementKey]
  );

  function getCodeLanguageOptions(): [string, string][] {
    const options: [string, string][] = [];

    for (const [lang, friendlyName] of Object.entries(
      CODE_LANGUAGE_FRIENDLY_NAME_MAP
    )) {
      options.push([lang, friendlyName]);
    }

    return options;
  }

  const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        setActiveEditor(newEditor);
        $updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, $updateToolbar, setActiveEditor]);

  useEffect(() => {
    activeEditor.getEditorState().read(() => {
      $updateToolbar();
    });
  }, [activeEditor, $updateToolbar]);

  useEffect(() => {
    if (setEditor) setEditor(editor);
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        LowPriority
      ),
      activeEditor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      activeEditor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor, activeEditor, $updateToolbar]);

  useEffect(() => {
    console.log(misskeyAddress);
  }, []);

  return (
    <div className="h-[5rem] desktop:h-12 flex flex-col desktop:flex-row desktop:items-center p-2 border-b border-base-300">
      <div className="flex items-center">
        <EditorButton
          disabled={!canUndo || !isEditable}
          onClick={() => activeEditor.dispatchCommand(UNDO_COMMAND, undefined)}
        >
          <Undo className={`${!canUndo && "fill-gray-400"}`} />
        </EditorButton>
        <EditorButton
          disabled={!canRedo || !isEditable}
          onClick={() => activeEditor.dispatchCommand(REDO_COMMAND, undefined)}
        >
          <Redo className={`${!canRedo && "fill-gray-400"}`} />
        </EditorButton>
        <EditorDivider />
        <EditorDropdown props={dropdownList} blockType={blockType} />
      </div>
      <div className="flex items-center">
        <EditorDivider className={`hidden desktop:flex`} />
        {blockType === "code" ? (
          <>
            <EditorCodeDropdown
              language={CODE_LANGUAGE_OPTIONS}
              onCodeChange={onCodeLanguageSelect}
            />
          </>
        ) : (
          <>
            <EditorButton
              onClick={() =>
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
              }
              disabled={!isEditable}
              className={`${isBold && "bg-base-200"}`}
            >
              <TextBold size={20} />
            </EditorButton>
            <EditorButton
              onClick={() =>
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
              }
              disabled={!isEditable}
              className={`${isItalic && "bg-base-200"}`}
            >
              <TextItalic size={20} />
            </EditorButton>
            <EditorButton
              onClick={() =>
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
              }
              disabled={!isEditable}
              className={`${isUnderline && "bg-base-200"}`}
            >
              <TextUnderline size={20} />
            </EditorButton>
            <EditorButton
              onClick={() =>
                activeEditor.dispatchCommand(
                  FORMAT_TEXT_COMMAND,
                  "strikethrough"
                )
              }
              disabled={!isEditable}
              className={`${isStrikethrough && "bg-base-200"}`}
            >
              <TextStrikethrough size={20} />
            </EditorButton>
            <EditorDivider />
            <EditorButton
              onClick={() => ImageDialogModalRef.current?.showModal()}
            >
              <InsertImageDialog
                activeEditor={activeEditor}
                ref={ImageDialogModalRef}
              />
              <Image size={20} />
            </EditorButton>
            <details className="dropdown">
              <summary tabIndex={0} role="button" className="list-none">
                <EditorButton>
                  <FaceSatisfied size={20} />
                </EditorButton>
              </summary>
              <EmojiSelector />
            </details>
          </>
        )}
      </div>
      <div className="w-full flex justify-end p-2"></div>
    </div>
  );
}
