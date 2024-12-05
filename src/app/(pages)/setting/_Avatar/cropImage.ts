import { Area } from "react-easy-crop";

export type CropImageProps = {
  imageUrl: string;
  croppedAreaPixels: Area | undefined;
  rotation: number;
  flip: { horizontal: boolean; vertical: boolean };
};

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const image = new Image();
    image.onload = () => res(image);
    image.onerror = (err) => rej(err);
    image.src = url;
  });
}

function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

export async function cropImage({
  imageUrl,
  croppedAreaPixels,
  rotation,
  flip,
}: CropImageProps): Promise<string | undefined> {
  const image = await createImage(imageUrl);
  return new Promise((res, rej) => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!croppedAreaPixels) throw new Error("Canvas에 에러 발생!");
      if (!ctx) throw new Error("Canvas에 에러 발생!");

      const rotRad = getRadianAngle(rotation);

      const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
        image.width,
        image.height,
        rotation
      );

      canvas.width = bBoxWidth;
      canvas.height = bBoxHeight;

      ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
      ctx.rotate(rotRad);
      ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
      ctx.translate(-image.width / 2, -image.height / 2);

      ctx.drawImage(image, 0, 0);

      const croppedCanvas = document.createElement("canvas");
      const croppedCtx = croppedCanvas.getContext("2d");

      if (!croppedCtx) throw new Error("Canvas에 에러 발생!");

      croppedCanvas.width = croppedAreaPixels.width;
      croppedCanvas.height = croppedAreaPixels.height;

      croppedCtx.drawImage(
        canvas,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      croppedCanvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          res(url);
        } else {
          throw new Error("이미지 URL 변환 실패!");
        }
      });
    } catch (err) {
      rej(err);
    }
  });
}
