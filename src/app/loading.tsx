import Image from "next/image";
import yunoLoading from "../../public/yuno_loading.webp";

export default function Loading() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Image
        src={yunoLoading}
        alt="yuno loading"
        width={100}
        height={100}
        style={{ aspectRatio: 1 }}
      />
      <span>로딩중...</span>
    </div>
  );
}
