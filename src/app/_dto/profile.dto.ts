import { IsString, ValidateIf } from "class-validator";

export class ProfileDto {
  @IsString()
  id: number;

  @IsString()
  userId: string;

  @ValidateIf((o, v) => v !== null)
  @IsString()
  avatarUrl: string | null;
}
