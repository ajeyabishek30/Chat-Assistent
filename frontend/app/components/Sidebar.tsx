'use client';

import { useState, Fragment } from 'react';
import styles from './Sidebar.module.css';

export interface Chat {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  theme: 'light' | 'dark' | 'matrix';
  onThemeChange: (theme: 'light' | 'dark' | 'matrix') => void;
  onAccountClick: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  chats,
  currentChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  theme,
  onThemeChange,
  onAccountClick,
  isOpen = true,
  onClose,
}: SidebarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSelectChat = (chatId: string) => {
    onSelectChat(chatId);
    if (onClose) {
      onClose();
    }
  };

  const handleNewChat = () => {
    onNewChat();
    if (onClose) {
      onClose();
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return 'Today';
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    onDeleteChat(chatId);
  };

  return (
    <Fragment>
      {isOpen && onClose && (
        <div className={styles.overlay} onClick={onClose} />
      )}
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        {onClose && (
          <button className={styles.closeButton} onClick={onClose} aria-label="Close sidebar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
        {/* New Chat Button */}
        <button className={styles.newChatButton} onClick={handleNewChat}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>New Chat</span>
      </button>

      {/* Chat History */}
      <div className={styles.chatHistory}>
        <div className={styles.chatHistoryHeader}>Recent Chats</div>
        <div className={styles.chatList}>
          {chats.length === 0 ? (
            <div className={styles.emptyState}>No chat history</div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                className={`${styles.chatItem} ${
                  currentChatId === chat.id ? styles.active : ''
                }`}
                onClick={() => handleSelectChat(chat.id)}
              >
                <div className={styles.chatItemContent}>
                  <div className={styles.chatTitle}>{chat.title}</div>
                  <div className={styles.chatDate}>{formatDate(chat.updatedAt)}</div>
                </div>
                <button
                  className={styles.deleteButton}
                  onClick={(e) => handleDeleteChat(e, chat.id)}
                  aria-label="Delete chat"
                  title="Delete chat"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Settings Section */}
      <div className={styles.settingsSection}>
        <button
          className={styles.settingsButton}
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3"></path>
          </svg>
          <span>Settings</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${styles.chevron} ${isSettingsOpen ? styles.open : ''}`}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        {isSettingsOpen && (
          <div className={styles.settingsMenu}>
            <div className={styles.settingsGroup}>
              <div className={styles.settingsLabel}>Theme</div>
              <div className={styles.themeOptions}>
                <button
                  className={`${styles.themeOption} ${theme === 'light' ? styles.active : ''}`}
                  onClick={() => onThemeChange('light')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                  </svg>
                  <span>Light</span>
                </button>
                <button
                  className={`${styles.themeOption} ${theme === 'dark' ? styles.active : ''}`}
                  onClick={() => onThemeChange('dark')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                  <span>Dark</span>
                </button>
                <button
                  className={`${styles.themeOption} ${theme === 'matrix' ? styles.active : ''}`}
                  onClick={() => onThemeChange('matrix')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="9" y1="9" x2="9" y2="15"></line>
                    <line x1="15" y1="9" x2="15" y2="15"></line>
                    <line x1="9" y1="12" x2="15" y2="12"></line>
                  </svg>
                  <span>Matrix</span>
                </button>
              </div>
            </div>

            <div className={styles.settingsGroup}>
              <button className={styles.accountButton} onClick={onAccountClick}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>My Account</span>
              </button>
            </div>
          </div>
        )}
      </div>
      </div>
    </Fragment>
  );
}

