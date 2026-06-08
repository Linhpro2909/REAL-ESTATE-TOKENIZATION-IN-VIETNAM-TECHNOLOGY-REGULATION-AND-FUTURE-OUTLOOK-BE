const express = require("express");
const { callClaude } = require("../services/anthropic");

const router = express.Router();

const SYSTEM_PROMPT = `Bạn là chuyên gia pháp lý hàng đầu về tokenization bất động sản tại Việt Nam. Bạn am hiểu toàn diện:

LUẬT PHÁP VIỆT NAM:
- Luật Kinh doanh Bất động sản 2023 (hiệu lực 01/01/2025)
- Luật Đất đai 2024 (hiệu lực 01/08/2024)
- Luật Chứng khoán 2019 (sửa đổi 2022)
- Luật Doanh nghiệp 2020
- Luật Phòng chống rửa tiền 2022
- Nghị định 65/2022/NĐ-CP về trái phiếu doanh nghiệp
- Sandbox fintech của NHNN (Nghị định 94/2025 nếu có)
- Quy định về tài sản kỹ thuật số của NHNN và Bộ Tài chính

THÔNG LỆ QUỐC TẾ:
- MAS Singapore (Property Token Framework)
- SEC Hoa Kỳ (Howey Test, Reg D, Reg A+)
- EU MiCA Regulation 2024
- FATF Guidelines on Virtual Assets

Trả lời bằng tiếng Việt. Trích dẫn điều luật cụ thể khi có thể. Phân biệt rõ "được phép", "chưa có quy định", "bị cấm". Đưa ra khuyến nghị thực tiễn.`;

router.post("/analyze", async (req, res) => {
  try {
    const { query, legalArea, analysisDepth } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({ error: "Legal query is required." });
    }

    const userPrompt = `LĨNH VỰC PHÁP LÝ: ${legalArea}
MỨC ĐỘ PHÂN TÍCH: ${analysisDepth}

CÂU HỎI / KỊCH BẢN:
${query}

Hãy phân tích theo cấu trúc:
1. ĐÁNH GIÁ TỔNG QUAN — Tình trạng pháp lý hiện tại tại Việt Nam
2. QUY ĐỊNH ÁP DỤNG — Các luật và điều khoản liên quan (trích dẫn cụ thể)
3. VÙNG XÁM PHÁP LÝ — Những điểm chưa có quy định rõ ràng
4. RỦI RO PHÁP LÝ — Các rủi ro cần lưu ý và mức độ
5. SO SÁNH QUỐC TẾ — Cách các nước trong khu vực xử lý (nếu phù hợp)
6. KHUYẾN NGHỊ — Bước tiếp theo để đảm bảo compliance`;

    const analysis = await callClaude(
      SYSTEM_PROMPT,
      [{ role: "user", content: userPrompt }],
      1500
    );

    res.json({ success: true, analysis });
  } catch (err) {
    console.error("Legal error:", err.message);
    res.status(500).json({ error: "Failed to analyze legal query." });
  }
});

module.exports = router;
