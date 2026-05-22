import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader } from 'lucide-react';
import { animals } from '../data/animals';
import './ChatBot.css';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const buildSystemPrompt = () => {
  const animalList = animals
    .map(a => `- ${a.name} (${a.scientificName}): ${a.description} Môi trường: ${a.habitat}. Thức ăn: ${a.diet}. Bảo tồn: ${a.conservation}.`)
    .join('\n');

  return `Bạn là trợ lý ảo của Vườn Thú Hà Nội (Hanoi Zoo). Hãy trả lời thân thiện, ngắn gọn bằng tiếng Việt.

THÔNG TIN VƯỜN THÚ:
- Tên: Vườn Thú Hà Nội — Thiên Nhiên Kỳ Thú
- Địa chỉ: Số 1 Cầu Giấy, Giảng Võ, Hà Nội
- Điện thoại: (028) 3829 1466
- Email: contact@hanoi.org
- Giờ mở cửa: Thứ 2–Thứ 6: 08:00–17:00 | Thứ 7, CN, Lễ: 07:30–18:00. Mở cửa tất cả các ngày trong năm.
- Quy mô: 3.000+ cá thể động vật, 700+ loài thực vật quý hiếm, 100+ chương trình bảo tồn.

GIÁ VÉ:
- Vé Người lớn: 300.000đ (khách trên 1m3)
- Vé Trẻ em: 150.000đ (khách từ 1m–1m3, miễn phí dưới 1m)
- Vé Gia đình: 750.000đ (gồm 2 người lớn & 2 trẻ em)
- Có thể mua vé trực tuyến trên website tại mục "Mua vé".
- Vé đã mua không hoàn lại nhưng có thể đổi ngày 1 lần (trước ít nhất 24 giờ).

NỘI QUY:
- Tuyệt đối không chọc phá, ném đồ vật vào chuồng trại.
- Không tự ý cho động vật ăn thức ăn bên ngoài.
- Được chụp ảnh nhưng không dùng flash ở khu vực cấm, không trèo qua lan can.
- Bỏ rác đúng nơi, không hút thuốc trong khuôn viên.

CÁC LOÀI ĐỘNG VẬT:
${animalList}

QUY TẮC TRẢ LỜI:
- Chỉ trả lời các câu hỏi liên quan đến vườn thú, động vật, vé, nội quy, giờ mở cửa.
- Nếu câu hỏi ngoài phạm vi, lịch sự từ chối và gợi ý hỏi về vườn thú.
- Trả lời ngắn gọn, dễ hiểu, thân thiện.
- Khi gợi ý mua vé, hướng dẫn khách vào mục "Mua vé" trên website.`;
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Xin chào! Tôi là trợ lý ảo của Vườn Thú Hà Nội. Bạn cần hỏi gì về vườn thú, giá vé, hay các loài động vật không?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const apiMessages = [
        { role: 'system', content: buildSystemPrompt() },
        ...updatedMessages.map(m => ({ role: m.role, content: m.content }))
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: apiMessages,
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = data.choices[0].message.content;
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau hoặc liên hệ (028) 3829 1466 để được hỗ trợ.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">🦁</div>
              <div>
                <h4>Trợ lý Vườn Thú</h4>
                <span className="chatbot-status">Trực tuyến</span>
              </div>
            </div>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chatbot-msg ${msg.role}`}>
                {msg.role === 'assistant' && <div className="msg-avatar">🦁</div>}
                <div className="msg-bubble">{msg.content}</div>
              </div>
            ))}
            {isLoading && (
              <div className="chatbot-msg assistant">
                <div className="msg-avatar">🦁</div>
                <div className="msg-bubble typing">
                  <Loader size={16} className="spin" />
                  <span>Đang trả lời...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input-area">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Hỏi về vườn thú, giá vé, động vật..."
              disabled={isLoading}
            />
            <button onClick={sendMessage} disabled={isLoading || !input.trim()} className="chatbot-send">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      <button className={`chatbot-toggle ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};

export default ChatBot;
