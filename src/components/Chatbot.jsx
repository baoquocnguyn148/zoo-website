import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader } from 'lucide-react';
import './Chatbot.css';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: 'Xin chào! 👋 Tôi là trợ lý của Vườn Thú Hà Nội. Tôi có thể giúp bạn tìm hiểu về các loài động vật, giờ mở cửa, vé vào cửa, và các chính sách của vườn thú. Hỏi tôi bất cứ điều gì!',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.concat(userMessage).map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Handle SSE stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      const assistantMessageId = (Date.now() + 1).toString();

      // Create placeholder assistant message
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: 'assistant',
          content: '',
        },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.type === 'text-delta' && parsed.delta) {
                assistantContent += parsed.delta;
                // Update assistant message in real-time
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: assistantContent }
                      : msg
                  )
                );
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('[v0] Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content:
            'Xin lỗi, tôi gặp lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Xin chào! 👋 Tôi là trợ lý của Vườn Thú Hà Nội. Tôi có thể giúp bạn tìm hiểu về các loài động vật, giờ mở cửa, vé vào cửa, và các chính sách của vườn thú. Hỏi tôi bất cứ điều gì!',
      },
    ]);
  };

  return (
    <>
      {/* Chatbot Button */}
      <button
        className="chatbot-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open chat"
        title="Tư vấn với trợ lý ảo"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div>
              <h3>Vườn Thú Hà Nội</h3>
              <p>Trợ lý tư vấn ảo</p>
            </div>
            <button
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((message) => (
              <div key={message.id} className={`chatbot-message ${message.role}`}>
                <div className="chatbot-message-content">{message.content}</div>
              </div>
            ))}
            {isLoading && (
              <div className="chatbot-message assistant">
                <div className="chatbot-message-content">
                  <Loader size={16} className="spinner" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form className="chatbot-input-form" onSubmit={handleSendMessage}>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Hỏi tôi gì đó..."
              disabled={isLoading}
              className="chatbot-input"
            />
            <button type="submit" disabled={isLoading || !inputValue.trim()} className="chatbot-send">
              {isLoading ? <Loader size={18} /> : <Send size={18} />}
            </button>
            {messages.length > 1 && (
              <button
                type="button"
                onClick={handleClearChat}
                title="Xóa cuộc trò chuyện"
                className="chatbot-clear"
              >
                ↻
              </button>
            )}
          </form>
        </div>
      )}
    </>
  );
}
