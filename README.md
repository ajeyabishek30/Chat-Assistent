# Chat Assistant

A simple web-based chat assistant with a conversational user interface built with Next.js and Express.js.

## 🎯 Features

### Required Features ✅
- ✅ Chat UI with message input and message display
- ✅ Users can send messages
- ✅ Assistant responds using rule-based replies
- ✅ Chat-style layout (User vs Assistant messages)
- ✅ Maintains conversation history on the page
- ✅ Handles empty input gracefully

### Bonus Features 🎁
- ✅ Loading/typing indicator with animated dots
- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Chat history stored in localStorage
- ✅ Message timestamps displayed for each message
- ✅ Smooth animations for message appearance
- ✅ Clear chat history functionality
- ✅ Beautiful gradient UI design

### Advanced Features 🚀
- ✅ **Unit Testing**: Jest + React Testing Library
  - Backend test for empty message error handling
  - Frontend test for message appearing in DOM after send
- ✅ **Markdown Support**: Full markdown rendering with `react-markdown`
  - Inline code with syntax highlighting
  - Code blocks
  - Bold, italic, lists, and more
- ✅ **Dark/Light Mode Toggle**: Theme switching with CSS variables
  - System preference detection
  - Persistent theme selection
  - Smooth transitions
- ✅ **Accessibility (A11y)**: WCAG compliant
  - Proper ARIA labels and roles
  - Keyboard navigation (Enter to send)
  - High color contrast ratios
  - Screen reader support
  - Focus indicators
- ✅ **Auto-Scroll**: Smooth scroll to bottom on new messages

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (React 18) with TypeScript
- **Backend**: Node.js & Express.js
- **Styling**: CSS Modules with responsive design and CSS variables
- **Storage**: localStorage for chat history persistence
- **Testing**: Jest + React Testing Library + Supertest
- **Markdown**: react-markdown for rich text rendering

## 📁 Project Structure

```
Chat-Assistant/
├── frontend/                 # Next.js frontend application
│   ├── app/
│   │   ├── components/      # React components
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── TypingIndicator.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── __tests__/       # Frontend tests
│   │   │   └── Chat.test.tsx
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Main chat page
│   │   └── globals.css      # Global styles with CSS variables
│   ├── jest.config.js       # Jest configuration
│   ├── jest.setup.js        # Jest setup file
│   ├── package.json
│   └── next.config.js
├── backend/                  # Express.js backend API
│   ├── __tests__/           # Backend tests
│   │   └── server.test.js
│   ├── server.js            # Main server file
│   ├── jest.config.js       # Jest configuration
│   └── package.json
├── package.json             # Root package.json with scripts
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Chat-Assistant
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```
   
   Or install manually:
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

### Running the Application

#### Development Mode (Recommended)

Run both frontend and backend concurrently:

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

#### Run Separately

**Backend only:**
```bash
npm run dev:backend
```

**Frontend only:**
```bash
npm run dev:frontend
```

### Production Build

1. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   npm start
   ```

2. **Start the backend:**
   ```bash
   cd backend
   npm start
   ```

## 🎨 Approach & Logic

### Frontend Architecture

1. **Component Structure**
   - `page.tsx`: Main chat container managing state and API calls
   - `ChatMessage.tsx`: Individual message component with user/assistant styling
   - `ChatInput.tsx`: Input field with send button and keyboard handling
   - `TypingIndicator.tsx`: Animated loading indicator

2. **State Management**
   - Uses React hooks (`useState`, `useEffect`) for local state
   - Messages stored in component state and synchronized with localStorage
   - Auto-scrolls to bottom when new messages arrive

3. **Persistence**
   - Chat history automatically saved to localStorage
   - History restored on page reload
   - Clear button to reset conversation

4. **User Experience**
   - Empty input validation (prevents sending empty messages)
   - Loading states with typing indicator
   - Smooth animations for message appearance
   - Responsive design for all screen sizes
   - Timestamps on all messages

### Backend Architecture

1. **API Endpoints**
   - `POST /api/chat`: Main chat endpoint that processes user messages
   - `GET /api/health`: Health check endpoint

2. **Rule-Based Response Logic**
   The assistant uses pattern matching to provide contextual responses:
   - **Greetings**: Recognizes various greeting patterns
   - **Goodbyes**: Handles farewell messages
   - **Questions**: Responds to what/who/where/when/why/how questions
   - **Time/Date**: Provides current time and date
   - **Help**: Offers assistance information
   - **Default**: Random contextual responses for unmatched patterns

3. **Response Timing**
   - Simulates natural conversation with random delay (500-1500ms)
   - Provides better UX than instant responses

4. **Error Handling**
   - Validates empty messages
   - Returns appropriate error responses
   - Handles edge cases gracefully

### Design Decisions

1. **Next.js App Router**: Used modern Next.js 14 with App Router for better performance and developer experience
2. **TypeScript**: Type safety for better code quality and maintainability
3. **CSS Modules**: Scoped styling to prevent conflicts
4. **CSS Variables**: Used for theme switching (dark/light mode) with smooth transitions
5. **localStorage**: Simple client-side persistence without database complexity
6. **Responsive Design**: Mobile-first approach with breakpoints for tablet and desktop
7. **Animations**: Subtle animations enhance UX without being distracting
8. **Accessibility First**: WCAG compliant with proper ARIA labels, keyboard navigation, and high contrast ratios
9. **Markdown Support**: Rich text rendering for better user experience with code examples
10. **Testing**: Unit tests for critical functionality to ensure reliability

## 🌐 Deployment

### Frontend (Vercel/Netlify)

1. **Vercel:**
   ```bash
   cd frontend
   vercel
   ```
   Set environment variable: `NEXT_PUBLIC_API_URL=https://your-backend-url.com`

2. **Netlify:**
   - Connect GitHub repository
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/.next`
   - Set environment variable: `NEXT_PUBLIC_API_URL`

### Backend (Railway/Heroku/Render)

1. **Railway/Heroku/Render:**
   - Connect GitHub repository
   - Set root directory to `backend`
   - Install command: `npm install`
   - Start command: `npm start`
   - Set PORT environment variable (usually auto-assigned)

### Environment Variables

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Backend (.env):**
```
PORT=5000
```

## 🧪 Testing

### Running Tests

**Frontend tests:**
```bash
cd frontend
npm test
```

**Backend tests:**
```bash
cd backend
npm test
```

**Watch mode (for development):**
```bash
cd frontend
npm run test:watch
```

### Test Coverage

- **Backend**: Tests for empty message error handling, valid message responses, and health check endpoint
- **Frontend**: Tests for message rendering, Enter key submission, and empty input validation

### Manual Testing

1. Start the application: `npm run dev`
2. Open `http://localhost:3000` in your browser
3. Try sending messages like:
   - "Hello"
   - "How are you?"
   - "What time is it?"
   - "Help"
   - "Thank you"
   - "Goodbye"
   - Try markdown: "Try `npm install` to install packages"
   - Try **bold** and *italic* text
4. Test dark mode toggle
5. Test keyboard navigation (Enter to send)
6. Test responsive design on different screen sizes

## 📝 API Documentation

### POST /api/chat

Send a message to the chat assistant.

**Request:**
```json
{
  "message": "Hello, how are you?"
}
```

**Response:**
```json
{
  "response": "Hello! How can I assist you today?",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Error Response:**
```json
{
  "error": "Message cannot be empty",
  "response": "Please enter a message to continue our conversation."
}
```

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Chat Assistant API is running"
}
```

## 🎯 Future Enhancements

Potential improvements for production:
- User authentication
- Database integration for chat history
- WebSocket support for real-time communication
- Integration with AI/ML models for smarter responses
- Multi-language support
- File upload capabilities
- Message search functionality

## 📄 License

MIT License

## 👤 Author

Built as part of an interview assessment task.

---

**Note**: Make sure to update the `NEXT_PUBLIC_API_URL` environment variable when deploying to production to point to your backend server URL.

