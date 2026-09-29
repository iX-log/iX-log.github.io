import type { CollectionEntry } from 'astro:content';

/** Everything a shell needs, assembled once at build time from src/content (see site-data.ts). */
export type Ui = CollectionEntry<'headunit'>['data'];
export type Bench = CollectionEntry<'bench'>['data'];
export type ScreenId = 'experience' | 'bench' | 'talks' | 'about';
export type Screen = 'home' | 'apps' | ScreenId;

/** An app is either a screen on the unit or a link that leaves it. */
export interface App {
  id: string;
  label: string;
  hint: string;
  icon: Ui['apps'][number]['icon'];
  screen?: ScreenId;
  href?: string;
}

export interface Role {
  project: string;
  title: string;
  start: string;
  end: string;
  blurb: string;
  points: string[];
}
export interface Post {
  part: string;
  kicker?: string;
  title: string;
  blurb: string;
  /** ISO date, yyyy-mm-dd */
  date: string;
  minutes: number;
  url: string;
}
export interface Talk {
  image?: string;
  youtube?: string;
  event?: string;
  year?: string;
  title?: string;
  video?: string;
  todos: string[];
}
export interface Education {
  school: string;
  short: string;
  degree: string;
  start: string;
  end: string;
  thesis?: { title: string; summary: string; line: string };
}
export interface Contact {
  id: 'email' | 'linkedin' | 'github' | 'medium';
  label: string;
  value: string;
  href: string;
}

export interface SiteData {
  name: string;
  role: string;
  city: string;
  location: string;
  year: number;
  host: string;
  facts: { label: string; title: string; text: string }[];
  tagline: string;
  about: string[];
  toolbox: { lead: string; items: string[] };
  languages: string[];
  links: { email: string; linkedin: string; github: string; medium: string };
  cvUrl?: string;
  profileTodos: string[];
  ui: Ui;
  apps: App[];
  bench: Bench;
  writing: { title: string; summary: string };
  roles: Role[];
  posts: Post[];
  talks: Talk[];
  education: Education[];
  contacts: Contact[];
  /** Build-time QR: inline SVG string, no runtime library. */
  qr: { svg: string; url: string };
}
