import type { Locale } from "@/i18n/config";

export interface PostsProps {
  lang: Locale;
}

interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

interface FeaturedImage {
  node: {
    sourceUrl: string;
  };
}

export interface PostNode {
  postId: number;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  featuredImage: FeaturedImage | null;
}

export interface PostsConnection {
  nodes: PostNode[];
  pageInfo: PageInfo;
}

interface Category {
  name: string;
  posts: PostsConnection;
}

export interface GetPostsByCategoriesResponse {
  categories: {
    nodes: Category[];
  };
}
