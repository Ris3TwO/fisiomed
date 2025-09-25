import { LOCALES, type Locale } from "@/i18n/config";
import { PUBLIC_BACKEND_URL, PUBLIC_BACKEND_API_URL } from "astro:env/client";
import type { GetCategoriesResponse, WpPosts } from "@/types/wp";
import type { GetPostsByCategoriesResponse, PostNode } from "@/types/posts";

const API_URL = `${PUBLIC_BACKEND_URL}${PUBLIC_BACKEND_API_URL}`;

export const getPosts = async (
  first = 100,
  languages: Locale[] = LOCALES,
  after: string | null = null
) => {
  const query = `
    query GetPosts($first: Int!, $languages: [LanguageCodeEnum!], $after: String) {
      posts(first: $first, where: { languages: $languages }, after: $after) {
        edges {
          cursor
          node {
            postId
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            slug
            date
            title
            content
            categories {
              nodes {
                name
                slug
              }
            }
            excerpt
            language {
              code
              slug
            }
            author {
              node {
                name
                avatar {
                  url
                }
              }
            }
            additionalInformation {
              redactor
              showEditor
              corrector {
                edges {
                  node {
                    name
                    lastName
                    avatar {
                      url
                    }
                  }
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  const variables: {
    first: number;
    languages?: string[];
    after?: string;
  } = {
    first,
  };

  if (languages && languages.length > 0) {
    variables.languages = languages.map((lang) => lang.toUpperCase());
  }

  if (after) variables.after = after;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: query,
      variables: variables,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Response error:", errorText);
    throw new Error(`HTTP error! status`, { cause: res.status });
  }

  const response = await res.json();

  if (response.errors) {
    console.error("GraphQL errors:", response.errors);
    throw new Error("GraphQL query failed: ", {
      cause: response.errors[0].message,
    });
  }

  return response.data.posts;
};

export const getCategories = async (
  first = 100,
  language: Locale | null = null,
  after: string | null = null
) => {
  const query = `
    query GetCategories($first: Int!, $language: LanguageCodeFilterEnum, $after: String) {
      categories(first: $first, where: { language: $language }, after: $after) {
        nodes {
          categoryId
          name
          slug
          categoryAdditionalData {
            image {
              node {
                sourceUrl(size: LARGE)
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  const variables: {
    first: number;
    language?: string;
    after?: string;
  } = {
    first,
  };

  if (language) variables.language = language.toUpperCase();

  if (after) variables.after = after;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: query,
      variables: variables,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HTTP error! status: ${res.status} - ${errorText}`);
  }

  const response = (await res.json()) as {
    data: GetCategoriesResponse;
    errors?: any[];
  };

  if (response.errors) {
    console.error("GraphQL errors:", response.errors);
    throw new Error("GraphQL query failed: " + response.errors[0].message);
  }

  return response.data.categories;
};

export const getPostBySlug = async (slug: string) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `
        query GetPostBySlug($slug: ID!) {
          post(id: $slug, idType: SLUG) {
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            date
            title
            content
            categories {
              nodes {
                name
                slug
              }
            }
            language {
              slug
            }
            additionalInformation {
              showEditor
              redactor
              corrector {
                edges {
                  node {
                    name
                  }
                }
              }
            }
            author {
              node {
                name
                avatar {
                  url
                }
              }
            }
          }
        }
      `,
      variables: {
        slug,
      },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Response error:", errorText);
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const response = await res.json();

  if (response.errors) {
    console.error("GraphQL errors:", response.errors);
    throw new Error("GraphQL query failed: " + response.errors[0].message);
  }

  return response.data.post;
};

export const getPostsByCategorySlug = async (
  slug: string,
  first = 10,
  after: string | null = null,
  language: Locale | null = null
) => {
  const query = `
    query GetPostsByCategorySlug($slug: String!, $language: LanguageCodeFilterEnum!, $first: Int!, $after: String) {
  categories(where: {slug: [$slug], language: $language}) {
    nodes {
      posts(first: $first, after: $after) {
        nodes {
          postId
          title
          slug
          date
          excerpt
          featuredImage {
            node {
              sourceUrl(size: LARGE)
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
}
  `;

  const variables = {
    slug: slug,
    first,
    after,
    language,
  };

  if (language) variables.language = language.toUpperCase();

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HTTP error! status: ${res.status} - ${errorText}`);
  }

  const response = (await res.json()) as {
    data: GetPostsByCategoriesResponse;
    errors?: any[];
  };

  if (response.errors) {
    console.error("GraphQL errors:", response.errors);
    throw new Error("GraphQL query failed: " + response.errors[0].message);
  }

  const categoryNode = response.data.categories?.nodes[0];

  return categoryNode
    ? categoryNode.posts
    : { nodes: [], pageInfo: { hasNextPage: false, endCursor: null } };
};

export const getAllPosts = async (lang: Locale): Promise<PostNode[]> => {
  let allPosts: PostNode[] = [];
  let hasNextPage = true;
  let afterCursor: string | null = null;

  while (hasNextPage) {
    try {
      const data: WpPosts = await getPosts(100, [lang], afterCursor);

      if (data?.edges) {
        allPosts.push(...data.edges.map((edge) => edge.node));
        hasNextPage = data.pageInfo.hasNextPage;
        afterCursor = data.pageInfo.endCursor;
      } else {
        hasNextPage = false;
      }
    } catch (error) {
      console.error("Error durante el fetching en getAllPosts:", error);
      hasNextPage = false;
    }
  }

  return allPosts;
};
