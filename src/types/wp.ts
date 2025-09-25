export interface WpPosts {
  edges: {
    node: WpPost;
    cursor: string;
  }[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
}

export interface WpPostEdge {
  node: WpPost;
  cursor: string;
}

export interface WpPost {
  postId: number;
  featuredImage: FeaturedImage;
  date: string; // ISO 8601 format
  title: string;
  content: string; // HTML content
  slug: string;
  categories: {
    nodes: Category[];
  };
  excerpt: string; // HTML excerpt
  language: {
    slug: string;
    code: string;
  };
  author: {
    node: Author;
  };
  additionalInformation: AdditionalInformation;
}

// Category node
export interface Category {
  name: string;
  slug: string;
}

// Author node
export interface Author {
  name: string;
  avatar: {
    url: string;
  };
}

// Extra info about the post
export interface AdditionalInformation {
  redactor: string | null;
  showEditor: boolean;
  corrector: string | null;
}

export interface FeaturedImage {
  node: {
    sourceUrl: string;
    altText: string;
  };
}

export interface WpCategory {
  categoryId: number;
  name: string;
  slug: string;
  categoryAdditionalData?: {
    image?: {
      node?: {
        sourceUrl: string;
      };
    };
  };
}

export interface WpCategoryEdge {
  nodes: WpCategory[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
}

export interface GetCategoriesResponse {
  categories: WpCategoryEdge;
}
