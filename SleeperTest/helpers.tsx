// should use localization etc.
// Get the date string we'll show in the conversation window.
export function tsToDateString(timestampMS: number): string {
  const date = new Date(timestampMS).toLocaleTimeString();
  return date;
}
