"use client";

import { Code, Password, User } from "@carbon/icons-react";
import { useForm } from "react-hook-form";
import { postSignup } from "./action";
import { signDto } from "@/app/_dto/sign.dto";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const successModalRef = useRef<HTMLDialogElement>(null);
  const failedModalRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<signDto>({ mode: "onBlur" });

  const onValid = async (data: signDto) => {
    if (data.invitationCode !== process.env.NEXT_PUBLIC_INVITATION_CODE) {
      setError(
        "invitationCode",
        { type: "codeNotMatch", message: "초대코드가 일치하지 않습니다!" },
        { shouldFocus: true }
      );
    } else {
      try {
        setLoading(true);
        const hashedPayload = await postSignup(data);
        const res = await fetch("/api/web/signup", {
          method: "POST",
          body: JSON.stringify(hashedPayload),
        });
        if (!res.ok) {
          setLoading(false);
          failedModalRef.current?.showModal();
        } else {
          const profile = await res.json();
          setLoading(false);
          localStorage.setItem("profile", JSON.stringify(profile));
          successModalRef.current?.showModal();
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="w-full desktop:w-[90%] flex flex-col items-center p-6">
      <form
        className="flex flex-col gap-4 w-full desktop:w-[24rem]"
        onSubmit={handleSubmit(onValid)}
      >
        <span>회원가입</span>
        <label className="input flex items-center gap-2">
          <div className="border-b border-b-black flex flex-col items-center">
            {errors.invitationCode?.type === "codeNotMatch" && (
              <div
                className="tooltip tooltip-open tooltip-error"
                data-tip={errors.invitationCode.message}
              />
            )}
            <div className="flex items-center">
              <Code />
              <input
                {...register("invitationCode", { required: true })}
                type="text"
                className={`input w-full ${
                  errors.invitationCode && "input-error"
                }`}
                placeholder="초대코드"
              />
            </div>
          </div>
        </label>
        <label className="input flex items-center gap-2">
          <div className="border-b border-b-black flex items-center">
            <User />
            <input
              {...register("userId", { required: true })}
              type="text"
              className={`input w-full ${errors.userId && "input-error"}`}
              placeholder="아이디"
            />
          </div>
        </label>
        <label className="input flex items-center gap-2">
          <div className="border-b border-b-black flex items-center">
            <Password />
            <input
              {...register("password", { required: true })}
              type="password"
              className={`input w-full ${errors.password && "input-error"}`}
              placeholder="비밀번호"
            />
          </div>
        </label>
        <button type="submit" className="btn btn-outline">
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm" />
              가입중...
            </>
          ) : (
            <>
              <span>회원가입</span>
            </>
          )}
        </button>
      </form>
      <dialog id="signup_success" ref={successModalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">안녕!</h3>
          <p className="py-4">놋치미나의 아늑한 집에 잘 왔어!</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn" onClick={() => router.replace("/")}>
                시작해볼까?
              </button>
            </form>
          </div>
        </div>
      </dialog>
      <dialog id="signup_failed" ref={failedModalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">아이고!</h3>
          <p className="py-4">회원가입에 실패했어!</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">다시해볼까?</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
