export const LongDateFormat = (isoString) => {
  return new Date(isoString).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
export const LongDateFormatVer2 = (isoString) => {
  return new Date(isoString).toLocaleString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true, // Change to false for 24-hour format
  });
};
