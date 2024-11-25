"use client";

import { Camera } from "@carbon/icons-react";
import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";
import AvatarCrop from "./_Avatar/page";
import { useForm } from "react-hook-form";

type FormValue = {
  nickname: string;
  sentences: string;
  introduce: string;
};

export default function Setting() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarCropModal = useRef<HTMLDialogElement>(null);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValue>({ mode: "onBlur" });

  const handleInputClick = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return setAvatar(null);
    try {
      const file = e.target.files[0];
      const fileInternalUrl = URL.createObjectURL(file);
      setAvatar(fileInternalUrl);
    } catch (err) {
      alert(err);
    }

    if (!avatarCropModal.current) return;
    avatarCropModal.current.showModal();
  };

  const onSubmit = async (data: FormValue) => {
    const formData = new FormData();
    try {
      if (avatar) {
        const blob = await fetch(avatar).then((r) => r.blob());
        formData.append("avatar", blob);
        formData.append("settings", JSON.stringify(data));
        const res = await fetch("/api/web/setting", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          throw new Error(`저장하는데 실패했어요! ${await res.text()}`);
        }
      }
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="w-full desktop:w-[90%] p-6 flex justify-center">
      <div className="w-full grid grid-cols-1 desktop:grid-cols-3 gap-4">
        <div className="flex flex-col items-center gap-4 desktop:border-r">
          <span className="text-2xl">아바타 설정</span>
          <div className="w-48 h-48 flex justify-center items-center rounded-full border border-dashed border-slate-400">
            {avatar ? (
              <>
                <button className="w-44 h-44 btn btn-circle object-cover">
                  <Image
                    src={avatar}
                    alt="Selected Avatar"
                    width={176}
                    height={176}
                    style={{ objectFit: "contain" }}
                    className="rounded-full"
                    onClick={handleInputClick}
                  />
                </button>
              </>
            ) : (
              <>
                <button
                  className="w-44 h-44 flex flex-col justify-center items-center btn btn-circle btn-outline border-slate-400"
                  onClick={handleInputClick}
                >
                  <Camera size={32} />
                  <span>아바타 사진 올리기</span>
                </button>
              </>
            )}
            <input
              type="file"
              name="avatar"
              id="avatar"
              accept="image/jpeg, image/png"
              ref={fileInputRef}
              onChange={handleChange}
              className="hidden"
            />
          </div>
          <button className="btn btn-outline" onClick={() => setAvatar(null)}>
            아바타 초기화
          </button>
        </div>
        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full desktop:w-[24rem] flex flex-col gap-2"
          >
            <div className="border-b border-b-black">
              <label className="input flex items-center gap-2">
                닉네임
                <input
                  {...register("nickname", { required: true })}
                  type="text"
                  className="w-56 desktop:w-72"
                />
              </label>
            </div>
            <div className="border-b border-b-black">
              <label className="input flex items-center gap-2">
                한마디
                <input
                  {...register("sentences")}
                  type="text"
                  className="w-56 desktop:w-72"
                />
              </label>
            </div>
            <div>
              <label className="flex flex-col">
                <span className="ml-4 mb-2">자기소개</span>
                <textarea
                  {...register("introduce")}
                  className="textarea textarea-bordered border-black h-36"
                  style={{ resize: "none" }}
                />
              </label>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn btn-outline btn-lg">
                저장
              </button>
            </div>
          </form>
        </div>
      </div>
      <dialog ref={avatarCropModal} className="modal ">
        <div className="modal-box w-full desktop:w-[52rem]">
          {avatar && (
            <AvatarCrop
              avatar={avatar}
              setter={setAvatar}
              ref={avatarCropModal}
            />
          )}
        </div>
      </dialog>
    </div>
  );
}
