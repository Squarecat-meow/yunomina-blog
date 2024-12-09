import { emojis } from "@prisma/client";
import { ReactNode, useCallback, useEffect, useState } from "react";

type MiNameProps = {
  name: string;
  host: string | null;
  instanceType: string;
  size: number;
};

export default function MiName({
  name,
  host,
  instanceType,
  size,
}: MiNameProps) {
  const [keomojiArray, setKeomojiArray] = useState<ReactNode[]>();

  const fetchKeomoji = async (inputName: string) => {
    const keomojiRegex = new RegExp(/(?<=\:)[\w]+(?=\:)/g);
    const keomoji = inputName.match(keomojiRegex);
    const nameRegex = new RegExp(/(:.*?:)|([^:]+)/g);
    const nameArray = Array.from(inputName.matchAll(nameRegex))
      .map((match) => match[0].trim())
      .filter((item) => item !== "");
    let resultArray: ReactNode[] = [];

    if (!keomoji || instanceType === "mastodon") {
      resultArray.push(<span>{inputName}</span>);
      return resultArray;
    } else {
      const promises = keomoji.map((moji) =>
        fetch(`https://${host ?? "serafuku.moe"}/api/emoji`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: moji }),
        })
      );
      const res = await Promise.all(promises);
      const data = await Promise.all(
        res.map((res) => res.json() as unknown as emojis)
      );

      let i = 0;
      for (const item of nameArray) {
        if (keomojiRegex.test(item) === true) {
          resultArray.push(
            <img src={data[i].url} alt={data[i].name} className={`h-${size}`} />
          );
          i++;
        } else {
          resultArray.push(<span>{item}</span>);
        }
      }

      return resultArray;
    }
  };

  useEffect(() => {
    fetchKeomoji(name).then((r) => setKeomojiArray(r));
  }, [name]);

  return (
    <div className="flex items-center">
      {keomojiArray && keomojiArray.map((el, key) => <div key={key}>{el}</div>)}
    </div>
  );
}
