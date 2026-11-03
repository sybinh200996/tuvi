/**
 * DANG NAM MYSTIC AI - UNIVERSAL MULTILINGUAL i18n ENGINE (public/i18n.js)
 * Supports Vietnamese (vi - default), English (en), and Chinese (zh).
 * High-accuracy terminology for Eastern Metaphysics, Zi Wei Dou Shu, Feng Shui, Tarot & Astrology.
 */

(function (root, factory) {
  const lib = factory();
  if (typeof exports === 'object') {
    Object.assign(exports, lib);
  }
  if (typeof module === 'object' && module.exports) {
    module.exports = lib;
  }
  if (typeof define === 'function' && define.amd) {
    define([], function () { return lib; });
  }
  if (typeof window !== 'undefined') {
    window.I18nEngine = lib;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.I18nEngine = lib;
  }
}(typeof self !== 'undefined' ? self : this, function () {

  const STORAGE_KEY = 'dangnam_language';

  const LANGUAGES = {
    vi: { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳', voiceLang: 'vi-VN', bcp47: 'vi-VN' },
    en: { code: 'en', name: 'English', flag: '🇬🇧', voiceLang: 'en-US', bcp47: 'en-US' },
    zh: { code: 'zh', name: '中文', flag: '🇨🇳', voiceLang: 'zh-CN', bcp47: 'zh-CN' }
  };

  const DICT = {
    vi: {
      // General
      app_title: "Đặng Năm Mystic AI",
      app_subtitle: "Trợ lý Trí tuệ Nhân tạo Mệnh lý & Huyền học Đa tầng",
      loading: "Đang xử lý...",
      saving: "Đang lưu...",
      saved_success: "✅ Đã lưu thành công!",
      save: "Lưu",
      close: "Đóng",
      cancel: "Hủy",
      confirm: "Xác nhận",
      copy: "📋 Sao chép",
      copied: "✅ Đã sao chép!",
      listen: "🔊 Nghe đọc",
      stop_listen: "⏹️ Dừng đọc",
      print: "🖨️ In / Xuất PDF",
      not_saved: "Chưa lưu",
      saved: "Đã lưu",

      // Top bar & Header
      destiny_profile: "Hồ Sơ Bản Mệnh",
      download_app: "📱 Tải App",
      account_member: "Tài khoản Member",
      quick_ask: "Hỏi nhanh",

      // Navigation & Tabs
      nav_home: "Trang Chủ",
      nav_tuvi: "Tử Vi 12 Cung",
      nav_tarot: "Bói Bài Tarot",
      nav_sim: "Sim Phong Thủy",
      nav_palm: "Xem Chỉ Tay",
      nav_face: "Xem Tướng",
      nav_astrology: "Chiêm Tinh",
      nav_love: "Tình Duyên",
      nav_numerology: "Thần Số Học",
      nav_chat: "AI Chat",
      nav_fengshui: "Phong Thủy",
      nav_history: "Lịch Sử",
      nav_deep: "Phân tích Tử vi chuyên sâu",
      nav_account: "Tài Khoản",

      // Hero Banner
      hero_title: "ĐẶNG NĂM MYSTIC",
      hero_subtitle: "Hệ thống luận giải Tử Vi Đẩu Số, Bát Tự, Phong Thủy, Tarot & Huyền Học kết hợp Trí Tuệ Nhân Tạo chuyên sâu.",
      hero_btn_tuvi: "📜 BÀN TỬ VI 12 CUNG",
      hero_btn_chat: "💬 TRÒ CHUYỆN VỚI AI",
      hero_sub_tags: "AI TỬ VI - CHỈ TAY - XEM TƯỚNG - CHIÊM TINH",
      quick_ask_btn: "✦ AI PHÂN TÍCH",
      tuvi_tool_title: "LẬP LÁ SỐ TỬ VI 12 CUNG",
      mobile_back_desktop: "🖥️ Máy tính",
      history_title: "🗂 Lịch sử phân tích",
      clear_history: "🧹 Xóa lịch sử",
      cskh_fab_label: "Hỗ Trợ & Báo Lỗi",
      cskh_title: "Trợ Lý CSKH & Hỗ Trợ Kỹ Thuật",

      // Destiny Profile Modal
      destiny_modal_title: "📜 Hồ Sơ Bản Mệnh",
      destiny_modal_tag: "Đồng bộ Kép: Máy + Cloud",
      destiny_modal_desc: "Điền đầy đủ thông tin để Đặng Năm AI ghi nhớ bản mệnh, tự động cá nhân hóa và luận giải chuẩn xác mọi phương diện Tử Vi, phong thủy và vận hạn.",
      destiny_fullname: "Họ và tên đương số",
      destiny_gender: "Giới tính",
      destiny_male: "Nam",
      destiny_female: "Nữ",
      destiny_calendar: "Loại lịch",
      destiny_solar: "Dương lịch",
      destiny_lunar: "Âm lịch",
      destiny_birthdate: "Ngày / Tháng / Năm sinh",
      destiny_birthhour: "Giờ sinh (12 Canh giờ)",
      destiny_birthplace: "Nơi sinh / Quê quán (Tùy chọn)",
      destiny_save_btn: "💾 Lưu Hồ Sơ Bản Mệnh",
      destiny_required_error: "Vui lòng điền họ tên và ngày sinh",
      destiny_invalid_date: "⚠️ Ngày sinh không hợp lệ. Vui lòng nhập dạng Ngày/Tháng/Năm (ví dụ: 20/10/1995)",

      // 12 Shichen (Canh Giờ)
      hour_ty: "Giờ Tý (23h00 - 00h59)",
      hour_suu: "Giờ Sửu (01h00 - 02h59)",
      hour_dan: "Giờ Dần (03h00 - 04h59)",
      hour_mao: "Giờ Mão (05h00 - 06h59)",
      hour_thin: "Giờ Thìn (07h00 - 08h59)",
      hour_ty_: "Giờ Tỵ (09h00 - 10h59)",
      hour_ngo: "Giờ Ngọ (11h00 - 12h59)",
      hour_mui: "Giờ Mùi (13h00 - 14h59)",
      hour_than: "Giờ Thân (15h00 - 16h59)",
      hour_dau: "Giờ Dậu (17h00 - 18h59)",
      hour_tuat: "Giờ Tuất (19h00 - 20h59)",
      hour_hoi: "Giờ Hợi (21h00 - 22h59)",

      // 12 Cung Board
      board_title: "📜 Bàn Lá Số Tử Vi 12 Cung Tương Tác",
      board_desc: "Bố cục 12 Cung chuẩn Đẩu Số truyền thống kết hợp trí tuệ nhân tạo Đặng Năm AI. Chạm vào bất kỳ cung nào để luận giải chi tiết theo thời gian thực.",
      cung_tat_ach: "TẬT ÁCH",
      cung_thien_di: "THIÊN DI",
      cung_no_boc: "NÔ BỘC",
      cung_quan_loc: "QUAN LỘC",
      cung_tai_bach: "TÀI BẠCH",
      cung_dien_trach: "ĐIỀN TRẠCH",
      cung_phuc_duc: "PHÚC ĐỨC",
      cung_phu_the: "PHU THÊ",
      cung_menh: "MỆNH CUNG",
      cung_huynh_de: "HUYNH ĐỆ",
      cung_tu_tuc: "TỬ TỨC",
      cung_phu_mau: "PHỤ MẪU",
      btn_luan_cung: "🔮 Luận Cung",

      // Deep Tu Vi Tool
      deep_title: "🧠 Phân Tích Tử Vi Chuyên Sâu PRO",
      deep_desc: "Cung cấp thông tin chi tiết nhất để AI tổng hợp đa lớp và luận giải chuyên sâu.",
      deep_ask_placeholder: "Trình bày rõ vấn đề bạn đang gặp phải hoặc điều muốn hỏi thật chi tiết...",
      deep_focus_label: "Khía cạnh tập trung",
      deep_focus_all: "Tổng quan cuộc đời & Vận hạn",
      deep_focus_career: "Công danh sự nghiệp & Tài lộc",
      deep_focus_love: "Tình duyên & Hôn nhân",
      deep_focus_mind: "Phân tích tâm lý & Lời khuyên",
      deep_btn: "✦ Bắt Đầu Phân Tích Sâu",

      // Love Tool
      love_title: "💕 Tình Duyên & Hòa Hợp",
      love_person1: "Tên người 1",
      love_birth1: "Ngày sinh người 1",
      love_person2: "Tên người 2",
      love_birth2: "Ngày sinh người 2",
      love_btn: "🤖 AI Luận Tình Duyên",

      // Numerology Tool
      num_title: "🔢 Thần Số Học AI PRO",
      num_name: "Họ và tên đầy đủ",
      num_birth: "Ngày sinh",
      num_btn: "🤖 AI Luận Thần Số Học",
      num_local_btn: "🔎 Tính Local",

      // Sim Phong Thuy Tool
      sim_title: "📱 Định Giá Sim & Phong Thủy Số",
      sim_hint: "* Nhập số điện thoại để AI thẩm định giá trị thị trường, cân bằng Âm Dương, điểm Nút số và Quẻ Kinh Dịch.",
      sim_phone_label: "Số điện thoại cần tra cứu",
      sim_birth_label: "Năm sinh hoặc Ngày sinh bản mệnh (để xét hợp tuổi)",
      sim_btn: "🔮 Phân tích bằng AI & Định giá",

      // Vision Tools (Palm & Face)
      palm_title: "🖐 Xem Chỉ Tay AI",
      face_title: "🙂 Xem Tướng AI",
      vision_snap: "📸 Chụp ảnh",
      vision_upload: "📁 Tải ảnh",
      vision_switch_cam: "🔄 Đổi Cam",
      vision_close_cam: "❌ Đóng",
      vision_retake: "📸 Chụp lại",
      vision_auto_toggle: "⚡ Tự động xem trực tiếp ngay sau khi chụp ảnh",
      palm_btn: "🤖 Phân tích chỉ tay trực tiếp",
      face_btn: "✨ Xem tướng trực tiếp ngay",

      // Tarot Tool
      tarot_title: "🃏 Bói Bài Tarot AI",
      tarot_ask_placeholder: "Điều mình cần lời khuyên lúc này là...",
      tarot_btn: "🃏 Rút bài AI",
      tarot_hint: "Nhập câu hỏi rồi rút bài.",

      // Chat AI
      chat_brand: "Đặng Năm AI",
      chat_sub: "Trợ lý Chuyên nghiệp",
      chat_new_btn: "＋ Cuộc chat mới",
      chat_placeholder: "Hỏi về vận mệnh, tử vi, phong thủy, công việc, tình duyên...",
      chat_send: "Gửi",

      // Voice TTS & STT
      voice_listening: "🎙️ Đang lắng nghe...",
      voice_mic_off: "Mic đang tắt. Bật mic trước nhé.",
      voice_not_supported: "Trình duyệt chưa hỗ trợ nhận diện giọng nói.",
      voice_speaking: "🔊 Đang đọc nội dung...",
      voice_auto_pick: "Tự động chọn giọng",
      voice_rate_label: "Tốc độ đọc",
      voice_auto_read_label: "Tự động đọc phản hồi",

      // Copyright
      copyright_text: "© Copyright SyBinh · Chứng Thực Bản Quyền & Chủ Sở Hữu"
    },

    en: {
      // General
      app_title: "Dang Nam Mystic AI",
      app_subtitle: "Multi-layered Metaphysics & Zi Wei Dou Shu AI Assistant",
      loading: "Processing...",
      saving: "Saving...",
      saved_success: "✅ Saved successfully!",
      save: "Save",
      close: "Close",
      cancel: "Cancel",
      confirm: "Confirm",
      copy: "📋 Copy",
      copied: "✅ Copied!",
      listen: "🔊 Listen",
      stop_listen: "⏹️ Stop",
      print: "🖨️ Print / PDF",
      not_saved: "Not saved",
      saved: "Saved",

      // Top bar & Header
      destiny_profile: "Destiny Profile",
      download_app: "📱 Get App",
      account_member: "Member Account",
      quick_ask: "Quick Ask",

      // Navigation & Tabs
      nav_home: "Home",
      nav_tuvi: "Zi Wei Horoscope",
      nav_tarot: "Tarot Reading",
      nav_sim: "Sim Feng Shui",
      nav_palm: "Palmistry",
      nav_face: "Face Reading",
      nav_astrology: "Astrology",
      nav_love: "Love Compatibility",
      nav_numerology: "Numerology",
      nav_chat: "AI Chat",
      nav_fengshui: "Feng Shui",
      nav_history: "History",
      nav_deep: "In-Depth Zi Wei Analysis",
      nav_account: "Account",

      // Hero Banner
      hero_title: "DANG NAM MYSTIC",
      hero_subtitle: "Advanced Multi-layer AI for Zi Wei Dou Shu, Bazi, Feng Shui, Tarot & Eastern Metaphysics combined with precision algorithms.",
      hero_btn_tuvi: "📜 12 PALACES BOARD",
      hero_btn_chat: "💬 CHAT WITH AI",
      hero_sub_tags: "AI ZI WEI - PALMISTRY - PHYSIOGNOMY - ASTROLOGY",
      quick_ask_btn: "✦ AI ANALYZE",
      tuvi_tool_title: "12-PALACE ZI WEI CHART",
      mobile_back_desktop: "🖥️ Desktop View",
      history_title: "🗂 Analysis History",
      clear_history: "🧹 Clear History",
      cskh_fab_label: "Support & Bug Report",
      cskh_title: "Customer Care & Tech Support",

      // Destiny Profile Modal
      destiny_modal_title: "📜 Destiny Profile",
      destiny_modal_tag: "Dual Sync: Device + Cloud",
      destiny_modal_desc: "Fill in your exact birth details so Dang Nam AI can tailor and calculate precise Zi Wei Dou Shu, Feng Shui, and life cycle readings.",
      destiny_fullname: "Full Name",
      destiny_gender: "Gender",
      destiny_male: "Male",
      destiny_female: "Female",
      destiny_calendar: "Calendar Type",
      destiny_solar: "Solar Calendar",
      destiny_lunar: "Lunar Calendar",
      destiny_birthdate: "Date of Birth (DD/MM/YYYY)",
      destiny_birthhour: "Birth Hour (12 Shichen)",
      destiny_birthplace: "Birthplace / Hometown (Optional)",
      destiny_save_btn: "💾 Save Destiny Profile",
      destiny_required_error: "Please enter your full name and birth date.",
      destiny_invalid_date: "⚠️ Invalid birth date. Please enter in DD/MM/YYYY format (e.g. 20/10/1995)",

      // 12 Shichen (Canh Giờ)
      hour_ty: "Zi Hour (23:00 - 00:59)",
      hour_suu: "Chou Hour (01:00 - 02:59)",
      hour_dan: "Yin Hour (03:00 - 04:59)",
      hour_mao: "Mao Hour (05:00 - 06:59)",
      hour_thin: "Chen Hour (07:00 - 08:59)",
      hour_ty_: "Si Hour (09:00 - 10:59)",
      hour_ngo: "Wu Hour (11:00 - 12:59)",
      hour_mui: "Wei Hour (13:00 - 14:59)",
      hour_than: "Shen Hour (15:00 - 16:59)",
      hour_dau: "You Hour (17:00 - 18:59)",
      hour_tuat: "Xu Hour (19:00 - 20:59)",
      hour_hoi: "Hai Hour (21:00 - 22:59)",

      // 12 Cung Board
      board_title: "📜 Interactive 12 Palaces Zi Wei Board",
      board_desc: "Traditional 12-palace Zi Wei layout combined with Dang Nam AI intelligence. Click any palace for real-time in-depth interpretation.",
      cung_tat_ach: "HEALTH",
      cung_thien_di: "TRAVEL",
      cung_no_boc: "FRIENDS",
      cung_quan_loc: "CAREER",
      cung_tai_bach: "WEALTH",
      cung_dien_trach: "PROPERTY",
      cung_phuc_duc: "KARMA & SPIRIT",
      cung_phu_the: "SPOUSE",
      cung_menh: "LIFE PALACE",
      cung_huynh_de: "SIBLINGS",
      cung_tu_tuc: "CHILDREN",
      cung_phu_mau: "PARENTS",
      btn_luan_cung: "🔮 Analyze",

      // Deep Tu Vi Tool
      deep_title: "🧠 In-Depth Zi Wei Analysis PRO",
      deep_desc: "Provide comprehensive life questions for multi-layer AI synthesis and detailed horoscope insights.",
      deep_ask_placeholder: "Detail your current situation, career crossroad, or specific questions...",
      deep_focus_label: "Focus Area",
      deep_focus_all: "Overall Life Cycle & Destiny",
      deep_focus_career: "Career, Ambition & Wealth",
      deep_focus_love: "Love, Marriage & Relationships",
      deep_focus_mind: "Psychological Insight & Strategic Advice",
      deep_btn: "✦ Start In-Depth Analysis",

      // Love Tool
      love_title: "💕 Love Compatibility & Harmony",
      love_person1: "Person 1 Name",
      love_birth1: "Person 1 Birth Date",
      love_person2: "Person 2 Name",
      love_birth2: "Person 2 Birth Date",
      love_btn: "🤖 Analyze Love Compatibility",

      // Numerology Tool
      num_title: "🔢 Numerology AI PRO",
      num_name: "Full Legal Name",
      num_birth: "Date of Birth",
      num_btn: "🤖 AI Numerology Report",
      num_local_btn: "🔎 Calculate Local",

      // Sim Phong Thuy Tool
      sim_title: "📱 Phone Number Valuation & Feng Shui",
      sim_hint: "* Enter phone number to evaluate market value, Yin-Yang balance, sum score and I Ching hexagram.",
      sim_phone_label: "Phone number to analyze",
      sim_birth_label: "Birth Year or Full Birth Date (for age synergy)",
      sim_btn: "🔮 AI Valuation & Feng Shui",

      // Vision Tools
      palm_title: "🖐 AI Palmistry Reading",
      face_title: "🙂 AI Physiognomy & Face Reading",
      vision_snap: "📸 Take Photo",
      vision_upload: "📁 Upload Image",
      vision_switch_cam: "🔄 Switch Cam",
      vision_close_cam: "❌ Close",
      vision_retake: "📸 Retake",
      vision_auto_toggle: "⚡ Auto analyze immediately after capturing",
      palm_btn: "🤖 Analyze Palm Directly",
      face_btn: "✨ Analyze Face Directly",

      // Tarot Tool
      tarot_title: "🃏 AI Tarot Card Reading",
      tarot_ask_placeholder: "What guidance are you seeking right now?...",
      tarot_btn: "🃏 Draw AI Cards",
      tarot_hint: "Enter your question and draw cards.",

      // Chat AI
      chat_brand: "Dang Nam AI",
      chat_sub: "Professional Super Assistant",
      chat_new_btn: "＋ New Chat",
      chat_placeholder: "Ask about destiny, Zi Wei, Feng Shui, career, relationships...",
      chat_send: "Send",

      // Voice TTS & STT
      voice_listening: "🎙️ Listening in English...",
      voice_mic_off: "Microphone is off. Please turn it on first.",
      voice_not_supported: "Your browser does not support speech recognition.",
      voice_speaking: "🔊 Reading aloud...",
      voice_auto_pick: "Auto-select English Voice",
      voice_rate_label: "Speech Speed",
      voice_auto_read_label: "Auto-read AI replies",

      // Copyright
      copyright_text: "© Copyright SyBinh · Certified Intellectual Property & Ownership"
    },

    zh: {
      // General
      app_title: "邓南玄机 AI",
      app_subtitle: "多模态东方命理学与紫微斗数人工智能专家",
      loading: "正在研判...",
      saving: "正在保存...",
      saved_success: "✅ 档案保存成功！",
      save: "保存",
      close: "关闭",
      cancel: "取消",
      confirm: "确认",
      copy: "📋 复制全文",
      copied: "✅ 已复制到剪贴板！",
      listen: "🔊 语音朗读",
      stop_listen: "⏹️ 停止朗读",
      print: "🖨️ 打印 / 导出PDF",
      not_saved: "未保存",
      saved: "已保存",

      // Top bar & Header
      destiny_profile: "本命档案",
      download_app: "📱 下载应用",
      account_member: "会员中心",
      quick_ask: "快捷提问",

      // Navigation & Tabs
      nav_home: "首页",
      nav_tuvi: "紫微十二宫",
      nav_tarot: "塔罗占卜",
      nav_sim: "数理吉凶",
      nav_palm: "手相分析",
      nav_face: "相学神态",
      nav_astrology: "西洋占星",
      nav_love: "八字合婚",
      nav_numerology: "生命灵数",
      nav_chat: "玄机问答",
      nav_fengshui: "风水堪舆",
      nav_history: "研判记录",
      nav_deep: "紫微命理精批",
      nav_account: "个人中心",

      // Hero Banner
      hero_title: "邓南玄机 DANG NAM MYSTIC",
      hero_subtitle: "融合紫微斗数、四柱八字、易经六十四卦与塔罗占星的多模态人工智能研判大模型系统。",
      hero_btn_tuvi: "📜 紫微十二宫命盘",
      hero_btn_chat: "💬 开启灵机对话",
      hero_sub_tags: "AI 紫微斗数 - 手相面相 - 东方神煞 - 占星术",
      quick_ask_btn: "✦ AI 深度分析",
      tuvi_tool_title: "紫微斗数十二宫命盘",
      mobile_back_desktop: "🖥️ 电脑版",
      history_title: "🗂 分析历史记录",
      clear_history: "🧹 清空记录",
      cskh_fab_label: "客服与报错",
      cskh_title: "客服与技术支持助理",

      // Destiny Profile Modal
      destiny_modal_title: "📜 本命命盘档案",
      destiny_modal_tag: "双端同步: 本地 + 云端",
      destiny_modal_desc: "请完整填写出生信息，邓南 AI 将自动锁定命宫天盘，为您精准推演紫微格局、大运流年与五行顺逆。",
      destiny_fullname: "命主姓名",
      destiny_gender: "性别",
      destiny_male: "乾造 (男)",
      destiny_female: "坤造 (女)",
      destiny_calendar: "历法类型",
      destiny_solar: "公历 (阳历)",
      destiny_lunar: "农历 (阴历)",
      destiny_birthdate: "出生年月日 (日/月/年)",
      destiny_birthhour: "出生时辰 (十二时辰)",
      destiny_birthplace: "出生地点 / 籍贯 (选填)",
      destiny_save_btn: "💾 保存本命档案",
      destiny_required_error: "请填写命主姓名与出生日期",
      destiny_invalid_date: "⚠️ 出生日期格式不正确，请使用 日/月/年 格式 (例如: 20/10/1995)",

      // 12 Shichen (Canh Giờ)
      hour_ty: "子时 (23:00 - 00:59)",
      hour_suu: "丑时 (01:00 - 02:59)",
      hour_dan: "寅时 (03:00 - 04:59)",
      hour_mao: "卯时 (05:00 - 06:59)",
      hour_thin: "辰时 (07:00 - 08:59)",
      hour_ty_: "巳时 (09:00 - 10:59)",
      hour_ngo: "午时 (11:00 - 12:59)",
      hour_mui: "未时 (13:00 - 14:59)",
      hour_than: "申时 (15:00 - 16:59)",
      hour_dau: "酉时 (17:00 - 18:59)",
      hour_tuat: "戌时 (19:00 - 20:59)",
      hour_hoi: "亥时 (21:00 - 22:59)",

      // 12 Cung Board
      board_title: "📜 紫微斗数十二宫交互命盘",
      board_desc: "传统斗数十二宫全盘架构结合邓南 AI 人工智能算法。点击任意宫位即可实时深入精批吉凶格局。",
      cung_tat_ach: "疾厄宫",
      cung_thien_di: "迁移宫",
      cung_no_boc: "交友宫 (奴仆)",
      cung_quan_loc: "官禄宫 (事业)",
      cung_tai_bach: "财帛宫",
      cung_dien_trach: "田宅宫",
      cung_phuc_duc: "福德宫",
      cung_phu_the: "夫妻宫",
      cung_menh: "命宫 (身命核心)",
      cung_huynh_de: "兄弟宫",
      cung_tu_tuc: "子女宫",
      cung_phu_mau: "父母宫",
      btn_luan_cung: "🔮 研判宫位",

      // Deep Tu Vi Tool
      deep_title: "🧠 紫微命理终身运势精批 PRO",
      deep_desc: "提供详细的个人问询，AI 将多层推演大限流年与星曜吉凶组合。",
      deep_ask_placeholder: "请详述您当前遇到的困惑、事业选择、财富运势或具体问题...",
      deep_focus_label: "研判重点",
      deep_focus_all: "终身格局与大运流年",
      deep_focus_career: "仕途功名、事业与财源",
      deep_focus_love: "姻缘感情与婚姻吉凶",
      deep_focus_mind: "心性解析与行事指南",
      deep_btn: "✦ 开启深度命理精批",

      // Love Tool
      love_title: "💕 八字合婚与姻缘契合",
      love_person1: "命主 1 姓名",
      love_birth1: "命主 1 出生日期",
      love_person2: "命主 2 姓名",
      love_birth2: "命主 2 出生日期",
      love_btn: "🤖 AI 推演八字合婚",

      // Numerology Tool
      num_title: "🔢 生命灵数与数理契机",
      num_name: "完整姓名",
      num_birth: "出生日期",
      num_btn: "🤖 AI 推演灵数报告",
      num_local_btn: "🔎 本地速算",

      // Sim Phong Thuy Tool
      sim_title: "📱 手机号码估价与数理吉凶",
      sim_hint: "* 输入手机号码，AI 综合评定市场价值、阴阳五行平衡、卦象吉凶与九运旺衰。",
      sim_phone_label: "待测手机号码",
      sim_birth_label: "出生年份或日期 (用于命卦相合)",
      sim_btn: "🔮 AI 估价与吉凶研判",

      // Vision Tools
      palm_title: "🖐 人工智能手相精批",
      face_title: "🙂 人工智能相学神态",
      vision_snap: "📸 拍照",
      vision_upload: "📁 上传图片",
      vision_switch_cam: "🔄 切换镜头",
      vision_close_cam: "❌ 关闭",
      vision_retake: "📸 重拍",
      vision_auto_toggle: "⚡ 拍照完成后立即自动分析",
      palm_btn: "🤖 开始手相分析",
      face_btn: "✨ 开始面相分析",

      // Tarot Tool
      tarot_title: "🃏 塔罗牌神谕指引",
      tarot_ask_placeholder: "此刻您内心最渴望探寻的指引是...",
      tarot_btn: "🃏 AI 牌阵抽取",
      tarot_hint: "输入问题后点击抽取牌阵。",

      // Chat AI
      chat_brand: "邓南玄机 AI",
      chat_sub: "专业多模态超级助手",
      chat_new_btn: "＋ 开启新对话",
      chat_placeholder: "问询命盘运势、紫微流年、八字风水、事业契机、情感发展...",
      chat_send: "发送",

      // Voice TTS & STT
      voice_listening: "🎙️ 正在聆听中文语音...",
      voice_mic_off: "麦克风已关闭，请先开启麦克风权限。",
      voice_not_supported: "当前浏览器暂不支持语音识别功能。",
      voice_speaking: "🔊 正在进行普通话朗读...",
      voice_auto_pick: "自动选用标准中文语音",
      voice_rate_label: "朗读语速",
      voice_auto_read_label: "自动朗读 AI 回复",

      // Copyright
      copyright_text: "© Copyright SyBinh · 知识产权与数字版权认证"
    }
  };

  let activeLang = 'vi';

  // Get current language from local storage, default to 'vi'
  function getCurrentLang() {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && LANGUAGES[saved]) return saved;
      }
    } catch (e) {}
    return activeLang || 'vi';
  }

  // Set language and broadcast change
  function setLanguage(lang) {
    if (!LANGUAGES[lang]) lang = 'vi';
    activeLang = lang;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, lang);
      }
    } catch (e) {}

    // Update html lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', lang);
      document.body.dataset.lang = lang;
      applyTranslations(lang);
      updateLanguageSelectorUI(lang);
    }

    // Dispatch event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }

    return lang;
  }

  // Translation lookup
  function t(key, fallback = '') {
    const lang = getCurrentLang();
    const table = DICT[lang] || DICT.vi;
    if (table[key] !== undefined) return table[key];
    if (DICT.vi[key] !== undefined) return DICT.vi[key];
    return fallback || key;
  }

  // Update elements with data-i18n attributes in the DOM
  function applyTranslations(lang) {
    if (typeof document === 'undefined') return;
    const l = lang || getCurrentLang();
    const table = DICT[l] || DICT.vi;

    // Text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (table[key] !== undefined) {
        el.textContent = table[key];
      }
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (table[key] !== undefined) {
        el.setAttribute('placeholder', table[key]);
      }
    });

    // Titles
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (table[key] !== undefined) {
        el.setAttribute('title', table[key]);
      }
    });
  }

  // Update Language dropdown/pill UI
  function updateLanguageSelectorUI(lang) {
    const l = lang || getCurrentLang();
    const meta = LANGUAGES[l] || LANGUAGES.vi;
    const flagEl = document.getElementById('curLangFlag');
    const codeEl = document.getElementById('curLangCode');
    if (flagEl) flagEl.textContent = meta.flag;
    if (codeEl) codeEl.textContent = meta.code.toUpperCase();

    // Mark active across all selector styles (topbar bar, floating dock, mobile header, side menu)
    document.querySelectorAll('.lang-opt, .lang-btn, .float-lang-btn, .m-lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === l);
    });
  }

  return {
    LANGUAGES,
    DICT,
    getCurrentLang,
    setLanguage,
    t,
    applyTranslations,
    updateLanguageSelectorUI
  };
}));
