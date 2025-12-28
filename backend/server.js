const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Configure CORS to allow requests from Vercel and localhost
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost and Vercel domains
    if (
      origin.includes('localhost') ||
      origin.includes('vercel.app') ||
      origin.includes('127.0.0.1')
    ) {
      return callback(null, true);
    }
    
    // Allow all origins for now (can be restricted later)
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

// Rule-based response logic
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

// Chat endpoint
app.post('/api/chat', (req, res) => {
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Chat Assistant API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

