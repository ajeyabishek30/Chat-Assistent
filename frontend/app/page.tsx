'use client';

import { useState, useEffect, useRef } from 'react';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import TypingIndicator from './components/TypingIndicator';
import Sidebar, { Chat } from './components/Sidebar';
import AccountModal from './components/AccountModal';
import ConfirmationModal from './components/ConfirmationModal';
import styles from './page.module.css';
import { sendChatMessage, saveChat, loadChat, listChats, deleteChat as deleteFirebaseChat } from '../lib/api';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatData {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// Generate a simple session ID for anonymous users
const getSessionId = () => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

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
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'matrix'>('light');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [username, setUsername] = useState('demo30');
  const [name, setName] = useState('DEMO');
  const [sessionId] = useState(getSessionId());
  const [isSyncing, setIsSyncing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Close sidebar on mobile by default
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'matrix' | null;
    if (savedTheme && ['light', 'dark', 'matrix'].includes(savedTheme)) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      setTheme(initialTheme);
      document.documentElement.setAttribute('data-theme', initialTheme);
    }
  }, []);

  // Load chats from Firebase on mount
  useEffect(() => {
    const loadChatsFromFirebase = async () => {
      try {
        setIsSyncing(true);
        const response = await listChats(undefined, sessionId);
        
        if (response.success && response.chats.length > 0) {
          const chatList: Chat[] = response.chats.map(chat => ({
            id: chat.id,
            title: chat.title,
            createdAt: chat.createdAt ? new Date(chat.createdAt) : new Date(),
            updatedAt: chat.updatedAt ? new Date(chat.updatedAt) : new Date()
          }));
          
          setChats(chatList);
          
          // Load the most recent chat
          const mostRecentChatId = response.chats[0].id;
          const chatResponse = await loadChat(mostRecentChatId);
          
          if (chatResponse.success) {
            setCurrentChatId(mostRecentChatId);
            setMessages(chatResponse.chat.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            })));
          } else {
            createNewChat();
          }
        } else {
          // Fallback to localStorage if Firebase fails
          const savedChats = localStorage.getItem('chats');
          if (savedChats) {
            try {
              const parsedChats: ChatData[] = JSON.parse(savedChats).map((chat: any) => ({
                ...chat,
                createdAt: new Date(chat.createdAt),
                updatedAt: new Date(chat.updatedAt),
                messages: chat.messages.map((msg: any) => ({
                  ...msg,
                  timestamp: new Date(msg.timestamp)
                }))
              }));
              
              const chatList: Chat[] = parsedChats.map(chat => ({
                id: chat.id,
                title: chat.title,
                createdAt: chat.createdAt,
                updatedAt: chat.updatedAt
              }));
              
              setChats(chatList);
              
              if (parsedChats.length > 0) {
                const mostRecentChat = parsedChats.reduce((latest, chat) => 
                  chat.updatedAt > latest.updatedAt ? chat : latest
                );
                setCurrentChatId(mostRecentChat.id);
                setMessages(mostRecentChat.messages);
              } else {
                createNewChat();
              }
            } catch (error) {
              console.error('Error loading chats from localStorage:', error);
              createNewChat();
            }
          } else {
            createNewChat();
          }
        }
      } catch (error) {
        console.error('Error loading chats from Firebase:', error);
        // Fallback to localStorage
        const savedChats = localStorage.getItem('chats');
        if (savedChats) {
          try {
            const parsedChats: ChatData[] = JSON.parse(savedChats).map((chat: any) => ({
              ...chat,
              createdAt: new Date(chat.createdAt),
              updatedAt: new Date(chat.updatedAt),
              messages: chat.messages.map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp)
              }))
            }));
            
            const chatList: Chat[] = parsedChats.map(chat => ({
              id: chat.id,
              title: chat.title,
              createdAt: chat.createdAt,
              updatedAt: chat.updatedAt
            }));
            
            setChats(chatList);
            
            if (parsedChats.length > 0) {
              const mostRecentChat = parsedChats.reduce((latest, chat) => 
                chat.updatedAt > latest.updatedAt ? chat : latest
              );
              setCurrentChatId(mostRecentChat.id);
              setMessages(mostRecentChat.messages);
            } else {
              createNewChat();
            }
          } catch (error) {
            console.error('Error loading chats:', error);
            createNewChat();
          }
        } else {
          createNewChat();
        }
      } finally {
        setIsSyncing(false);
      }
    };

    loadChatsFromFirebase();
  }, []);

  // Save chats to Firebase and localStorage whenever chats or messages change
  useEffect(() => {
    if (currentChatId && messages.length > 0) {
      const saveChatData = async () => {
        // Save to localStorage first (immediate)
        const savedChats = localStorage.getItem('chats');
        let allChats: ChatData[] = savedChats ? JSON.parse(savedChats) : [];
        
        const chatIndex = allChats.findIndex(chat => chat.id === currentChatId);
        const firstUserMessage = messages.find(msg => msg.sender === 'user');
        const chatTitle = firstUserMessage 
          ? firstUserMessage.text.substring(0, 50) 
          : (chatIndex >= 0 ? allChats[chatIndex].title : 'New Chat');
        
        const updatedChat: ChatData = {
          id: currentChatId,
          title: chatTitle,
          messages: messages,
          createdAt: chatIndex >= 0 ? new Date(allChats[chatIndex].createdAt) : new Date(),
          updatedAt: new Date()
        };
        
        if (chatIndex >= 0) {
          allChats[chatIndex] = updatedChat;
        } else {
          allChats.push(updatedChat);
        }
        
        const chatList: Chat[] = allChats.map(chat => ({
          id: chat.id,
          title: chat.title,
          createdAt: new Date(chat.createdAt),
          updatedAt: new Date(chat.updatedAt)
        }));
        
        setChats(chatList);
        localStorage.setItem('chats', JSON.stringify(allChats));

        // Save to Firebase (async)
        try {
          await saveChat({
            chatId: currentChatId,
            title: chatTitle,
            messages: messages.map(msg => ({
              ...msg,
              timestamp: msg.timestamp.toISOString()
            })),
            sessionId: sessionId
          });
        } catch (error) {
          console.error('Error saving to Firebase:', error);
          // Continue with local storage only
        }
      };

      saveChatData();
    }
  }, [messages, currentChatId, sessionId]);

  const createNewChat = () => {
    const newChatId = Date.now().toString();
    const greeting: Message = {
      id: Date.now().toString(),
      text: "Hello! I'm your chat assistant. How can I help you today?",
      sender: 'assistant',
      timestamp: new Date()
    };
    
    setCurrentChatId(newChatId);
    setMessages([greeting]);
  };

  const handleNewChat = () => {
    createNewChat();
  };

  const handleSelectChat = async (chatId: string) => {
    try {
      // Try loading from Firebase first
      const response = await loadChat(chatId);
      if (response.success) {
        setCurrentChatId(chatId);
        setMessages(response.chat.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
        return;
      }
    } catch (error) {
      console.error('Error loading chat from Firebase:', error);
    }

    // Fallback to localStorage
    const savedChats = localStorage.getItem('chats');
    if (savedChats) {
      try {
        const allChats: ChatData[] = JSON.parse(savedChats).map((chat: any) => ({
          ...chat,
          createdAt: new Date(chat.createdAt),
          updatedAt: new Date(chat.updatedAt),
          messages: chat.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        
        const selectedChat = allChats.find(chat => chat.id === chatId);
        if (selectedChat) {
          setCurrentChatId(chatId);
          setMessages(selectedChat.messages);
        }
      } catch (error) {
        console.error('Error loading chat:', error);
      }
    }
  };

  const handleDeleteChat = (chatId: string) => {
    setChatToDelete(chatId);
    setShowDeleteModal(true);
  };

  const confirmDeleteChat = async () => {
    if (!chatToDelete) return;
    
    // Delete from Firebase first
    try {
      await deleteFirebaseChat(chatToDelete);
    } catch (error) {
      console.error('Error deleting from Firebase:', error);
    }

    // Delete from localStorage
    const savedChats = localStorage.getItem('chats');
    if (savedChats) {
      try {
        const allChats: ChatData[] = JSON.parse(savedChats);
        const filteredChats = allChats.filter(chat => chat.id !== chatToDelete);
        
        if (filteredChats.length > 0) {
          localStorage.setItem('chats', JSON.stringify(filteredChats));
          const chatList: Chat[] = filteredChats.map(chat => ({
            id: chat.id,
            title: chat.title,
            createdAt: new Date(chat.createdAt),
            updatedAt: new Date(chat.updatedAt)
          }));
          setChats(chatList);
          
          // If deleted chat was current, switch to most recent
          if (currentChatId === chatToDelete) {
            const mostRecentChat = filteredChats.reduce((latest, chat) => 
              new Date(chat.updatedAt) > new Date(latest.updatedAt) ? chat : latest
            );
            setCurrentChatId(mostRecentChat.id);
            setMessages(mostRecentChat.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            })));
          }
        } else {
          // If no chats left, create a new one
          localStorage.removeItem('chats');
          setChats([]);
          createNewChat();
        }
      } catch (error) {
        console.error('Error deleting chat:', error);
      }
    }
    
    setShowDeleteModal(false);
    setChatToDelete(null);
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) {
      return;
    }

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
    const minLoadingTime = 800;

    try {
      const data = await sendChatMessage(text.trim());

      // Ensure minimum loading time for better UX
      const elapsed = Date.now() - startTime;
      if (elapsed < minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsed));
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'assistant',
        timestamp: new Date(data.timestamp)
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Error sending message:', error);
      
      // Ensure minimum loading time even on error
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(minLoadingTime - elapsed, 600);
      await new Promise(resolve => setTimeout(resolve, remainingTime));
      
      // Use fallback response for network errors
      const fallbackResponse = generateFallbackResponse(text.trim());
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: fallbackResponse,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setShowClearModal(true);
  };

  const confirmClearHistory = () => {
    const greeting: Message = {
      id: Date.now().toString(),
      text: "Hello! I'm your chat assistant. How can I help you today?",
      sender: 'assistant',
      timestamp: new Date()
    };
    setMessages([greeting]);
    setShowClearModal(false);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'matrix') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleChangeAccount = () => {
    alert('Change account functionality would be implemented here');
  };

  const handleLogout = () => {
    localStorage.removeItem('chats');
    localStorage.removeItem('theme');
    setChats([]);
    setMessages([]);
    setCurrentChatId(null);
    setShowAccountModal(false);
    
    createNewChat();
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultTheme = prefersDark ? 'dark' : 'light';
    setTheme(defaultTheme);
    document.documentElement.setAttribute('data-theme', defaultTheme);
  };

  const handleEditMessage = async (editedText: string) => {
    let lastUserMessageIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === 'user') {
        lastUserMessageIndex = i;
        break;
      }
    }

    if (lastUserMessageIndex === -1) return;

    const updatedMessages = [...messages];
    updatedMessages[lastUserMessageIndex] = {
      ...updatedMessages[lastUserMessageIndex],
      text: editedText,
      timestamp: new Date()
    };

    if (lastUserMessageIndex + 1 < updatedMessages.length && 
        updatedMessages[lastUserMessageIndex + 1].sender === 'assistant') {
      updatedMessages.splice(lastUserMessageIndex + 1, 1);
    }

    setMessages(updatedMessages);
    setIsLoading(true);

    const startTime = Date.now();
    const minLoadingTime = 800;

    try {
      const data = await sendChatMessage(editedText);

      const elapsed = Date.now() - startTime;
      if (elapsed < minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsed));
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'assistant',
        timestamp: new Date(data.timestamp)
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Error regenerating response:', error);
      
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(minLoadingTime - elapsed, 600);
      await new Promise(resolve => setTimeout(resolve, remainingTime));
      
      const fallbackResponse = generateFallbackResponse(editedText.trim());
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: fallbackResponse,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

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
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onSettingsClick={() => setShowAccountModal(true)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className={styles.chatContainer} ref={chatContainerRef}>
        <div className={styles.chatHeader}>
          <button
            className={styles.menuButton}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
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

      <ConfirmationModal
        isOpen={showClearModal}
        title="Clear Chat"
        message="Are you sure you want to clear this chat? This action cannot be undone."
        confirmText="Clear"
        cancelText="Cancel"
        onConfirm={confirmClearHistory}
        onCancel={() => setShowClearModal(false)}
        type="warning"
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Chat"
        message="Are you sure you want to delete this chat? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteChat}
        onCancel={() => {
          setShowDeleteModal(false);
          setChatToDelete(null);
        }}
        type="danger"
      />

      <AccountModal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        onLogout={handleLogout}
        onChangeAccount={handleChangeAccount}
        theme={theme}
        onThemeChange={handleThemeChange}
        username={username}
        name={name}
      />
    </main>
  );
}
