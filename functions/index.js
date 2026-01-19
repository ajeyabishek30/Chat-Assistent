const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors');

// Initialize Firebase Admin
admin.initializeApp();

// Configure CORS
const corsHandler = cors({
  origin: true,
  credentials: true
});

// Rule-based response logic (same as original backend)
function generateResponse(userMessage) {
  const message = userMessage.toLowerCase().trim();

  // Greetings
  if (message.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/)) {
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

// Chat endpoint - Firebase Function
exports.chat = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, () => {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;

    // Handle empty input
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Message cannot be empty',
        response: "Please enter a message to continue our conversation."
      });
    }

    // Simulate typing delay for better UX
    setTimeout(() => {
      const response = generateResponse(message);
      res.json({ 
        response,
        timestamp: new Date().toISOString()
      });
    }, 500 + Math.random() * 1000); // Random delay between 500ms and 1500ms
  });
});

// Health check endpoint
exports.health = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, () => {
    res.json({ 
      status: 'ok', 
      message: 'Chat Assistant API is running on Firebase Functions',
      timestamp: new Date().toISOString()
    });
  });
});

// Save chat to Firestore
exports.saveChat = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const { chatId, title, messages, userId, sessionId } = req.body;

      if (!messages || messages.length === 0) {
        return res.status(400).json({ error: 'Messages are required' });
      }

      const db = admin.firestore();
      const chatData = {
        title: title || 'New Chat',
        messages: messages,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        userId: userId || null,
        sessionId: sessionId || null
      };

      if (chatId) {
        // Update existing chat
        await db.collection('chats').doc(chatId).update(chatData);
        res.json({ success: true, chatId });
      } else {
        // Create new chat
        chatData.createdAt = admin.firestore.FieldValue.serverTimestamp();
        const docRef = await db.collection('chats').add(chatData);
        res.json({ success: true, chatId: docRef.id });
      }
    } catch (error) {
      console.error('Error saving chat:', error);
      res.status(500).json({ error: 'Failed to save chat' });
    }
  });
});

// Load chat from Firestore
exports.loadChat = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const chatId = req.query.chatId;

      if (!chatId) {
        return res.status(400).json({ error: 'chatId is required' });
      }

      const db = admin.firestore();
      const doc = await db.collection('chats').doc(chatId).get();

      if (!doc.exists) {
        return res.status(404).json({ error: 'Chat not found' });
      }

      const chatData = doc.data();
      res.json({ 
        success: true, 
        chat: {
          id: doc.id,
          ...chatData,
          createdAt: chatData.createdAt?.toDate?.()?.toISOString() || null,
          updatedAt: chatData.updatedAt?.toDate?.()?.toISOString() || null
        }
      });
    } catch (error) {
      console.error('Error loading chat:', error);
      res.status(500).json({ error: 'Failed to load chat' });
    }
  });
});

// List all chats for a user/session
exports.listChats = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const { userId, sessionId } = req.query;

      if (!userId && !sessionId) {
        return res.status(400).json({ error: 'userId or sessionId is required' });
      }

      const db = admin.firestore();
      let query = db.collection('chats');

      if (userId) {
        query = query.where('userId', '==', userId);
      } else if (sessionId) {
        query = query.where('sessionId', '==', sessionId);
      }

      query = query.orderBy('updatedAt', 'desc').limit(50);

      const snapshot = await query.get();
      const chats = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        chats.push({
          id: doc.id,
          title: data.title,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
          messageCount: data.messages?.length || 0
        });
      });

      res.json({ success: true, chats });
    } catch (error) {
      console.error('Error listing chats:', error);
      res.status(500).json({ error: 'Failed to list chats' });
    }
  });
});

// Delete a chat
exports.deleteChat = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    if (req.method !== 'DELETE' && req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const chatId = req.body.chatId || req.query.chatId;

      if (!chatId) {
        return res.status(400).json({ error: 'chatId is required' });
      }

      const db = admin.firestore();
      await db.collection('chats').doc(chatId).delete();

      res.json({ success: true, message: 'Chat deleted successfully' });
    } catch (error) {
      console.error('Error deleting chat:', error);
      res.status(500).json({ error: 'Failed to delete chat' });
    }
  });
});
