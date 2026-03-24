import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';

export default function BlogListPage() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
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

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-10 pl-1">
          <div className="w-1.5 h-8 bg-purple-600 rounded-full"></div>
          <h2 className="text-3xl font-bold text-slate-800">새소식 & 블로그</h2>
        </div>

        {allPostsData.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100">
            <p className="text-slate-500 text-lg">아직 작성된 글이 없습니다. 곧 유익한 소식으로 찾아뵐게요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10">
            {allPostsData.map(({ slug, date, title, summary, category }) => (
              <Link href={`/blog/${slug}`} key={slug} className="group">
                <article className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-xl hover:border-purple-200">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-purple-50 text-purple-700 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                      {category}
                    </span>
                    <span className="text-sm text-slate-400 font-medium">{date}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-4 group-hover:text-purple-700 transition-colors leading-tight">
                    {title}
                  </h3>
                  <p className="text-slate-500 text-lg leading-relaxed line-clamp-2">
                    {summary}
                  </p>
                  <div className="mt-8 flex items-center text-purple-600 font-bold gap-2">
                    보러 가기
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 mt-20">
        <div className="max-w-4xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© 2026 우리 동네 생활 정보. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
