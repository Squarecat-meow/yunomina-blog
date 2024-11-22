"use client";

import { Camera } from "@carbon/icons-react";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";

export default function Setting() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputClick = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return setAvatar(null);
    const file = e.target.files[0];
    const fileInternalUrl = URL.createObjectURL(file);
    setAvatar(fileInternalUrl);
  };

  return (
    <div className="w-full desktop:w-[90%] p-6 flex justify-center">
      <div className="flex flex-col items-center gap-4">
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
            ref={fileInputRef}
            onChange={handleChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
