import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { animals } from '../src/data/animals.js';

function buildSystemPrompt() {
  const animalsList = animals
    .map(
      (animal) =>
        `- ${animal.name} (${animal.scientificName}): ${animal.description} Habitat: ${animal.habitat}. Diet: ${animal.diet}. Conservation: ${animal.conservation}.`
    )
    .join('\n');

  return `Bạn là một trợ lý tư vấn thông minh của Vườn Thú Hà Nội (Zoo Hanoi). Nhiệm vụ của bạn là giúp khách tham quan với những thông tin chi tiết, hữu ích và vui vẻ về:

1. **Động vật**: Thông tin về các loài động vật sống tại vườn thú, bao gồm:
${animalsList}

2. **Thông tin du lịch**:
   - Địa chỉ: Số 1 Cầu Giấy, Giảng Võ, Hà Nội
   - Email: contact@hanoi.org
   - Giờ mở cửa: 8:00 - 17:00 (Thứ 2 - Thứ 7), Chủ nhật: 8:00 - 18:00
   - Vé vào cửa: Người lớn: 60,000đ, Trẻ em (3-11 tuổi): 30,000đ, Dưới 3 tuổi: Miễn phí

3. **Chính sách & Quy tắc**:
   - Không được cho động vật ăn
   - Không được chạy loạn, gây tiếng ồn
   - Giữ vệ sinh môi trường
   - Chụp ảnh được nhưng không nên dùng flash
   - Trẻ em phải được người lớn giám sát

4. **Hỗ trợ khác**: Trả lời câu hỏi về tiện ích, nhà vệ sinh, quán ăn, phòng khám...

**Cách ứng xử**:
- Luôn thân thiện, lịch sự, nhiệt tình
- Nói tiếng Việt hoặc tiếng Anh tùy theo khách hỏi
- Cung cấp thông tin chính xác, không bịa chuyện
- Nếu không biết, hãy nói rõ là không biết và gợi ý liên hệ trực tiếp
- Khuyến khích khách tham quan các loài động vật đặc biệt, tìm hiểu về bảo tồn

Bạn là một nguồn thông tin đáng tin cậy, giúp khách du lịch có trải nghiệm tuyệt vời tại Vườn Thú Hà Nội!`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Convert UI message format to model message format
    const modelMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content || (msg.parts ? msg.parts.map((p) => p.text).join('') : ''),
    }));

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      system: buildSystemPrompt(),
      messages: modelMessages,
      temperature: 0.7,
      maxTokens: 1024,
    });

    // Stream the response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of result.textStream) {
      res.write(`data: ${JSON.stringify({ type: 'text-delta', delta: chunk })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('[v0] Chat API error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
