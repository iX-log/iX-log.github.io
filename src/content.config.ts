import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Shared layer: the single source of truth for every shell.
 * The static "boring version", the head unit and the (later) companion all read from here.
 *
 * Rule: never invent a fact. If something is missing, list it in `todos`
 * and it renders as a visible TODO badge (see components/Todo.astro).
 */
const todos = z.array(z.string()).default([]);

const profile = defineCollection({
  loader: file('src/content/profile.yaml'),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    city: z.string(),
    location: z.string(),
    description: z.string(),
    facts: z.array(z.object({ label: z.string(), title: z.string(), text: z.string() })),
    tagline: z.string(),
    about: z.array(z.string()).min(1),
    toolbox: z.object({ lead: z.string(), items: z.array(z.string()).min(1) }),
    languages: z.array(z.string()),
    links: z.object({
      email: z.email(),
      linkedin: z.url(),
      github: z.url(),
      medium: z.url(),
    }),
    cvUrl: z.url().optional(),
    todos,
  }),
});

const roles = defineCollection({
  loader: file('src/content/roles.yaml'),
  schema: z.object({
    order: z.number(),
    project: z.string(),
    title: z.string(),
    start: z.string(),
    end: z.string(),
    blurb: z.string(),
    points: z.array(z.string()).min(1),
    todos,
  }),
});

const education = defineCollection({
  loader: file('src/content/education.yaml'),
  schema: z.object({
    order: z.number(),
    school: z.string(),
    short: z.string(),
    degree: z.string(),
    start: z.string(),
    end: z.string(),
    thesis: z.object({ title: z.string(), summary: z.string(), line: z.string() }).optional(),
    todos,
  }),
});

const writing = defineCollection({
  loader: file('src/content/writing.yaml'),
  schema: z.object({ title: z.string(), summary: z.string() }),
});

const posts = defineCollection({
  loader: file('src/content/posts.yaml'),
  schema: z.object({
    part: z.string(),
    kicker: z.string().optional(),
    title: z.string(),
    blurb: z.string(),
    date: z.coerce.date(),
    minutes: z.number().int().positive(),
    url: z.url(),
  }),
});

const talks = defineCollection({
  loader: file('src/content/talks.yaml'),
  schema: z
    .object({
      order: z.number(),
      event: z.string().optional(),
      year: z.string().optional(),
      title: z.string().optional(),
      video: z.url().optional(),
      /** YouTube id: the talk then plays on the Talks screen instead of linking away. */
      youtube: z.string().optional(),
      image: z.string().optional(),
      todos,
    })
    // A talk is either complete, or a placeholder that says what is missing.
    .refine((t) => t.todos.length > 0 || (t.event && t.year && t.title), {
      message: 'A talk needs event, year and title, or a todos entry saying what is missing.',
    }),
});

const bench = defineCollection({
  loader: file('src/content/bench.yaml'),
  schema: z.object({
    name: z.string(),
    summary: z.string(),
    pitch: z.string(),
    pitchWithRepo: z.string(),
    status: z.string(),
    variants: z.string(),
    context: z.string(),
    repo: z.url().optional(),
    readouts: z
      .array(
        z.object({
          value: z.string(),
          unit: z.string(),
          label: z.string(),
          display: z.string(),
          accent: z.boolean().default(false),
        }),
      )
      .length(4),
    chart: z.object({
      label: z.string(),
      unit: z.string(),
      stepAt: z.number(),
      stepLabel: z.string(),
      duration: z.number(),
      low: z.number(),
      high: z.number(),
      alt: z.string(),
      points: z.array(z.tuple([z.number(), z.number()])).min(2),
    }),
    todos,
  }),
});

const iconName = z.enum(['briefcase', 'pen', 'mic', 'pulse', 'person', 'mail', 'medium', 'github', 'linkedin', 'cv']);
const screenId = z.enum(['experience', 'talks', 'bench', 'about']);
const linkKey = z.enum(['medium', 'github', 'linkedin', 'email']);

/** UI copy: every word the head unit and the page chrome show that isn't a fact. */
const headunit = defineCollection({
  loader: file('src/content/headunit.yaml'),
  schema: z.object({
    brand: z.string(),
    unitLabel: z.string(),
    header: z.object({
      navLabel: z.string(), theme: z.string(),
      writing: z.string(), github: z.string(), linkedin: z.string(), email: z.string(), skip: z.string(),
    }),
    handshake: z.object({ title: z.string(), detail: z.string(), done: z.string(), skipHint: z.string() }),
    dock: z.object({ label: z.string(), home: z.string(), back: z.string() }),
    theme: z.object({ toDay: z.string(), toNight: z.string() }),
    home: z.object({ title: z.string(), apps: z.string(), cvLead: z.string(), stageTitle: z.string(), aboutCta: z.string(), photoAlt: z.string(), todos }),
    widgets: z.object({
      nowBuilding: z.string(),
      latest: z.string(),
      qr: z.object({ lead: z.string(), text: z.string(), alt: z.string() }),
    }),
    // An app either opens a screen on the unit or leaves for a link — never both.
    apps: z
      .array(
        z
          .object({ id: z.string(), label: z.string(), hint: z.string(), icon: iconName, screen: screenId.optional(), link: linkKey.optional() })
          .refine((a) => !!a.screen !== !!a.link, { message: 'An app needs exactly one of `screen` or `link`.' }),
      )
      .min(4),
    screens: z.object({
      writing: z.object({ minutes: z.string() }),
      talks: z.object({ video: z.string(), play: z.string(), playing: z.string() }),
      bench: z.object({ rawData: z.string() }),
      about: z.object({ speaks: z.string(), thesis: z.string(), toolbox: z.string() }),
      contact: z.object({ email: z.string(), linkedin: z.string(), github: z.string(), medium: z.string() }),
    }),
    play: z.object({ title: z.string(), blurb: z.string(), dressLabel: z.string(), dressHint: z.string() }),
    power: z.object({
      on: z.string(), off: z.string(), goingOff: z.string(),
      offDetail: z.string(), offTitle: z.string(), photoAlt: z.string(),
    }),
    companion: z.object({
      openedFrom: z.string(),
      pill: z.string(),
      sync: z.object({ label: z.string(), tag: z.string(), blurb: z.string(), pink: z.string(), blue: z.string() }),
    }),
    boring: z.object({
      title: z.string(),
      hint: z.string(),
      cv: z.string(),
      groups: z.object({
        tldr: z.string(), experience: z.string(), education: z.string(),
      }),
      minutesSuffix: z.string(),
    }),
  }),
});

export const collections = { profile, roles, education, writing, posts, talks, bench, headunit };
