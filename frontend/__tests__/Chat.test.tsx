import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../app/page';

// Mock fetch
global.fetch = jest.fn();

describe('Chat Assistant', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    // Clear localStorage
    localStorage.clear();
  });

  test('user message appears in DOM after clicking send', async () => {
    const user = userEvent.setup();
    
    // Mock successful API response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        response: 'Hello! How can I assist you today?',
        timestamp: new Date().toISOString(),
      }),
    });

    render(<Home />);

    // Find the input field
    const input = screen.getByPlaceholderText(/type your message/i);
    expect(input).toBeInTheDocument();

    // Type a message
    await user.type(input, 'Hello, how are you?');

    // Find and click the send button
    const sendButton = screen.getByLabelText(/send message/i);
    expect(sendButton).toBeInTheDocument();
    await user.click(sendButton);

    // Wait for the user message to appear in the DOM
    await waitFor(() => {
      expect(screen.getByText('Hello, how are you?')).toBeInTheDocument();
    });

    // Verify the message is displayed
    const userMessage = screen.getByText('Hello, how are you?');
    expect(userMessage).toBeInTheDocument();
  });

  test('user can submit message by pressing Enter', async () => {
    const user = userEvent.setup();
    
    // Mock successful API response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        response: 'Test response',
        timestamp: new Date().toISOString(),
      }),
    });

    render(<Home />);

    const input = screen.getByPlaceholderText(/type your message/i);
    
    // Type a message and press Enter
    await user.type(input, 'Test message{Enter}');

    // Wait for the message to appear
    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });
  });

  test('empty message cannot be sent', async () => {
    const user = userEvent.setup();
    
    render(<Home />);

    const input = screen.getByPlaceholderText(/type your message/i);
    const sendButton = screen.getByLabelText(/send message/i);

    // Send button should be disabled when input is empty
    expect(sendButton).toBeDisabled();

    // Try to type only spaces
    await user.type(input, '   ');
    
    // Button should still be disabled
    expect(sendButton).toBeDisabled();

    // Verify fetch was not called
    expect(fetch).not.toHaveBeenCalled();
  });
});

