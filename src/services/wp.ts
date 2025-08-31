// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import type { GetCategoriesResponse } from "../types/wp";

const API_URL = import.meta.env.BACKEND_API_URL;

export const getPosts = async (first = 100) => {
  const query = `
    query GetPosts($first: Int!) {
      posts(first: $first) {
        edges {
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
      }
    }
  `;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: query,
      variables: {
        first: first,
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

  return response.data.posts.edges;
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

export const getCategories = async () => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `
        query GetCategories {
          categories {
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
          }
        }
      `,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HTTP error! status: ${res.status} - ${errorText}`);
  }

  const response = (await res.json()) as { data: GetCategoriesResponse; errors?: any[] };

  if (response.errors) {
    console.error("GraphQL errors:", response.errors);
    throw new Error("GraphQL query failed: " + response.errors[0].message);
  }

  return response.data.categories.nodes;
};
