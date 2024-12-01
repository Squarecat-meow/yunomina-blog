import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
  LexicalEditor,
} from "lexical";
import { ChangeEvent, RefObject, useEffect, useRef, useState } from "react";
import {
  $createImageNode,
  $isImageNode,
  ImageNode,
  ImagePayload,
} from "../nodes/imageNode";
import Image from "next/image";
import { Image as CarbonImage } from "@carbon/icons-react";
import { $wrapNodeInElement, mergeRegister } from "@lexical/utils";
import { TextMatchTransformer } from "@lexical/markdown";

export type InsertImagePayload = Readonly<ImagePayload>;

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
  createCommand("INSERT_IMAGE_COMMAND");

export const IMAGE: TextMatchTransformer = {
  export: (node, exportChildren, exportFormat) => {
    if (!$isImageNode(node)) {
      return null;
    }

    return `!['selected Image'](${node.getSrc()})`;
  },
  importRegExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))/,
  regExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))$/,
  replace: (textNode, match) => {
    const [, altText, src] = match;
    const imageNode = $createImageNode({ src: src, width: 800, height: 450 });
    textNode.replace(imageNode);
  },
  trigger: ")",
  type: "text-match",
  dependencies: [],
};

export function InsertImageDialog({
  activeEditor,
  ref,
}: {
  activeEditor: LexicalEditor;
  ref: RefObject<HTMLDialogElement>;
}) {
  const [fileEnter, setFileEnter] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onClick = (payload: InsertImagePayload) => {
    activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
    ref.current?.close();
  };

  const handleInputClick = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    try {
      const file = e.target.files[0];
      const fileInteralUrl = URL.createObjectURL(file);
      setSelectedImage(fileInteralUrl);
    } catch (err) {
      alert(err);
    }
  };

  return (
    <>
      <dialog ref={ref} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-2">이미지 선택</h3>
          <div className="aspect-video w-full p-2 mb-2 flex justify-center items-center rounded-box border border-dashed border-slate-400 focus:outline-none">
            {selectedImage ? (
              <button
                className="w-full h-full active:scale-95 transition-transform relative"
                onClick={handleInputClick}
                onDragOver={(e) => {
                  e.preventDefault();
                  setFileEnter(true);
                }}
                onDragLeave={(e) => {
                  setFileEnter(false);
                }}
                onDragEnd={(e) => {
                  e.preventDefault();
                  setFileEnter(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setFileEnter(false);
                  if (e.dataTransfer.items) {
                    [...e.dataTransfer.items].forEach((item, i) => {
                      if (
                        item.type === "image/png" ||
                        item.type === "image/jpeg"
                      ) {
                        const file = item.getAsFile();
                        if (file) {
                          const blobUrl = URL.createObjectURL(file);
                          setSelectedImage(blobUrl);
                        }
                      } else {
                        console.log("사진이 아니라 다른게 들어왔어요!");
                        setSelectedImage(null);
                      }
                    });
                  }
                }}
              >
                <Image src={selectedImage} fill alt="user selected image" />
              </button>
            ) : (
              <>
                <button
                  className="w-full h-full flex flex-col items-center btn focus:outline-none"
                  onClick={handleInputClick}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setFileEnter(true);
                  }}
                  onDragLeave={(e) => {
                    setFileEnter(false);
                  }}
                  onDragEnd={(e) => {
                    e.preventDefault();
                    setFileEnter(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setFileEnter(false);
                    if (e.dataTransfer.items) {
                      [...e.dataTransfer.items].forEach((item, i) => {
                        if (
                          item.type === "image/png" ||
                          item.type === "image/jpeg"
                        ) {
                          const file = item.getAsFile();
                          if (file) {
                            const blobUrl = URL.createObjectURL(file);
                            setSelectedImage(blobUrl);
                          }
                        } else {
                          console.log("사진이 아니라 다른게 들어왔어요!");
                          setSelectedImage(null);
                        }
                      });
                    }
                  }}
                >
                  <CarbonImage size={36} />
                  <span>이미지를 끌어다 놓거나 여기를 눌러 찾기</span>
                </button>
              </>
            )}
          </div>
          <button
            className="btn btn-outline w-full"
            onClick={() => setSelectedImage(null)}
          >
            이미지 초기화
          </button>
          <input
            type="file"
            hidden={true}
            accept="image/*"
            onChange={handleChange}
            ref={fileInputRef}
          />
          <div className="modal-action">
            <form method="dialog">
              <div className="flex gap-2">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (selectedImage)
                      onClick({ src: selectedImage, width: 800, height: 450 });
                  }}
                >
                  확인
                </button>
                <button className="btn">취소</button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default function ImagePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error("이미지 플러그인: 이미지 노드가 에디터에 없어요!");
    }

    return mergeRegister(
      editor.registerCommand<InsertImagePayload>(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const imageNode = $createImageNode(payload);
          $insertNodes([imageNode]);
          if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
            $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);

  return null;
}
