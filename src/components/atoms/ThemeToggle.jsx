import { useState, useEffect } from 'react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return true; // default dark
  });

  useEffect(() => {
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [isDark]);

  return (
    <button
      id="theme-toggle"
      onClick={() => setIsDark(prev => !prev)}
      className="relative w-[52px] h-[28px] rounded-full border border-border cursor-pointer flex items-center p-0 transition-all duration-300 ease-in-out focus:outline-none"
      style={{ backgroundColor: isDark ? 'var(--surface2)' : 'var(--accent)' }}
      aria-label={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
      title={isDark ? 'Modo Claro' : 'Modo Escuro'}
    >
      {/* Track icons */}
      <span className="absolute left-[6px] text-[12px] select-none transition-opacity duration-300"
        style={{ opacity: isDark ? 0.3 : 1 }}>
        ☀️
      </span>
      <span className="absolute right-[6px] text-[12px] select-none transition-opacity duration-300"
        style={{ opacity: isDark ? 1 : 0.3 }}>
        🌙
      </span>

      {/* Thumb */}
      <span
        className="absolute w-[20px] h-[20px] rounded-full shadow-md transition-all duration-300 ease-in-out"
        style={{
          backgroundColor: isDark ? 'var(--text-dim)' : '#ffffff',
          left: isDark ? '4px' : '28px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }}
      />
    </button>
  );
}
