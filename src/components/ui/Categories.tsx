import { useEffect, useState } from "preact/hooks";
import {
  getLangFromUrl,
  translations,
  useTranslations,
} from "../../i18n/utils";
import { getCategories } from "../../services/wordpress/wp";
import type { WpCategory } from "../../types";

const Categories = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [categories, setCategories] = useState<WpCategory[]>([]);
  const [t, setT] = useState(() =>
    useTranslations(getLangFromUrl(new URL(window.location.href)))
  );

  const getAllCategories = async (lang: keyof typeof translations) => {
    setIsLoading(true);
    try {
      const categories = await getCategories(6, lang.toUpperCase());
      setCategories(categories.nodes);
      setT(() => useTranslations(lang));
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const currentLang = getLangFromUrl(new URL(window.location.href));
    getAllCategories(currentLang);

    const handleUrlChange = () => {
      const newLang = getLangFromUrl(new URL(window.location.href));
      getAllCategories(newLang);
    };

    window.addEventListener("popstate", handleUrlChange);
    return () => {
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, []);

  return (
    <section class="py-20 lg:py-30 max-w-7xl mx-auto px-4 xl:px-0">
      <div class="grid grid-cols-[20%_1fr] md:flex items-center md:justify-between relative">
        <h2 class="text-4xl md:text-5xl xl:text-7xl uppercase text-federal-blue-600">
          {t("categories.title")}
        </h2>

        <div class="justify-self-end">
          <button class="text-center w-12 h-12 lg:w-16 lg:h-16 border border-honolulu-blue-600 rounded-full text-honolulu-blue-600 hover:cursor-pointer hover:text-light-cyan-600 transition-colors duration-200 hover:bg-honolulu-blue-600 mr-1 md:mr-2">
            <i class="ti ti-chevron-left text-3xl"></i>
          </button>
          <button class="text-center w-12 h-12 lg:w-16 lg:h-16 border border-honolulu-blue-600 rounded-full text-honolulu-blue-600 hover:cursor-pointer hover:text-light-cyan-600 transition-colors duration-200 hover:bg-honolulu-blue-600">
            <i class="ti ti-chevron-right text-3xl"></i>
          </button>
        </div>
      </div>

      <div class="mt-8 md:mt-20 flex flex-col md:grid md:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 lg:gap-x-6 gap-y-8 mx-4 lg:mx-0">
        {isLoading &&
          Array.from({ length: 4 }).map(() => (
            <article class="relative hover:cursor-wait hover:shadow-lg hover:scale-105 transition-all duration-300 text-light-cyan-600 hover:text-honolulu-blue-600 animate-pulse">
              <div class="aspect-[4/5] object-cover w-full h-auto rounded-lg bg-gray-300"></div>

              <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 rounded-lg"></div>

              <h3 class="absolute bottom-4 left-4 uppercase text-xl font-semibold mt-4">
                <div class="h-6 w-32 bg-gray-400 rounded-lg"></div>
              </h3>
            </article>
          ))}

        {!isLoading &&
          categories.length > 0 &&
          categories.map((category, index) => (
            <article class="relative hover:cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 text-light-cyan-600 hover:text-honolulu-blue-600">
              <img
                src={
                  category.categoryAdditionalData?.image?.node?.sourceUrl ||
                  `https://picsum.photos/800/1200?random=${index}`
                }
                alt={category.name}
                class="aspect-4/5 object-cover w-full h-auto rounded-lg"
                loading="lazy"
                width="400"
                height="600"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 rounded-lg" />
              <h3 class="absolute bottom-4 left-4 uppercase text-xl font-semibold mt-4 ">
                {category.name}
              </h3>
            </article>
          ))}

        {!isLoading && categories.length === 0 && (
          <p class="text-center text-gray-500">
            {t("categories.noCategories")}
          </p>
        )}
      </div>
    </section>
  );
};

export default Categories;
