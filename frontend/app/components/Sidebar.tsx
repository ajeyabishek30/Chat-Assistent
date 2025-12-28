'use client';

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
  onSettingsClick: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  chats,
  currentChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onSettingsClick,
  isOpen = true,
  onClose,
}: SidebarProps) {

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
    <>
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
          onClick={onSettingsClick}
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
        </button>
      </div>
      </div>
    </>
  );
}

