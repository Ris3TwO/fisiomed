export interface WpPosts {
  node: WpPost
}

export interface WpPost {
  postId: string;
  featuredImage: FeaturedImage;
  date: string; // ISO 8601 format
  title: string;
  content: string; // HTML content
  categories: {
    nodes: Category[];
  };
  language: {
    slug: string;
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
