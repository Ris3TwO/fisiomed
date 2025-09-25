import type { Locale } from "@/i18n/config";
import { getCategories, getPostsByCategorySlug } from "@/services/wordpress/wp";

export async function generateCategoryPaths(lang: Locale) {
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

    const pagesForCategory = [];

    if (allPosts.length === 0) {
      const emptyProps = {
        categoryName: category.name,
        posts: [],
        currentPage: 1,
        totalPages: 1,
      };

      pagesForCategory.push({
        params: { slug: category.slug, lang, page: undefined },
        props: emptyProps,
      });
      return pagesForCategory;
    }

    const totalPages = Math.ceil(allPosts.length / pageSize);

    for (let i = 0; i < totalPages; i++) {
      const currentPage = i + 1;
      const postsForPage = allPosts.slice(i * pageSize, (i + 1) * pageSize);
      const pageProps = {
        categoryName: category.name,
        posts: postsForPage,
        currentPage,
        totalPages,
      };

      pagesForCategory.push({
        params: { slug: category.slug, lang, page: currentPage.toString() },
        props: pageProps,
      });

      if (currentPage === 1) {
        pagesForCategory.push({
          params: { slug: category.slug, lang, page: undefined },
          props: pageProps,
        });
      }
    }
    return pagesForCategory;
  });

  const pagesForAllCategories = await Promise.all(promises);

  return pagesForAllCategories.flat();
}
