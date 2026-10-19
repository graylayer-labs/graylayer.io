import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';
import { getPosts, postHref } from '@/lib/site';

const md = new MarkdownIt({ html: true });

// Same visibility helper as the pages: drafts and (in production) example
// posts are not returned, so they never reach the feed. With no posts the
// feed is a valid empty channel.
export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: 'graylayer',
    description: 'Writing from Graylayer Labs: applied machine learning projects and research.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: postHref(post),
      categories: post.data.tags,
      content: sanitizeHtml(md.render(post.body ?? ''), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      }),
    })),
  });
}
