"use client";

import { Code, Password, User } from "@carbon/icons-react";
import { useForm } from "react-hook-form";
import { postSignup } from "./action";
import { signupDto } from "@/app/_dto/signup.dto";
import { useState } from "react";

export default function Signup() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signupDto>();

  const onSubmit = async (data: signupDto) => {
    setLoading(true);
    try {
      const hashedPayload = await postSignup(data);
      await fetch("/api/web/signup", {
        method: "POST",
        body: JSON.stringify(hashedPayload),
      }).then(() => setLoading(false));
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="w-full desktop:w-[90%] flex flex-col items-center p-6">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <span>회원가입</span>
        <label className="input flex items-center gap-2">
          <div className="border-b border-b-black flex items-center">
            <Code />{" "}
            <input
              {...register("invitationCode", { required: true })}
              type="text"
              className={`input ${errors.invitationCode && "input-error"}`}
              placeholder="초대코드"
            />
          </div>
        </label>
        <label className="input flex items-center gap-2">
          <div className="border-b border-b-black flex items-center">
            <User />
            <input
              {...register("id", { required: true })}
              type="text"
              className={`input ${errors.id && "input-error"}`}
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
              className={`input ${errors.password && "input-error"}`}
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
    </div>
  );
}
