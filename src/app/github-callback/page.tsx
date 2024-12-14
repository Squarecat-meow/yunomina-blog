"use client";

import { useCallback, useEffect } from "react";
import { GithubProfileDto } from "../_dto/replyGithubProfile.dto";

export default function GithubCallback({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const fn = useCallback(async () => {
    const params = await searchParams;

    const res = await fetch(`/api/web/github-login?code=${params.code}`);

    return await res.json();
  }, [searchParams]);

  useEffect(() => {
    fn().then((r) => {
      console.log(r);

      const ev = new CustomEvent<GithubProfileDto>("github-login", {
        detail: r,
      });

      window.opener.dispatchEvent(ev);
      window.close();
    });
  }, [fn]);

  return <div>히히</div>;
}
