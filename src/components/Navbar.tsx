"use client";

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';

export default function Navbar() {
  const { t } = useLanguage();

  return (
    <nav className="botanical-gradient text-white p-4 shadow-lg border-b border-green-900 sticky top-0 z-50">
      <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
        <Link href="/" className="text-xl font-bold tracking-tighter flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          <div>
            <div>{t('brandTitle')}</div>
            <div className="text-[10px] text-green-400 tracking-widest uppercase font-mono font-normal">
              {t('brandSubtitle')}
            </div>
          </div>
        </Link>

        <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
          <Link href="/" className="hover:text-green-400 transition-colors flex items-center gap-1">
            <span>🛡️</span> {t('navAudit')}
          </Link>
          <Link href="/live-prices" className="hover:text-green-400 transition-colors flex items-center gap-1 relative">
            <span>🌐</span> {t('navPrices')}
            <span className="bg-emerald-500 text-black font-extrabold text-[9px] px-1.5 py-0.2 rounded-full font-mono uppercase">
              {t('liveBadge')}
            </span>
          </Link>
          <Link href="/marketplace" className="hover:text-green-400 transition-colors flex items-center gap-1">
            <span>🏪</span> {t('navMarketplace')}
          </Link>
          <Link href="/add-varietal" className="hover:text-green-400 transition-colors flex items-center gap-1">
            <span>➕</span> {t('navAddVarietal')}
          </Link>

          {/* Theme Mode Toggle Switch */}
          <ThemeSwitcher />

          {/* Language Selector Switch */}
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
}
