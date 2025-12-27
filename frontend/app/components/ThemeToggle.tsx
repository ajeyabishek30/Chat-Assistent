'use client';

import styles from './ThemeToggle.module.css';

interface ThemeToggleProps {
  theme: 'light' | 'dark' | 'matrix';
  onToggle: () => void;
}

const getNextTheme = (currentTheme: 'light' | 'dark' | 'matrix'): 'light' | 'dark' | 'matrix' => {
  switch (currentTheme) {
    case 'light':
      return 'dark';
    case 'dark':
      return 'matrix';
    case 'matrix':
      return 'light';
    default:
      return 'light';
  }
};

const getThemeIcon = (theme: 'light' | 'dark' | 'matrix') => {
  switch (theme) {
    case 'light':
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      );
    case 'dark':
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      );
    case 'matrix':
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="9" y1="9" x2="9" y2="15"></line>
          <line x1="15" y1="9" x2="15" y2="15"></line>
          <line x1="9" y1="12" x2="15" y2="12"></line>
        </svg>
      );
  }
};

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const nextTheme = getNextTheme(theme);
  
  return (
    <button
      onClick={onToggle}
      className={styles.themeToggle}
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Current: ${theme} theme. Click to switch to ${nextTheme} theme`}
    >
      {getThemeIcon(theme)}
    </button>
  );
}

