import { useEffect, useState } from "preact/hooks";
import { formatDate, calculateReadTime } from "../../lib";
import { getPosts } from "../../services/wordpress/wp";
import type { WpPosts } from "../../types";
import {
  getLangFromUrl,
  translations,
  useTranslations,
} from "../../i18n/utils";

const Posts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<WpPosts[]>([]);
  const [lang, setLang] = useState("");
  const [t, setT] = useState(() =>
    useTranslations(getLangFromUrl(new URL(window.location.href)))
  );

  const getAllPosts = async (lang: keyof typeof translations) => {
    setIsLoading(true);
    try {
      const posts = await getPosts(6, lang.toUpperCase());
      setPosts(posts.edges);
      setT(() => useTranslations(lang));
      setLang(lang);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
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
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 items-center mx-4 lg:mx-0">
        <h2 class="text-4xl md:text-5xl xl:text-7xl uppercase text-federal-blue-600">
          {t("posts.title")}
        </h2>
        <a
          href={`/${lang}/posts`}
          class="px-1 lg:px-4 py-1 md:pr-1 lg:pr-2 border border-honolulu-blue-600 text-honolulu-blue-600 rounded-full md:rounded-4xl flex items-center col-start-3 w-fit place-self-end self-center"
        >
          <span class="hidden md:block text-xs md:text-sm uppercase font-bold transition-colors duration-200">
            {t("posts.allPosts")}
          </span>

          <div class="rotate-45 md:ml-1 lg:ml-2 w-10 h-10 flex items-center justify-center rounded-full bg-honolulu-blue-600 text-light-cyan-600">
            <i class="ti ti-arrow-up text-3xl lg:text-4xl"></i>
          </div>
        </a>
      </div>
      <div class="mt-8 md:mt-20 flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 lg:gap-x-6 gap-y-8 mx-4 lg:mx-0">
        {isLoading &&
          Array.from({ length: 8 }).map(() => (
            <article
              class="col-span-2 sm:col-span-1 px-2 lg:px-4 py-4 bg-non-photo-blue-700 rounded-lg animate-pulse"
              slot="fallback"
            >
              <div class="w-full h-48 xl:h-54 rounded-lg bg-gray-300" />

              <div class="h-6 w-3/4 rounded-lg bg-gray-300 mt-4" />

              <div class="grid grid-cols-2 lg:grid-cols-3 items-center gap-2 mt-4">
                <div class="h-5 w-20 rounded-full bg-gray-300" />

                <div class="h-4 w-16 bg-gray-300" />

                <div class="h-4 w-24 bg-gray-300" />
              </div>
            </article>
          ))}

        {posts.length > 0 &&
          posts.map((post) => (
            <a href={`post/${post.node.postId}`} key={post.node.postId} rel="noopener">
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

                <div class="grid grid-cols-2 lg:grid-cols-3 items-center gap-2 mt-4">
                  <span class="text-xs rounded-full px-2 py-1 text-center order-2 lg:order-1 bg-honolulu-blue-600 text-light-cyan-600">
                    {post.node.categories?.nodes[0].name}
                  </span>
                  <span class="text-xs text-pacific-cyan-300 text-center order-3 lg:order-2">
                    <i class="ti ti-clock" />{" "}
                    {calculateReadTime(post.node.content)} min read
                  </span>
                  <div class="text-xs text-pacific-cyan-300 order-1 lg:order-3 col-span-2 lg:col-span-1 flex items-center justify-start lg:justify-end">
                    <i class="ti ti-calendar-week" />
                    <span>{formatDate(post.node.date)}</span>
                  </div>
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
