import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostData, getSortedPostsData } from '@/lib/posts';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const postData = getPostData(slug);

  if (!postData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* 헤더 */}
      <header className="bg-white border-b border-purple-100">
        <div className="max-w-4xl mx-auto px-4 py-10 flex flex-col items-center">
          <Link href="/" className="text-3xl sm:text-4xl font-extrabold text-purple-700 mb-3 tracking-tight">
             ✨ 성남시 생활 정보
          </Link>
          <nav className="flex gap-6 mt-4">
            <Link href="/" className="text-slate-500 hover:text-purple-700 font-bold transition-colors">홈</Link>
            <Link href="/blog" className="text-purple-700 font-bold border-b-2 border-purple-700 pb-1">블로그</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-12">
        {/* 뒤로가기 버튼 */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-purple-700 transition-colors mb-8 group"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">블로그 목록으로 돌아가기</span>
        </Link>

        {/* 상세 내용 카드 */}
        <article className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-slate-100">
          <div className="mb-10 text-center">
            <span className="inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg mb-6 bg-purple-100 text-purple-700">
              {postData.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-slate-800 leading-tight mb-6">
              {postData.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-slate-400 font-medium">
              <span>{postData.date}</span>
              <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
              <div className="flex gap-2">
                {postData.tags.map(tag => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* 마크다운 본문 */}
          <div className="prose prose-lg prose-slate prose-purple max-w-none pt-10 border-t border-slate-50">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {postData.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 mt-20">
        <div className="max-w-4xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© 2026 우리 동네 생활 정보. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
