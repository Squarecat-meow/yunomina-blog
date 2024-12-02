import { category } from "@prisma/client";

export interface PostDto {
  title: string;
  category: category;
  author: string;
  body: string;
}

export interface FrontmatterDto {
  title: string;
  userId: string;
  author: string;
  category: string;
  postDate: Date;
}
