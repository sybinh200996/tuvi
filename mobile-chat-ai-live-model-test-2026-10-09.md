# Kiểm thử model AI trực tiếp trên giao diện Mobile — 2026-10-09

## Phạm vi và cách thử

- Chạy app tại trang Mobile (`mobile.html`) trong Chromium giả lập **390 × 844 px**, bật mobile/touch; media query mobile đã được xác nhận hoạt động.
- Chọn từng model trong selector của giao diện và gửi cùng một prompt riêng biệt.
- Prompt: *“Kiểm tra phép tính: giá gốc 240.000đ, giảm 15%, sau đó cộng phí giao hàng 18.000đ. Hãy tính đúng tổng phải trả, chỉ trả lời một dòng gồm phép tính và kết quả.”*
- Đáp án chuẩn nếu model phản hồi: `240.000 × 0,85 + 18.000 = 222.000đ`.
- Đây là **lượt gọi API thật theo yêu cầu**. Mỗi response đều được giao diện nhận và hiển thị thành thông báo lỗi; không model nào trả nội dung để đánh giá độ chính xác.

## Kết quả

| Provider/model đã chọn | HTTP | Thời gian | Kết quả của lần gọi | Có câu trả lời AI để chấm? |
|---|---:|---:|---|---|
| OpenAI / `gpt-6.1-sol` | 500 | 0,38 giây | Backend phân loại là API key sai, thiếu quyền hoặc cấu hình chưa đúng. | Không |
| Anthropic / `claude-opus-5-5` | 500 | 2,74 giây | Anthropic trả rõ: số dư tín dụng API không đủ để gọi API. | Không |
| Google / `gemini-3.1-pro-preview` | 500 | 0,38 giây | Backend phân loại là hết quota hoặc bị giới hạn tốc độ. | Không |

### Chi tiết lỗi theo lần thử

**OpenAI — `gpt-6.1-sol`**

`attempts` của backend ghi nhận đúng provider `openai` và thông báo: “ChatGPT Pro API key sai, thiếu quyền hoặc chưa được cấu hình đúng.” Đây là thông báo phân loại của ứng dụng, không đủ để kết luận chắc chắn key sai; cần kiểm tra API key/project, quyền truy cập model và trạng thái API account.

**Lỗi giao diện cần lưu ý:** thông báo lỗi tổng quát trên UI lại ghi “Gemini API key sai…” dù lần thử là OpenAI. Hàm chuẩn hóa lỗi đang mặc định nhãn Gemini khi không nhận provider. Vì vậy, với lỗi OpenAI, hãy dựa vào `attempts[0]` (provider `openai`) thay vì dòng lỗi tổng quát hiển thị. Phần này chưa được sửa trong lượt kiểm thử.

**Anthropic — `claude-opus-5-5`**

API trả về rõ ràng: “Your credit balance is too low to access the Anthropic API.” Đây là vấn đề số dư/billing phía Anthropic, không phải bằng chứng model yếu hoặc model ID sai.

**Gemini — `gemini-3.1-pro-preview`**

Backend phân loại lỗi là quota hoặc rate limit. Lượt thử này chưa xác định được quota bị giới hạn theo model, project hay key.

## Kết luận

- Selector trên app Mobile gửi đúng lựa chọn provider/model; từng lỗi được trả về và hiển thị trong chat.
- **Chưa đánh giá được chất lượng hoặc độ chính xác** của ba model ở lần thử này vì cả ba request đều thất bại trước khi có nội dung trả lời.
- Việc key có mặt trong `.env` chỉ xác nhận key được cấu hình, **không xác nhận key hợp lệ, account có quyền, còn quota hoặc còn credit**.
- Trước khi chạy lại nhiều lượt, cần kiểm tra quyền/API account của OpenAI, credit Anthropic và quota Google. Không nên kết luận các model đời cao không hoạt động chỉ từ lần thử này.

## Ảnh kiểm thử

[Ảnh giao diện Mobile ở viewport 390 × 844 sau khi app hiển thị lỗi quota Gemini](previews/mobile-chat-ai-model-test-final.png)
