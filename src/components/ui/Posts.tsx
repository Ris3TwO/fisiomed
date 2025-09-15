import { useEffect, useMemo, useState } from "preact/hooks";
import { getPosts } from "@/services/wordpress/wp";
import type { PostsProps, WpPostEdge } from "@/types";
import { getLangFromUrl, translations, useTranslations } from "@/i18n/utils";
import type React from "preact/compat";
import { useTransition } from "preact/compat";
import PostCard from "./PostCard";
import PostCardSkeleton from "./PostCardSkeleton";

const Posts: React.FC<PostsProps> = ({ lang }) => {
  const [isFetching, setIsFetching] = useState(true);
  const [_, startTransition] = useTransition();
  const [posts, setPosts] = useState<WpPostEdge[]>([]);
  const [t, setT] = useState(() =>
    useTranslations(getLangFromUrl(new URL(window.location.href)))
  );

  const getAllPosts = async (lang: keyof typeof translations) => {
    setIsFetching(true);
    try {
      const postsData = await getPosts(6, [lang]);

      startTransition(() => {
        setPosts(postsData.edges);
        setT(() => useTranslations(lang));
      });
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setIsFetching(false);
    }
  };

  const skeletonKeys = useMemo(
    () =>
      Array.from({ length: 8 }, () =>
        Math.random().toString(36).substring(2, 9)
      ),
    []
  );

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
      <div
        slot="postHeader"
        class="grid md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 items-center mx-4 lg:mx-0"
      >
        <h2 class="text-4xl md:text-5xl xl:text-7xl uppercase text-federal-blue-600">
          {t("posts.title")}
        </h2>
        <a
          href={`/${lang}/blog/posts`}
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

      {/* Post List */}
      <div class="mt-8 md:mt-20 flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 lg:gap-x-6 gap-y-8 mx-4 lg:mx-0">
        {isFetching &&
          skeletonKeys.map((key) => <PostCardSkeleton key={key} />)}

        {!isFetching && posts.length > 0
          ? posts.map((post) => <PostCard key={post.node.postId} post={post} />)
          : !isFetching &&
            posts.length === 0 && (
              <div class="col-span-2 sm:col-span-1 md:col-start-2 md:col-end-3 xl:col-start-2 xl:col-end-4 px-2 lg:px-4 py-4 bg-non-photo-blue-700 rounded-lg">
                <p class="text-center text-gray-500">{t("posts.noPosts")}</p>
              </div>
            )}
      </div>
    </div>
  );
};

export default Posts;
