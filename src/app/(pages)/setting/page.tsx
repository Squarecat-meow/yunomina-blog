"use client";

import { useEffect, useRef, useState } from "react";
import AvatarCrop from "./_Avatar/page";
import SettingForm from "./_form";
import { ProfileDto } from "@/app/_dto/profile.dto";

export default function Setting() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<ProfileDto>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarCropModal = useRef<HTMLDialogElement>(null);
  const profileUpdateCompleteModalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const parsedProfile = JSON.parse(localStorage.getItem("profile") ?? "");
    setProfile(parsedProfile);
    setAvatar(parsedProfile.avatarUrl);
  }, []);

  return (
    <div className="w-full desktop:w-[90%] p-6 flex justify-center">
      {profile ? (
        <SettingForm
          profile={profile}
          avatar={avatar}
          setAvatar={setAvatar}
          setLoading={setLoading}
          refs={[fileInputRef, avatarCropModal, profileUpdateCompleteModalRef]}
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
