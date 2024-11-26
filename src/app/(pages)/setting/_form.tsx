"use client";

import {
  ProfileWithAvatarDto,
  ProfileWithoutAvatarDto,
} from "@/app/_dto/profile.dto";
import { Camera } from "@carbon/icons-react";
import Image from "next/image";
import {
  ChangeEvent,
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useMemo,
} from "react";
import { useForm } from "react-hook-form";

type FormValue = {
  profile: ProfileWithoutAvatarDto;
  avatar: string | null;
  setAvatar: Dispatch<SetStateAction<string | null>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  refs: [
    fileInputRef: RefObject<HTMLInputElement>,
    avatarCropModal: RefObject<HTMLDialogElement>,
    profileUpdateCompleteModalRef: RefObject<HTMLDialogElement>
  ];
};

function destructFormValue<T>(t: T) {
  const tempArray = [];
  for (const k in t) {
    tempArray.push([k, t[k]]);
  }
  const newObject: Record<string, string> = Object.fromEntries(tempArray);

  return newObject;
}

export default function SettingForm({
  profile,
  avatar,
  setAvatar,
  setLoading,
  refs: [fileInputRef, avatarCropModal, profileUpdateCompleteModalRef],
}: FormValue) {
  const { register, handleSubmit, reset } = useForm<ProfileWithoutAvatarDto>({
    mode: "onBlur",
    defaultValues: useMemo(() => {
      return profile;
    }, [profile]),
  });

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

  const onSubmit = async (data: ProfileWithoutAvatarDto) => {
    setLoading(true);
    profileUpdateCompleteModalRef.current?.showModal();
    const formData = new FormData();
    try {
      if (profile) {
        if (avatar) {
          // 아바타 사진을 블롭으로 바꿈
          const blob = await fetch(avatar).then((r) => r.blob());
          // 멀티파트 폼 데이터로 변환
          const newData = destructFormValue(data);
          formData.append("avatar", blob);
          formData.append("userId", profile?.userId);
          for (const k in newData) {
            formData.append(k, newData[k]);
          }
          const res = await fetch("/api/web/setting", {
            method: "POST",
            body: formData,
          });
          if (!res.ok) {
            throw new Error(`저장하는데 실패했어요! ${await res.text()}`);
          }

          const result = await res.json();
          const updatedProfileWithAvatar: ProfileWithAvatarDto = {
            ...data,
            avatarUrl: result.avatarUrl,
          };
          localStorage.setItem(
            "profile",
            JSON.stringify(updatedProfileWithAvatar)
          );
          window.dispatchEvent(
            new CustomEvent("profile", {
              bubbles: true,
            })
          );
          setLoading(false);
        } else {
          // 멀티파트 폼 데이터로 변환
          const newData = destructFormValue(data);
          formData.append("avatar", "");
          formData.append("userId", profile?.userId);
          for (const k in newData) {
            formData.append(k, newData[k]);
          }
          const res = await fetch("/api/web/setting", {
            method: "POST",
            body: formData,
          });
          if (!res.ok) {
            throw new Error(`저장하는데 실패했어요! ${await res.text()}`);
          }
          const updatedProfileWithoutAvatar: ProfileWithAvatarDto = {
            ...data,
            avatarUrl: null,
          };

          localStorage.setItem(
            "profile",
            JSON.stringify(updatedProfileWithoutAvatar)
          );
          window.dispatchEvent(
            new CustomEvent("profile", {
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
    reset(profile);
  }, [profile]);
  return (
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
  );
}
