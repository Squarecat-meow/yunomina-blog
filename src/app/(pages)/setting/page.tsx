"use client";

import { Camera } from "@carbon/icons-react";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import AvatarCrop from "./_Avatar/page";
import { useForm } from "react-hook-form";
import { ProfileDto } from "@/app/_dto/profile.dto";

type FormValue = {
  nickname: string;
  sentences: string;
  introduce: string;
};

export default function Setting() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<ProfileDto | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarCropModal = useRef<HTMLDialogElement>(null);
  const profileUpdateCompleteModalRef = useRef<HTMLDialogElement>(null);

  const { register, handleSubmit } = useForm<FormValue>({ mode: "onBlur" });

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
    setLoading(true);
    profileUpdateCompleteModalRef.current?.showModal();
    const formData = new FormData();
    try {
      if (profile) {
        if (avatar) {
          // 아바타 사진을 블롭으로 바꿈
          const blob = await fetch(avatar).then((r) => r.blob());
          // 멀티파트 폼 데이터로 변환
          formData.append("avatar", blob);
          formData.append("userId", profile?.userId);
          formData.append("settings", JSON.stringify(data));
          const res = await fetch("/api/web/setting", {
            method: "POST",
            body: formData,
          });
          if (!res.ok) {
            throw new Error(`저장하는데 실패했어요! ${await res.text()}`);
          }

          const result = await res.json();
          const updatedProfile = {
            userId: profile?.userId,
            ...data,
            ...result,
          };
          localStorage.setItem("profile", JSON.stringify(updatedProfile));
          document.dispatchEvent(
            new CustomEvent("avatar", {
              detail: { avatarUrl: result.avatarUrl },
              bubbles: true,
            })
          );
          setLoading(false);
        } else {
          formData.append("avatar", "");
          formData.append("settings", JSON.stringify(data));
          const res = await fetch("/api/web/setting", {
            method: "POST",
            body: formData,
          });
          if (!res.ok) {
            throw new Error(`저장하는데 실패했어요! ${await res.text()}`);
          }
          const updatedProfile = {
            userId: profile?.userId,
            avatarUrl: null,
            ...data,
          };

          localStorage.setItem("profile", JSON.stringify(updatedProfile));
          document.dispatchEvent(
            new CustomEvent("avatar", {
              detail: { avatarUrl: null },
              bubbles: true,
            })
          );
          setLoading(false);
        }
      } else {
        throw new Error("LocalStorage에 프로필이 없어요!");
      }
      // 아바타 사진이 들어있으면?
    } catch (err) {
      setLoading(false);
      profileUpdateCompleteModalRef.current?.close();
      alert(err);
    }
  };

  useEffect(() => {
    const localProfile = localStorage.getItem("profile");
    if (localProfile) {
      const profileData = JSON.parse(localProfile) as ProfileDto;
      setProfile(profileData);
      setAvatar(profileData.avatarUrl);
    }
  }, []);

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
                    style={{ aspectRatio: 1, objectFit: "cover" }}
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
              <label className="flex flex-col mt-2">
                <span className="ml-4 mb-4">자기소개</span>
                <textarea
                  {...register("introduce")}
                  className="textarea textarea-bordered border-black h-36"
                  style={{ resize: "none" }}
                />
              </label>
            </div>
            <div className="flex justify-end mt-2">
              <button type="submit" className="btn btn-outline btn-lg">
                저장
              </button>
            </div>
          </form>
        </div>
      </div>
      <dialog ref={avatarCropModal} className="modal">
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
      <dialog ref={profileUpdateCompleteModalRef} className="modal">
        <div className="modal-box">
          <p className="py-4">
            {loading ? "업데이트 하는 중..." : "프로필 업데이트 끝~!"}
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button
                className={`btn ${loading ? "btn-disabled" : "btn-outline"}`}
              >
                <span className={`${loading && "loading loading-spinner"}`}>
                  {!loading && "닫기"}
                </span>
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
