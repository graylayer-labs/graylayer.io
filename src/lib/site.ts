import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;
export type Post = CollectionEntry<'posts'>;

/** Set to the feed URL once #23 ships; links to it appear automatically. */
export const FEED_URL: string | null = null;

export const postSlug = (post: Post) => post.id.split('/').pop() as string;
export const postHref = (post: Post) => `/projects/${post.data.project.id}/${postSlug(post)}/`;
export const projectHref = (project: Project) => `/projects/${project.id}/`;

export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects');
  // Active first, then by title, so the order is stable.
  return all.sort(
    (a, b) =>
      Number(b.data.status === 'active') - Number(a.data.status === 'active') ||
      a.data.title.localeCompare(b.data.title),
  );
}

/** Published posts, newest first. Pass a project id to scope them (part order). */
export async function getPosts(projectId?: string): Promise<Post[]> {
  const all = await getCollection(
    'posts',
    ({ data }) => !data.draft && (!projectId || data.project.id === projectId),
  );
  return projectId
    ? all.sort((a, b) => a.data.part - b.data.part)
    : all.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getCv() {
  const entry = await getEntry('cv', 'cv');
  if (!entry) throw new Error('src/data/cv.yaml is missing');
  return entry.data;
}

export const readMinutes = (body = '') => Math.max(1, Math.round(body.split(/\s+/).length / 220));

export const fmtDate = (d: Date, opts: Intl.DateTimeFormatOptions) =>
  d.toLocaleDateString('en-GB', { timeZone: 'UTC', ...opts });

export const statusLabel = (p: Project) =>
  `${p.data.status === 'active' ? '● Active' : 'Finished'} · ${
    p.data.category === 'research' ? 'Research' : 'Engineering'
  }`;
