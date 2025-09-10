import { useEffect, useState } from "preact/hooks";
import { formatDate } from "@/lib";
import { getPosts } from "@/services/wordpress/wp";
import type { PostsProps, WpPostEdge } from "@/types";
import { getLangFromUrl, translations, useTranslations } from "@/i18n/utils";
import type React from "preact/compat";

const Posts: React.FC<PostsProps> = ({ postHeader }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<WpPostEdge[]>([]);
  const [t, setT] = useState(() =>
    useTranslations(getLangFromUrl(new URL(window.location.href)))
  );

  const getAllPosts = async (lang: keyof typeof translations) => {
    setIsLoading(true);
    try {
      const posts = await getPosts(6, [lang.toUpperCase()]);
      setPosts(posts.edges);
      setT(() => useTranslations(lang));
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPostExcerpt = (htmlString: string) => {
    return htmlString.replace(/<[^>]+>/g, "").slice(0, 100) + "...";
  };

  useEffect(() => {
    const currentLang = getLangFromUrl(new URL(window.location.href));
    getAllPosts(currentLang);

    const handleUrlChange = () => {
      const newLang = getLangFromUrl(new URL(window.location.href));
      getAllPosts(newLang);
    };

    window.addEventListener("popstate", handleUrlChange);
    return () => {
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, []);

  return (
    <div class="container mx-auto px-6 py-10 lg:px-0 lg:py-0">
      {/* Post Header */}
      {postHeader}

      {/* Post List */}
      <div class="mt-8 md:mt-20 flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 lg:gap-x-6 gap-y-8 mx-4 lg:mx-0">
        {isLoading &&
          Array.from({ length: 8 }).map(() => (
            <article
              class="col-span-2 sm:col-span-1 px-2 lg:px-4 py-4 bg-non-photo-blue-700 rounded-lg animate-pulse"
              slot="fallback"
            >
              <div class="w-full h-48 xl:h-54 rounded-lg bg-gray-300" />

              <div class="h-6 w-full rounded-lg bg-gray-300 mt-4" />

              <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2 mt-4">
                <div class="h-5 w-20 rounded-full bg-gray-300" />

                <div class="h-4 w-24 bg-gray-300" />
              </div>

              <div class="h-14 w-full rounded-lg bg-gray-300 mt-4" />
            </article>
          ))}

        {posts.length > 0 &&
          posts.map((post) => (
            <a
              href={`blog/${post.node.slug}`}
              key={post.node.postId}
              rel="noopener"
            >
              <article class="col-span-2 sm:col-span-1 px-2 lg:px-4 py-4 bg-non-photo-blue-700 rounded-lg hover:cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300">
                <img
                  src={
                    post.node.featuredImage.node.sourceUrl ||
                    `https://picsum.photos/400/400`
                  }
                  alt={`${post.node.title}`}
                  class="w-full h-48 xl:h-54 rounded-lg"
                  loading="lazy"
                  width="400"
                  height="400"
                />

                <h3 class="capitalize text-xl font-semibold mt-4 text-federal-blue-600">
                  {post.node.title}
                </h3>

                <div class="flex flex-col lg:flex-row lg:justify-between gap-2 mt-4">
                  <a
                    href={`blog/categories/${post.node.categories?.nodes[0].slug}`}
                  >
                    <span class="text-xs rounded-full px-2 py-1 bg-honolulu-blue-600 text-light-cyan-600 w-fit">
                      {post.node.categories?.nodes[0].name}
                    </span>
                  </a>
                  <div class="text-xs text-pacific-cyan-300 col-span-2 lg:col-span-1 flex items-center justify-start lg:justify-end">
                    <i class="ti ti-calendar-week" />
                    <span>{formatDate(post.node.date)}</span>
                  </div>
                </div>

                <div class="mt-4 text-sm">
                  {getPostExcerpt(post.node.excerpt)}
                </div>
              </article>
            </a>
          ))}

        {posts.length === 0 && !isLoading && (
          <div class="col-span-2 sm:col-span-1 md:col-start-2 md:col-end-3 xl:col-start-2 xl:col-end-4 px-2 lg:px-4 py-4 bg-non-photo-blue-700 rounded-lg">
            <p class="text-center text-gray-500">{t("posts.noPosts")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;
