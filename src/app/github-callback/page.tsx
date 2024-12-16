"use client";

import { useCallback, useEffect } from "react";
import { GithubProfileDto } from "../_dto/replyGithubProfile.dto";
import { useSearchParams } from "next/navigation";
import Loading from "../loading";

export default function GithubCallback() {
  const searchParams = useSearchParams();

  const code = searchParams.get("code");

  const fn = useCallback(async () => {
    const res = await fetch(`/api/web/github-login?code=${code}`);

    return await res.json();
  }, [code]);

  useEffect(() => {
    fn().then((r) => {
      const ev = new CustomEvent<GithubProfileDto>("github-login", {
        detail: r,
        bubbles: true,
      });

      window.opener.dispatchEvent(ev);
      window.close();
    });
  }, [fn]);

  return <Loading />;
}
