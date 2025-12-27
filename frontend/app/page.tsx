'use client';

import { useState, useEffect, useRef } from 'react';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import TypingIndicator from './components/TypingIndicator';
import ThemeToggle from './components/ThemeToggle';
import SignInButton from './components/SignInButton';
import styles from './page.module.css';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'matrix'>('light');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'matrix' | null;
    if (savedTheme && ['light', 'dark', 'matrix'].includes(savedTheme)) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      setTheme(initialTheme);
      document.documentElement.setAttribute('data-theme', initialTheme);
    }
  }, []);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    } else {
      // Initial greeting
      const greeting: Message = {
        id: Date.now().toString(),
        text: "Hello! I'm your chat assistant. How can I help you today?\n\nYou can try:\n- `npm install` (markdown code example)\n- **Bold text**\n- *Italic text*",
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages([greeting]);
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) {
      return; // Handle empty input gracefully
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'assistant',
        timestamp: new Date(data.timestamp)
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I encountered an error. Please try again.",
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear the chat history?')) {
      setMessages([]);
      localStorage.removeItem('chatHistory');
      // Reset with greeting
      const greeting: Message = {
        id: Date.now().toString(),
        text: "Hello! I'm your chat assistant. How can I help you today?\n\nYou can try:\n- `npm install` (markdown code example)\n- **Bold text**\n- *Italic text*",
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages([greeting]);
    }
  };

  const handleThemeToggle = () => {
    let newTheme: 'light' | 'dark' | 'matrix';
    switch (theme) {
      case 'light':
        newTheme = 'dark';
        break;
      case 'dark':
        newTheme = 'matrix';
        break;
      case 'matrix':
        newTheme = 'light';
        break;
      default:
        newTheme = 'light';
    }
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleSignIn = () => {
    // Placeholder for sign in functionality
    alert('Sign in functionality would be implemented here');
  };

  const handleEditMessage = async (editedText: string) => {
    // Find the last user message index
    let lastUserMessageIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === 'user') {
        lastUserMessageIndex = i;
        break;
      }
    }

    if (lastUserMessageIndex === -1) return;

    // Update the user message
    const updatedMessages = [...messages];
    updatedMessages[lastUserMessageIndex] = {
      ...updatedMessages[lastUserMessageIndex],
      text: editedText,
      timestamp: new Date()
    };

    // Remove the assistant's response if it exists (the message after the user message)
    if (lastUserMessageIndex + 1 < updatedMessages.length && 
        updatedMessages[lastUserMessageIndex + 1].sender === 'assistant') {
      updatedMessages.splice(lastUserMessageIndex + 1, 1);
    }

    setMessages(updatedMessages);
    setIsLoading(true);

    // Regenerate assistant response
    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: editedText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      // Add new assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'assistant',
        timestamp: new Date(data.timestamp)
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error regenerating response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I encountered an error. Please try again.",
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Find the last user message index
  const getLastUserMessageIndex = () => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === 'user') {
        return i;
      }
    }
    return -1;
  };

  const lastUserMessageIndex = getLastUserMessageIndex();

  return (
    <main className={styles.main}>
      {/* Top-right corner actions */}
      <div className={styles.topRightActions}>
        <SignInButton onClick={handleSignIn} />
        <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
      </div>

      <div className={styles.chatContainer} ref={chatContainerRef}>
        <div className={styles.chatHeader}>
          <h1 className={styles.title}>Chat Assistant</h1>
          <div className={styles.headerActions}>
            <button
              onClick={handleClearHistory}
              className={styles.clearButton}
              title="Clear chat history"
              aria-label="Clear chat history"
            >
              Clear
            </button>
          </div>
        </div>
        
        <div 
          className={styles.messagesContainer}
          role="log"
          aria-label="Chat messages"
          aria-live="polite"
          aria-atomic="false"
        >
          {messages.map((message, index) => (
            <ChatMessage 
              key={message.id} 
              message={message}
              isLastUserMessage={index === lastUserMessageIndex}
              onEdit={index === lastUserMessageIndex ? handleEditMessage : undefined}
            />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} aria-hidden="true" />
        </div>

        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>
    </main>
  );
}

