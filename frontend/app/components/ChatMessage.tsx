'use client';

import ReactMarkdown from 'react-markdown';
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
      role="article"
      aria-label={`${message.sender === 'user' ? 'User' : 'Assistant'} message`}
    >
      <div
        className={`${styles.message} ${
          message.sender === 'user' ? styles.user : styles.assistant
        }`}
      >
        <div className={styles.messageContent}>
          {message.sender === 'assistant' ? (
            <ReactMarkdown
              components={{
                code: ({ node, inline, className, children, ...props }) => {
                  return inline ? (
                    <code className={styles.inlineCode} {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className={styles.codeBlock} {...props}>
                      {children}
                    </code>
                  );
                },
                p: ({ children }) => <p className={styles.paragraph}>{children}</p>,
                ul: ({ children }) => <ul className={styles.list}>{children}</ul>,
                ol: ({ children }) => <ol className={styles.list}>{children}</ol>,
                li: ({ children }) => <li className={styles.listItem}>{children}</li>,
                strong: ({ children }) => <strong className={styles.bold}>{children}</strong>,
                em: ({ children }) => <em className={styles.italic}>{children}</em>,
              }}
            >
              {message.text}
            </ReactMarkdown>
          ) : (
            message.text
          )}
        </div>
        <div className={styles.timestamp} aria-label={`Sent at ${formatTime(message.timestamp)}`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
}

