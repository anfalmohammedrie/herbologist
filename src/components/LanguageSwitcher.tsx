"use client";

import { useLanguage, Language } from '@/context/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-[#0a180b] border border-green-800 p-1 rounded-lg">
      <button
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
          language === 'en'
            ? 'bg-emerald-600 text-white shadow'
            : 'text-gray-400 hover:text-white'
        }`}
        title="English"
      >
        EN
      </button>

      <button
        onClick={() => setLanguage('hi')}
        className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
          language === 'hi'
            ? 'bg-emerald-600 text-white shadow'
            : 'text-gray-400 hover:text-white'
        }`}
        title="हिन्दी (Hindi)"
      >
        हिन्दी
      </button>

      <button
        onClick={() => setLanguage('ml')}
        className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
          language === 'ml'
            ? 'bg-emerald-600 text-white shadow'
            : 'text-gray-400 hover:text-white'
        }`}
        title="മലയാളം (Malayalam)"
      >
        മലയാളം
      </button>
    </div>
  );
}
