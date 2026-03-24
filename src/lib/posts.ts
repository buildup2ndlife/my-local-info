import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

export interface PostData {
  slug: string;
  title: string;
  date: string;
  summary: string;
  category: string;
  tags: string[];
  content: string;
}

export function getSortedPostsData(): PostData[] {
  // 폴더가 없으면 빈 배열 반환
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      // 날짜 처리 (Date 객체인 경우 YYYY-MM-DD 문자열로 변환)
      let dateValue = matterResult.data.date;
      if (dateValue instanceof Date) {
        dateValue = dateValue.toISOString().split('T')[0];
      } else if (!dateValue) {
        dateValue = new Date().toISOString().split('T')[0];
      }

      return {
        slug,
        title: matterResult.data.title || '제목 없음',
        date: dateValue,
        summary: matterResult.data.summary || '',
        category: matterResult.data.category || '일반',
        tags: matterResult.data.tags || [],
        content: matterResult.content,
      };
    });

  // 날짜순 정렬
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostData(slug: string): PostData | null {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  let dateValue = matterResult.data.date;
  if (dateValue instanceof Date) {
    dateValue = dateValue.toISOString().split('T')[0];
  }

  return {
    slug,
    title: matterResult.data.title || '제목 없음',
    date: dateValue,
    summary: matterResult.data.summary || '',
    category: matterResult.data.category || '일반',
    tags: matterResult.data.tags || [],
    content: matterResult.content,
  };
}
