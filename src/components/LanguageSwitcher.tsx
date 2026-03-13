"use client";

import { usePathname, useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value as 'en' | 'zh' | 'ja';
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    router.replace(pathname + query, { locale: nextLocale });
  };

  return (
    <div className="mr-4 flex items-center bg-slate-50 border border-slate-200 rounded-md px-2 py-1">
      <svg className="w-4 h-4 text-slate-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <select 
        value={locale} 
        onChange={handleChange}
        className="bg-transparent text-sm font-medium text-slate-600 hover:text-blue-900 border-none outline-none cursor-pointer appearance-none focus:ring-0"
      >
        <option value="en">English</option>
        <option value="zh">简体中文</option>
        <option value="ja">日本語</option>
      </select>
    </div>
  );
}
