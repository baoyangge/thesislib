import {Link} from '@/i18n/routing';
import {getTranslations} from 'next-intl/server';
import LanguageSwitcher from './LanguageSwitcher';
import { signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Navbar({ user }: { user: any }) {
  const t = await getTranslations('Navigation');

  return (
    <nav className="border-b border-slate-200 bg-white sticky top-0 z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-900 tracking-tight">
              FaultJournal
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link href="/app/papers" className="text-slate-600 hover:text-blue-900 px-3 py-2 text-sm font-medium transition-colors">
                {t('publications')}
              </Link>
              {user && (
                <Link href="/app/papers?mine=1" className="text-slate-600 hover:text-blue-900 px-3 py-2 text-sm font-medium transition-colors">
                  {t('my_papers')}
                </Link>
              )}
              {user?.isAdmin && (
                <>
                  <Link href="/app/papers/new" className="text-slate-600 hover:text-blue-900 px-3 py-2 text-sm font-medium transition-colors">
                    {t('upload_paper')}
                  </Link>
                  <Link href="/admin" className="text-slate-600 hover:text-blue-900 px-3 py-2 text-sm font-medium transition-colors">
                    {t('admin')}
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
            {!user ? (
              <>
                <Link href="/auth/login" className="text-sm font-medium text-slate-600 hover:text-blue-900">
                  {t('login')}
                </Link>
                <Link href="/auth/signup" className="text-sm font-medium bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors">
                  {t('signup')}
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-slate-600">
                  {user.email} {user.isAdmin && <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{t('admin')}</span>}
                </div>
                <form action={async () => { 
                  "use server"; 
                  await signOut(); 
                  redirect('/'); 
                }}>
                  <button type="submit" className="text-sm font-medium text-slate-600 hover:text-blue-900">
                    {t('logout')}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}