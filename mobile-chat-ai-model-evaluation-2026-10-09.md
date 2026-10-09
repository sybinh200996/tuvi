# Báo cáo kiểm thử Chat AI Mobile

**Ngày:** 09/10/2026  
**Môi trường:** Web app local, giao diện Mobile ở viewport 393 × 852 px. Kiểm thử dùng backend và cấu hình provider sẵn có của project; không in hoặc đưa API key vào báo cáo.

## Phạm vi và cách kiểm thử

- Gửi một prompt benchmark tiếng Việt qua giao diện Mobile cho **model mặc định của mỗi provider đang được cấu hình**. Prompt gồm phép tính giảm giá/phí giao hàng, xác suất rút bi không hoàn lại, và email xin dời lịch với ràng buộc không tự bịa lý do.
- Kiểm tra thêm chế độ **Auto Router**, câu hỏi tiếp nối để xác nhận ngữ cảnh, lựa chọn model trong giao diện, lỗi trang, và cuộn khi nhận phản hồi dài.
- Mô phỏng sự kiện SpeechRecognition trong trình duyệt để kiểm tra transcript và thời gian tự gửi. Không thu âm từ micro thật.
- Đây là **smoke test với một prompt/model**, không phải đánh giá thống kê hoặc chứng minh độ chính xác cho mọi chủ đề.

Đáp án chuẩn của benchmark: tổng tiền **1.135.000đ**; xác suất hai bi đỏ **5/14 ≈ 35,71%**.

## Kết quả model

| Provider / model mặc định | Kết quả gọi từ giao diện | Nhận xét |
|---|---:|---|
| Gemini — `gemini-2.5-flash` | Thành công, khoảng 8 giây | Tính đúng tổng và xác suất, giải thích theo bước, email lịch sự. Câu tiếp nối đổi phí giao hàng thành 50.000đ được trả đúng **1.150.000đ**. |
| Groq — `llama-3.3-70b-versatile` | HTTP 500 | Không đánh giá được câu trả lời; app hiển thị lỗi cuối chuỗi fallback liên quan hạn mức Anthropic. |
| OpenRouter — `deepseek/deepseek-r1:free` | HTTP 500 | Không đánh giá được câu trả lời; app hiển thị cùng lỗi cuối chuỗi fallback liên quan hạn mức Anthropic. |
| OpenAI — `gpt-4o-mini` | Thành công, khoảng 12,8 giây | Kết quả tiền và xác suất đúng khi đối chiếu nội dung (phân số được viết dưới dạng LaTeX `\\frac{5}{14}`); email lịch sự, có cấu trúc. |
| Claude — `claude-3-5-haiku-latest` | HTTP 500 | Không đánh giá được câu trả lời; app hiển thị lỗi cuối chuỗi fallback liên quan cấu hình/khóa Gemini. |
| Auto Router | Thành công, khoảng 20,7 giây | Trả đúng phép tính, xác suất và email. Response của endpoint không cho biết provider/model thực sự đã trả lời. |

**Lưu ý chẩn đoán:** lỗi hiển thị khi chọn Groq, OpenRouter hoặc Claude là lỗi cuối cùng mà endpoint trả ra, không đủ chứng minh chính provider đang chọn gây lỗi. Trong `server.js`, `tryMultiAI` thử lần lượt các provider khác khi provider được chọn lỗi và truyền tiếp cùng `requestedModel` sang fallback. Vì vậy model ID có thể không tương thích với provider dự phòng, và lỗi cuối có thể che nguyên nhân ban đầu. Response cũng chỉ trả nhãn chung `Đặng Năm AI`, không ghi model thực tế.

## Kiểm thử Mobile và giọng nói

- Model selector chọn được các model đã cấu hình; gửi tin và nhận phản hồi thật qua giao diện không gây lỗi JavaScript trang.
- Gemini giữ được ngữ cảnh ở lượt tiếp theo.
- Với câu trả lời dài, vùng hội thoại cuộn được. Sau khi animation cuộn hoàn tất, bong bóng kết thúc phía trên composer; **không bị composer hoặc thanh điều hướng che**. Ảnh chụp ngay lúc phản hồi vừa xong có thể bắt gặp animation giữa chừng.
- Mô phỏng transcript “Tính giúp tôi 2 cộng 2, trả lời ngắn gọn” được tự gửi sau **3,06 giây**; response giả lập hiển thị đúng. Đây chỉ kiểm tra luồng UI/timer — chưa xác minh nhận dạng âm thanh thật, quyền micro hoặc hành vi trên iPhone thực.

## Kết luận

- Trong mẫu đã thử, **Gemini Flash, OpenAI gpt-4o-mini và Auto Router** trả lời đúng hai câu có đáp án kiểm chứng được, với cách trình bày tương đối rõ ràng và chuyên nghiệp. Gemini còn xử lý đúng câu hỏi tiếp nối.
- **Chưa thể kết luận Groq, OpenRouter và Claude có chất lượng tốt hay kém** vì các lượt gọi của chúng kết thúc bằng HTTP 500.
- Nên ưu tiên sửa/kiểm tra routing: khi người dùng chọn model cụ thể, gọi đúng provider/model đó; nếu cần fallback thì dùng model mặc định của provider dự phòng và lưu/hiển thị dấu vết từng lần thử. Đồng thời kiểm tra trạng thái hạn mức/khóa cho các provider gặp lỗi.
- OpenAI trả công thức ở dạng LaTeX; Mobile hiện dùng renderer Markdown cơ bản và không nạp MathJax/KaTeX, nên công thức có thể hiện thành ký hiệu thô thay vì dạng toán học đã định dạng.

**Ảnh xem trước:** [Giao diện Mobile sau khi phản hồi Gemini đã cuộn ổn định](previews/chat-ai-mobile-gemini-settled.png). Nội dung phản hồi trong ảnh được lấy từ lượt gọi Gemini thật và phát lại trong giao diện để chụp sau khi animation cuộn kết thúc; không phát sinh thêm API call.


---

## Cập nhật sau khi bật chế độ free-only — 09/10/2026

Báo cáo ở phần trên là snapshot của lần smoke test trước đó, **không đại diện cho tình trạng provider hiện tại hoặc lịch sử sử dụng production**. Trong lượt kiểm tra mới, backend được bật `FREE_MODELS_ONLY=true`; OpenRouter Free là lựa chọn duy nhất được phép gọi để không suy đoán tier billing của Google/Groq hoặc dùng API trả phí.

OpenRouter Free đã được gọi qua giao diện `mobile.html` ở 390×844: HTTP 200, phản hồi sau 7,58 giây, tính đúng `(240.000 − 240.000 × 15%) + 18.000 = 222.000đ`, và trả lời render trong chat. Không gửi live request mới tới Gemini, Groq, OpenAI, Anthropic hay provider khác. Request local xác nhận các provider đó bị chặn ngay ở backend, không có `attempts` tới upstream.

Xem [báo cáo free-only chi tiết](mobile-chat-ai-free-validation-2026-10-09.md) và [ảnh giao diện sau phản hồi](previews/mobile-chat-ai-openrouter-free-final.png).


Thêm một lượt Auto trên app Mobile: HTTP 200, provider/model trả về `openrouter` / `openrouter/free`, đúng **222.000đ**, hiển thị trong chat. Chi tiết xem báo cáo free-only đi kèm.
