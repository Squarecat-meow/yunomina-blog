import Image from "next/image";
import minaSorry from "../../public/mina_sorry.webp";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-2">
      <Image
        src={minaSorry}
        alt="mina Sorry"
        width={100}
        height={100}
        style={{ aspectRatio: 1 }}
      />
      <span className="text-xl font-bold">페이지를 찾을 수 없어요!</span>
      <Link href="/posts">
        <span className="link">포스트로 돌아가기</span>
      </Link>
    </div>
  );
}
