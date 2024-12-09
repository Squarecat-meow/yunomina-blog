"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AvatarCrop from "./_Avatar/page";
import ProfileSettingForm from "./profileSettingForm";
import { ProfileDto } from "@/app/_dto/profile.dto";
import DialogModalTwoButton from "@/app/_components/modalTwoButton";
import DialogModalLoadingOneButton from "@/app/_components/modalLoadingOneButton";

export type MisskeyHandle = {
  streamingLeftHandle: string | null;
  streamingRightHandle: string | null;
};

export default function Setting() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [emojiLoading, setEmojiLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<ProfileDto>();
  const [address, setAddress] = useState<string | null>(null);
  const [misskeyHandle, setMisskeyHandle] = useState<MisskeyHandle>({
    streamingLeftHandle: null,
    streamingRightHandle: null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarCropModal = useRef<HTMLDialogElement>(null);
  const profileUpdateCompleteModalRef = useRef<HTMLDialogElement>(null);
  const emojiImportModalRef = useRef<HTMLDialogElement>(null);
  const emojiImportLoadingModalRef = useRef<HTMLDialogElement>(null);

  const handleImportEmoji = async () => {
    setEmojiLoading(true);
    emojiImportLoadingModalRef.current?.showModal();
    const res = await fetch("/api/web/setting/emoji", {
      method: "POST",
      body: `https://${address}`,
    });
    localStorage.setItem("misskeyAddress", address ?? "");
    if (res.ok) setEmojiLoading(false);
  };

  const fetchSettingValues = useCallback(async () => {
    const parsedProfile = JSON.parse(localStorage.getItem("profile") ?? "");
    const misskeyAddress = localStorage.getItem("misskeyAddress") ?? "";
    const misskeyHandle = JSON.parse(
      localStorage.getItem("misskeyHandle") ?? "{}"
    );
    setProfile(parsedProfile);
    setAvatar(parsedProfile.avatarUrl);
    setAddress(misskeyAddress);
    setMisskeyHandle(misskeyHandle);
  }, []);

  useEffect(() => {
    fetchSettingValues();
  }, [fetchSettingValues]);

  return (
    <div className="w-full desktop:w-[90%] p-6 flex justify-center">
      {profile ? (
        <ProfileSettingForm
          address={address}
          profile={profile}
          avatar={avatar}
          setAvatar={setAvatar}
          setLoading={setLoading}
          setAddress={setAddress}
          refs={[
            fileInputRef,
            avatarCropModal,
            profileUpdateCompleteModalRef,
            emojiImportModalRef,
          ]}
        />
      ) : (
        <div className="w-full desktop:w-[90%] p-6 grid grid-cols-1 desktop:grid-cols-3">
          <div className="w-full col-span-1 desktop:col-span-2 flex justify-center">
            <span className="loading loading-spinner loading-lg" />
          </div>
        </div>
      )}
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
      <DialogModalLoadingOneButton
        isLoading={loading}
        title_loading={"프로필 업데이트"}
        title_done={"프로필 업데이트"}
        body_loading={"업데이트 하는 중..."}
        body_done={"프로필 업데이트 끝~!"}
        loadingButtonText={"로딩중"}
        doneButtonText={"닫기"}
        ref={profileUpdateCompleteModalRef}
      />
      <DialogModalTwoButton
        title={"커모지 수입"}
        body={
          "이 주소로 커모지를 수입해올까? \n전에 있던 커모지는 사라지고 새로 가져오게 돼!"
        }
        confirmButtonColor={"btn-warning"}
        confirmButtonText={"가보자고"}
        cancelButtonText={"잠깐!"}
        onClick={handleImportEmoji}
        ref={emojiImportModalRef}
      />
      <DialogModalLoadingOneButton
        isLoading={emojiLoading}
        title_loading={"커모지 수입"}
        title_done={"커모지 수입"}
        body_loading={"수입하는 중..."}
        body_done={"수입 끝~!"}
        loadingButtonText={"로딩중"}
        doneButtonText={"닫기"}
        ref={emojiImportLoadingModalRef}
      />
    </div>
  );
}
