'use client';

import { Message } from '../page';
import styles from './ChatMessage.module.css';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div
      className={`${styles.messageWrapper} ${
        message.sender === 'user' ? styles.userMessage : styles.assistantMessage
      }`}
    >
      <div
        className={`${styles.message} ${
          message.sender === 'user' ? styles.user : styles.assistant
        }`}
      >
        <div className={styles.messageContent}>
          {message.text}
        </div>
        <div className={styles.timestamp}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
}

