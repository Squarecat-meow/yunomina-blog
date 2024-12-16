"use client";

import DialogModalLoadingOneButton from "@/app/_components/modalLoadingOneButton";
import DialogModalTwoButton from "@/app/_components/modalTwoButton";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { LexicalEditor } from "lexical";
import Editor from "./_components/editor";
import { useForm } from "react-hook-form";
import { PostDto } from "@/app/_dto/post.dto";
import { IMAGE } from "./_components/plugins/imagePlugin";
import { getCookie } from "@/app/_actions/getCookie";
import { checkAuth } from "@/utils/jwt/checkAuth";
import {
  createCategory,
  getCategory,
  uploadToS3,
} from "./_components/actions/action";
import { category, profile } from "@prisma/client";
import { useRouter } from "next/navigation";
import { EditorContext } from "@/app/_context/contextProvider";
import { KEOMOJI } from "./_components/plugins/emojiPickerPlugin";

type postType = {
  title: string;
  category: string;
};

export default function Writer() {
  const [loading, setLoading] = useState(false);
  const [editor, setEditor] = useState<LexicalEditor | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [category, setCategory] = useState<category[] | null | undefined>();
  const [postCategory, setPostCategory] = useState<category>({
    category: "",
    id: 0,
    ownerId: 0,
  });
  const [newCategoryName, setNewCategoryName] = useState<string>("");

  const postConfirmModalRef = useRef<HTMLDialogElement>(null);
  const postSuccessModalRef = useRef<HTMLDialogElement>(null);
  const createCategoryModalRef = useRef<HTMLDialogElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
  } = useForm<postType>({ mode: "onBlur" });

  const router = useRouter();

  const handlePost = async () => {
    try {
      if (editor && title) {
        setLoading(true);
        postSuccessModalRef.current?.showModal();
        let markdown: string = "";
        editor.update(() => {
          markdown = $convertToMarkdownString([
            KEOMOJI,
            IMAGE,
            ...TRANSFORMERS,
          ]);
        });
        let payload: PostDto = {
          title: "",
          category: {
            category: "",
            id: 0,
            ownerId: 0,
          },
          author: "",
          body: "",
        };
        const regex = new RegExp(/(?:blob:http)[^)]*/gm);
        const imageUrls = [...markdown.matchAll(regex)].flat();

        const fetchUrls = async (urls: string[]) => {
          try {
            const promises = urls.map((url) => fetch(url));
            const res = await Promise.all(promises);
            const data = await Promise.all(res.map((res) => res.blob()));

            return data;
          } catch (err) {
            throw new Error(`blob URL fetch 에러! ${err}`);
          }
        };
        const images = await fetchUrls(imageUrls)
          .then((data) => data)
          .catch((err) => {
            throw err;
          });

        if (images) {
          const promises = images.map((el) => uploadToS3(el));
          const res = await Promise.all(promises);
          const bucketImages = await Promise.all(res.map((res) => res));

          for (const data in bucketImages) {
            markdown = markdown.replace(
              /(?:blob:http)[^)]*/m,
              bucketImages[data]
            );
          }

          const jwtToken = await getCookie("jwtToken");
          if (!jwtToken) {
            throw new Error("토큰을 가져오는데 실패했어요!");
          }
          const userId = await checkAuth(jwtToken.value);
          if (!userId) {
            throw new Error("쿠키를 검증하는데 실패했어요!");
          }

          payload = {
            title: title,
            category: postCategory,
            author: userId,
            thumbnail: bucketImages[0],
            body: markdown ?? "",
          };

          const fetchRes = await fetch("/api/web/post", {
            method: "POST",
            body: JSON.stringify(payload),
          });
          if (!fetchRes.ok) alert(await fetchRes.text());
          setLoading(false);
        } else {
          const jwtToken = await getCookie("jwtToken");
          if (!jwtToken) {
            throw new Error("토큰을 가져오는데 실패했어요!");
          }
          const userId = await checkAuth(jwtToken.value);
          if (!userId) {
            throw new Error("쿠키를 검증하는데 실패했어요!");
          }
          payload = {
            title: title,
            category: postCategory,
            author: userId,
            body: markdown ?? "",
          };

          const res = await fetch("/api/web/post", {
            method: "POST",
            body: JSON.stringify(payload),
          });
          if (!res.ok) alert(await res.text());
          setLoading(false);
        }
      }
    } catch (err) {
      alert(err);
      console.log(err);
    }
  };

  const onSubmit = (data: postType) => {
    setTitle(data.title);
    postConfirmModalRef.current?.showModal();
  };

  const onCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    switch (e.target.value) {
      case "create-category":
        createCategoryModalRef.current?.showModal();
        break;
      case "":
        trigger();
        break;
      default:
        const filteredCategory = category?.find(
          (el) => el.id === parseInt(e.target.value)
        );
        setPostCategory(
          filteredCategory ?? { category: "", id: 0, ownerId: 0 }
        );
        break;
    }
  };

  const getCategoryFromServer = useCallback(async () => {
    const localProfile = localStorage.getItem("profile");
    if (!localProfile) {
      throw new Error("로컬 프로필이 없어요!");
    }
    const profile = JSON.parse(localProfile) as profile;
    const [gotCategory] = await getCategory(profile.id);
    setCategory(gotCategory.ownedCategory);
  }, []);

  const createCategoryFromServer = useCallback(async () => {
    const localProfile = localStorage.getItem("profile");
    if (!localProfile) {
      throw new Error("로컬 프로필이 없어요!");
    }
    const profile = JSON.parse(localProfile) as profile;

    const newCategory = await createCategory(newCategoryName, profile.id ?? 0);
    setCategory((prevCategory) => [...(prevCategory || []), newCategory]);
    setValue("category", newCategory.category);
  }, [newCategoryName, setValue]);

  useEffect(() => {
    getCategoryFromServer();
  }, [getCategoryFromServer]);

  return (
    <EditorContext.Provider value={setEditor}>
      <div className="w-full flex flex-col items-center">
        <div className="w-full desktop:w-[60%] mb-2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex justify-between"
          >
            <div className="w-full flex flex-col desktop:flex-row gap-2 mb-2">
              <select
                {...register("category", { required: true })}
                className="select shadow w-fit"
                disabled={category === undefined && true}
                onChange={onCategoryChange}
              >
                {category !== undefined ? (
                  <>
                    {category !== null ? (
                      <>
                        <option value="">선택해주세요</option>
                        <option value="create-category">카테고리 만들기</option>
                        {category.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.category}
                          </option>
                        ))}
                      </>
                    ) : (
                      <>
                        <option value="create-category">카테고리 만들기</option>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <option>로딩중...</option>
                  </>
                )}
              </select>
              <div className="flex w-full gap-2">
                <label className="w-full input shadow flex items-center gap-2">
                  <span className="font-bold w-12">제목</span>
                  <input
                    autoComplete="off"
                    type="text"
                    {...register("title", { required: true })}
                    className={`w-full ${
                      errors.title && "input-bordered input-error"
                    }`}
                  />
                </label>
                <button
                  type="submit"
                  className="w-24 h-12 rounded-btn shadow hover:bg-primary hover:text-white px-4 py-2 transition-all active:scale-95"
                >
                  올리기
                </button>
              </div>
            </div>
          </form>
          <Editor />
        </div>
        <dialog ref={createCategoryModalRef} className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">카테고리 만들기</h3>
            <div className="flex flex-col gap-2">
              <span>카테고리 이름을 입력해줘.</span>
              <input
                type="text"
                className="input input-bordered input-sm focus:outline-none"
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
            <div className="modal-action">
              <form method="dialog">
                <div className="flex gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={createCategoryFromServer}
                  >
                    확인
                  </button>
                  <button className="btn">취소</button>
                </div>
              </form>
            </div>
          </div>
        </dialog>
        <DialogModalTwoButton
          title={"포스트하기"}
          body={"내가 쓴 글을 이제 모두에게 보여줄까?"}
          confirmButtonColor="btn-primary"
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
          onClick={() => router.push("/posts")}
          doneButtonText={"확인"}
          ref={postSuccessModalRef}
        />
      </div>
    </EditorContext.Provider>
  );
}
