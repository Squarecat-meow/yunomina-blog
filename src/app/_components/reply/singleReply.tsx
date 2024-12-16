"use client";

import { reply } from "@prisma/client";
import { CompileMDXResult } from "next-mdx-remote/rsc";
import { Reply as CarbonReply, TrashCan } from "@carbon/icons-react";
import { GithubProfileDto } from "@/app/_dto/replyGithubProfile.dto";
import { useRef } from "react";
import DialogModalTwoButton from "../modalTwoButton";

export default function SingleReply({
  reply,
  replyKey,
  compiledReply,
  github,
}: {
  reply: reply;
  replyKey: number;
  compiledReply: CompileMDXResult<Record<string, unknown>>[];
  github: GithubProfileDto | null | undefined;
}) {
  const replyDeleteConfirmModalRef = useRef<HTMLDialogElement>(null);

  const handleDelete = async () => {
    const res = await fetch(`/api/web/post/reply?replyId=${reply.id}`, {
      method: "DELETE",
    });
    if (!res.ok) alert(await res.text());
    const ev = new CustomEvent("replyDelete");
    window.dispatchEvent(ev);
  };

  return (
    <>
      <div className="chat chat-start flex items-end">
        <div className="chat-image avatar h-16">
          <img
            src={reply.avatar ?? ""}
            alt="Github Profile"
            className="rounded-full"
          />
        </div>
        <div>
          <div className="chat-header">{reply.name}</div>
          <div className="chat-bubble flex items-center bg-base-100 text-slate-800 shadow prose">
            {compiledReply[replyKey].content}
          </div>
        </div>
        <div className="chat-footer flex gap-2">
          <CarbonReply />
          {github?.id === reply.githubId && (
            <TrashCan
              fill="red"
              onClick={() => replyDeleteConfirmModalRef.current?.showModal()}
            />
          )}
        </div>
      </div>
      <DialogModalTwoButton
        title={"댓글 지우기"}
        body={"정말로 댓글을 지울거야?"}
        confirmButtonColor={"btn-error"}
        confirmButtonText={"응"}
        cancelButtonText={"아니"}
        onClick={handleDelete}
        ref={replyDeleteConfirmModalRef}
      />
    </>
  );
}
