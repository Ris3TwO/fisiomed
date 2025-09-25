import type { Locale } from "@/i18n/config";

export interface TeamMember {
  name: string;
  position: { [key in Locale]: string };
  img: string;
  bio: { [key in Locale]: string };
}

export interface TeamsProps {
  teams: TeamMember[];
  translations: {
    title: string;
    subtitle: string;
  };
  lang: Locale;
}
