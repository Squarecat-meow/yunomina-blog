import { IsNullable } from "@/utils/validator/isNullable";
import { IsString } from "class-validator";

export class DetailedProfileDto {
  @IsString()
  nickname: string;

  @IsNullable()
  @IsString()
  sentences: string | null;

  @IsNullable()
  @IsString()
  introduce: string | null;

  @IsNullable()
  @IsString()
  avatarUrl: string | null;
}
