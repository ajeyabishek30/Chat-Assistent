const request = require('supertest');
const express = require('express');
const cors = require('cors');

// Import the app logic (we'll need to refactor server.js slightly)
// For now, let's test the endpoint directly
const app = express();
app.use(cors());
app.use(express.json());

// Rule-based response logic (same as server.js)
function generateResponse(userMessage) {
  const message = userMessage.toLowerCase().trim();

  if (message.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/)) {
    return "Hello! How can I assist you today?";
  }

  if (message.match(/^(bye|goodbye|see you|farewell|exit|quit)/)) {
    return "Goodbye! It was nice chatting with you. Have a great day!";
  }

  if (message.match(/^(how are you|how's it going|how do you do)/)) {
    return "I'm doing well, thank you for asking! How can I help you today?";
  }

  if (message.match(/(what is your name|who are you|what's your name)/)) {
    return "I'm a Chat Assistant, here to help you with your questions!";
  }

  if (message.match(/^(help|what can you do|what do you do)/)) {
    return "I can help you with various questions! Try asking me about:\n- Greetings and general conversation\n- Information about topics\n- Or just have a friendly chat!";
  }

  if (message.match(/(weather|temperature|rain|sunny)/)) {
    return "I don't have access to real-time weather data, but I'd recommend checking a weather service for accurate information!";
  }

  if (message.match(/(what time|current time|time now)/)) {
    const now = new Date();
    return `The current time is ${now.toLocaleTimeString()}.`;
  }

  if (message.match(/(what date|today's date|current date)/)) {
    const now = new Date();
    return `Today's date is ${now.toLocaleDateString()}.`;
  }

  if (message.match(/^(thanks|thank you|appreciate it)/)) {
    return "You're welcome! Is there anything else I can help you with?";
  }

  if (message.match(/^(what|who|where|when|why|how)/)) {
    return "That's an interesting question! While I'm a simple rule-based assistant, I'd be happy to discuss general topics. Could you provide more details?";
  }

  if (message.length < 5) {
    return "Could you please provide more details? I'd love to help!";
  }

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
  }, 100); // Faster for tests
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Chat Assistant API is running' });
});

describe('Chat API', () => {
  describe('POST /api/chat', () => {
    test('should return error for empty message', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({ message: '' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Message cannot be empty');
      expect(response.body).toHaveProperty('response');
    });

    test('should return error for message with only whitespace', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({ message: '   ' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Message cannot be empty');
    });

    test('should return error when message is missing', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should return response for valid message', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({ message: 'Hello' })
        .expect(200);

      expect(response.body).toHaveProperty('response');
      expect(response.body).toHaveProperty('timestamp');
      expect(typeof response.body.response).toBe('string');
      expect(response.body.response.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/health', () => {
    test('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('ok');
    });
  });
});

