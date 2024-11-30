export interface PostDto {
  title: string;
  author: string;
  body: string;
}

export interface FrontmatterDto {
  title: string;
  author: string;
  avatarUrl: string;
  postDate: Date;
}
