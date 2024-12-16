export interface FormDataDto {
  avatar: File | string;
  userId: string;
  nickname: string | null;
  sentences: string | null;
  introduce: string | null;
}

export interface ProfileDto {
  id: number;
  userId: string;
  nickname: string | null;
  sentences: string | null;
  introduce: string | null;
  avatarUrl?: string | null;
}
