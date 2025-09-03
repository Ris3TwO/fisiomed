import { PUBLIC_BACKEND_URL, PUBLIC_BACKEND_API_URL } from "astro:env/client";
import type { GetCategoriesResponse } from "../../types/wp";

const API_URL = `${PUBLIC_BACKEND_URL}${PUBLIC_BACKEND_API_URL}`;

export const getPosts = async (
  first = 100,
  language: string | null = null,
  after: string | null = null
) => {
  const query = `
    query GetPosts($first: Int!, $language: LanguageCodeFilterEnum, $after: String) {
      posts(first: $first, where: { language: $language }, after: $after) {
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
            date
            title
            content
            categories {
              nodes {
                name
                slug
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

  if (language) {
    variables.language = language;
  }

  if (after) {
    variables.after = after;
  }

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
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const response = await res.json();

  if (response.errors) {
    console.error("GraphQL errors:", response.errors);
    throw new Error("GraphQL query failed: " + response.errors[0].message);
  }

  return response.data.posts;
};

export const getPostById = async (id: string) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `
        query GetPostById($id: ID!) {
          post(id: $id, idType: DATABASE_ID) {
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
        id: id,
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

export const getCategories = async (
  first = 100,
  language: string | null = null,
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

  if (language) {
    variables.language = language;
  }

  if (after) {
    variables.after = after;
  }

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
