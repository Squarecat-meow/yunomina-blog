import { GetPrismaClient } from "@/utils/getPrismaClient/getPrismaClient";
import { FavoriteFilled } from "@carbon/icons-react";
import Image from "next/image";

const prisma = GetPrismaClient.getClient();
const fetchProfile = async (userId: string) => {
  const userProfile = await prisma.profile.findUnique({
    where: {
      userId: userId,
    },
  });
  return userProfile;
};

export default async function About() {
  const yozuminaProfile = await fetchProfile("Yozumina");
  const yunochiProfile = await fetchProfile("yunochi");

  return (
    <div className="w-full flex flex-col items-center">
      <span className="m-8 italic text-xl">
        "이 곳은 놋치와 미나가 편하게 쉬고 글을 쓰는 아늑한 집이에요. 방문하신
        분도 편하게 쉬시고 저희가 쓴 글도 보시고 가끔은 커피도 내려드릴게요."
      </span>
      <div className="w-full grid grid-cols-[47.5%_5%_47.5%]">
        <div className="flex flex-col items-center gap-2">
          {yunochiProfile?.avatarUrl ? (
            <Image
              src={yunochiProfile.avatarUrl}
              alt="Yozumina Profile"
              width={200}
              height={200}
              className="rounded-full"
            />
          ) : (
            <div className="w-[200px] h-[200px] flex justify-center bg-base-300 rounded-full">
              <span className="text-[10rem]">
                {yunochiProfile?.userId.substring(0, 1)}
              </span>
            </div>
          )}
          <span className="italic">{yunochiProfile?.sentences}</span>
          <span className="text-3xl">저는 {yunochiProfile?.nickname}에요.</span>
          <p>{yunochiProfile?.introduce}</p>
        </div>
        <div className="flex justify-center items-center">
          <FavoriteFilled className="fill-red-500" size={50} />
        </div>
        <div className="flex flex-col items-center gap-2">
          {yozuminaProfile?.avatarUrl ? (
            <Image
              src={yozuminaProfile.avatarUrl}
              alt="Yozumina Profile"
              width={200}
              height={200}
              className="rounded-full"
            />
          ) : (
            <div className="w-[200px] h-[200px] flex justify-center bg-base-300 rounded-full">
              <span className="text-[10rem]">
                {yozuminaProfile?.userId.substring(0, 1)}
              </span>
            </div>
          )}
          <span className="italic">{yozuminaProfile?.sentences}</span>
          <span className="text-3xl">
            저는 {yozuminaProfile?.nickname}에요.
          </span>
          <p>{yozuminaProfile?.introduce}</p>
        </div>
      </div>
    </div>
  );
}
