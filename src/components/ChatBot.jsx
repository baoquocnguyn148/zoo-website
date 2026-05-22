import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { animals } from '../data/animals';
import './ChatBot.css';

const normalize = (text) =>
  text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D');

const findAnimal = (text) => {
  const norm = normalize(text);
  return animals.find(a => {
    const nameNorm = normalize(a.name);
    const idNorm = normalize(a.id);
    const sciNorm = normalize(a.scientificName);
    return norm.includes(nameNorm)
      || (norm.length >= 3 && nameNorm.includes(norm))
      || norm.includes(idNorm) || norm.includes(sciNorm)
      || nameNorm.split(' ').some(w => w.length > 2 && norm.includes(w));
  });
};

const rules = [
  {
    keywords: ['gia ve', 'giá vé', 'gia ve', 'bao nhieu tien', 'bao nhieu', 'phi', 'ticket', 'price', 've nguoi lon', 've tre em', 've gia dinh', 'mua ve', 'dat ve', 'tien ve'],
    response: `🎫 Bảng giá vé tham quan:

• Vé Người lớn: 300.000đ (khách trên 1m3)
• Vé Trẻ em: 150.000đ (khách từ 1m – 1m3)
• Vé Gia đình: 750.000đ (2 người lớn + 2 trẻ em)
• Miễn phí: Trẻ em dưới 1m

Bạn có thể mua vé trực tuyến ngay tại mục "Mua vé" trên website!`
  },
  {
    keywords: ['gio mo cua', 'gio hoat dong', 'may gio', 'mo cua', 'dong cua', 'luc nao', 'opening', 'khi nao mo', 'gio lam viec'],
    response: `🕐 Giờ hoạt động:

• Thứ 2 – Thứ 6: 08:00 – 17:00
• Thứ 7, Chủ nhật, Lễ: 07:30 – 18:00

Vườn thú mở cửa tất cả các ngày trong năm.`
  },
  {
    keywords: ['dia chi', 'o dau', 'cho nao', 'duong nao', 'address', 'location', 'vi tri', 'den nhu the nao', 'di den'],
    response: `📍 Địa chỉ: Số 1 Cầu Giấy, Giảng Võ, Hà Nội

📞 Điện thoại: (028) 3829 1466
📧 Email: contact@hanoi.org`
  },
  {
    keywords: ['noi quy', 'quy dinh', 'chinh sach', 'cam', 'khong duoc', 'luu y', 'policy', 'rule'],
    response: `📋 Nội quy tham quan:

• Không chọc phá, ném đồ vật vào chuồng trại
• Không tự ý cho động vật ăn thức ăn bên ngoài
• Được chụp ảnh nhưng không dùng flash ở khu vực cấm
• Không trèo qua lan can
• Bỏ rác đúng nơi, không hút thuốc trong khuôn viên

Xem chi tiết tại mục "Chính sách" trên website.`
  },
  {
    keywords: ['doi ve', 'hoan ve', 'tra ve', 'doi ngay', 'cancel', 'refund'],
    response: `🔄 Chính sách đổi vé:

• Vé đã mua không hoàn lại tiền
• Có thể đổi ngày tham quan 1 lần
• Phải đổi trước ít nhất 24 giờ so với giờ mở cửa ngày đã đặt`
  },
  {
    keywords: ['an uong', 'nha hang', 'quan an', 'do an', 'thuc an', 'restaurant', 'food', 'nuoc uong'],
    response: `🍽️ Khu vực ăn uống:

Sở thú có nhiều nhà hàng và quầy giải khát trải dọc theo các tuyến đường tham quan chính. Bạn có thể thoải mái nghỉ ngơi và thưởng thức đồ ăn tại đây!`
  },
  {
    keywords: ['bao ton', 'bao ve', 'conservation', 'nguy cap', 'tuyet chung'],
    response: `🌿 Chương trình bảo tồn:

Vườn Thú Hà Nội tự hào với hơn 100 chương trình bảo tồn, chăm sóc 3.000+ cá thể động vật và 700+ loài thực vật quý hiếm. Mỗi lượt tham quan của bạn góp phần lan tỏa nhận thức bảo tồn và tình yêu thiên nhiên!`
  },
  {
    keywords: ['dong vat', 'con gi', 'loai nao', 'thu', 'animals', 'co nhung con', 'danh sach'],
    response: () => {
      const list = animals.map(a => `• ${a.name} (${a.scientificName})`).join('\n');
      return `🦁 Các loài động vật tiêu biểu tại vườn thú:\n\n${list}\n\nBạn muốn tìm hiểu về loài nào? Hãy hỏi tôi nhé!`;
    }
  },
  {
    keywords: ['chup anh', 'chup hinh', 'quay phim', 'photo', 'camera', 'flash'],
    response: `📸 Quy định chụp ảnh:

• Được phép chụp ảnh tại hầu hết các khu vực
• Không sử dụng đèn flash ở những khu vực có biển cấm
• Không trèo qua lan can để chụp ảnh
• Hãy tôn trọng không gian của động vật nhé!`
  },
  {
    keywords: ['tre em', 'con nho', 'em be', 'mien phi', 'child', 'kid', 'baby'],
    response: `👶 Chính sách dành cho trẻ em:

• Trẻ em dưới 1m: Miễn phí vé hoàn toàn (đi cùng người lớn)
• Trẻ em từ 1m – 1m3: Vé trẻ em 150.000đ
• Vé Gia đình (750.000đ): Gồm 2 người lớn + 2 trẻ em — tiết kiệm hơn!`
  },
  {
    keywords: ['xin chao', 'hello', 'hi', 'hey', 'chao', 'alo'],
    response: `Xin chào bạn! 👋 Tôi là trợ lý ảo của Vườn Thú Hà Nội. Tôi có thể giúp bạn:

• Giá vé & cách mua vé
• Giờ mở cửa & địa chỉ
• Thông tin các loài động vật
• Nội quy tham quan

Bạn muốn hỏi gì nào?`
  },
  {
    keywords: ['cam on', 'thanks', 'thank', 'ok', 'duoc roi', 'hieu roi'],
    response: 'Không có gì! Nếu bạn cần hỏi thêm gì về vườn thú, cứ nhắn cho tôi nhé! 😊'
  },
  {
    keywords: ['lien he', 'contact', 'goi dien', 'phone', 'dien thoai', 'email', 'hotline'],
    response: `📞 Thông tin liên hệ:

• Điện thoại: (028) 3829 1466
• Email: contact@hanoi.org
• Địa chỉ: Số 1 Cầu Giấy, Giảng Võ, Hà Nội`
  }
];

const getResponse = (text) => {
  const norm = normalize(text);

  const animal = findAnimal(text);
  if (animal) {
    return `🐾 ${animal.name} (${animal.scientificName})

${animal.description}

📍 Môi trường sống: ${animal.habitat}
🍽️ Thức ăn: ${animal.diet}
🛡️ Tình trạng bảo tồn: ${animal.conservation}

${animal.details}`;
  }

  for (const rule of rules) {
    if (rule.keywords.some(kw => norm.includes(normalize(kw)))) {
      return typeof rule.response === 'function' ? rule.response() : rule.response;
    }
  }

  return `Cảm ơn bạn đã hỏi! Tôi có thể giúp bạn về:

• 🎫 Giá vé (gõ "giá vé")
• 🕐 Giờ mở cửa (gõ "giờ mở cửa")
• 🦁 Thông tin động vật (gõ tên con vật, VD: "sư tử")
• 📋 Nội quy (gõ "nội quy")
• 📍 Địa chỉ (gõ "địa chỉ")
• 📞 Liên hệ (gõ "liên hệ")

Hãy thử hỏi lại nhé!`;
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Xin chào! 👋 Tôi là trợ lý ảo của Vườn Thú Hà Nội. Bạn cần hỏi gì về vườn thú, giá vé, hay các loài động vật không?' }
  ]);
  const [input, setInput] = useState('');
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

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    const userMessage = { role: 'user', content: text };
    const response = getResponse(text);
    setMessages(prev => [...prev, userMessage, { role: 'assistant', content: response }]);
    setInput('');
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
            />
            <button onClick={sendMessage} disabled={!input.trim()} className="chatbot-send">
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
