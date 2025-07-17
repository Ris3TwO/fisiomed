/**
 * Formats and capitalizes dates according to the specified language.
 *
 * @param {string | Date} dateString - Date in ISO format or Date object
 * @param {string} [language='es'] - Language code (e.g. 'es', 'en')
 * @param {boolean} [withDay=true] - Whether to include the day in the formatted output
 * @returns {string} Formatted date string (e.g. "21 Oct 2024")
 *
 * @example
 * formatDate('2024-10-21', 'en'); // "21 Oct 2024"
 * formatDate(new Date(), 'es', false); // "Oct 2024"
 * formatDate('2024-10-21', 'es'); // "21 oct 2024" (lowercase in Spanish)
 */
export const formatDate = (
  dateString: string | Date,
  language: string = "es",
  withDay: boolean = true
): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    ...(withDay && { day: "numeric" }),
  };

  const formatted = new Intl.DateTimeFormat(language, options).formatToParts(
    new Date(dateString)
  );

  return formatted
    .map((part) => {
      if (part.type === "month") {
        return part.value.charAt(0).toUpperCase() + part.value.slice(1);
      }
      return part.value;
    })
    .join("");
};
