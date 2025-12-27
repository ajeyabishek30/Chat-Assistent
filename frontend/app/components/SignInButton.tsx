'use client';

import styles from './SignInButton.module.css';

interface SignInButtonProps {
  onClick: () => void;
}

export default function SignInButton({ onClick }: SignInButtonProps) {
  return (
    <button
      onClick={onClick}
      className={styles.signInButton}
      aria-label="Sign in or log in"
      title="Sign in or log in"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
      <span>Sign In</span>
    </button>
  );
}