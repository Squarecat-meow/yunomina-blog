"use client";

import {
  ChangeEvent,
  Dispatch,
  RefObject,
  SetStateAction,
  useState,
} from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import { cropImage, CropImageProps } from "./cropImage";

type avatarProps = {
  avatar: string;
  setter: Dispatch<SetStateAction<string | null>>;
  ref: RefObject<HTMLDialogElement>;
};

export default function AvatarCrop({ avatar, setter, ref }: avatarProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();
  const [finalImage, setFinalImage] = useState<string>();

  const onZoomSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    setZoom(parseInt(e.target.value));
  };

  const handleCancel = () => {
    setter(finalImage ?? null);
    ref.current?.close();
  };

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const completeCrop = async () => {
    const cropImagePayload: CropImageProps = {
      imageUrl: avatar,
      croppedAreaPixels: croppedAreaPixels,
      rotation: 0,
      flip: {
        horizontal: false,
        vertical: false,
      },
    };
    if (finalImage) {
      URL.revokeObjectURL(finalImage);
      const newUrl = await cropImage(cropImagePayload);
      setFinalImage(newUrl);
      setter(newUrl ?? null);
    } else {
      const newUrl = await cropImage(cropImagePayload);
      setFinalImage(newUrl);
      setter(newUrl ?? null);
    }
    ref.current?.close();
  };

  return (
    <div>
      {avatar && (
        <div className="flex flex-col gap-4">
          <div className="relative h-[24rem]">
            <Cropper
              image={avatar}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              cropSize={{ width: 300, height: 300 }}
              showGrid={false}
              objectFit="contain"
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span>확대</span>
            <input
              type="range"
              min="1"
              max="5"
              defaultValue="1"
              className="range"
              step="1"
              onChange={onZoomSliderChange}
            />
          </div>
          <div className="w-full grid grid-cols-2 gap-2">
            <button
              className="btn btn-outline btn-primary"
              onClick={completeCrop}
            >
              자르기
            </button>
            <button className="w-full btn btn-outline" onClick={handleCancel}>
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
