"use client";

import { useCallback, useEffect, useState } from "react";
import { MisskeyHandle } from "./(pages)/setting/page";
import MisskeyTimeline from "./_components/misskey/timeline";

export default function Home() {
  const [misskeyHandle, setMisskeyHandle] = useState<MisskeyHandle>({
    streamingLeftHandle: null,
    streamingRightHandle: null,
  });

  const fetchHandle = useCallback(() => {
    const data = localStorage.getItem("misskeyHandle");

    if (data) setMisskeyHandle(JSON.parse(data));
  }, []);

  useEffect(() => {
    fetchHandle();
  }, [fetchHandle]);

  return (
    <div className="w-full desktop:w-[90%] p-2 desktop:p-6">
      <div className="grid desktop:grid-cols-2">
        <div className="w-full flex flex-col items-center">
          <h1 className="font-extrabold text-5xl">놋치미나의 아늑한 집</h1>
          <p>
            이곳은 유놋치와 요즈미나의 아늑한 블로그에요. 각자가 쓴 글이
            올라오고 편하게 쉴 수 있는 곳이에요.
          </p>
        </div>
        <div className="w-full grid grid-cols-1 desktop:grid-cols-2 gap-2">
          <MisskeyTimeline handle={misskeyHandle.streamingLeftHandle ?? ""} />
          <MisskeyTimeline handle={misskeyHandle.streamingRightHandle ?? ""} />
        </div>
      </div>
    </div>
  );
}
