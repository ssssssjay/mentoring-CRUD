import type { BlogData } from "./Blog";

type CommonResponse = {
  state: boolean;
  message: string;
};

type LoginResponse = CommonResponse & {
  accessToken: string;
  loginId: string;
};

type BlogDetailResponse = CommonResponse & {
  blogData: BlogData;
};

type BlogUpdateResponse = CommonResponse & {
  blog_id: string;
};

type BlogInsertResponse = CommonResponse & {
  blog_id: number;
};

type BlogListResponse = CommonResponse & {
  blogList: BlogData[];
  blogCount: number;
};

export type {
  CommonResponse,
  LoginResponse,
  BlogDetailResponse,
  BlogUpdateResponse,
  BlogInsertResponse,
  BlogListResponse,
};
