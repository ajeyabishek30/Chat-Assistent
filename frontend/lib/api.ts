// API service for Firebase Functions
const FUNCTIONS_URL = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL || 
  'https://us-central1-chat-assistant-6112c.cloudfunctions.net';

export interface ChatResponse {
  response: string;
  timestamp: string;
}

export interface SaveChatRequest {
  chatId?: string;
  title: string;
  messages: any[];
  userId?: string | null;
  sessionId?: string | null;
}

export interface SaveChatResponse {
  success: boolean;
  chatId: string;
}

export interface LoadChatResponse {
  success: boolean;
  chat: {
    id: string;
    title: string;
    messages: any[];
    createdAt: string | null;
    updatedAt: string | null;
  };
}

export interface ListChatsResponse {
  success: boolean;
  chats: Array<{
    id: string;
    title: string;
    createdAt: string | null;
    updatedAt: string | null;
    messageCount: number;
  }>;
}

// Send a chat message
export async function sendChatMessage(message: string): Promise<ChatResponse> {
  const response = await fetch(`${FUNCTIONS_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  return response.json();
}

// Save a chat to Firestore
export async function saveChat(data: SaveChatRequest): Promise<SaveChatResponse> {
  const response = await fetch(`${FUNCTIONS_URL}/saveChat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to save chat');
  }

  return response.json();
}

// Load a specific chat from Firestore
export async function loadChat(chatId: string): Promise<LoadChatResponse> {
  const response = await fetch(`${FUNCTIONS_URL}/loadChat?chatId=${chatId}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to load chat');
  }

  return response.json();
}

// List all chats for a user or session
export async function listChats(userId?: string, sessionId?: string): Promise<ListChatsResponse> {
  const params = new URLSearchParams();
  if (userId) params.append('userId', userId);
  if (sessionId) params.append('sessionId', sessionId);

  const response = await fetch(`${FUNCTIONS_URL}/listChats?${params.toString()}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to list chats');
  }

  return response.json();
}

// Delete a chat
export async function deleteChat(chatId: string): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${FUNCTIONS_URL}/deleteChat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ chatId }),
  });

  if (!response.ok) {
    throw new Error('Failed to delete chat');
  }

  return response.json();
}

// Health check
export async function checkHealth(): Promise<{ status: string; message: string; timestamp: string }> {
  const response = await fetch(`${FUNCTIONS_URL}/health`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Health check failed');
  }

  return response.json();
}
