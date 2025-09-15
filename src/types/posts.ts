import type React from "preact/compat";
import { translations } from "@/i18n/utils";

export interface PostsProps {
  lang: keyof typeof translations;
}
