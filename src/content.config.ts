import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'accent must be a #rrggbb hex colour');

// One folder per project: src/content/projects/<slug>/index.md. The entry id
// is the folder name, which becomes the URL: /projects/<slug>/.
const projects = defineCollection({
  loader: glob({
    pattern: '*/index.md',
    base: './src/content/projects',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    status: z.enum(['active', 'finished']),
    category: z.enum(['research', 'engineering']),
    accent: hex,
    since: z.string().optional(),
    featured: z.boolean().default(false),
    cover: z.string().optional(),
    stack: z.array(z.string()).default([]),
    links: z
      .object({
        repo: z.string().optional(),
        paper: z.string().optional(),
        dataset: z.string().optional(),
        weights: z.string().optional(),
      })
      .default({}),
    demos: z
      .array(
        z.object({
          kind: z.enum(['video', 'hf-space', 'iframe', 'widget']),
          // Empty src renders a labelled placeholder instead of an embed.
          src: z.string().default(''),
          caption: z.string().optional(),
        }),
      )
      .default([]),
    metrics: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    timeline: z.array(z.object({ date: z.string(), label: z.string() })).default([]),
  }),
});

// Posts live at src/content/posts/<project>/<post-slug>.md; the URL is
// /projects/<project>/<post-slug>/.
const posts = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/content/posts' }),
  schema: z.object({
    project: reference('projects'),
    part: z.number().int().positive(),
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const link = z.object({ label: z.string(), url: z.string() });

const cv = defineCollection({
  loader: glob({ pattern: 'cv.yaml', base: './src/data' }),
  schema: z.object({
    name: z.string(),
    headline: z.string(),
    location: z.string(),
    intro: z.string(),
    open_to: z.string(),
    cv_pdf: z.string(),
    links: z.array(link),
    experience: z.array(
      z.object({
        period: z.string(),
        role: z.string(),
        employer: z.string(),
        highlights: z.array(z.string()).default([]),
      }),
    ),
    education: z.array(z.object({ degree: z.string(), institution: z.string(), year: z.string() })),
    skills: z.array(z.string()),
    publications: z.array(z.object({ citation: z.string(), url: z.string().optional() })),
  }),
});

export const collections = { projects, posts, cv };
