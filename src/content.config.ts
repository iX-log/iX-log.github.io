import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Shared layer: the single source of truth for every shell.
 * The static "boring version", the head unit and the companion all read from here.
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
    location: z.string(),
    description: z.string(),
    facts: z.array(
      z.object({
        label: z.string(),
        title: z.string(),
        text: z.string(),
        href: z.string().optional(),
        hrefLabel: z.string().optional(),
      }),
    ),
    about: z.string(),
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
    points: z.array(z.string()).min(1),
    todos,
  }),
});

const education = defineCollection({
  loader: file('src/content/education.yaml'),
  schema: z.object({
    school: z.string(),
    degree: z.string(),
    start: z.string(),
    end: z.string(),
    thesis: z.object({ title: z.string(), summary: z.string() }).optional(),
    todos,
  }),
});

const posts = defineCollection({
  loader: file('src/content/posts.yaml'),
  schema: z.object({
    series: z.string(),
    title: z.string(),
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
    status: z.string(),
    repo: z.url().optional(),
    readouts: z.array(z.object({ value: z.string(), label: z.string() })).length(4),
    todos,
  }),
});

export const collections = { profile, roles, education, posts, talks, bench };
