'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../page';
import styles from './ChatMessage.module.css';

interface ChatMessageProps {
  message: Message;
  isLastUserMessage?: boolean;
  onEdit?: (editedText: string) => void;
}

export default function ChatMessage({ message, isLastUserMessage = false, onEdit }: ChatMessageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);
  const editInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.style.height = 'auto';
      editInputRef.current.style.height = `${editInputRef.current.scrollHeight}px`;
    }
  }, [isEditing]);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditText(message.text);
  };

  const handleSaveEdit = () => {
    if (editText.trim() && onEdit) {
      onEdit(editText.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditText(message.text);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
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
        {isEditing ? (
          <div className={styles.editContainer}>
            <textarea
              ref={editInputRef}
              value={editText}
              onChange={(e) => {
                setEditText(e.target.value);
                if (editInputRef.current) {
                  editInputRef.current.style.height = 'auto';
                  editInputRef.current.style.height = `${editInputRef.current.scrollHeight}px`;
                }
              }}
              onKeyDown={handleKeyPress}
              className={styles.editInput}
              rows={1}
            />
            <div className={styles.editActions}>
              <button
                onClick={handleSaveEdit}
                className={styles.saveButton}
                disabled={!editText.trim()}
                aria-label="Save edit"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className={styles.cancelButton}
                aria-label="Cancel edit"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.messageContent}>
              {message.sender === 'assistant' ? (
                <ReactMarkdown
                  components={{
                    code: ({ className, children, ...props }) => {
                      const isInline = !className;
                      return isInline ? (
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
            <div className={styles.messageFooter}>
              <div className={styles.timestamp} aria-label={`Sent at ${formatTime(message.timestamp)}`}>
                {formatTime(message.timestamp)}
              </div>
              {isLastUserMessage && message.sender === 'user' && onEdit && (
                <button
                  onClick={handleEditClick}
                  className={styles.editButton}
                  aria-label="Edit message"
                  title="Edit message"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Edit
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

