"use client";

import { Password, User } from "@carbon/icons-react";
import { useForm } from "react-hook-form";

interface loginInputs {
  id: string;
  password: string;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginInputs>();

  const onSubmit = (data: loginInputs) => {
    console.log(data);
  };
  return (
    <div className="w-full desktop:w-[90%] flex justify-center p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full desktop:w-[24rem]"
      >
        <span>관리자 로그인</span>
        <label className="input flex items-center gap-2">
          <div className="border-b border-b-black flex items-center">
            <User />
            <input
              {...register("id", { required: true })}
              type="text"
              className={`input w-full ${
                errors.id && "input-bordered input-error"
              }`}
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
              className={`input w-full ${
                errors.id && "input-bordered input-error"
              }`}
              placeholder="비밀번호"
            />
          </div>
        </label>
        <button type="submit" className="btn btn-outline">
          로그인
        </button>
      </form>
    </div>
  );
}
