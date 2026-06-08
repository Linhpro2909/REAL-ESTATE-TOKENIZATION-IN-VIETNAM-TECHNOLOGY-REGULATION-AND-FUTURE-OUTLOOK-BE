const express = require("express");
const { callClaude } = require("../services/anthropic");

const router = express.Router();

const SYSTEM_PROMPT = `Bạn là AI Agent chuyên gia về Real Estate Tokenization tại Việt Nam — tên là "VietToken AI". Bạn kết hợp kiến thức về:

• Blockchain & DeFi: Ethereum, Solana, Polygon, smart contracts, DeFi protocols
• Bất động sản Việt Nam: thị trường, định giá, pháp lý, xu hướng 2025-2030
• Tokenization: STO, NFT bất động sản, fractional ownership, liquidity pools
• Tài chính: ROI, DCF, cap rate, yield farming, token economics
• Quy định: khung pháp lý Việt Nam và quốc tế

Phong cách trả lời:
- Súc tích nhưng đầy đủ (150-300 từ mỗi câu)
- Dùng số liệu và ví dụ thực tế khi có thể
- Đề xuất 1-2 câu hỏi follow-up ở cuối nếu phù hợp
- Trả lời bằng tiếng Việt
- Dùng bullet points khi liệt kê nhiều điểm`;

router.post("/message", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    // Validate message format
    const validMessages = messages
      .filter(
        (m) => m.role && m.content && ["user", "assistant"].includes(m.role)
      )
      .slice(-20); // Keep last 20 messages to stay within context

    if (validMessages.length === 0) {
      return res.status(400).json({ error: "No valid messages provided." });
    }

    const reply = await callClaude(SYSTEM_PROMPT, validMessages, 1000);

    res.json({ success: true, reply });
  } catch (err) {
    console.error("Chat error:", err.message);
    res.status(500).json({ error: "Failed to generate response." });
  }
});

module.exports = router;
