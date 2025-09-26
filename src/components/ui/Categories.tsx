import { useEffect, useState, useRef } from "preact/hooks";
import { useTranslations } from "@/i18n/utils";
import { getCategories } from "@/services/wordpress/wp";
import { useTransition } from "preact/compat";
import type { WpCategory } from "@/types/wp";

// Carousel (Swiper) imports
import { setupSwiper } from "src/lib/carousel";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import type { SwiperOptions } from "swiper/types";

// Styles for Swiper components
import "swiper/css";
import SliderButton from "./SliderButton";
import type { Locale } from "@/i18n/config";

const Categories = ({
  initialCategories,
  lang,
}: {
  initialCategories: WpCategory[];
  lang: Locale;
}) => {
  const [isFetching, setIsFetching] = useState(true);
  const [_, startTransition] = useTransition();
  const [categories, setCategories] = useState(initialCategories);
  const [t, setT] = useState(() => useTranslations(lang));
  const swiperElRef = useRef(null);
  const prevElRef = useRef(null);
  const nextElRef = useRef(null);
  const swiperSettings: SwiperOptions = {
    modules: [Navigation, Pagination, Autoplay],
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    slidesPerView: "auto",
    spaceBetween: 20,
    navigation: {
      prevEl: prevElRef.current,
      nextEl: nextElRef.current,
    },
    pagination: {
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 15,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      1280: {
        slidesPerView: 4,
        spaceBetween: 50,
      },
    },
  };

  const getAllCategories = async (currentLang: Locale) => {
    setIsFetching(true);
    try {
      const categoriesData = await getCategories(6, currentLang);
      startTransition(() => {
        setCategories(categoriesData.nodes);
        setT(() => useTranslations(currentLang));
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    getAllCategories(lang);

    const handleUrlChange = () => {
      getAllCategories(lang);
    };

    window.addEventListener("popstate", handleUrlChange);
    return () => {
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, []);

  useEffect(() => {
    if (!swiperElRef.current) return;

    const swiper = setupSwiper({
      swiperElRef,
      prevElRef,
      nextElRef,
      settings: swiperSettings,
    });

    if (!swiper) return;

    return () => {
      swiper.destroy();
    };
  }, [categories]);

  return (
    <section class="py-20 lg:py-30 max-w-7xl mx-auto px-4 2xl:px-0">
      <div class="grid grid-cols-[20%_1fr] md:flex items-center md:justify-between relative">
        <h2 class="text-4xl md:text-5xl xl:text-7xl uppercase text-purpureus-600">
          {t("categories.title")}
        </h2>
        <div class="justify-self-end">
          <SliderButton
            ref={prevElRef}
            isLoading={isFetching}
            direction="left"
            className="mr-1 md:mr-2"
            name="previousCategories"
            aria-label="Go to previous categories"
          />
          <SliderButton
            ref={nextElRef}
            isLoading={isFetching}
            direction="right"
            name="nextCategories"
            aria-label="Go to next categories"
          />
        </div>
      </div>

      <div class="mt-8 md:mt-20">
        {isFetching && (
          <div class="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 lg:gap-x-6 gap-y-8 mx-4 lg:mx-0">
            {Array.from({ length: 4 }).map(() => (
              <article class="relative hover:cursor-wait hover:shadow-lg hover:scale-105 transition-all duration-300 text-light-cyan-600 hover:text-honolulu-blue-600 animate-pulse">
                <div class="aspect-[4/5] object-cover w-full h-auto rounded-lg bg-gray-300"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 rounded-lg"></div>
                <h3 class="absolute bottom-4 left-4 uppercase text-xl font-semibold mt-4">
                  <div class="h-6 w-32 bg-gray-400 rounded-lg"></div>
                </h3>
              </article>
            ))}
          </div>
        )}

        <div ref={swiperElRef} class="swiper">
          <div class="swiper-wrapper">
            {!isFetching &&
              categories.length > 0 &&
              categories.map((category, index) => (
                <div class="swiper-slide" key={category.categoryId || index}>
                  <a
                    href={`blog/categories/${category.slug}`}
                    aria-label={category.name}
                  >
                    <article class="relative hover:cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 text-light-cyan-600 hover:text-honolulu-blue-600">
                      <img
                        src={
                          category.categoryAdditionalData?.image?.node
                            ?.sourceUrl ||
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
                  </a>
                </div>
              ))}
          </div>
        </div>

        {!isFetching && categories.length === 0 && (
          <div class="flex flex-col md:grid md:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 lg:gap-x-6 gap-y-8 mx-4 lg:mx-0">
            <p class="text-center text-gray-500">
              {t("categories.noCategories")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;
