import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export interface PostMeta {
  slug: string[];
  title: string;
  description: string;
  date: string;
  author?: string;
  tags?: string[];
  cover?: string;
  readingTime: number;
}

export interface Post extends PostMeta {
  content: string;
}

function walkDir(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return walkDir(full);
    }
    if (/\.(md|mdx|mdc)$/.test(entry.name)) {
      return [full];
    }
    return [];
  });
}

function pathToSlug(filePath: string): string[] {
  const rel = path.relative(BLOG_DIR, filePath);
  const noExt = rel.replace(/\.(md|mdx|mdc)$/, '');
  const parts = noExt.split(path.sep);
  if (parts.at(-1) === 'index') {
    parts.pop();
  }
  return parts;
}

function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export async function getAllPosts(): Promise<PostMeta[]> {
  const files = walkDir(BLOG_DIR);

  const posts = files.map((filePath) => {
    const raw = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(raw);
    return {
      slug: pathToSlug(filePath),
      title: data.title ?? 'Sem título',
      description: data.description ?? '',
      date: data.date
        ? new Date(data.date).toISOString()
        : new Date().toISOString(),
      author: data.author,
      tags: Array.isArray(data.tags) ? data.tags : [],
      cover: data.cover,
      readingTime: estimateReadingTime(content),
    } satisfies PostMeta;
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export async function getPost(slug: string[]): Promise<Post | null> {
  const candidates = [
    path.join(BLOG_DIR, ...slug) + '.md',
    path.join(BLOG_DIR, ...slug) + '.mdx',
    path.join(BLOG_DIR, ...slug) + '.mdc',
    path.join(BLOG_DIR, ...slug, 'index.md'),
    path.join(BLOG_DIR, ...slug, 'index.mdx'),
    path.join(BLOG_DIR, ...slug, 'index.mdc'),
  ];

  const filePath = candidates.find((p) => fs.existsSync(p));
  if (!filePath) {
    return null;
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(content);

  return {
    slug,
    title: data.title ?? 'Sem título',
    description: data.description ?? '',
    date: data.date
      ? new Date(data.date).toISOString()
      : new Date().toISOString(),
    author: data.author,
    tags: Array.isArray(data.tags) ? data.tags : [],
    cover: data.cover,
    readingTime: estimateReadingTime(content),
    content: processed.toString(),
  };
}
