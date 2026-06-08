const express = require("express");
const { callClaude } = require("../services/anthropic");

const router = express.Router();

const SYSTEM_PROMPT = `Bạn là chuyên gia phân tích tokenization bất động sản tại Việt Nam với hơn 10 năm kinh nghiệm trong blockchain và thị trường BĐS. Bạn có kiến thức sâu về:
- Công nghệ blockchain và smart contracts (Ethereum, BSC, Polygon, Solana, Hyperledger)
- Thị trường bất động sản Việt Nam và định giá tài sản
- Cấu trúc Security Token Offering (STO) và Utility Token
- Quản lý rủi ro và compliance trong tokenization

Trả lời bằng tiếng Việt. Phân tích có cấu trúc rõ ràng với các mục đánh số. Dựa trên dữ liệu thực tế thị trường Việt Nam. Đưa ra khuyến nghị cụ thể, actionable.`;

router.post("/analyze", async (req, res) => {
  try {
    const {
      projectName,
      propertyType,
      assetValueBillion,
      tokenizationPercent,
      totalSupply,
      blockchain,
      yieldRate,
      investorType,
    } = req.body;

    // Validate required fields
    if (!projectName || !assetValueBillion || !totalSupply) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const tokenizedValue = (assetValueBillion * tokenizationPercent) / 100;
    const pricePerToken = (tokenizedValue * 1e9) / totalSupply;
    const annualIncomePerToken = (pricePerToken * yieldRate) / 100;

    const userPrompt = `Phân tích mô phỏng phát hành token bất động sản sau:

DỰ ÁN: ${projectName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Loại BĐS: ${propertyType}
• Tổng giá trị tài sản: ${assetValueBillion} tỷ VNĐ
• Tỷ lệ token hóa: ${tokenizationPercent}%
• Giá trị token hóa: ${tokenizedValue.toFixed(2)} tỷ VNĐ
• Tổng cung token: ${Number(totalSupply).toLocaleString()} tokens
• Giá mỗi token: ${Math.round(pricePerToken).toLocaleString()} VNĐ
• Blockchain: ${blockchain}
• Lợi suất kỳ vọng: ${yieldRate}%/năm
• Thu nhập/token/năm: ${Math.round(annualIncomePerToken).toLocaleString()} VNĐ
• Đối tượng nhà đầu tư: ${investorType}

Hãy phân tích chi tiết theo các mục sau:
1. ĐÁNH GIÁ CẤU TRÚC TOKEN — Định giá có hợp lý không? So sánh với thị trường
2. CƠ CHẾ PHÂN PHỐI LỢI NHUẬN — Đề xuất mô hình dividend / rental yield
3. SMART CONTRACT CẦN THIẾT — Loại contract, chức năng cụ thể, tiêu chuẩn áp dụng
4. PHÂN TÍCH RỦI RO — Top 5 rủi ro và biện pháp giảm thiểu
5. LỘ TRÌNH TRIỂN KHAI — Các giai đoạn từ phát hành đến niêm yết
6. KHUYẾN NGHỊ — Cụ thể cho nhà phát hành tại thị trường Việt Nam 2025`;

    const analysis = await callClaude(
      SYSTEM_PROMPT,
      [{ role: "user", content: userPrompt }],
      1500
    );

    res.json({
      success: true,
      metrics: {
        tokenizedValueBillion: tokenizedValue,
        pricePerToken: Math.round(pricePerToken),
        annualIncomePerToken: Math.round(annualIncomePerToken),
      },
      analysis,
    });
  } catch (err) {
    console.error("Simulator error:", err.message);
    res.status(500).json({ error: "Failed to analyze token structure." });
  }
});

module.exports = router;
