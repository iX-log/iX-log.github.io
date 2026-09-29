import { getCollection, getEntry } from 'astro:content';
import QRCode from 'qrcode';
import type { Contact, SiteData } from './types';

const QR_PARAM = 'from=headunit';

/** "https://github.com/iX-log" -> "iX-log", "https://medium.com/@ixhen.dev" -> "@ixhen.dev" */
const handle = (url: string) => new URL(url).pathname.replace(/^\/|\/$/g, '');

export async function loadSiteData(site: URL): Promise<SiteData> {
  const profile = (await getEntry('profile', 'main'))!.data;
  const ui = (await getEntry('headunit', 'main'))!.data;
  const bench = (await getEntry('bench', 'main'))!.data;
  const writing = (await getEntry('writing', 'main'))!.data;
  const roles = (await getCollection('roles')).sort((a, b) => a.data.order - b.data.order);
  const posts = (await getCollection('posts')).sort((a, b) => a.data.date.valueOf() - b.data.date.valueOf());
  const talks = (await getCollection('talks')).sort((a, b) => a.data.order - b.data.order);
  const education = (await getCollection('education')).sort((a, b) => a.data.order - b.data.order);

  const { links } = profile;
  const labels = ui.screens.contact;
  const contacts: Contact[] = [
    { id: 'email', label: labels.email, value: links.email, href: `mailto:${links.email}` },
    { id: 'linkedin', label: labels.linkedin, value: handle(links.linkedin), href: links.linkedin },
    { id: 'github', label: labels.github, value: handle(links.github), href: links.github },
    { id: 'medium', label: labels.medium, value: handle(links.medium), href: links.medium },
  ];

  // Built once here, at build time. Dark modules on a light plate, so it scans on the dark display.
  const qrUrl = new URL(`/?${QR_PARAM}`, site).href;
  const qrSvg = await QRCode.toString(qrUrl, {
    type: 'svg',
    margin: 4,
    errorCorrectionLevel: 'M',
    color: { dark: '#0B0C0E', light: '#ECEDEF' },
  });

  return {
    name: profile.name,
    role: profile.role,
    city: profile.city,
    location: profile.location,
    year: new Date().getFullYear(),
    host: site.host,
    facts: profile.facts,
    tagline: profile.tagline,
    about: profile.about,
    toolbox: profile.toolbox,
    languages: profile.languages,
    links,
    cvUrl: profile.cvUrl,
    profileTodos: profile.todos,
    ui,
    apps: ui.apps.map((a) => ({
      id: a.id,
      label: a.label,
      hint: a.hint,
      icon: a.icon,
      screen: a.screen,
      href: a.link ? (a.link === 'email' ? `mailto:${links.email}` : links[a.link]) : undefined,
    })),
    bench,
    writing,
    roles: roles.map(({ data: r }) => ({ project: r.project, title: r.title, start: r.start, end: r.end, blurb: r.blurb, points: r.points })),
    posts: posts.map(({ data: p }) => ({
      part: p.part,
      kicker: p.kicker,
      title: p.title,
      blurb: p.blurb,
      date: p.date.toISOString().slice(0, 10),
      minutes: p.minutes,
      url: p.url,
    })),
    talks: talks.map(({ data: t }) => ({ event: t.event, year: t.year, title: t.title, video: t.video, youtube: t.youtube, image: t.image, todos: t.todos })),
    education: education.map(({ data: e }) => ({
      school: e.school, short: e.short, degree: e.degree, start: e.start, end: e.end, thesis: e.thesis,
    })),
    contacts,
    qr: { svg: qrSvg, url: qrUrl },
  };
}
