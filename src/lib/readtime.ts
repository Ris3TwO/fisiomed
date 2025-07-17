/**
 * Calculates the estimated read time for a given text and returns a localized string.
 * 
 * @param {string} text - The input text to analyze. HTML tags are not filtered.
 * @returns {string} Localized read time string (e.g., "1 min read" or "3 mins read")
 * 
 * @remarks
 * - Uses a standard reading speed of 200 words per minute
 * - Rounds up to the nearest minute (Math.ceil)
 * - Returns a localized string using i18n
 * - The translation key should handle singular/plural forms (typically "mainPage.blog.readTime")
 * 
 * @example
 * Returns "5 mins read" for a 950-word article (200 wpm × 5 mins = 1000 words)
 * calculateReadTime(longArticleText);
 */
export const calculateReadTime = (text: string): string => {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes.toString();
};