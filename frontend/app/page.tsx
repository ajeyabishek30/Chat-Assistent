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

// Get API URL and ensure it has https:// prefix if it's a production URL
const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  // If it's a railway URL and doesn't start with http:// or https://, add https://
  if (url.includes('railway.app') && !url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  // If it's a production URL without protocol, add https://
  if (!url.startsWith('http://') && !url.startsWith('https://') && url !== 'localhost:5000') {
    return `https://${url}`;
  }
  return url;
};

const API_URL = getApiUrl();

// Fallback response generator (used when backend is not available)
function generateFallbackResponse(userMessage: string): string {
  const message = userMessage.toLowerCase().trim();

  // Greetings
  if (message.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening|hii)/)) {
    return "Hello! How can I assist you today?";
  }

  // Goodbye
  if (message.match(/^(bye|goodbye|see you|farewell|exit|quit)/)) {
    return "Goodbye! It was nice chatting with you. Have a great day!";
  }

  // How are you
  if (message.match(/^(how are you|how's it going|how do you do)/)) {
    return "I'm doing well, thank you for asking! How can I help you today?";
  }

  // Name questions
  if (message.match(/(what is your name|who are you|what's your name)/)) {
    return "I'm a Chat Assistant, here to help you with your questions!";
  }

  // Help
  if (message.match(/^(help|what can you do|what do you do)/)) {
    return "I can help you with various questions! Try asking me about:\n- Greetings and general conversation\n- Information about topics\n- Or just have a friendly chat!";
  }

  // Weather (mock response)
  if (message.match(/(weather|temperature|rain|sunny)/)) {
    return "I don't have access to real-time weather data, but I'd recommend checking a weather service for accurate information!";
  }

  // Time
  if (message.match(/(what time|current time|time now)/)) {
    const now = new Date();
    return `The current time is ${now.toLocaleTimeString()}.`;
  }

  // Date
  if (message.match(/(what date|today's date|current date)/)) {
    const now = new Date();
    return `Today's date is ${now.toLocaleDateString()}.`;
  }

  // Thank you
  if (message.match(/^(thanks|thank you|appreciate it)/)) {
    return "You're welcome! Is there anything else I can help you with?";
  }

  // Questions with question words
  if (message.match(/^(what|who|where|when|why|how)/)) {
    return "That's an interesting question! While I'm a simple rule-based assistant, I'd be happy to discuss general topics. Could you provide more details?";
  }

  // Default responses based on message length
  if (message.length < 5) {
    return "Could you please provide more details? I'd love to help!";
  }

  // Default response
  const responses = [
    "I understand. Could you tell me more about that?",
    "That's interesting! What else would you like to know?",
    "I see. How can I assist you further?",
    "Thanks for sharing! Is there anything specific you'd like help with?",
    "Got it! Feel free to ask me anything else."
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

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
        text: "Hello! I'm your chat assistant. How can I help you today?",
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

    // Track start time for minimum loading duration
    const startTime = Date.now();
    const minLoadingTime = 800; // Minimum 800ms to show typing indicator

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text.trim() }),
      });

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();

      // Ensure minimum loading time for better UX
      const elapsed = Date.now() - startTime;
      if (elapsed < minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsed));
      }

      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'assistant',
        timestamp: new Date(data.timestamp)
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Error sending message:', error);
      console.error('API URL:', API_URL);
      
      // Ensure minimum loading time even on error
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(minLoadingTime - elapsed, 600);
      await new Promise(resolve => setTimeout(resolve, remainingTime));
      
      // If backend is not available, use fallback response
      if (error.message?.includes('Failed to fetch') || 
          error.message?.includes('NetworkError') || 
          error.name === 'TypeError' ||
          error.message?.includes('Network request failed')) {
        // Use fallback response generator
        const fallbackResponse = generateFallbackResponse(text.trim());
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: fallbackResponse,
          sender: 'assistant',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Other errors - show error message
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `Error: ${error.message || 'Unable to connect to the server. Please check your connection.'}`,
          sender: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
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
        text: "Hello! I'm your chat assistant. How can I help you today?",
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

