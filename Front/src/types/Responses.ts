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
  isRenew: boolean;
  accessToken: string;
};

type BlogInsertResponse = CommonResponse & {
  blog_id: number;
  isRenew: boolean;
  accessToken: string;
};

type BlogListResponse = CommonResponse & {
  blogList: BlogData[];
  blogCount: number;
};

type BlogDeleteResponse = CommonResponse & {
  isRenew: boolean;
  accessToken: string;
};

export type {
  CommonResponse,
  LoginResponse,
  BlogDetailResponse,
  BlogUpdateResponse,
  BlogInsertResponse,
  BlogListResponse,
  BlogDeleteResponse,
};
