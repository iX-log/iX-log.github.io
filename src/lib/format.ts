const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
/** "2025-12-09" -> "Dec 9, 2025" */
export const formatDate = (iso: string) => dateFmt.format(new Date(`${iso}T00:00:00Z`));
/** Role titles are stored as "iOS Engineer, App Architecture"; the display uses a middle dot. */
export const dotTitle = (title: string) => title.replace(', ', ' · ');

/**
 * The old site's heading treatment: the first part stays solid, the rest steps back to grey.
 * Splits at the first space, or at a ';' when there is none ("TL;DR" -> "TL" + ";DR").
 */
export const twoTone = (text: string): [string, string] => {
  const space = text.indexOf(' ');
  if (space > 0) return [text.slice(0, space), text.slice(space)];
  const semi = text.indexOf(';');
  if (semi > 0) return [text.slice(0, semi), text.slice(semi)];
  return [text, ''];
};
