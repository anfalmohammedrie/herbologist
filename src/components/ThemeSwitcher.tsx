"use client";

import { useTheme } from '@/context/ThemeContext';

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg border transition-all shadow active:scale-95 bg-[#0a180b] border-green-800 text-green-300 hover:text-white hover:border-green-600"
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
      <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </button>
  );
}
