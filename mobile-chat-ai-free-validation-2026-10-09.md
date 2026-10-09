# Báo cáo kiểm thử AI Chat Mobile — chế độ chỉ miễn phí

**Ngày:** 09/10/2026  
**Trang:** `mobile.html`  
**Viewport:** 390 × 844 px (Chromium, mobile/touch)  
**Chính sách chi phí:** `FREE_MODELS_ONLY=true`; chỉ gọi lựa chọn có mức giá $0 được xác minh độc lập. Không gọi API OpenAI, Anthropic, Gemini, Groq hay model khác trong lượt test này.

## Kết quả live trên giao diện

Prompt kiểm chứng: *“Giá gốc 240.000đ, giảm 15%, sau đó cộng phí giao hàng 18.000đ. Hãy trả lời một dòng gồm phép tính và tổng phải trả.”* Đáp án chuẩn: `(240.000 − 240.000 × 15%) + 18.000 = 222.000đ`.

| Lựa chọn | HTTP | Provider/model trả về | Thời gian | Kết quả | Render trong chat |
|---|---:|---|---:|---|---|
| OpenRouter Free — `openrouter/free` | 200 | `openrouter` / `openrouter/free` | 7,58 giây | Đúng: **222.000đ** | Có |

Lượt gọi live này không phát sinh phí token theo trang OpenRouter Free Models Router/pricing đã kiểm tra. Model nền mà router chọn có thể thay đổi; response của app lần này trả về ID router `openrouter/free`, không nêu model nền cụ thể.

## Các provider còn lại

| Provider | Tình trạng an toàn/cấu hình | Đã gọi model live trong lượt này? |
|---|---|---|
| Google Gemini | Có biến key trong `.env`; lượt live trước với `gemini-3.1-pro-preview` trả HTTP 500 do quota/rate limit. Chưa xác nhận project đang ở Google Free hay Paid tier. Bị khóa để tránh overage. | Không |
| Groq | Có biến key; không thể xác định tier Free hay Developer chỉ từ key. Bị khóa cho đến khi tier được xác nhận. | Không |
| OpenAI | Có biến key; lượt trước `gpt-6.1-sol` không qua được bước xác thực/quyền API theo thông báo backend. API có thể tính phí; bị khóa. | Không |
| Anthropic | Biến chuẩn `ANTHROPIC_API_KEY` hiện diện; lượt trước API trả số dư tín dụng không đủ. API có thể tính phí; bị khóa. | Không |
| Mistral | Thiếu key; Free mode có quota dùng kèm khả năng pay-as-you-go vượt mức, chưa có cấu hình account để xác minh. | Không |
| DeepSeek, xAI/Grok, Qwen | Thiếu biến key; giá API trực tiếp không được xác nhận là $0 cho key/project này. | Không |

Các provider bị khóa cũng được thử qua request local tới backend: mỗi lựa chọn trả lỗi tại chỗ với `attempts=[]`, xác nhận backend không bắt đầu request tới API provider đó. Đường gửi ảnh/tệp trước đây dùng trực tiếp Gemini; trong strict free-only, lời gọi Gemini được chặn và UI không còn gợi ý sai rằng chỉ cần bổ sung Gemini key.

## Trả lời câu hỏi “app trước đây chỉ gọi Gemini?”

Không thể kết luận lịch sử thực tế nếu không có production usage logs. Trong source hiện tại, chat văn bản đi qua `/api/multi-ai/chat`: khi người dùng chọn hãng/model rõ ràng, app định tuyến riêng tới hãng đó; chế độ Auto trước đó ưu tiên Gemini với câu hỏi thông thường rồi có thể fallback. Riêng nhánh gửi ảnh/tệp đi qua `/api/chat-ai` và dùng Gemini. Vì vậy mã không chỉ hỗ trợ Gemini, nhưng một phiên chat dùng Auto có thể ưu tiên Gemini; lựa chọn model cụ thể có thể gọi provider khác. Lượt kiểm thử cũ không chứng minh lịch sử sử dụng của người dùng cuối.

## Kết luận

- Trong số provider có thể bật mà không cần phỏng đoán billing tier, **OpenRouter Free là lựa chọn duy nhất được gọi live**; trả lời và hiển thị đúng trong app.
- Không gọi Gemini/Groq chỉ vì có key: cần xác nhận account ở Free tier và không có overage. Không gọi OpenAI/Anthropic hoặc API trả phí trong yêu cầu no-cost.
- “Key hiện diện” không có nghĩa key hợp lệ, có quyền, còn quota hay ở gói miễn phí. Không thể tự sửa một key bị từ chối nếu không có key mới; không đưa key vào chat.
- Chế độ free-only hiện khóa các provider còn lại ở backend, không chỉ ẩn chúng trên UI. Phân tích ảnh/tệp hiện chưa dùng vì route hiện có gọi Gemini.

## Ảnh kiểm thử

[Ảnh giao diện Mobile sau câu trả lời OpenRouter Free](previews/mobile-chat-ai-openrouter-free-final.png)

## Nguồn chính thức đã đối chiếu

- [OpenRouter Free Models Router](https://openrouter.ai/openrouter/free) và [Pricing](https://openrouter.ai/pricing).
- [Google Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing) — Free/Paid tier khác nhau; tier của project mới quyết định billing.
- [Groq billing FAQ](https://console.groq.com/docs/billing-faqs), [rate limits](https://console.groq.com/docs/rate-limits), [models/pricing](https://console.groq.com/docs/models).
- [Mistral usage and limits](https://docs.mistral.ai/admin/billing-usage/usage-limits).
- [DeepSeek API pricing](https://api-docs.deepseek.com/quick_start/pricing).


## Lượt bổ sung: Auto Router

Chọn **Auto** trên cùng giao diện Mobile và gửi prompt kiểm chứng thêm một lần: HTTP 200, router/provider thực tế `openrouter` / `openrouter/free`, mất 8,30 giây, trả `240.000 × (1 - 15%) + 18.000 = 222.000đ`; câu trả lời được render trong chat. Vì allowlist chỉ có OpenRouter Free, Auto không thể fallback sang API khác.
