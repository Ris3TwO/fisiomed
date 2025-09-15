import Swiper from "swiper";
import type { SwiperOptions } from "swiper/types";

export const setupSwiper = ({
  swiperElRef,
  prevElRef,
  nextElRef,
  settings
}: {
  swiperElRef: { current: HTMLElement | null };
  prevElRef: { current: HTMLElement | null };
  nextElRef: { current: HTMLElement | null };
  settings?: SwiperOptions;
}) => {
  if (!swiperElRef.current || !prevElRef.current || !nextElRef.current) {
    return;
  }
  const swiper = new Swiper(swiperElRef.current, settings);

  return swiper;
};
