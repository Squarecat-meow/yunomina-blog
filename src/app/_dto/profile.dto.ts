export interface FormDataDto {
  avatar: File | string;
  userId: string;
  nickname: string | null;
  sentences: string | null;
  introduce: string | null;
}

export interface ProfileWithoutAvatarDto {
  id: number;
  userId: string;
  nickname: string | null;
  sentences: string | null;
  introduce: string | null;
}

export interface ProfileWithAvatarDto extends ProfileWithoutAvatarDto {
  avatarUrl: string | null;
}
