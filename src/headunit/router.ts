import type { Screen } from '../lib/types';

const ROUTES = ['apps', 'experience', 'talks', 'bench', 'about'];

/**
 * "" -> home, "#bench" -> bench. Any other hash (e.g. #cv, the boring-version anchor)
 * returns null so the display is left alone.
 */
export function screenFromHash(hash: string): Screen | null {
  const id = hash.replace(/^#/, '');
  if (id === '') return 'home';
  return ROUTES.includes(id) ? (id as Screen) : null;
}

export const urlFor = (screen: Screen) =>
  location.pathname + location.search + (screen === 'home' ? '' : `#${screen}`);
