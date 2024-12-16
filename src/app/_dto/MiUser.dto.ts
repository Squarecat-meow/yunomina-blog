export interface MiUserDto {
  id: string;
  name: string;
  username: string;
  host: string;
  approved: boolean;
  avatarUrl: string | null;
  instance: {
    name: string | null;
    softwareName: string | null;
  };
}
