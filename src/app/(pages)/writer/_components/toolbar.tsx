"use client";

import { Dispatch, useCallback, useEffect, useMemo, useState } from "react";
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
import { formatHeading, formatParagraph } from "./utils/toolbarUtils";
import EditorDropdown from "./components/dropdown";
import { IconType } from "react-icons";
import { $isListNode, ListNode } from "@lexical/list";
import { $isHeadingNode } from "@lexical/rich-text";
import {
  $isCodeNode,
  getCodeLanguages,
  getDefaultCodeLanguage,
} from "@lexical/code";
import { $isAtNodeEnd } from "@lexical/selection";
import { $isLinkNode } from "@lexical/link";

export type DropdownType = {
  key: number;
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
  const [blockType, setBlockType] = useState("paragraph");
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

  const dropdownList: DropdownType[] = [
    {
      key: 0,
      carbonIcon: TextLongParagraph,
      string: "Normal",
      onClick: () => formatParagraph(editor),
    },
    {
      key: 1,
      faIcon: BsTypeH1,
      string: "Heading 1",
      onClick: () => formatHeading(editor, blockType, "h1"),
    },
    {
      key: 2,
      faIcon: BsTypeH2,
      string: "Heading 2",
    },
    {
      key: 3,
      faIcon: BsTypeH3,
      string: "Heading 3",
    },
    {
      key: 4,
      carbonIcon: ListBulleted,
      string: "Bullet List",
    },
    {
      key: 5,
      carbonIcon: ListNumbered,
      string: "Numbered List",
    },
    {
      key: 6,
      carbonIcon: ListBoxes,
      string: "Check List",
    },
    {
      key: 7,
      carbonIcon: Code,
      string: "Code Block",
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
          const type = parentList ? parentList.getTag() : element.getTag();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if ($isCodeNode(element)) {
            setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage());
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

  const codeLanguges = useMemo(() => getCodeLanguages(), []);
  const onCodeLanguageSelect = useCallback(
    (e) => {
      editor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(e.target.value);
          }
        }
      });
    },
    [editor, selectedElementKey]
  );

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

  return (
    <div className="h-12 flex items-center p-2 border-b border-base-300">
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
      <EditorDropdown props={dropdownList} />
      <EditorDivider />
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
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
        }
        disabled={!isEditable}
        className={`${isStrikethrough && "bg-base-200"}`}
      >
        <TextStrikethrough size={20} />
      </EditorButton>
    </div>
  );
}
