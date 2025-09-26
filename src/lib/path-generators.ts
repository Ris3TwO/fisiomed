import type { Locale } from "@/i18n/config";
import { getCategories, getPostsByCategorySlug } from "@/services/wordpress/wp";
import type { PaginateFunction } from "astro";

export async function generateCategoryPaths(
  lang: Locale,
  paginate: PaginateFunction
) {
  const pageSize = 10;
  const { nodes: categories } = await getCategories(100, lang);

  const promises = categories.map(async (category) => {
    if (!category.slug) return [];

    const { nodes: allPosts } = await getPostsByCategorySlug(
      category.slug,
      1000,
      null,
      lang
    );

    if (allPosts.length === 0) {
      return [
        {
          params: { slug: category.slug, lang },
          props: {
            categoryName: category.name,

            page: {
              data: [],
              currentPage: 1,
              lastPage: 1,
              total: 0,
            },
          },
        },
      ];
    }

    const paginatedRoutes = paginate(allPosts, {
      pageSize: pageSize,
      params: { slug: category.slug, lang },
      props: { categoryName: category.name },
    });

    return paginatedRoutes;
  });

  const pagesForAllCategories = await Promise.all(promises);
  return pagesForAllCategories.flat();
}
