export interface TeamMember {
  name: string;
  position: {
    es: string;
    en: string;
  };
  img: string;
  bio: {
    es: string;
    en: string;
  };
}

export interface TeamSectionProps {
  teams: TeamMember[];
  translations: {
    title: string;
    subtitle: string;
  };
  lang: "es" | "en";
}