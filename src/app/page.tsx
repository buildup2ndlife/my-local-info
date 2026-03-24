import Link from 'next/link';

// 데이터 타입 정의 (개발자를 위한 설명: 데이터의 생김새를 미리 정해두는 거예요)
interface LocalInfo {
  id: number;
  name: string;
  category: '행사' | '혜택';
  startDate: string;
  endDate: string;
  location: string;
  target: string;
  summary: string;
  link: string;
}

// 샘플 데이터를 불러오는 시뮬레이션 (나중에 진짜 파일에서 읽어오게 할 수 있어요)
// 지금은 간단하게 파일 내용을 변수로 담아서 사용합니다.
import localData from '../../public/data/local-info.json';
const infoList = localData as LocalInfo[];

export default function Home() {
  const events = infoList.filter((item) => item.category === '행사');
  const benefits = infoList.filter((item) => item.category === '혜택');

  // 마지막 업데이트 날짜 (오늘 날짜)
  const today = new Date().toLocaleDateString('ko-KR');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* 1. 상단 헤더: 시원하고 깔끔한 보라색 계열로 디자인 */}
      <header className="bg-white border-b border-purple-100">
        <div className="max-w-4xl mx-auto px-4 py-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-purple-700 mb-3 tracking-tight">
            ✨ 성남시 생활 정보
          </h1>
          <p className="text-slate-500 text-lg font-medium">
            우리 동네 최신 행사와 알뜰한 혜택을 한곳에서 확인하세요.
          </p>
          <nav className="flex justify-center gap-6 mt-6">
            <Link href="/" className="text-purple-700 font-bold border-b-2 border-purple-700 pb-1">홈</Link>
            <Link href="/blog" className="text-slate-500 hover:text-purple-700 font-bold transition-colors">블로그</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-16">
        {/* 2. 이번 달 행사/축제 목록 */}
        <section>
          <div className="flex items-center gap-3 mb-8 pl-1">
            <div className="w-1.5 h-8 bg-purple-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-slate-800">이번 달 행사/축제</h2>
            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-lg">
              {events.length}건
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((event) => (
              <Card key={event.id} item={event} color="purple" />
            ))}
          </div>
        </section>

        {/* 3. 지원금/혜택 정보 목록 */}
        <section>
          <div className="flex items-center gap-3 mb-8 pl-1">
            <div className="w-1.5 h-8 bg-indigo-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-slate-800">지원금/혜택 정보</h2>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-lg">
              {benefits.length}건
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit) => (
              <Card key={benefit.id} item={benefit} color="indigo" />
            ))}
          </div>
        </section>
      </main>

      {/* 4. 하단 푸터 */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-10">
        <div className="max-w-4xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p className="mb-2 font-medium">데이터 출처: 공공데이터포털(data.go.kr)</p>
          <p>마지막 업데이트: {today}</p>
          <p className="mt-8">© 2026 우리 동네 생활 정보. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// 카드 컴포넌트
function Card({ item, color }: { item: LocalInfo; color: 'purple' | 'indigo' }) {
  const borderColorClass = color === 'purple' ? 'hover:border-purple-300' : 'hover:border-indigo-300';
  const iconColorClass = color === 'purple' ? 'text-purple-600' : 'text-indigo-600';
  const bgColorClass = color === 'purple' ? 'bg-purple-50 text-purple-700' : 'bg-indigo-50 text-indigo-700';
  const btnColorClass = color === 'purple' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-indigo-600 hover:bg-indigo-700';

  return (
    <div className={`bg-white rounded-3xl p-7 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-transparent transition-all duration-300 hover:shadow-xl ${borderColorClass} group`}>
      <div className="flex items-start justify-between mb-5">
        <div className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md ${bgColorClass}`}>
          {item.category}
        </div>
        <span className="text-xs font-medium text-slate-400">{item.startDate}</span>
      </div>
      
      <h3 className="text-xl font-extrabold text-slate-800 mb-4 group-hover:text-purple-700 transition-colors leading-tight">
        {item.name}
      </h3>
      
      <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">
        {item.summary}
      </p>
      
      <div className="space-y-3 text-sm text-slate-400 border-t border-slate-50 pt-5">
        <div className="flex items-center gap-3">
          <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <span className="truncate font-medium">{item.location}</span>
        </div>
        <div className="flex items-center gap-3">
          <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          <span className="truncate font-medium">{item.target}</span>
        </div>
      </div>
      
      <Link 
        href="/blog" 
        className={`mt-8 block w-full text-center py-4 rounded-2xl font-bold text-white transition-all shadow-lg shadow-transparent hover:shadow-purple-200 ${btnColorClass}`}
      >
        자세히 보기
      </Link>
    </div>
  );
}
