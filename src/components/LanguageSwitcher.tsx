"use client";

import {usePathname, Link} from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString() ? `?${searchParams.toString()}` : '';

  return (
    <div className="flex space-x-2 mr-4 text-sm">
      <Link href={pathname + query} locale="en" className="text-slate-500 hover:text-blue-900 font-medium">EN</Link>
      <Link href={pathname + query} locale="zh" className="text-slate-500 hover:text-blue-900 font-medium">中文</Link>
      <Link href={pathname + query} locale="ja" className="text-slate-500 hover:text-blue-900 font-medium">日本語</Link>
    </div>
  );
}