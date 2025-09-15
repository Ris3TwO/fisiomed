export const getPostExcerpt = (htmlString: string) => {
  return htmlString.replace(/<[^>]+>/g, "").slice(0, 100) + "...";
};
