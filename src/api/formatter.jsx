export default function LongDateFormat(isoString) {
  return new Date(isoString).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
