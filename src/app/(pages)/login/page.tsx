"use client";

import { fetchProfile } from "@/app/(pages)/login/action";
import { Password, User } from "@carbon/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

interface loginInputs {
  userId: string;
  password: string;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<loginInputs>({ mode: "onBlur" });
  const [loading, setLoading] = useState<boolean>(false);
  const loginFailModalRef = useRef<HTMLDialogElement>(null);

  const router = useRouter();

  const onSubmit = async (data: loginInputs) => {
    setLoading(true);
    const res = await fetch("/api/web/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    switch (res.status) {
      case 400:
        setError("userId", {
          type: "idNotFound",
          message: "아이디가 없습니다!",
        });
        break;
      case 401:
        setError("password", {
          type: "passwordNotMatch",
          message: "비밀번호가 다릅니다!",
        });
        break;
      case 500:
        loginFailModalRef.current?.showModal();
        break;
      default:
        const profile = await fetchProfile(data.userId);
        if (profile) {
          localStorage.setItem("profile", JSON.stringify(profile));
          window.dispatchEvent(
            new CustomEvent("profile", {
              bubbles: true,
            })
          );
          router.replace("/");
        } else {
          loginFailModalRef.current?.showModal();
          console.error("프로필 불러오기 실패");
        }
        break;
    }
  };

  return (
    <div className="w-full desktop:w-[90%] flex flex-col items-center p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full desktop:w-[24rem]"
      >
        <span>관리자 로그인</span>
        <label className="input flex items-center gap-2">
          <div className="border-b border-b-black flex flex-col items-center">
            {errors.userId && errors.userId.type === "idNotFound" && (
              <div
                className="tooltip tooltip-open tooltip-error"
                data-tip={errors.userId.message}
              />
            )}
            <div className="flex items-center">
              <User />
              <input
                {...register("userId", { required: true })}
                type="text"
                className={`input w-full ${
                  errors.userId && "input-bordered input-error"
                }`}
                placeholder="아이디"
              />
            </div>
          </div>
        </label>
        <label className="input flex items-center gap-2">
          <div className="border-b border-b-black flex flex-col items-center">
            {errors.password && errors.password.type === "passwordNotMatch" && (
              <div
                className="tooltip tooltip-open tooltip-error"
                data-tip={errors.password.message}
              />
            )}
            <div className="flex items-center">
              <Password />
              <input
                {...register("password", { required: true })}
                type="password"
                className={`input w-full ${
                  errors.password && "input-bordered input-error"
                }`}
                placeholder="비밀번호"
              />
            </div>
          </div>
        </label>
        <button
          type="submit"
          className={`btn btn-outline ${loading && "btn-disabled"}`}
        >
          {loading && <span className="loading loading-spinner" />}
          로그인
        </button>
      </form>
      <Link href={"/signup"} className="link text-sm mt-2">
        회원가입
      </Link>
      <dialog id="server_fault" ref={loginFailModalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">아이고!</h3>
          <p className="py-4">서버에 이상이 생겼나봐!</p>
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
