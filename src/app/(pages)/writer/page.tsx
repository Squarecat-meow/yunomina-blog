"use client";

import DialogModalLoadingOneButton from "@/app/_components/modalLoadingOneButton";
import DialogModalTwoButton from "@/app/_components/modalTwoButton";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { LexicalEditor } from "lexical";
import Editor from "./_components/editor";
import { useForm } from "react-hook-form";
import { PostDto } from "@/app/_dto/post.dto";
import { IMAGE } from "./_components/plugins/imagePlugin";

type TitleType = {
  title: string;
};

export const EditorContext = createContext<Dispatch<
  SetStateAction<LexicalEditor | null>
> | null>(null);

export default function Writer() {
  const [loading, setLoading] = useState(false);
  const [editor, setEditor] = useState<LexicalEditor | null>(null);
  const [title, setTitle] = useState<string | null>(null);

  const postConfirmModalRef = useRef<HTMLDialogElement>(null);
  const postSuccessModalRef = useRef<HTMLDialogElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TitleType>({ mode: "onBlur" });

  const handlePost = async () => {
    if (editor && title) {
      setLoading(true);
      postSuccessModalRef.current?.showModal();
      let markdown;
      editor.update(() => {
        markdown = $convertToMarkdownString([IMAGE, ...TRANSFORMERS]);
      });
      const profile = JSON.parse(localStorage.getItem("profile") ?? "");
      const payload: PostDto = {
        title: title,
        author: profile.userId,
        body: markdown ?? "",
      };

      const res = await fetch("/api/web/post", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (!res.ok) alert(await res.text());
      setLoading(false);
    }
  };

  const onSubmit = (data: TitleType) => {
    setTitle(data.title);
    postConfirmModalRef.current?.showModal();
  };

  return (
    <EditorContext.Provider value={setEditor}>
      <div className="w-full flex flex-col items-center">
        <div className="w-full desktop:w-[60%] mb-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex justify-between"
          >
            <label className="w-full input shadow flex items-center gap-2 mb-2">
              <span className="font-bold">제목</span>
              <input
                autoComplete="off"
                type="text"
                {...register("title", { required: true })}
                className={`grow ${
                  errors.title && "input-bordered input-error"
                }`}
              />
            </label>
            <button
              type="submit"
              className="w-24 h-12 ml-2 rounded-btn shadow hover:bg-primary hover:text-white px-4 py-2 transition-all active:scale-95"
            >
              올리기
            </button>
          </form>
          <Editor />
        </div>
        <DialogModalTwoButton
          title={"포스트하기"}
          body={"내가 쓴 글을 이제 모두에게 보여줄까?"}
          confirmButtonText={"네!"}
          onClick={handlePost}
          cancelButtonText={"아니오"}
          ref={postConfirmModalRef}
        />
        <DialogModalLoadingOneButton
          isLoading={loading}
          title_loading={"포스트하는 중..."}
          title_done={"완료!"}
          body_loading={"포스트하고 있어. 잠시만 기다려줘!"}
          body_done={"포스트 끝! 이제 내 글을 많은 사람들이 볼 수 있어!"}
          loadingButtonText={"로딩중..."}
          doneButtonText={"확인"}
          ref={postSuccessModalRef}
        />
      </div>
    </EditorContext.Provider>
  );
}
