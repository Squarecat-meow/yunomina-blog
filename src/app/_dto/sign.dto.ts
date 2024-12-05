import { IsString } from "class-validator";

export class signDto {
  @IsString()
  userId: string;

  @IsString()
  password: string;

  @IsString()
  invitationCode: string;
}
