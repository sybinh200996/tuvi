const TAROT_CARDS_DATA = [{
  "id": 0,
  "num": "0",
  "name": "The Fool - Chàng Khờ",
  "en": "The Fool",
  "vi": "Chàng Khờ",
  "icon": "🎒",
  "keywords": "Khởi đầu mới, tự do, tiềm năng",
  "mean": "Đại diện cho sự bắt đầu một hành trình mới đầy hứng khởi. Hãy tự tin dấn bước, giữ tâm hồn cởi mở và lạc quan."
}, {
  "id": 1,
  "num": "I",
  "name": "The Magician - Ảo Thuật Gia",
  "en": "The Magician",
  "vi": "Ảo Thuật Gia",
  "icon": "🪄",
  "keywords": "Ý chí, hành động, hiện thực hóa",
  "mean": "Bạn đang nắm trong tay mọi kỹ năng và nguồn lực để biến ý tưởng thành hiện thực. Hãy chủ động hành động."
}, {
  "id": 2,
  "num": "II",
  "name": "The High Priestess - Nữ Tu Tối Cao",
  "en": "The High Priestess",
  "vi": "Nữ Tu Tối Cao",
  "icon": "📜",
  "keywords": "Trực giác, bí ẩn, tĩnh lặng",
  "mean": "Lắng nghe tiếng nói trực giác bên trong bạn. Mọi câu trả lời bạn tìm kiếm đang ẩn sâu trong nội tâm."
}, {
  "id": 3,
  "num": "III",
  "name": "The Empress - Hoàng Hậu",
  "en": "The Empress",
  "vi": "Hoàng Hậu",
  "icon": "👑",
  "keywords": "Trù phú, nuôi dưỡng, tình yêu",
  "mean": "Báo hiệu thời kỳ thịnh vượng, tình cảm đơm hoa kết trái và những dự định sáng tạo có kết quả tốt."
}, {
  "id": 4,
  "num": "IV",
  "name": "The Emperor - Hoàng Đế",
  "en": "The Emperor",
  "vi": "Hoàng Đế",
  "icon": "🏛️",
  "keywords": "Trật tự, quyền uy, kỷ luật",
  "mean": "Xây dựng cấu trúc vững chắc, kiểm soát tốt tình hình và làm chủ cuộc sống bằng sự kiên định."
}, {
  "id": 5,
  "num": "V",
  "name": "The Hierophant - Đại Tư Tế",
  "en": "The Hierophant",
  "vi": "Đại Tư Tế",
  "icon": "📿",
  "keywords": "Đạo đức, tri thức, dẫn lối",
  "mean": "Tìm kiếm lời khuyên từ người có kinh nghiệm hoặc tuân theo các chuẩn mực đạo đức, quy tắc chung."
}, {
  "id": 6,
  "num": "VI",
  "name": "The Lovers - Đôi Uyên Ương",
  "en": "The Lovers",
  "vi": "Đôi Uyên Ương",
  "icon": "💕",
  "keywords": "Tình duyên, hòa hợp, lựa chọn",
  "mean": "Gắn kết tình cảm sâu sắc hoặc đứng trước một lựa chọn quan trọng từ trái tim. Hãy chọn con đường chân thành."
}, {
  "id": 7,
  "num": "VII",
  "name": "The Chariot - Cỗ Chiến Xa",
  "en": "The Chariot",
  "vi": "Cỗ Chiến Xa",
  "icon": "🛡️",
  "keywords": "Quyết đoán, vượt khó, chiến thắng",
  "mean": "Ý chí kiên cường và lòng quyết tâm sẽ giúp bạn vượt qua mọi chướng ngại và tiến thẳng đến mục tiêu."
}, {
  "id": 8,
  "num": "VIII",
  "name": "Strength - Sức Mạnh Nội Tâm",
  "en": "Strength",
  "vi": "Sức Mạnh Nội Tâm",
  "icon": "🦁",
  "keywords": "Bình tĩnh, nhẫn nại, kiên cường",
  "mean": "Sức mạnh thực sự đến từ lòng nhân từ và sự điềm tĩnh, biết chế ngự cảm xúc để cảm hóa mọi khó khăn."
}, {
  "id": 9,
  "num": "IX",
  "name": "The Hermit - Ẩn Sĩ",
  "en": "The Hermit",
  "vi": "Ẩn Sĩ",
  "icon": "🕯️",
  "keywords": "Chiêm nghiệm, soi sáng, tìm kiếm",
  "mean": "Thời điểm cần một khoảng lặng tĩnh tâm để nhìn nhận lại bản thân, lắng nghe nội tâm trước khi quyết định."
}, {
  "id": 10,
  "num": "X",
  "name": "Wheel of Fortune - Vòng Xoay Vận Mệnh",
  "en": "Wheel of Fortune",
  "vi": "Vòng Xoay Vận Mệnh",
  "icon": "🎡",
  "keywords": "Bước ngoặt, thời vận, may mắn",
  "mean": "Bánh xe số phận đang quay theo hướng có lợi cho bạn. Hãy đón nhận sự thay đổi bất ngờ với tâm thế tích cực."
}, {
  "id": 11,
  "num": "XI",
  "name": "Justice - Công Lý",
  "en": "Justice",
  "vi": "Công Lý",
  "icon": "⚖️",
  "keywords": "Công bằng, sự thật, nhân quả",
  "mean": "Sự thật sẽ được sáng tỏ. Mọi quyết định cần dựa trên lý trí, sự công tâm và trách nhiệm."
}, {
  "id": 12,
  "num": "XII",
  "name": "The Hanged Man - Kẻ Treo Ngược",
  "en": "The Hanged Man",
  "vi": "Kẻ Treo Ngược",
  "icon": "🙃",
  "keywords": "Đổi góc nhìn, kiên nhẫn, giác ngộ",
  "mean": "Tạm dừng lại để đổi một góc nhìn mới. Đôi khi lùi một bước lại là tiến ba bước dài hơn."
}, {
  "id": 13,
  "num": "XIII",
  "name": "Death - Chuyển Hóa & Tái Sinh",
  "en": "Death",
  "vi": "Chuyển Hóa & Tái Sinh",
  "icon": "🦋",
  "keywords": "Kết thúc cái cũ, tái sinh cái mới",
  "mean": "Khép lại một giai đoạn cũ đã lỗi thời để nhường chỗ cho những điều mới mẻ, tốt đẹp hơn phát triển."
}, {
  "id": 14,
  "num": "XIV",
  "name": "Temperance - Tiết Chế",
  "en": "Temperance",
  "vi": "Tiết Chế",
  "icon": "🏺",
  "keywords": "Cân bằng, điều độ, kiên nhẫn",
  "mean": "Giữ tâm thái cân bằng, dung hòa giữa các mặt đối lập và bình tĩnh giải quyết từng bước."
}, {
  "id": 15,
  "num": "XV",
  "name": "The Devil - Giải Phóng Cám Dỗ",
  "en": "The Devil",
  "vi": "Giải Phóng Cám Dỗ",
  "icon": "⛓️",
  "keywords": "Cảnh giác, ràng buộc, giải thoát",
  "mean": "Cảnh báo những ràng buộc độc hại, thói quen tiêu cực hoặc ảo tưởng. Bạn hoàn toàn có quyền tự giải phóng mình."
}, {
  "id": 16,
  "num": "XVI",
  "name": "The Tower - Ngọn Tháp Sụp Đổ",
  "en": "The Tower",
  "vi": "Ngọn Tháp Sụp Đổ",
  "icon": "⚡",
  "keywords": "Biến động, thức tỉnh, xây dựng lại",
  "mean": "Một biến cố bất ngờ xảy ra để phá vỡ những nền tảng sai lầm, giúp bạn nhìn thẳng vào sự thật để tái tạo vững vàng hơn."
}, {
  "id": 17,
  "num": "XVII",
  "name": "The Star - Ngôi Sao Hy Vọng",
  "en": "The Star",
  "vi": "Ngôi Sao Hy Vọng",
  "icon": "⭐",
  "keywords": "Hy vọng, chữa lành, niềm tin",
  "mean": "Ánh sáng hy vọng soi đường sau cơn bão. Bạn đang được hồi phục năng lượng và tìm lại sự bình yên."
}, {
  "id": 18,
  "num": "XVIII",
  "name": "The Moon - Mặt Trăng Mờ Ảo",
  "en": "The Moon",
  "vi": "Mặt Trăng Mờ Ảo",
  "icon": "🌙",
  "keywords": "Ảo ảnh, trực giác, khám phá nỗi sợ",
  "mean": "Cần thận trọng với những điều chưa rõ ràng. Hãy tin vào trực giác và đừng để nỗi sợ vô căn cứ chi phối."
}, {
  "id": 19,
  "num": "XIX",
  "name": "The Sun - Mặt Trời Tỏa Sáng",
  "en": "The Sun",
  "vi": "Mặt Trời Tỏa Sáng",
  "icon": "☀️",
  "keywords": "Thành công, rạng rỡ, niềm vui lớn",
  "mean": "Một trong những lá bài tốt lành nhất bộ Tarot. Báo hiệu niềm vui, sự minh bạch, ấm áp và thành công rực rỡ."
}, {
  "id": 20,
  "num": "XX",
  "name": "Judgement - Sự Thức Tỉnh",
  "en": "Judgement",
  "vi": "Sự Thức Tỉnh",
  "icon": "🎺",
  "keywords": "Thức tỉnh, hồi sinh, tha thứ",
  "mean": "Tiếng gọi của sự thức tỉnh. Thời điểm tha thứ cho quá khứ và bước vào một chương mới trong cuộc đời."
}, {
  "id": 21,
  "num": "XXI",
  "name": "The World - Thế Giới Toàn Năng",
  "en": "The World",
  "vi": "Thế Giới Toàn Năng",
  "icon": "🌍",
  "keywords": "Viên mãn, hoàn tất, đỉnh cao",
  "mean": "Bạn đã hoàn thành xuất sắc một chu kỳ lớn. Sự viên mãn, thành tựu trọn vẹn và niềm tự hào xứng đáng."
}];
const {
  useEffect,
  useMemo,
  useRef,
  useState
} = React;
function saveHistory(type, content) {
  try {
    const list = JSON.parse(localStorage.getItem('synam_history') || '[]');
    list.unshift({
      type,
      content,
      at: new Date().toLocaleString('vi-VN')
    });
    localStorage.setItem('synam_history', JSON.stringify(list.slice(0, 80)));
  } catch (e) {}
}
const TABS = [{
  id: 'home',
  icon: '✨',
  label: 'Trang chủ'
}, {
  id: 'horoscope',
  icon: '🔮',
  label: 'Tử vi'
}, {
  id: 'palm',
  icon: '✋',
  label: 'Chỉ tay'
}, {
  id: 'face',
  icon: '👁️',
  label: 'Xem tướng'
}, {
  id: 'astrology',
  icon: '🌌',
  label: 'Chiêm tinh'
}, {
  id: 'love',
  icon: '💖',
  label: 'Tình duyên'
}, {
  id: 'numerology',
  icon: '🔢',
  label: 'Thần số học'
}, {
  id: 'sim',
  icon: '📱',
  label: 'Sim Số'
}, {
  id: 'chat',
  icon: '⚡',
  label: 'AI Chat'
}, {
  id: 'multi',
  icon: '🌌',
  label: 'Multi AI'
}, {
  id: 'fengshui',
  icon: '☯️',
  label: 'Phong thủy'
}, {
  id: 'tarot',
  icon: '🃏',
  label: 'Xem bài Tarot'
}, {
  id: 'settings',
  icon: '⚙️',
  label: 'AI Keys'
}];
const LEGACY_WELCOME = 'Chào Đặng Năm. Mình là Đặng Năm AI Ultra. Bạn có thể hỏi về tử vi, thời tiết, ý tưởng, phân tích lỗi, viết nội dung hoặc code; mình sẽ trả lời rõ ràng và thực tế.';
const WELCOME_MESSAGE = 'Chào bạn. Mình là Đặng Năm AI Ultra. Bạn có thể hỏi về tử vi, thời tiết, ý tưởng, phân tích lỗi, viết nội dung hoặc code; mình sẽ trả lời rõ ràng và thực tế.';
const DEFAULT_MESSAGES = [{
  role: 'assistant',
  text: WELCOME_MESSAGE
}];
function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const value = JSON.parse(raw);
    return value ?? fallback;
  } catch {
    return fallback;
  }
}
function authHeaders() {
  const token = localStorage.getItem('synam_token') || '';
  return token ? {
    Authorization: `Bearer ${token}`
  } : {};
}
async function apiJSON(url, payload, method = 'POST', signal) {
  const response = await fetch(url, {
    method,
    headers: {
      ...(method === 'GET' ? {} : {
        'Content-Type': 'application/json'
      }),
      ...authHeaders()
    },
    body: method === 'GET' ? undefined : JSON.stringify(payload || {}),
    ...(signal ? {
      signal
    } : {})
  });
  const raw = await response.text();
  let data = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = {
      message: raw
    };
  }
  if (!response.ok) throw new Error(data.error || data.message || `HTTP ${response.status}`);
  return data;
}
function optimizeImage(file, maxEdge = 1600, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('Chưa chọn ảnh.'));
    if (!String(file.type || '').startsWith('image/')) return reject(new Error('File phải là ảnh.'));
    if (file.size > 15 * 1024 * 1024) return reject(new Error('Ảnh quá lớn. Hãy chọn ảnh dưới 15 MB.'));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Không đọc được ảnh.'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('Ảnh không hợp lệ hoặc định dạng chưa được trình duyệt hỗ trợ.'));
      image.onload = () => {
        const scale = Math.min(1, maxEdge / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error(`Không đọc được file ${file.name || ''}.`));
    reader.readAsDataURL(file);
  });
}
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || '').slice(0, 12000));
    reader.onerror = () => reject(new Error(`Không đọc được nội dung ${file.name || ''}.`));
    reader.readAsText(file);
  });
}
async function prepareChatAttachment(file) {
  if (!file) throw new Error('File đính kèm không hợp lệ.');
  if (file.size > 18 * 1024 * 1024) throw new Error(`${file.name}: tối đa 18 MB mỗi file/video clip.`);
  const name = String(file.name || 'file');
  const originalType = String(file.type || 'application/octet-stream').toLowerCase();
  const isText = originalType.startsWith('text/') || /\.(txt|md|csv|json|xml|html|js|ts|py|log|css)$/i.test(name);
  if (isText) {
    return {
      name,
      type: originalType,
      size: file.size,
      textPreview: await readFileAsText(file)
    };
  }
  if (originalType.startsWith('image/')) {
    try {
      const dataUrl = await optimizeImage(file, 1600, 0.82);
      return {
        name,
        type: 'image/jpeg',
        size: file.size,
        dataUrl
      };
    } catch {
      return {
        name,
        type: originalType,
        size: file.size,
        dataUrl: await readFileAsDataUrl(file)
      };
    }
  }
  if (originalType.startsWith('video/') || /\.(mp4|webm|mov)$/i.test(name)) {
    return {
      name,
      type: originalType || 'video/mp4',
      size: file.size,
      dataUrl: await readFileAsDataUrl(file),
      isVideo: true
    };
  }
  return {
    name,
    type: originalType,
    size: file.size,
    dataUrl: await readFileAsDataUrl(file)
  };
}
function markdownLite(text = '') {
  try {
    if (typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined') {
      return DOMPurify.sanitize(marked.parse(String(text), {
        breaks: true,
        gfm: true
      }));
    }
  } catch (e) {}
  const safe = String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return safe.replace(/\n/g, '<br/>');
}
const BIRTH_PROFILE_STORAGE_KEY = 'dangnam_birth_profile';
const DESTINY_STORAGE_KEY = 'dangnam_destiny_profile';
function getBirthProfile() {
  try {
    const raw = localStorage.getItem(BIRTH_PROFILE_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    const legacy = localStorage.getItem(DESTINY_STORAGE_KEY);
    if (legacy) return JSON.parse(legacy);
    const legacy2 = localStorage.getItem('synam_destiny_profile');
    if (legacy2) return JSON.parse(legacy2);
  } catch (e) {}
  const u = readJSON('synam_user', null);
  return u?.birthProfile || u?.destinyProfile || null;
}
function getDestinyProfile() {
  return getBirthProfile();
}
async function saveDestinyProfile(profile) {
  if (!profile) return;
  try {
    localStorage.setItem(BIRTH_PROFILE_STORAGE_KEY, JSON.stringify(profile));
    localStorage.setItem(DESTINY_STORAGE_KEY, JSON.stringify(profile));
    localStorage.setItem('synam_destiny_profile', JSON.stringify(profile));
  } catch (e) {}
  try {
    await fetch('/api/user/destiny-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify({
        profile,
        birthProfile: profile,
        destinyProfile: profile
      })
    });
  } catch (e) {}
  try {
    if (typeof window !== 'undefined' && window.firebase && window.firebase.apps && window.firebase.apps.length) {
      const auth = window.firebase.auth();
      const currentUser = auth.currentUser;
      if (currentUser && window.firebase.firestore) {
        const db = window.firebase.firestore();
        await db.collection('users').doc(currentUser.uid).set({
          birthProfile: profile,
          destinyProfile: profile,
          updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
        }, {
          merge: true
        });
        await db.collection('destiny_profiles').doc(currentUser.uid).set({
          ...profile,
          email: currentUser.email || '',
          updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
        }, {
          merge: true
        });
      }
    }
  } catch (e) {
    console.warn('Sync destiny profile to Firestore:', e);
  }
}
async function saveBirthProfile(profile) {
  return saveDestinyProfile(profile);
}
async function loadDestinyProfileFromCloud() {
  try {
    const res = await fetch('/api/user/destiny-profile', {
      headers: authHeaders()
    });
    const data = await res.json();
    const p = data?.profile || data?.destinyProfile;
    if (data.ok && p) {
      localStorage.setItem(BIRTH_PROFILE_STORAGE_KEY, JSON.stringify(p));
      localStorage.setItem(DESTINY_STORAGE_KEY, JSON.stringify(p));
      return p;
    }
  } catch (e) {}
  return getDestinyProfile();
}
function exportResultToPrint(title, text) {
  if (!text) return alert('Chưa có nội dung để in hoặc xuất PDF.');
  const profile = getDestinyProfile();
  const cleanTitle = (title || 'BẢN LUẬN GIẢI MỆNH LÝ & VẬN TRÌNH').toUpperCase();
  const now = new Date().toLocaleString('vi-VN');
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    return alert('Trình duyệt đã chặn cửa sổ in. Vui lòng cho phép popup để xuất bản luận giải.');
  }
  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>${cleanTitle} - Đặng Năm AI</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @page { size: A4 portrait; margin: 16mm 14mm; }
    body { font-family: 'Times New Roman', 'Segoe UI', serif; font-size: 14pt; line-height: 1.6; color: #111; margin: 0; padding: 20px; position: relative; background: #fff; }
    .print-watermark { position: fixed; top: 45%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg); font-size: 52pt; font-weight: 900; color: rgba(0, 0, 0, 0.05); pointer-events: none; z-index: 0; white-space: nowrap; font-family: sans-serif; }
    .header { text-align: center; border-bottom: 2px solid #8b0000; padding-bottom: 12px; margin-bottom: 18px; }
    .brand { font-size: 18pt; font-weight: bold; color: #8b0000; letter-spacing: 2px; }
    .subbrand { font-size: 11pt; color: #555; text-transform: uppercase; margin-top: 4px; }
    .doc-title { font-size: 15pt; font-weight: bold; margin-top: 14px; color: #222; }
    .meta-box { background: #fbf8f2; border: 1px solid #e2d7c5; border-radius: 6px; padding: 10px 14px; margin-bottom: 20px; font-size: 11pt; }
    .meta-row { display: flex; flex-wrap: wrap; gap: 16px; margin: 3px 0; }
    .content { font-size: 13pt; text-align: justify; z-index: 1; position: relative; }
    .content h1, .content h2, .content h3 { color: #8b0000; margin-top: 16px; margin-bottom: 8px; }
    .content p { margin: 8px 0; }
    .footer { margin-top: 30px; border-top: 1px solid #ccc; padding-top: 10px; font-size: 10pt; color: #666; display: flex; justify-content: space-between; flex-wrap: wrap; }
    .actions-bar { position: sticky; top: 0; background: #333; color: #fff; padding: 10px; text-align: center; margin: -20px -20px 20px -20px; z-index: 100; }
    .print-btn { background: #8b0000; color: #fff; border: none; padding: 8px 18px; border-radius: 4px; font-size: 14px; font-weight: bold; cursor: pointer; margin: 0 6px; }
    @media print {
      .actions-bar { display: none !important; }
      body { padding: 0 !important; }
    }
  </style>
</head>
<body>
  <div class="actions-bar">
    <button class="print-btn" onclick="window.print()">🖨️ In ngay / Lưu PDF</button>
    <button class="print-btn" style="background:#555;" onclick="window.close()">Đóng</button>
  </div>
  <div class="print-watermark">dangnam.online</div>
  <div class="header">
    <div class="brand">✦ ĐẶNG NĂM AI ✦</div>
    <div class="subbrand">HỆ THỐNG TRÍ TUỆ NHÂN TẠO LUẬN GIẢI MỆNH LÝ & PHONG THỦY HỌC</div>
    <div class="doc-title">${cleanTitle}</div>
  </div>
  ${profile && (profile.fullName || profile.name) ? `
  <div class="meta-box">
    <div class="meta-row">
      <span><b>Đương số:</b> ${profile.fullName || profile.name}</span>
      <span><b>Giới tính:</b> ${profile.gender || 'Nam'}</span>
      <span><b>Ngày sinh:</b> ${profile.birthDate || 'Chưa rõ'} (${profile.calendarType === 'lunar' ? 'Âm lịch' : 'Dương lịch'})</span>
      ${profile.birthTime ? `<span><b>Giờ sinh:</b> ${profile.birthTime}</span>` : ''}
    </div>
    ${profile.concern ? `<div class="meta-row"><span><b>Mối quan tâm:</b> ${profile.concern}</span></div>` : ''}
  </div>` : ''}
  <div class="content">
    ${typeof markdownLite === 'function' ? markdownLite(text) : text.replace(/\n/g, '<br>')}
  </div>
  <div class="footer">
    <span>Nguồn xuất bản: <b>dangnam.online</b> (Đặng Năm AI)</span>
    <span>Thời gian: ${now}</span>
    <span>Lưu ý: Luận giải mang tính tham khảo văn hóa & chiêm nghiệm</span>
  </div>
  <script>
    setTimeout(() => { window.print(); }, 400);
  </script>
</body>
</html>`;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
async function streamChatResponse({
  url,
  payload,
  signal,
  onStart,
  onDelta,
  onDone,
  onError
}) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
        ...authHeaders()
      },
      body: JSON.stringify(payload),
      ...(signal ? {
        signal
      } : {})
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || errJson.message || `HTTP ${res.status}`);
    }
    const reader = res.body?.getReader ? res.body.getReader() : null;
    if (!reader) {
      const data = await res.json();
      const txt = data.reply || data.text || '';
      if (typeof onDone === 'function') onDone(txt, data);
      return txt;
    }
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let currentEvent = 'message';
    let fullText = '';
    let isTerminated = false;
    while (true) {
      const {
        done,
        value
      } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, {
        stream: true
      });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) {
          currentEvent = 'message';
          continue;
        }
        if (trimmed.startsWith('event: ')) {
          currentEvent = trimmed.slice(7).trim();
          continue;
        }
        if (trimmed.startsWith('data: ')) {
          const rawData = trimmed.slice(6).trim();
          if (rawData === '[DONE]') {
            isTerminated = true;
            if (typeof onDone === 'function') onDone(fullText, {
              label: 'Đặng Năm AI'
            });
            return fullText;
          }
          try {
            const data = JSON.parse(rawData);
            if (data.error) {
              throw new Error(data.error || 'Lỗi streaming từ AI');
            }
            const chunk = data.content ?? data.chunk ?? (data.choices && data.choices[0]?.delta?.content) ?? '';
            if (chunk) {
              fullText += chunk;
              if (typeof onDelta === 'function') onDelta(chunk, fullText);
            } else if (currentEvent === 'start') {
              if (typeof onStart === 'function') onStart(data);
            } else if (currentEvent === 'done' || data.done) {
              isTerminated = true;
              if (typeof onDone === 'function') onDone(data.fullText || fullText, data);
            }
          } catch (pe) {
            if (rawData && rawData !== '[DONE]') {
              fullText += rawData;
              if (typeof onDelta === 'function') onDelta(rawData, fullText);
            }
          }
        }
      }
    }
    if (!isTerminated && typeof onDone === 'function') {
      onDone(fullText, {
        label: 'Đặng Năm AI'
      });
    }
    return fullText;
  } catch (err) {
    if (typeof onError === 'function') onError(err);
    throw err;
  }
}
function HistoryTool() {
  const [list, setList] = useState([]);
  useEffect(() => {
    try {
      setList(JSON.parse(localStorage.getItem('synam_history') || '[]'));
    } catch (e) {}
  }, []);
  function clearHist() {
    if (confirm('Xóa toàn bộ lịch sử?')) {
      localStorage.removeItem('synam_history');
      setList([]);
    }
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "tool-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "premium-panel",
    style: {
      padding: '15px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0
    }
  }, "⏳ Lịch sử"), list.length > 0 && /*#__PURE__*/React.createElement("button", {
    onClick: clearHist,
    className: "ghost",
    style: {
      padding: '6px 12px',
      fontSize: '12px'
    }
  }, "Xóa hết")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '15px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }
  }, list.length === 0 ? /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--muted)'
    }
  }, "Chưa có lịch sử nào.") : list.map((item, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: 'rgba(255,255,255,0.08)',
      padding: '12px',
      borderRadius: '12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px',
      fontSize: '12px',
      color: 'var(--brand)'
    }
  }, /*#__PURE__*/React.createElement("b", null, item.type), " ", /*#__PURE__*/React.createElement("span", null, item.at)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '14px',
      lineHeight: '1.5',
      whiteSpace: 'pre-wrap',
      maxHeight: '200px',
      overflowY: 'auto'
    }
  }, item.content))))));
}
function App() {
  const [tab, setTab] = useState('home');
  const [health, setHealth] = useState('Đang kiểm tra AI...');
  const [providers, setProviders] = useState([]);
  useEffect(() => {
    fetch('/api/health').then(r => r.json()).then(d => setHealth(d.ok ? 'Server online' : 'Server lỗi')).catch(() => setHealth('Server chưa kết nối'));
    loadProviders();
  }, []);
  async function loadProviders() {
    try {
      const data = await fetch('/api/ai/providers', {
        headers: authHeaders()
      }).then(r => r.json());
      setProviders(data.providers || []);
    } catch {
      setProviders([]);
    }
  }
  return /*#__PURE__*/React.createElement("main", {
    className: "app-shell"
  }, /*#__PURE__*/React.createElement(Hero, {
    tab: tab,
    setTab: setTab,
    health: health,
    providers: providers
  }), /*#__PURE__*/React.createElement(TabRail, {
    tab: tab,
    setTab: setTab
  }), /*#__PURE__*/React.createElement("section", {
    className: "workspace"
  }, tab === 'home' && /*#__PURE__*/React.createElement(Home, {
    setTab: setTab,
    providers: providers
  }), tab === 'chat' && /*#__PURE__*/React.createElement(Chat, {
    providers: providers
  }), tab === 'deep' && /*#__PURE__*/React.createElement(DeepTool, null), tab === 'palm' && /*#__PURE__*/React.createElement(VisionTool, {
    mode: "palm",
    title: "Xem chỉ tay AI",
    icon: "✋"
  }), tab === 'face' && /*#__PURE__*/React.createElement(VisionTool, {
    mode: "face",
    title: "Xem tướng AI",
    icon: "🙂"
  }), tab === 'love' && /*#__PURE__*/React.createElement(LoveTool, null), tab === 'horoscope' && /*#__PURE__*/React.createElement(TuviTool, null), tab === 'astrology' && /*#__PURE__*/React.createElement(AstrologyTool, null), tab === 'numerology' && /*#__PURE__*/React.createElement(NumerologyTool, null), tab === 'sim' && /*#__PURE__*/React.createElement(SimTool, null), tab === 'multi' && /*#__PURE__*/React.createElement(Chat, {
    providers: providers
  }), tab === 'fengshui' && /*#__PURE__*/React.createElement(FengShuiTool, null), tab === 'tarot' && /*#__PURE__*/React.createElement(TarotTool, null), tab === 'history' && /*#__PURE__*/React.createElement(HistoryTool, null), tab === 'settings' && /*#__PURE__*/React.createElement(Settings, {
    providers: providers,
    reload: loadProviders
  })), /*#__PURE__*/React.createElement("nav", {
    className: "bottom-nav"
  }, /*#__PURE__*/React.createElement("button", {
    "aria-label": "Trang chủ",
    onClick: () => setTab('home'),
    className: tab === 'home' ? 'active' : ''
  }, /*#__PURE__*/React.createElement("svg", {
    className: "bottom-nav-icon",
    viewBox: "0 0 24 24",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m3 10 9-7 9 7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5.5 9v11h13V9M9.5 20v-6h5v6"
  })), /*#__PURE__*/React.createElement("span", null, "Trang chủ")), /*#__PURE__*/React.createElement("button", {
    "aria-label": "Lịch sử",
    onClick: () => setTab('history'),
    className: tab === 'history' ? 'active' : ''
  }, /*#__PURE__*/React.createElement("svg", {
    className: "bottom-nav-icon",
    viewBox: "0 0 24 24",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3.5 8.5A8.5 8.5 0 1 1 4 17"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3.5 3.5v5h5M12 7v5l3 2"
  })), /*#__PURE__*/React.createElement("span", null, "Lịch sử")), /*#__PURE__*/React.createElement("button", {
    className: "magic",
    "aria-label": "Mở AI Chat",
    title: "Mở AI Chat",
    onClick: () => setTab('chat')
  }, "✦"), /*#__PURE__*/React.createElement("button", {
    "aria-label": "AI Chat",
    onClick: () => setTab('chat'),
    className: tab === 'chat' ? 'active' : ''
  }, /*#__PURE__*/React.createElement("svg", {
    className: "bottom-nav-icon",
    viewBox: "0 0 24 24",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 11.5a7.5 7.5 0 0 1-7.5 7.5H6l-3 2 1.2-4.1A7.5 7.5 0 1 1 20 11.5Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 11.5h.01M12 11.5h.01M16 11.5h.01"
  })), /*#__PURE__*/React.createElement("span", null, "AI Chat")), /*#__PURE__*/React.createElement("button", {
    "aria-label": "Tài khoản",
    onClick: () => setTab('settings'),
    className: tab === 'settings' ? 'active' : ''
  }, /*#__PURE__*/React.createElement("svg", {
    className: "bottom-nav-icon",
    viewBox: "0 0 24 24",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "8",
    r: "3.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4.5 21a7.5 7.5 0 0 1 15 0M5 21h14"
  })), /*#__PURE__*/React.createElement("span", null, "Tài khoản"))));
}
function Hero({
  setTab,
  health,
  providers
}) {
  const configured = providers.filter(p => p.configured).length;
  const [query, setQuery] = useState("");
  function handleSearch() {
    if (query.trim()) {
      localStorage.setItem("synam_quick_ask", query.trim());
    }
    setTab("chat");
  }
  return /*#__PURE__*/React.createElement("header", {
    className: "hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-img hero-left"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/hero-left.png",
    alt: "Minh họa Đặng Năm bên trái"
  })), /*#__PURE__*/React.createElement("div", {
    className: "hero-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "status-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), health, /*#__PURE__*/React.createElement("span", {
    className: "chip"
  }, configured || 0, " AI đang bật")), /*#__PURE__*/React.createElement("h1", null, "Đặng Năm ", /*#__PURE__*/React.createElement("b", null, "Mystic")), /*#__PURE__*/React.createElement("p", null, "AI • Tử vi • Chỉ tay • Xem tướng • Chiêm tinh"), /*#__PURE__*/React.createElement("div", {
    className: "hero-actions quick"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setTab('horoscope')
  }, "🔮 Tử vi hôm nay"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setTab('astrology')
  }, "🪐 Cung hoàng đạo"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setTab('palm')
  }, "✋ Xem chỉ tay"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setTab('face')
  }, "🙂 Xem tướng")), /*#__PURE__*/React.createElement("div", {
    className: "hero-search"
  }, /*#__PURE__*/React.createElement("input", {
    value: query,
    onChange: e => setQuery(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter") handleSearch();
    },
    placeholder: "Nhập câu hỏi tử vi..."
  }), /*#__PURE__*/React.createElement("button", {
    onClick: handleSearch
  }, "✦ AI phân tích"))), /*#__PURE__*/React.createElement("div", {
    className: "hero-img hero-right"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/hero-right.jpg",
    alt: "Minh họa Đặng Năm bên phải"
  })));
}
function TabRail({
  tab,
  setTab
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "tab-rail-wrap"
  }, /*#__PURE__*/React.createElement("nav", {
    className: "tab-rail"
  }, TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    className: tab === t.id ? 'active' : '',
    onClick: () => setTab(t.id)
  }, /*#__PURE__*/React.createElement("span", null, t.icon), t.label))));
}
function Home({
  setTab,
  providers
}) {
  const cards = [['🧠', 'Phân tích Tử vi chuyên sâu', 'AI tổng hợp đa lớp, luận giải chuyên sâu.', 'deep'], ['🔮', 'Tử vi', 'Luận giải hôm nay, công việc, tình cảm, tài chính.', 'horoscope'], ['✋', 'Xem chỉ tay', 'Upload ảnh bàn tay để AI phân tích rõ hơn.', 'palm'], ['🙂', 'Xem tướng', 'Upload ảnh khuôn mặt, nhận luận giải nhẹ nhàng.', 'face'], ['🪐', 'Chiêm tinh', 'Cung hoàng đạo, vận trình tháng, tình cảm.', 'astrology'], ['💞', 'Tình duyên', 'Tính tuổi, ngũ hành, thần số học bằng code trước khi AI luận.', 'love'], ['🔢', 'Thần số học', 'Tính số chủ đạo, linh hồn, biểu đạt và luận AI.', 'numerology'], ['📱', 'Sim Phong Thủy', 'Định giá thị trường, quẻ kinh dịch và âm dương.', 'sim'], ['💬', 'AI Chat Pro', 'Trả lời có nhớ ngữ cảnh, copy, đọc giọng nói.', 'chat'], ['🤖', 'Multi AI', 'Tự chọn Claude, Gemini, Groq, OpenRouter, ChatGPT, Grok.', 'multi'], ['☯️', 'Phong thủy', 'Màu hợp, hướng hợp, bố trí phòng/bàn làm việc.', 'fengshui'], ['🃏', 'Xem bài Tarot', 'Bốc bài tham khảo và đổi bài nhanh.', 'tarot'], ['⚙️', 'Cài đặt', 'Quản lý tài khoản và thiết lập AI.', 'settings']];
  return /*#__PURE__*/React.createElement("div", {
    className: "home-grid"
  }, cards.map(c => /*#__PURE__*/React.createElement("button", {
    key: c[3],
    className: "feature-card",
    onClick: () => setTab(c[3])
  }, /*#__PURE__*/React.createElement("b", null, c[0]), /*#__PURE__*/React.createElement("h3", null, c[1]), /*#__PURE__*/React.createElement("p", null, c[2]))));
}
function Chat({
  providers
}) {
  const [messages, setMessages] = useState(() => {
    const saved = readJSON('nam44_messages', DEFAULT_MESSAGES);
    return Array.isArray(saved) && saved.length ? saved.slice(-50).map(m => m?.role === 'assistant' && m.text === LEGACY_WELCOME ? {
      ...m,
      text: WELCOME_MESSAGE
    } : m) : DEFAULT_MESSAGES;
  });
  const [historyOpen, setHistoryOpen] = useState(false);
  const [showUploads, setShowUploads] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [text, setText] = useState('');
  const [modelChoice, setModelChoice] = useState('auto');
  const [answerStyle, setAnswerStyle] = useState('detailed');
  const [council, setCouncil] = useState(false);
  const [busy, setBusy] = useState(false);
  const [lastPrompt, setLastPrompt] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [fileNotice, setFileNotice] = useState('');
  const [voiceStatus, setVoiceStatus] = useState('');
  const [listening, setListening] = useState(false);
  const [speakingId, setSpeakingId] = useState(null);
  const boxRef = useRef(null);
  const imageInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const voiceTranscriptRef = useRef('');
  const draftRef = useRef('');
  const sendRef = useRef(null);
  const requestAbortRef = useRef(null);
  const autoSendTimerRef = useRef(null);
  const autoSendIntervalRef = useRef(null);
  function cancelAutoSend() {
    if (autoSendTimerRef.current || autoSendIntervalRef.current) {
      if (autoSendTimerRef.current) clearTimeout(autoSendTimerRef.current);
      if (autoSendIntervalRef.current) clearInterval(autoSendIntervalRef.current);
      autoSendTimerRef.current = null;
      autoSendIntervalRef.current = null;
      setVoiceStatus('Đã dừng tự động gửi. Bạn có thể chỉnh sửa câu hỏi.');
      setTimeout(() => setVoiceStatus(''), 2500);
    }
  }
  useEffect(() => () => {
    try {
      recognitionRef.current?.abort();
    } catch {}
    requestAbortRef.current?.abort?.();
    try {
      if (typeof window !== 'undefined' && window.SyncSpeech) window.SyncSpeech.stop();else speechSynthesis.cancel();
    } catch {}
  }, []);
  useEffect(() => {
    const quickAsk = localStorage.getItem('synam_quick_ask');
    if (quickAsk) {
      localStorage.removeItem('synam_quick_ask');
      setText(quickAsk);
    }
  }, []);
  useEffect(() => {
    const isStreaming = messages.some(m => m.streaming || m.isSpeaking);
    if (!isStreaming) {
      try {
        localStorage.setItem('nam44_messages', JSON.stringify(messages.slice(-50)));
      } catch (e) {}
    }
    if (boxRef.current) {
      if (typeof window !== 'undefined' && window.SyncSpeech) {
        window.SyncSpeech.smoothScrollToBottom(boxRef.current, isStreaming);
      } else if (isStreaming) {
        boxRef.current.scrollTop = boxRef.current.scrollHeight;
      } else {
        boxRef.current.scrollTop = boxRef.current.scrollHeight;
      }
    }
  }, [messages]);
  function addFiles(fileList) {
    const picked = Array.from(fileList || []);
    if (!picked.length) return;
    let totalBytes = attachments.reduce((sum, item) => sum + item.file.size, 0);
    const accepted = [];
    const notices = [];
    for (const file of picked) {
      if (attachments.length + accepted.length >= 6) {
        notices.push('Mỗi lượt tối đa 6 file.');
        break;
      }
      if (file.size > 12 * 1024 * 1024) {
        notices.push(`${file.name}: file vượt quá 12 MB.`);
        continue;
      }
      if (totalBytes + file.size > 14 * 1024 * 1024) {
        notices.push('Tổng dung lượng file tối đa 14 MB/lượt.');
        continue;
      }
      totalBytes += file.size;
      accepted.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file
      });
    }
    if (accepted.length) setAttachments(current => [...current, ...accepted]);
    setFileNotice(notices.join(' '));
  }
  function removeFile(id) {
    setAttachments(current => current.filter(item => item.id !== id));
    setFileNotice('');
  }
  function startDictation() {
    setVoiceStatus('');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceStatus('Trình duyệt chưa hỗ trợ micro trong trang. Bạn có thể bấm biểu tượng micro trên bàn phím điện thoại.');
      return;
    }
    try {
      try {
        recognitionRef.current?.abort?.();
      } catch {}
      const recognition = new SpeechRecognition();
      recognition.lang = 'vi-VN';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      // Capture base text in composer before this dictation session starts
      const initialBaseText = draftRef.current ? draftRef.current.trim() : '';
      let sessionFullText = initialBaseText;
      voiceTranscriptRef.current = initialBaseText;
      recognition.onstart = () => {
        setListening(true);
        setVoiceStatus('🎙️ Đang nghe tiếng Việt... Đọc đến đâu chữ hiện đến đó');
      };
      recognition.onresult = event => {
        let speechText = '',
          interimText = '';
        if (typeof window !== 'undefined' && window.SyncSpeech?.dedupeTranscript) {
          const parsed = window.SyncSpeech.dedupeTranscript(event.results);
          speechText = parsed.speechText;
          interimText = parsed.interimTranscript;
        } else {
          let f = '';
          for (let i = 0; i < event.results.length; i++) {
            const item = event.results[i];
            const t = (item && item[0] ? item[0].transcript : '').trim();
            if (!t) continue;
            if (item.isFinal) {
              if (f && t.toLowerCase().startsWith(f.toLowerCase())) f = t;else if (!f.toLowerCase().endsWith(t.toLowerCase())) f = f ? f + ' ' + t : t;
            } else {
              interimText = t;
            }
          }
          speechText = [f, interimText].filter(Boolean).join(' ').trim();
        }
        const combinedText = [initialBaseText, speechText].filter(Boolean).join(' ').trim();
        sessionFullText = combinedText;
        draftRef.current = combinedText;
        setText(combinedText);
        if (interimText.trim()) {
          setVoiceStatus('🎙️ Đang nhận: "' + interimText.trim() + '"');
        } else {
          setVoiceStatus('🎙️ Đang lắng nghe... Hãy tiếp tục nói');
        }
      };
      recognition.onerror = event => {
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setListening(false);
          setVoiceStatus('⚠️ Chưa có quyền dùng micro. Hãy bật quyền micro cho trang web.');
        } else if (event.error === 'no-speech') {
          // Tạm ngừng nói, giữ mic
        } else {
          setListening(false);
          setVoiceStatus('⚠️ Lỗi micro: ' + event.error);
        }
      };
      recognition.onend = () => {
        setListening(false);
        recognitionRef.current = null;
        if (sessionFullText.trim()) {
          draftRef.current = sessionFullText;
          setText(sessionFullText);
          if (autoSendTimerRef.current) clearTimeout(autoSendTimerRef.current);
          if (autoSendIntervalRef.current) clearInterval(autoSendIntervalRef.current);
          let secondsLeft = 2;
          setVoiceStatus('⚡ Đã đọc xong! Tự động gửi sau ' + secondsLeft + 's... [Chạm đây để hủy]');
          autoSendIntervalRef.current = setInterval(() => {
            secondsLeft -= 1;
            if (secondsLeft > 0) {
              setVoiceStatus('⚡ Đã đọc xong! Tự động gửi sau ' + secondsLeft + 's... [Chạm đây để hủy]');
            } else {
              clearInterval(autoSendIntervalRef.current);
              autoSendIntervalRef.current = null;
            }
          }, 1000);
          autoSendTimerRef.current = setTimeout(() => {
            if (autoSendIntervalRef.current) {
              clearInterval(autoSendIntervalRef.current);
              autoSendIntervalRef.current = null;
            }
            autoSendTimerRef.current = null;
            setVoiceStatus('');
            if (draftRef.current && draftRef.current.trim()) {
              send();
            }
          }, 2000);
        } else {
          setVoiceStatus('');
        }
      };
      recognition.start();
      recognitionRef.current = recognition;
    } catch (error) {
      setListening(false);
      setVoiceStatus('Không mở được micro: ' + (error.message || 'hãy thử lại.'));
    }
  }
  function stopDictation() {
    setVoiceStatus('✅ Đã dừng micro. Bạn có thể sửa nội dung trước khi gửi.');
    try {
      recognitionRef.current?.stop();
    } catch {}
    setListening(false);
    setTimeout(() => setVoiceStatus(''), 4000);
  }
  function stopResponse() {
    try {
      requestAbortRef.current?.abort?.();
    } catch {}
  }
  sendRef.current = send;
  async function send(customText) {
    const content = (customText ?? text).trim();
    if (!content && !attachments.length || busy) return;
    setVoiceStatus('');
    setText('');
    draftRef.current = '';
    const requestText = content || 'Hãy phân tích nội dung các tệp đính kèm và trả lời bằng tiếng Việt.';
    setLastPrompt(content || 'Hãy phân tích lại các tệp đính kèm đã gửi.');
    setBusy(true);
    const fileMeta = attachments.map(item => ({
      name: item.file.name,
      type: item.file.type || 'file',
      size: item.file.size
    }));
    const userText = content || 'Đã gửi tệp đính kèm.';
    const next = [...messages, {
      role: 'user',
      text: userText,
      attachments: fileMeta
    }];
    setMessages([...next, {
      role: 'assistant',
      text: '',
      streaming: true,
      loading: false
    }]);
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    requestAbortRef.current = controller;
    const destinyProfile = getDestinyProfile();
    let accumulatedText = '';
    const pacer = typeof window !== 'undefined' && window.SyncSpeech ? window.SyncSpeech.createStreamPacer({
      onTextUpdate: (revealedText, isDone) => {
        setMessages(prev => prev.map((m, idx) => idx === prev.length - 1 ? {
          ...m,
          text: revealedText,
          streaming: !isDone,
          loading: false
        } : m));
        if (boxRef.current && window.SyncSpeech) {
          window.SyncSpeech.smoothScrollToBottom(boxRef.current);
        }
      }
    }) : null;
    try {
      const [selectedProvider, selectedModel] = modelChoice === 'auto' ? ['auto', ''] : modelChoice.split('::');
      if (attachments.length) {
        const files = await Promise.all(attachments.map(item => prepareChatAttachment(item.file)));
        setAttachments([]);
        setFileNotice('');
        await streamChatResponse({
          url: '/api/chat-ai/stream',
          payload: {
            message: content,
            attachments: files,
            history: next.slice(-20),
            answerStyle,
            geminiModel: selectedProvider === 'gemini' ? selectedModel || 'gemini-3.5-flash-lite' : 'gemini-3.5-flash-lite',
            destinyProfile
          },
          signal: controller?.signal,
          onStart: () => {},
          onDelta: (chunk, fullText) => {
            accumulatedText = fullText;
            if (pacer) {
              pacer.pushDelta(fullText);
            } else {
              setMessages(prev => prev.map((m, idx) => idx === prev.length - 1 ? {
                ...m,
                text: fullText,
                streaming: true,
                loading: false
              } : m));
            }
          },
          onDone: (fullText, meta) => {
            accumulatedText = fullText;
            const finalMeta = meta?.label || meta?.model || 'Đặng Năm AI';
            if (pacer) pacer.complete(fullText);
            setMessages(prev => prev.map((m, idx) => idx === prev.length - 1 ? {
              ...m,
              text: fullText,
              streaming: false,
              loading: false,
              meta: finalMeta
            } : m));
            saveHistory('AI Chat', `${userText}: ${fullText.slice(0, 140)}...`);
          }
        });
      } else {
        await streamChatResponse({
          url: '/api/chat-stream',
          payload: {
            message: requestText,
            history: next.slice(-20),
            birthProfile: destinyProfile,
            provider: selectedProvider,
            model: selectedModel
          },
          signal: controller?.signal,
          onStart: () => {},
          onDelta: (chunk, fullText) => {
            accumulatedText = fullText;
            if (pacer) {
              pacer.pushDelta(fullText);
            } else {
              setMessages(prev => prev.map((m, idx) => idx === prev.length - 1 ? {
                ...m,
                text: fullText,
                streaming: true,
                loading: false
              } : m));
            }
          },
          onDone: (fullText, meta) => {
            accumulatedText = fullText;
            const finalMeta = meta?.label || meta?.model || 'Đặng Năm AI';
            if (pacer) pacer.complete(fullText);
            setMessages(prev => prev.map((m, idx) => idx === prev.length - 1 ? {
              ...m,
              text: fullText,
              streaming: false,
              loading: false,
              meta: finalMeta
            } : m));
            saveHistory('AI Chat', `${userText}: ${fullText.slice(0, 140)}...`);
          }
        });
      }
    } catch (e) {
      if (pacer) pacer.abort();
      if (e.name === 'AbortError') {
        setMessages(prev => prev.map((m, idx) => idx === prev.length - 1 ? {
          ...m,
          text: accumulatedText || 'Đã dừng phản hồi.',
          streaming: false,
          loading: false
        } : m));
      } else {
        if (content) {
          draftRef.current = content;
          setText(current => current || content);
        }
        const freeModeError = /chế độ chỉ dùng model API miễn phí|tránh phát sinh phí/i.test(e.message || '');
        const extra = freeModeError ? '' : '\n\nNếu gửi ảnh/file, server cần có Gemini API key; bạn cũng có thể kiểm tra cấu hình ở AI Keys.';
        const errText = accumulatedText ? `${accumulatedText}\n\n⚠️ ${e.message}${extra}` : `⚠️ ${e.message}${extra}`;
        setMessages(prev => prev.map((m, idx) => idx === prev.length - 1 ? {
          ...m,
          text: errText,
          streaming: false,
          loading: false
        } : m));
      }
    } finally {
      if (requestAbortRef.current === controller) requestAbortRef.current = null;
      setBusy(false);
    }
  }
  function copy(t) {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(t);
      alert('Đã sao chép nội dung vào khay nhớ tạm!');
    }
  }
  function cleanMarkdownForSpeech(raw = '') {
    return String(raw || '').replace(/```[\s\S]*?```/g, ' đoạn mã ').replace(/`([^`]+)`/g, '$1').replace(/#{1,6}\s+/g, '').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1').replace(/__([^_]+)__/g, '$1').replace(/_([^_]+)_/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/!\[([^\]]*)\]\([^)]+\)/g, '').replace(/^>\s+/gm, '').replace(/^[-*+]\s+/gm, '').replace(/\n+/g, ' ').trim();
  }
  function toggleSpeak(textToSpeak, id = 'header') {
    if (speakingId === id) {
      if (typeof window !== 'undefined' && window.SyncSpeech) {
        window.SyncSpeech.stop();
      } else {
        try {
          speechSynthesis.cancel();
        } catch {}
      }
      setSpeakingId(null);
      return;
    }
    if (!textToSpeak) return;
    if (typeof window !== 'undefined' && window.SyncSpeech) {
      window.SyncSpeech.stop();
      setSpeakingId(id);
      let targetIdx = -1;
      if (id === 'header') {
        for (let j = messages.length - 1; j >= 0; j--) {
          if (messages[j].role === 'assistant') {
            targetIdx = j;
            break;
          }
        }
      } else if (id.startsWith('msg-')) {
        targetIdx = parseInt(id.replace('msg-', ''), 10);
      }
      window.SyncSpeech.speakWithSync({
        id,
        text: textToSpeak,
        rate: 1.0,
        onWord: (revealedText, isDone) => {
          if (targetIdx >= 0) {
            setMessages(prev => prev.map((m, idx) => idx === targetIdx ? {
              ...m,
              fullText: m.fullText || m.text,
              speakingText: revealedText,
              isSpeaking: !isDone
            } : m));
          }
          if (boxRef.current && window.SyncSpeech) {
            window.SyncSpeech.smoothScrollToBottom(boxRef.current);
          }
        },
        onDone: finalText => {
          setSpeakingId(null);
          if (targetIdx >= 0) {
            setMessages(prev => prev.map((m, idx) => idx === targetIdx ? {
              ...m,
              text: m.fullText || finalText || m.text,
              speakingText: null,
              isSpeaking: false
            } : m));
          }
        },
        onError: () => {
          setSpeakingId(null);
          if (targetIdx >= 0) {
            setMessages(prev => prev.map((m, idx) => idx === targetIdx ? {
              ...m,
              text: m.fullText || textToSpeak || m.text,
              speakingText: null,
              isSpeaking: false
            } : m));
          }
        }
      });
      return;
    }
    const cleanText = cleanMarkdownForSpeech(textToSpeak);
    if (!cleanText) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(cleanText);
      u.lang = 'vi-VN';
      u.onend = () => setSpeakingId(null);
      u.onerror = () => setSpeakingId(null);
      setSpeakingId(id);
      speechSynthesis.speak(u);
    } catch {
      setSpeakingId(null);
    }
  }
  function handleNewChat() {
    if (messages.length > 1) {
      const firstUser = messages.find(m => m.role === 'user');
      const firstBot = messages.find(m => m.role === 'assistant' && !m.loading);
      const summary = firstUser ? `${firstUser.text.slice(0, 50)}: ${firstBot?.text?.slice(0, 100) || 'Đoạn chat'}` : 'Cuộc trò chuyện';
      saveHistory('AI Chat', summary);
    }
    if (confirm("Tạo đoạn chat mới?")) {
      setMessages(DEFAULT_MESSAGES);
      setAttachments([]);
      setText('');
      setFileNotice('');
      try {
        if (typeof window !== 'undefined' && window.SyncSpeech) window.SyncSpeech.stop();else speechSynthesis.cancel();
      } catch {}
      setSpeakingId(null);
    }
  }
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  const providerGroupLabel = p => `${p.label}${p.freeOnlyBlocked ? ' · tắt để tránh phí' : p.configured ? '' : ' · chưa cấu hình'}`;
  const providerModelOptions = providers.map(p => ({
    ...p,
    modelOptions: Array.from(new Set([...(p.models || []), p.model].filter(Boolean)))
  }));
  const chatHistoryList = readJSON('synam_history', []).filter(h => h.type === 'AI Chat');
  return /*#__PURE__*/React.createElement("section", {
    className: "chat-layout"
  }, historyOpen && /*#__PURE__*/React.createElement("div", {
    className: "history-drawer-overlay",
    onClick: () => setHistoryOpen(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "history-drawer",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "drawer-head"
  }, /*#__PURE__*/React.createElement("h3", null, "🕒 Lịch sử Chat AI"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setHistoryOpen(false)
  }, "✕")), /*#__PURE__*/React.createElement("div", {
    className: "drawer-body"
  }, chatHistoryList.map((h, i) => {
    const previewTitle = h.content.split(':')[0] || h.content;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "drawer-item",
      onClick: () => {
        setText(previewTitle.trim());
        setHistoryOpen(false);
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: '700',
        color: '#ffe27a',
        marginBottom: '4px'
      }
    }, "💬 ", previewTitle.slice(0, 70)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '12px',
        opacity: 0.82,
        lineHeight: '1.35'
      }
    }, h.content.slice(0, 140)), /*#__PURE__*/React.createElement("small", {
      style: {
        opacity: 0.55,
        marginTop: '4px',
        display: 'block'
      }
    }, h.at));
  }), chatHistoryList.length === 0 && /*#__PURE__*/React.createElement("p", {
    style: {
      opacity: 0.5,
      textAlign: 'center',
      padding: '24px 0'
    }
  }, "Chưa có lịch sử chat.")))), /*#__PURE__*/React.createElement("aside", {
    className: "chat-side premium-panel"
  }, /*#__PURE__*/React.createElement("h2", null, "🧠 AI Router"), /*#__PURE__*/React.createElement("p", null, "Auto chọn provider có key. Ưu tiên nhanh, chính xác, không lộ model."), /*#__PURE__*/React.createElement("select", {
    value: modelChoice,
    onChange: e => setModelChoice(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "auto"
  }, "Auto Router"), providerModelOptions.map(p => /*#__PURE__*/React.createElement("optgroup", {
    key: p.id,
    label: providerGroupLabel(p),
    disabled: !p.configured
  }, p.modelOptions.map(model => /*#__PURE__*/React.createElement("option", {
    key: `${p.id}:${model}`,
    value: `${p.id}::${model}`
  }, model))))), /*#__PURE__*/React.createElement("select", {
    value: answerStyle,
    onChange: e => setAnswerStyle(e.target.value),
    "aria-label": "Độ chi tiết câu trả lời"
  }, /*#__PURE__*/React.createElement("option", {
    value: "detailed"
  }, "Chi tiết chuyên nghiệp"), /*#__PURE__*/React.createElement("option", {
    value: "expert"
  }, "Chuyên gia sâu"), /*#__PURE__*/React.createElement("option", {
    value: "concise"
  }, "Ngắn gọn")), /*#__PURE__*/React.createElement("label", {
    className: "switch"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: council,
    onChange: e => setCouncil(e.target.checked)
  }), " Hội Đồng AI"), /*#__PURE__*/React.createElement("button", {
    onClick: handleNewChat
  }, "＋ Chat mới"), /*#__PURE__*/React.createElement("div", {
    className: "mini-list"
  }, providers.map(p => /*#__PURE__*/React.createElement("span", {
    className: p.configured ? 'ok' : '',
    key: p.id
  }, p.configured ? '●' : '○', " ", p.label, p.freeOnlyBlocked ? ' (tắt để tránh phí)' : '')))), /*#__PURE__*/React.createElement("div", {
    className: "chat-main premium-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chat-head"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "chat-icon-btn",
    onClick: () => setHistoryOpen(true)
  }, "🕒 Lịch sử"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "chat-icon-btn",
    onClick: handleNewChat
  }, "➕ Mới"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "chat-icon-btn",
    onClick: () => toggleSpeak(messages.filter(m => m.role === 'assistant').at(-1)?.text || '', 'header')
  }, speakingId === 'header' ? '⏹️ Dừng' : '🔊 Đọc'), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: `chat-icon-btn ${optionsOpen ? 'active' : ''}`,
    onClick: () => setOptionsOpen(!optionsOpen)
  }, "⚙️ Tùy chọn ", optionsOpen ? '▲' : '▼')), optionsOpen && /*#__PURE__*/React.createElement("div", {
    className: "chat-mobile-options-tray"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chat-opt-group"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "chat-mobile-model"
  }, "🤖 Model AI"), /*#__PURE__*/React.createElement("select", {
    id: "chat-mobile-model",
    value: modelChoice,
    onChange: e => setModelChoice(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "auto"
  }, "Auto Router (Tối ưu)"), providerModelOptions.map(p => /*#__PURE__*/React.createElement("optgroup", {
    key: p.id,
    label: providerGroupLabel(p),
    disabled: !p.configured
  }, p.modelOptions.map(model => /*#__PURE__*/React.createElement("option", {
    key: `${p.id}:${model}`,
    value: `${p.id}::${model}`
  }, model)))))), /*#__PURE__*/React.createElement("div", {
    className: "chat-opt-group"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "chat-mobile-style"
  }, "📝 Độ dài"), /*#__PURE__*/React.createElement("select", {
    id: "chat-mobile-style",
    value: answerStyle,
    onChange: e => setAnswerStyle(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "detailed"
  }, "Chi tiết chuyên nghiệp"), /*#__PURE__*/React.createElement("option", {
    value: "expert"
  }, "Chuyên gia sâu"), /*#__PURE__*/React.createElement("option", {
    value: "concise"
  }, "Ngắn gọn"))), /*#__PURE__*/React.createElement("div", {
    className: "chat-opt-group",
    style: {
      alignSelf: 'center'
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "chat-council-toggle",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      cursor: 'pointer',
      fontSize: '12px',
      color: '#ffe27a'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: council,
    onChange: e => setCouncil(e.target.checked)
  }), /*#__PURE__*/React.createElement("span", null, "🏛️ Hội Đồng AI")))), /*#__PURE__*/React.createElement("div", {
    className: "chat-box",
    ref: boxRef
  }, messages.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `bubble ${m.role} ${m.loading ? 'loading' : ''} ${m.isSpeaking ? 'speaking' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "avatar"
  }, m.role === 'user' ? '👤' : '✦'), /*#__PURE__*/React.createElement("div", {
    className: "bubble-body"
  }, m.attachments?.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "chat-message-files"
  }, m.attachments.map((file, index) => /*#__PURE__*/React.createElement("span", {
    key: `${file.name}-${index}`
  }, "📎 ", file.name))), /*#__PURE__*/React.createElement("div", {
    dangerouslySetInnerHTML: {
      __html: markdownLite(m.isSpeaking && m.speakingText ? m.speakingText : m.text)
    }
  }), (m.streaming || m.isSpeaking) && /*#__PURE__*/React.createElement("span", {
    className: "streaming-cursor"
  }), m.meta && !m.streaming && /*#__PURE__*/React.createElement("div", {
    className: "msg-meta-tag",
    style: {
      fontSize: '10px',
      opacity: 0.65,
      marginTop: '4px'
    }
  }, "✦ ", m.meta), m.role === 'assistant' && !m.loading && !m.streaming && /*#__PURE__*/React.createElement("div", {
    className: "msg-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => copy(m.text)
  }, "📋 Sao chép"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => exportResultToPrint('Luận giải Đặng Năm AI', m.text)
  }, "🖨️ In / PDF"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => toggleSpeak(m.text, `msg-${i}`)
  }, speakingId === `msg-${i}` ? '⏹️ Dừng đọc' : '🔊 Đọc'), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => send(lastPrompt)
  }, "🔄 Thử lại")))))), /*#__PURE__*/React.createElement("div", {
    className: "chat-composer-panel"
  }, /*#__PURE__*/React.createElement("input", {
    ref: imageInputRef,
    className: "chat-hidden-input",
    type: "file",
    accept: "image/*",
    multiple: true,
    onChange: e => {
      addFiles(e.target.files);
      e.target.value = '';
      setShowUploads(false);
    }
  }), /*#__PURE__*/React.createElement("input", {
    ref: cameraInputRef,
    className: "chat-hidden-input",
    type: "file",
    accept: "image/*",
    capture: "environment",
    onChange: e => {
      addFiles(e.target.files);
      e.target.value = '';
      setShowUploads(false);
    }
  }), /*#__PURE__*/React.createElement("input", {
    ref: fileInputRef,
    className: "chat-hidden-input",
    type: "file",
    accept: "image/*,video/*,.mp4,.webm,.mov,.pdf,.txt,.md,.csv,.json,.xml,.html,.js,.ts,.py,.log,.css,.doc,.docx,.xls,.xlsx",
    multiple: true,
    onChange: e => {
      addFiles(e.target.files);
      e.target.value = '';
      setShowUploads(false);
    }
  }), attachments.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "chat-attachment-list"
  }, attachments.map(item => /*#__PURE__*/React.createElement("span", {
    className: "chat-file-chip",
    key: item.id
  }, item.file.type.startsWith('image/') ? '🖼️' : '📄', " ", item.file.name, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": `Xóa ${item.file.name}`,
    title: `Xóa ${item.file.name}`,
    onClick: () => removeFile(item.id)
  }, "✕")))), fileNotice && /*#__PURE__*/React.createElement("div", {
    className: "chat-file-notice",
    role: "status"
  }, fileNotice), attachments.length > 0 && modelChoice !== 'auto' && !modelChoice.startsWith('gemini::') && /*#__PURE__*/React.createElement("div", {
    className: "chat-attachment-note"
  }, "Ảnh/file được xử lý tối ưu qua Gemini đa phương thức."), voiceStatus && /*#__PURE__*/React.createElement("div", {
    className: "chat-voice-status",
    role: "status",
    onClick: cancelAutoSend,
    style: {
      cursor: 'pointer'
    },
    title: "Chạm để hủy tự động gửi"
  }, voiceStatus), /*#__PURE__*/React.createElement("div", {
    className: "chat-quick-chips"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quick-chip",
    onClick: () => send('Luận giải tổng quan vận hạn năm 2026 cho bản mệnh')
  }, "🔮 Vận hạn 2026"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quick-chip",
    onClick: () => send('Phân tích cung Tài Bạch & Quan Lộc chi tiết')
  }, "💰 Tài Lộc & Sự Nghiệp"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quick-chip",
    onClick: () => send('Xem ngày giờ tốt và việc nên làm trong tuần này')
  }, "📅 Ngày tốt tuần này"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quick-chip",
    onClick: () => send('Luận giải tình duyên, gia đạo và các mối quan hệ')
  }, "💞 Tình duyên gia đạo"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quick-chip",
    onClick: () => send('Gợi ý màu sắc, vật phẩm phong thủy kích tài lộc')
  }, "☯️ Phong thủy bản mệnh")), /*#__PURE__*/React.createElement("div", {
    className: "composer chat-pill-composer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chat-plus-menu-container"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: `chat-plus-btn ${showUploads ? 'active' : ''}`,
    onClick: () => setShowUploads(!showUploads),
    title: "Đính kèm",
    "aria-label": "Đính kèm tệp hoặc chụp ảnh",
    "aria-expanded": showUploads
  }, "+"), showUploads && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "chat-plus-backdrop",
    onClick: () => setShowUploads(false)
  }), /*#__PURE__*/React.createElement("div", {
    className: "chat-plus-popover",
    role: "menu"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "chat-popover-item",
    onClick: () => {
      imageInputRef.current?.click();
      setShowUploads(false);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "popover-icon"
  }, "🖼️"), /*#__PURE__*/React.createElement("span", null, "Tải ảnh")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "chat-popover-item",
    onClick: () => {
      cameraInputRef.current?.click();
      setShowUploads(false);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "popover-icon"
  }, "📷"), /*#__PURE__*/React.createElement("span", null, "Chụp ảnh")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "chat-popover-item",
    onClick: () => {
      fileInputRef.current?.click();
      setShowUploads(false);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "popover-icon"
  }, "📎"), /*#__PURE__*/React.createElement("span", null, "Tải file / Video")), attachments.length > 0 && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "chat-popover-item is-clear",
    onClick: () => {
      setAttachments([]);
      setFileNotice('');
      setShowUploads(false);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "popover-icon"
  }, "🗑️"), /*#__PURE__*/React.createElement("span", null, "Xóa hết file"))))), /*#__PURE__*/React.createElement("div", {
    className: "chat-input-wrapper"
  }, /*#__PURE__*/React.createElement("textarea", {
    value: text,
    onChange: e => {
      cancelAutoSend();
      draftRef.current = e.target.value;
      setText(e.target.value);
    },
    onKeyDown: e => {
      if (!isTouchDevice && e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    },
    placeholder: "Hỏi AI...",
    "aria-label": "Tin nhắn gửi AI",
    rows: "1"
  })), /*#__PURE__*/React.createElement("div", {
    className: "chat-actions-wrapper"
  }, listening ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "chat-mic-btn is-listening",
    "aria-label": "Dừng ghi âm",
    title: "Dừng ghi âm",
    onClick: stopDictation
  }, "🛑") : /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "chat-mic-btn",
    "aria-label": "Nhập bằng giọng nói",
    title: "Nhập bằng giọng nói",
    disabled: busy,
    onClick: startDictation
  }, "🎤"), text.trim() || attachments.length > 0 || busy ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: `pill-send-btn ${busy ? 'is-stop' : ''}`,
    "aria-label": busy ? 'Dừng phản hồi' : 'Gửi tin nhắn',
    title: busy ? 'Dừng phản hồi' : 'Gửi tin nhắn',
    onClick: busy ? stopResponse : () => send()
  }, busy ? '🛑' : '➤') : null)))));
}
let cachedMobileFirebaseConfig = null;
async function fetchMobileFirebaseConfig() {
  if (cachedMobileFirebaseConfig) return cachedMobileFirebaseConfig;
  try {
    const res = await fetch('/api/auth/firebase-config');
    const data = await res.json();
    if (data.ok && data.enabled && data.config) {
      cachedMobileFirebaseConfig = data.config;
      return cachedMobileFirebaseConfig;
    }
  } catch (e) {
    console.warn('Fetch Mobile Firebase config error:', e);
  }
  return null;
}
async function getMobileFirebase() {
  if (typeof window === 'undefined' || !window.firebase) {
    throw new Error('Firebase SDK chưa được tải trên trình duyệt.');
  }
  if (!window.firebase.apps || !window.firebase.apps.length) {
    const cfg = await fetchMobileFirebaseConfig();
    if (!cfg || !cfg.apiKey) {
      throw new Error('Chưa cấu hình Firebase trên máy chủ.');
    }
    window.firebase.initializeApp(cfg);
  }
  return window.firebase;
}
function Settings({
  providers,
  reload
}) {
  const [keys, setKeys] = useState({});
  const [user, setUser] = useState(() => readJSON('synam_user', null));
  const [authMode, setAuthMode] = useState('login');
  const [account, setAccount] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });
  const [socialLoading, setSocialLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('synam_token');
    if (!token) return;
    fetch('/api/auth/me', {
      headers: authHeaders()
    }).then(r => r.ok ? r.json() : null).then(d => {
      if (d && d.user) {
        localStorage.setItem('synam_user', JSON.stringify(d.user));
        setUser(d.user);
      }
    }).catch(() => {});
  }, []);
  async function handleSocialLogin(provider) {
    if (socialLoading) return;
    setSocialLoading(true);
    try {
      const fb = await getMobileFirebase();
      const auth = fb.auth();
      auth.useDeviceLanguage();
      const authProvider = provider === 'facebook' ? new fb.auth.FacebookAuthProvider() : new fb.auth.GoogleAuthProvider();
      if (provider === 'google') {
        authProvider.addScope('email');
        authProvider.addScope('profile');
      }
      const result = await auth.signInWithPopup(authProvider);
      const fbUser = result.user;
      const idToken = await fbUser.getIdToken();
      const payload = {
        provider,
        uid: fbUser.uid,
        email: fbUser.email,
        name: fbUser.displayName || (provider === 'google' ? 'Google User' : 'Facebook User'),
        avatar: fbUser.photoURL || '',
        idToken: idToken
      };
      const data = await apiJSON('/api/auth/social', payload);
      localStorage.setItem('synam_user', JSON.stringify(data.user));
      localStorage.setItem('synam_token', data.token || '');
      setUser(data.user);
      setAccount({
        name: '',
        email: '',
        password: ''
      });
      alert(`Đăng nhập ${provider === 'google' ? 'Google' : 'Facebook'} thành công! Chào mừng ${data.user.name || data.user.email}`);
      await reload();
      await loadDestinyProfileFromCloud();
    } catch (e) {
      if (pacer) pacer.abort();
      if (e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request') {
        setSocialLoading(false);
        return;
      }
      if (e.code === 'auth/unauthorized-domain') {
        alert('Tên miền ' + window.location.hostname + ' chưa được cấp quyền trong Firebase Console.\n\nVui lòng vào Firebase Console -> Authentication -> Settings -> Authorized domains -> Thêm "' + window.location.hostname + '" vào danh sách để hoàn tất.');
        setSocialLoading(false);
        return;
      }
      if (e.code === 'auth/operation-not-allowed') {
        alert(`Phương thức đăng nhập ${provider === 'google' ? 'Google' : 'Facebook'} chưa được kích hoạt trong Firebase Console.\n\n👉 Bạn hãy sử dụng form Đăng ký / Đăng nhập trực tiếp bằng Email & Mật khẩu ngay bên dưới nhé!`);
        setSocialLoading(false);
        return;
      }
      alert('Lỗi đăng nhập: ' + (e.message || e));
    } finally {
      setSocialLoading(false);
    }
  }
  async function submitAccount(action) {
    if (!account.email || !account.password) {
      return alert('Vui lòng nhập đầy đủ Email và Mật khẩu.');
    }
    if (account.password.length < 6) {
      return alert('Mật khẩu tối thiểu 6 ký tự.');
    }
    if (action === 'register' && !account.name) {
      account.name = 'Thành viên Đặng Nam';
    }
    setLoading(true);
    try {
      const data = await apiJSON(`/api/auth/${action}`, account);
      localStorage.setItem('synam_user', JSON.stringify(data.user));
      localStorage.setItem('synam_token', data.token || '');
      setUser(data.user);
      setAccount({
        name: data.user.name || '',
        email: data.user.email || '',
        password: ''
      });
      alert(action === 'register' ? 'Đăng ký tài khoản thành công!' : `Đăng nhập thành công! Chào mừng ${data.user.name || data.user.email}`);
      await reload();
      await loadDestinyProfileFromCloud();
    } catch (e) {
      if (pacer) pacer.abort();
      alert(e.message || 'Thao tác không thành công.');
    } finally {
      setLoading(false);
    }
  }
  async function logout() {
    try {
      await apiJSON('/api/auth/logout', {});
    } catch {}
    try {
      if (typeof window !== 'undefined' && window.firebase && window.firebase.apps && window.firebase.apps.length && window.firebase.auth) {
        await window.firebase.auth().signOut().catch(() => {});
      }
    } catch (e) {}
    localStorage.removeItem('synam_user');
    localStorage.removeItem('synam_token');
    setUser(null);
    setAccount({
      name: '',
      email: '',
      password: ''
    });
    await reload();
  }
  async function save() {
    try {
      await apiJSON('/api/ai/user-keys', {
        keys
      });
      await reload();
      alert('Đã lưu AI keys.');
    } catch (e) {
      alert(e.message);
    }
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "premium-panel settings"
  }, /*#__PURE__*/React.createElement("h2", null, "👤 Quản lý Tài khoản & AI Keys"), /*#__PURE__*/React.createElement("div", {
    className: "account-card",
    style: {
      marginBottom: '20px'
    }
  }, user ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px',
      background: 'rgba(255,255,255,0.06)',
      borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.12)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '12px'
    }
  }, user.avatar ? /*#__PURE__*/React.createElement("img", {
    src: user.avatar,
    alt: "Avatar",
    style: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      border: '2px solid #ffd700',
      objectFit: 'cover'
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px'
    }
  }, "👤"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 'bold',
      fontSize: '15px',
      color: '#ffe6ad'
    }
  }, user.name || 'Người dùng'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      opacity: 0.8,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, user.email), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#4ade80',
      marginTop: '2px'
    }
  }, "Gói: ", user.plan || 'Free', " · ", (user.providers || []).map(p => p === 'google' ? 'Google' : p === 'facebook' ? 'Facebook' : p).join(', ') || 'Email')), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: logout,
    style: {
      padding: '6px 12px',
      fontSize: '12px',
      background: 'rgba(239,68,68,0.2)',
      border: '1px solid rgba(239,68,68,0.5)',
      color: '#ff8888',
      borderRadius: '10px'
    }
  }, "Đăng xuất"))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      background: 'rgba(255,255,255,0.07)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: '12px',
      padding: '4px',
      gap: '6px',
      marginBottom: '14px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setAuthMode('login'),
    style: {
      flex: 1,
      padding: '8px 12px',
      borderRadius: '8px',
      border: 'none',
      background: authMode === 'login' ? 'linear-gradient(135deg, #00f0ff, #7000ff)' : 'transparent',
      color: authMode === 'login' ? '#fff' : '#a0aec0',
      fontWeight: 'bold',
      fontSize: '13px'
    }
  }, "🔐 Đăng nhập"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setAuthMode('register'),
    style: {
      flex: 1,
      padding: '8px 12px',
      borderRadius: '8px',
      border: 'none',
      background: authMode === 'register' ? 'linear-gradient(135deg, #00f0ff, #7000ff)' : 'transparent',
      color: authMode === 'register' ? '#fff' : '#a0aec0',
      fontWeight: 'bold',
      fontSize: '13px'
    }
  }, "📝 Đăng ký")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px',
      marginBottom: '14px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: socialLoading,
    onClick: () => handleSocialLogin('google'),
    style: {
      background: 'linear-gradient(135deg,rgba(255,74,74,.92),rgba(255,180,42,.78))',
      border: '1px solid rgba(255,255,255,.18)',
      borderRadius: '16px',
      color: '#fff',
      fontWeight: 900,
      textShadow: '0 1px 3px rgba(0,0,0,0.3)',
      opacity: socialLoading ? 0.6 : 1,
      padding: '10px'
    }
  }, "🔴 ", socialLoading ? 'Đang mở...' : 'Google'), /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: socialLoading,
    onClick: () => handleSocialLogin('facebook'),
    style: {
      background: 'linear-gradient(135deg,rgba(24,119,242,.92),rgba(68,72,255,.82))',
      border: '1px solid rgba(255,255,255,.18)',
      borderRadius: '16px',
      color: '#fff',
      fontWeight: 900,
      textShadow: '0 1px 3px rgba(0,0,0,0.3)',
      opacity: socialLoading ? 0.6 : 1,
      padding: '10px'
    }
  }, "🔵 ", socialLoading ? 'Đang mở...' : 'Facebook')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      margin: '14px 0',
      fontSize: '11px',
      textTransform: 'uppercase',
      opacity: 0.6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: '1px',
      background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)'
    }
  }), /*#__PURE__*/React.createElement("span", null, "hoặc dùng email"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: '1px',
      background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)'
    }
  })), authMode === 'register' && /*#__PURE__*/React.createElement("input", {
    value: account.name,
    onChange: e => setAccount(a => ({
      ...a,
      name: e.target.value
    })),
    placeholder: "Họ và tên của bạn"
  }), /*#__PURE__*/React.createElement("input", {
    value: account.email,
    onChange: e => setAccount(a => ({
      ...a,
      email: e.target.value
    })),
    type: "email",
    placeholder: "Email (vd: email@example.com)"
  }), /*#__PURE__*/React.createElement("input", {
    value: account.password,
    onChange: e => setAccount(a => ({
      ...a,
      password: e.target.value
    })),
    type: "password",
    placeholder: "Mật khẩu (tối thiểu 6 ký tự)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '10px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "primary",
    type: "button",
    disabled: loading,
    onClick: () => submitAccount(authMode),
    style: {
      width: '100%',
      padding: '12px'
    }
  }, loading ? 'Đang xử lý...' : authMode === 'register' ? '📝 Đăng ký tài khoản' : '🔐 Đăng nhập')), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginTop: '12px',
      fontSize: '12px',
      opacity: 0.85
    }
  }, authMode === 'login' ? /*#__PURE__*/React.createElement("span", null, "Chưa có tài khoản? ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: '#00f0ff',
      cursor: 'pointer',
      textDecoration: 'underline'
    },
    onClick: () => setAuthMode('register')
  }, "Đăng ký ngay")) : /*#__PURE__*/React.createElement("span", null, "Đã có tài khoản? ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: '#00f0ff',
      cursor: 'pointer',
      textDecoration: 'underline'
    },
    onClick: () => setAuthMode('login')
  }, "Đăng nhập ngay"))))), /*#__PURE__*/React.createElement("h2", null, "⚙️ Multi-AI API Keys"), /*#__PURE__*/React.createElement("p", null, "Nhập key cá nhân hoặc dùng key mặc định từ server."), /*#__PURE__*/React.createElement("div", {
    className: "key-grid"
  }, providers.map(p => /*#__PURE__*/React.createElement("label", {
    key: p.id
  }, /*#__PURE__*/React.createElement("span", null, p.label, " ", p.configured ? '✅' : '○'), /*#__PURE__*/React.createElement("input", {
    type: "password",
    placeholder: p.maskedKey || p.keyEnv || 'API key',
    onChange: e => setKeys(k => ({
      ...k,
      [p.id]: e.target.value
    }))
  }), /*#__PURE__*/React.createElement("small", null, p.model)))), /*#__PURE__*/React.createElement("button", {
    className: "primary",
    onClick: save
  }, "💾 Lưu keys"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '24px',
      padding: '16px',
      background: 'rgba(255,255,255,0.04)',
      borderRadius: '16px',
      border: '1px solid rgba(255,215,0,0.25)',
      textAlign: 'center',
      fontSize: '12px',
      lineHeight: '1.6'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 'bold',
      color: '#ffd700',
      fontSize: '13px',
      marginBottom: '6px'
    }
  }, "© Copyright SyBinh · Bản Quyền Chủ Sở Hữu"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#cbd5e1',
      marginBottom: '4px'
    }
  }, "✉ Email: ", /*#__PURE__*/React.createElement("a", {
    href: "mailto:admin@dangnam.online",
    style: {
      color: '#38bdf8',
      textDecoration: 'none'
    }
  }, "admin@dangnam.online")), /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#cbd5e1',
      marginBottom: '8px'
    }
  }, "☎ SĐT: ", /*#__PURE__*/React.createElement("a", {
    href: "tel:0898333365",
    style: {
      color: '#38bdf8',
      textDecoration: 'none'
    }
  }, "0898.333.365")), /*#__PURE__*/React.createElement("div", {
    style: {
      opacity: 0.6,
      fontSize: '11px'
    }
  }, "Đặng Năm Mystic v2.0 · Mọi quyền được bảo lưu")));
}
function VisionTool({
  mode,
  title,
  icon
}) {
  const isFace = mode === 'face';
  const defaultHint = isFace ? '* Mẹo: Chụp chính diện khuôn mặt, rõ 5 ngũ quan (trán, mắt, mũi, miệng, cằm), đủ sáng, không đeo kính râm và không che trán để xem tướng chuẩn xác nhất.' : '* Mẹo: Chụp rõ toàn bộ lòng bàn tay, đủ sáng, không bị bóng râm che khuất.';
  const [result, setResult] = useState('Vui lòng chụp ảnh hoặc tải ảnh lên để AI xem trực tiếp.');
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageDataUrl, setImageDataUrl] = useState('');
  const [note, setNote] = useState('');
  const [focusPart, setFocusPart] = useState(isFace ? 'Tổng quan ngũ quan & thần thái' : 'Tổng quan đường tay');
  const [isLiveCamera, setIsLiveCamera] = useState(false);
  const [cameraFacing, setCameraFacing] = useState(isFace ? 'user' : 'environment');
  const [autoAnalyze, setAutoAnalyze] = useState(true);
  const [loading, setLoading] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const nativeCameraInputRef = useRef(null);
  const stopStream = () => {
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach(track => track.stop());
      } catch (e) {}
      streamRef.current = null;
    }
  };
  useEffect(() => {
    return () => stopStream();
  }, []);
  async function startCamera(facing = cameraFacing) {
    stopStream();
    setCameraError('');
    setIsLiveCamera(true);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Trình duyệt chưa hỗ trợ Live Camera trực tiếp. Bạn vui lòng bấm nút "📷 Chụp bằng máy" nhé.');
      }
      const constraints = {
        video: {
          facingMode: {
            ideal: facing
          },
          width: {
            ideal: 1280
          },
          height: {
            ideal: 720
          }
        },
        audio: false
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.warn('Live camera error:', err);
      setCameraError(err.message || 'Không thể mở Camera. Hãy bấm nút "📷 Chụp bằng máy" hoặc cho phép quyền truy cập Camera.');
    }
  }
  function switchCamera() {
    const nextFacing = cameraFacing === 'user' ? 'environment' : 'user';
    setCameraFacing(nextFacing);
    startCamera(nextFacing);
  }
  function closeCamera() {
    stopStream();
    setIsLiveCamera(false);
    setCameraError('');
  }
  function snapPhoto() {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (cameraFacing === 'user') {
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    closeCamera();
    setImageDataUrl(dataUrl);
    setPreviewUrl(dataUrl);
    if (autoAnalyze) {
      runAnalysis(dataUrl);
    } else {
      setResult('Đã chụp ảnh xong. Bấm nút "Xem tướng trực tiếp ngay" để nhận kết quả phân tích.');
    }
  }
  async function handleFileChange(e) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    try {
      setLoading(true);
      setResult('Đang tối ưu hóa ảnh...');
      const optimized = await optimizeImage(selectedFile, 1600, 0.85);
      setImageDataUrl(optimized);
      setPreviewUrl(optimized);
      if (autoAnalyze) {
        runAnalysis(optimized);
      } else {
        setResult('Ảnh đã sẵn sàng. Bấm nút "Xem tướng trực tiếp ngay" để AI phân tích.');
      }
    } catch (err) {
      setResult('⚠️ ' + (err.message || 'Lỗi khi tải ảnh.'));
    } finally {
      setLoading(false);
    }
  }
  function handleNativeCamera(e) {
    handleFileChange(e);
  }
  async function runAnalysis(explicitImage = '') {
    const targetImage = explicitImage || imageDataUrl;
    if (!targetImage && !note.trim()) {
      return setResult('Bạn cần chụp ảnh hoặc tải ảnh lên trước nhé.');
    }
    setLoading(true);
    setResult(isFace ? '🔍 AI đang quét nhận diện ngũ quan, thần thái và đối chiếu nhân tướng...' : '🔍 AI đang quét phân tích đường chỉ tay...');
    try {
      const payload = isFace ? {
        mode: 'face',
        image: targetImage,
        faceImage: targetImage,
        facePart: focusPart,
        faceNote: note,
        geminiModel: 'gemini-3.5-flash-lite',
        clientTime: new Date().toLocaleString('vi-VN')
      } : {
        mode: 'palm',
        image: targetImage,
        palmImage: targetImage,
        palmLine: focusPart,
        palmNote: note,
        geminiModel: 'gemini-3.5-flash-lite',
        clientTime: new Date().toLocaleString('vi-VN')
      };
      const d = await apiJSON('/api/vision-ai', payload);
      const text = d.text || d.reply || 'Không có kết quả trả về từ AI.';
      setResult(text);
      saveHistory(title, text);
    } catch (e) {
      if (pacer) pacer.abort();
      console.error('Vision analysis error:', e);
      const fb = window.MysticEngine ? mode === 'palm' ? window.MysticEngine.Palmistry.analyze(note, '') : window.MysticEngine.Face.analyze(note, '') : mode === 'palm' ? '### Lỗi tải Mystic Engine - Chỉ Tay' : '### Lỗi tải Mystic Engine - Tướng Mặt';
      const fallbackMsg = fb + '\n\n*(Lưu ý: Đang hiển thị kết quả phân tích offline do máy chủ: ' + (e.message || 'Mất kết nối') + ')*';
      setResult(fallbackMsg);
      saveHistory(title + ' local', fallbackMsg);
    } finally {
      setLoading(false);
    }
  }
  const faceOptions = ['Tổng quan ngũ quan & thần thái', 'Trán (Cung Quan Lộc, tiền vận & trí tuệ)', 'Mắt (Thần khí, tâm tư & năng lượng)', 'Mũi (Cung Tài Bạch, tài vận & ý chí)', 'Miệng & Cằm (Cung Điền Trạch, hậu vận & phúc đức)'];
  const palmOptions = ['Tổng quan các đường tay', 'Sinh đạo (Sức khỏe, sức sống & biến cố)', 'Trí đạo (Tư duy, quyết định & tài năng)', 'Tâm đạo (Tình cảm, hôn nhân & cảm xúc)', 'Sự nghiệp (Thời vận & bước ngoặt thành công)'];
  const options = isFace ? faceOptions : palmOptions;
  return /*#__PURE__*/React.createElement("section", {
    className: "tool-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "premium-panel vision-tool-container"
  }, /*#__PURE__*/React.createElement("h2", null, icon, " ", title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.85em',
      color: '#ffd700',
      margin: '0 0 10px',
      fontStyle: 'italic'
    }
  }, defaultHint), /*#__PURE__*/React.createElement("input", {
    ref: fileInputRef,
    type: "file",
    accept: "image/*",
    style: {
      display: 'none'
    },
    onChange: handleFileChange
  }), /*#__PURE__*/React.createElement("input", {
    ref: nativeCameraInputRef,
    type: "file",
    accept: "image/*",
    capture: isFace ? 'user' : 'environment',
    style: {
      display: 'none'
    },
    onChange: handleNativeCamera
  }), !isLiveCamera && /*#__PURE__*/React.createElement("div", {
    className: "vision-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "vision-action-btn primary-camera",
    onClick: () => startCamera(cameraFacing)
  }, "📸 Chụp trực tiếp"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "vision-action-btn",
    onClick: () => nativeCameraInputRef.current && nativeCameraInputRef.current.click()
  }, "📷 Chụp bằng máy"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "vision-action-btn",
    onClick: () => fileInputRef.current && fileInputRef.current.click()
  }, "📁 Tải ảnh có sẵn")), isLiveCamera && /*#__PURE__*/React.createElement("div", {
    className: "vision-camera-box"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("video", {
    ref: videoRef,
    playsInline: true,
    autoPlay: true,
    muted: true,
    className: `vision-video ${cameraFacing === 'user' ? 'mirror' : ''}`
  }), isFace && /*#__PURE__*/React.createElement("div", {
    className: "vision-face-guide"
  }, /*#__PURE__*/React.createElement("div", {
    className: "vision-face-oval"
  }), /*#__PURE__*/React.createElement("span", {
    className: "vision-guide-text"
  }, "Căn khuôn mặt vào giữa khung"))), cameraError && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px',
      color: '#ff7b7b',
      fontSize: '13px',
      background: 'rgba(255,0,0,0.15)',
      textAlign: 'center'
    }
  }, cameraError), /*#__PURE__*/React.createElement("div", {
    className: "vision-cam-ctrls"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "vision-action-btn",
    style: {
      padding: '8px 12px',
      fontSize: '12px'
    },
    onClick: switchCamera,
    title: "Đổi camera trước/sau"
  }, "🔄 Đổi cam"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "vision-snap-btn",
    onClick: snapPhoto,
    title: "Bấm để chụp ảnh"
  }, "📸"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "vision-action-btn",
    style: {
      padding: '8px 12px',
      fontSize: '12px',
      background: 'rgba(255,50,50,0.25)',
      borderColor: 'rgba(255,80,80,0.4)'
    },
    onClick: closeCamera,
    title: "Hủy chụp"
  }, "❌ Đóng"))), previewUrl && !isLiveCamera && /*#__PURE__*/React.createElement("div", {
    className: "vision-preview-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "vision-preview-img-wrap"
  }, loading && /*#__PURE__*/React.createElement("div", {
    className: "vision-scan-bar"
  }), /*#__PURE__*/React.createElement("img", {
    src: previewUrl,
    alt: "Ảnh xem tướng",
    className: "vision-preview-img"
  })), /*#__PURE__*/React.createElement("div", {
    className: "vision-preview-status"
  }, /*#__PURE__*/React.createElement("span", null, loading ? '🔍 Đang quét nhận diện...' : '✅ Ảnh đã sẵn sàng'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '6px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "vision-retake-btn",
    onClick: () => startCamera(cameraFacing)
  }, "📸 Chụp lại"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "vision-retake-btn",
    onClick: () => fileInputRef.current && fileInputRef.current.click()
  }, "📁 Đổi ảnh")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      marginTop: '4px'
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: '13px',
      color: '#c3d9ff'
    }
  }, "Bộ phận muốn xem kỹ:", /*#__PURE__*/React.createElement("select", {
    value: focusPart,
    onChange: e => setFocusPart(e.target.value),
    style: {
      width: '100%',
      marginTop: '4px',
      padding: '10px',
      background: 'rgba(255,255,255,0.08)',
      borderRadius: '12px',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.15)'
    }
  }, options.map((opt, i) => /*#__PURE__*/React.createElement("option", {
    key: i,
    value: opt,
    style: {
      background: '#071534',
      color: '#fff'
    }
  }, opt)))), /*#__PURE__*/React.createElement("textarea", {
    value: note,
    onChange: e => setNote(e.target.value),
    placeholder: isFace ? "Ghi chú thêm nếu muốn (Ví dụ: Mình muốn xem kỹ cung Tài Bạch, sự nghiệp năm nay...)" : "Ghi chú thêm nếu ảnh chưa rõ...",
    style: {
      width: '100%',
      minHeight: '60px',
      padding: '10px',
      background: 'rgba(255,255,255,0.08)',
      borderRadius: '12px',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.15)',
      resize: 'none'
    }
  }), /*#__PURE__*/React.createElement("label", {
    className: "vision-auto-toggle"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: autoAnalyze,
    onChange: e => setAutoAnalyze(e.target.checked)
  }), /*#__PURE__*/React.createElement("span", null, "⚡ Tự động phân tích xem ngay sau khi chụp ảnh"))), /*#__PURE__*/React.createElement("button", {
    className: "primary",
    style: {
      width: '100%',
      marginTop: '6px',
      height: '46px',
      fontSize: '15px',
      fontWeight: 'bold'
    },
    disabled: loading || !imageDataUrl && !note.trim(),
    onClick: () => runAnalysis()
  }, loading ? '⌛ AI đang phân tích trực tiếp...' : '✨ Xem tướng trực tiếp ngay')), /*#__PURE__*/React.createElement(Result, {
    text: result
  }));
}
function LoveTool() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [out, setOut] = useState('Nhập thông tin hai người để luận giải.');
  async function run() {
    setOut('Đang tính bằng code và AI luận giải...');
    try {
      const d = await apiJSON('/api/love-ai', {
        geminiModel: 'gemini-3.5-flash-lite',
        persons: [{
          name: 'Người 1',
          birthDate: a
        }, {
          name: 'Người 2',
          birthDate: b
        }]
      });
      setOut(d.text || d.reply || 'Không có kết quả');
      saveHistory('Tình duyên', d.text || d.reply || 'Không có kết quả');
    } catch (e) {
      setOut('⚠️ ' + e.message);
    }
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "tool-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "premium-panel"
  }, /*#__PURE__*/React.createElement("h2", null, "💞 Tình duyên"), /*#__PURE__*/React.createElement("input", {
    value: a,
    onChange: e => setA(e.target.value),
    placeholder: "Ngày sinh người 1: 01/01/2000"
  }), /*#__PURE__*/React.createElement("input", {
    value: b,
    onChange: e => setB(e.target.value),
    placeholder: "Ngày sinh người 2: 02/02/2004"
  }), /*#__PURE__*/React.createElement("button", {
    className: "primary",
    onClick: run
  }, "Luận giải")), /*#__PURE__*/React.createElement(Result, {
    text: out
  }));
}
function DestinyModal({
  isOpen,
  onClose,
  profile,
  onSave
}) {
  if (!isOpen) return null;
  const [form, setForm] = useState(() => ({
    fullName: profile.fullName || profile.name || '',
    gender: profile.gender || 'Nam',
    calendarType: profile.calendarType || 'solar',
    birthDate: profile.birthDate || '',
    birthHour: profile.birthHour || 'Ngọ (11h00 - 12h59)',
    birthPlace: profile.birthPlace || ''
  }));
  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.fullName.trim() || !form.birthDate) {
      alert('Vui lòng điền họ tên và ngày sinh');
      return;
    }
    await onSave(form);
    onClose();
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "destiny-modal-backdrop",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "destiny-modal-box",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "destiny-modal-head"
  }, /*#__PURE__*/React.createElement("h2", null, "📜 Hồ Sơ Bản Mệnh"), /*#__PURE__*/React.createElement("span", {
    className: "destiny-modal-tag"
  }, "Kép: Máy + Cloud")), /*#__PURE__*/React.createElement("p", {
    className: "destiny-modal-sub"
  }, "Lưu hồ sơ để Đặng Năm AI tự động cá nhân hóa và luận giải chuẩn xác theo thuật Tử Vi Đẩu Số."), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement("div", {
    className: "destiny-form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Họ và tên đương số ", /*#__PURE__*/React.createElement("span", {
    className: "req"
  }, "*")), /*#__PURE__*/React.createElement("input", {
    required: true,
    placeholder: "Ví dụ: Đặng Văn Năm",
    value: form.fullName,
    onChange: e => setForm({
      ...form,
      fullName: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "destiny-form-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "destiny-form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Giới tính ", /*#__PURE__*/React.createElement("span", {
    className: "req"
  }, "*")), /*#__PURE__*/React.createElement("select", {
    value: form.gender,
    onChange: e => setForm({
      ...form,
      gender: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: "Nam"
  }, "Nam"), /*#__PURE__*/React.createElement("option", {
    value: "Nữ"
  }, "Nữ"))), /*#__PURE__*/React.createElement("div", {
    className: "destiny-form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Loại lịch ", /*#__PURE__*/React.createElement("span", {
    className: "req"
  }, "*")), /*#__PURE__*/React.createElement("select", {
    value: form.calendarType,
    onChange: e => setForm({
      ...form,
      calendarType: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: "solar"
  }, "Dương lịch"), /*#__PURE__*/React.createElement("option", {
    value: "lunar"
  }, "Âm lịch")))), /*#__PURE__*/React.createElement("div", {
    className: "destiny-form-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "destiny-form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Ngày sinh ", /*#__PURE__*/React.createElement("span", {
    className: "req"
  }, "*")), /*#__PURE__*/React.createElement("input", {
    type: "date",
    required: true,
    value: form.birthDate,
    onChange: e => setForm({
      ...form,
      birthDate: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "destiny-form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Giờ sinh (12 Canh giờ) ", /*#__PURE__*/React.createElement("span", {
    className: "req"
  }, "*")), /*#__PURE__*/React.createElement("select", {
    value: form.birthHour,
    onChange: e => setForm({
      ...form,
      birthHour: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: "Tý (23h00 - 00h59)"
  }, "Giờ Tý (23h00 - 00h59)"), /*#__PURE__*/React.createElement("option", {
    value: "Sửu (01h00 - 02h59)"
  }, "Giờ Sửu (01h00 - 02h59)"), /*#__PURE__*/React.createElement("option", {
    value: "Dần (03h00 - 04h59)"
  }, "Giờ Dần (03h00 - 04h59)"), /*#__PURE__*/React.createElement("option", {
    value: "Mão (05h00 - 06h59)"
  }, "Giờ Mão (05h00 - 06h59)"), /*#__PURE__*/React.createElement("option", {
    value: "Thìn (07h00 - 08h59)"
  }, "Giờ Thìn (07h00 - 08h59)"), /*#__PURE__*/React.createElement("option", {
    value: "Tỵ (09h00 - 10h59)"
  }, "Giờ Tỵ (09h00 - 10h59)"), /*#__PURE__*/React.createElement("option", {
    value: "Ngọ (11h00 - 12h59)"
  }, "Giờ Ngọ (11h00 - 12h59)"), /*#__PURE__*/React.createElement("option", {
    value: "Mùi (13h00 - 14h59)"
  }, "Giờ Mùi (13h00 - 14h59)"), /*#__PURE__*/React.createElement("option", {
    value: "Thân (15h00 - 16h59)"
  }, "Giờ Thân (15h00 - 16h59)"), /*#__PURE__*/React.createElement("option", {
    value: "Dậu (17h00 - 18h59)"
  }, "Giờ Dậu (17h00 - 18h59)"), /*#__PURE__*/React.createElement("option", {
    value: "Tuất (19h00 - 20h59)"
  }, "Giờ Tuất (19h00 - 20h59)"), /*#__PURE__*/React.createElement("option", {
    value: "Hợi (21h00 - 22h59)"
  }, "Giờ Hợi (21h00 - 22h59)")))), /*#__PURE__*/React.createElement("div", {
    className: "destiny-form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Nơi sinh / Quê quán (Tùy chọn)"), /*#__PURE__*/React.createElement("input", {
    placeholder: "Ví dụ: Hà Nội, TP. HCM...",
    value: form.birthPlace,
    onChange: e => setForm({
      ...form,
      birthPlace: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "destiny-modal-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "primary",
    style: {
      flex: 2
    }
  }, "💾 Lưu Hồ Sơ"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ghost",
    style: {
      flex: 1
    },
    onClick: onClose
  }, "Đóng")))));
}
function TuviTool() {
  const [profile, setProfile] = useState(() => {
    const saved = getBirthProfile() || {};
    return {
      fullName: saved.fullName || saved.name || '',
      gender: saved.gender || 'Nam',
      birthDate: saved.birthDate || '',
      birthHour: saved.birthHour || 'Ngọ (11h00 - 12h59)',
      calendarType: saved.calendarType || 'solar',
      birthPlace: saved.birthPlace || ''
    };
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCung, setActiveCung] = useState('Mệnh');
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState('Bấm vào một Cung trên Bàn Lá Số hoặc chọn câu hỏi gợi ý nhanh để Đặng Năm AI bắt đầu luận giải theo thời gian thực.');
  const [streaming, setStreaming] = useState(false);
  useEffect(() => {
    loadDestinyProfileFromCloud().then(cloudProfile => {
      if (cloudProfile && (cloudProfile.fullName || cloudProfile.name)) {
        setProfile(prev => ({
          fullName: prev.fullName || cloudProfile.fullName || cloudProfile.name || '',
          gender: prev.gender || cloudProfile.gender || 'Nam',
          birthDate: prev.birthDate || cloudProfile.birthDate || '',
          birthHour: prev.birthHour || cloudProfile.birthHour || 'Ngọ (11h00 - 12h59)',
          calendarType: prev.calendarType || cloudProfile.calendarType || 'solar',
          birthPlace: prev.birthPlace || cloudProfile.birthPlace || ''
        }));
      }
    });
  }, []);
  async function handleSaveProfile(newProfile) {
    setProfile(newProfile);
    await saveBirthProfile(newProfile);
  }
  async function analyzeTuviStream(prompt, cungName) {
    if (busy) return;
    if (cungName) setActiveCung(cungName);
    setBusy(true);
    setStreaming(true);
    setOut('✦ Đang kết nối trí tuệ nhân tạo Đặng Năm AI luận giải theo thời gian thực...');
    const resultElem = document.getElementById('mobileTuviResult');
    if (resultElem) {
      resultElem.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    let accumulated = '';
    try {
      await streamChatResponse({
        url: '/api/chat-stream',
        payload: {
          message: prompt,
          history: [],
          birthProfile: profile
        },
        onDelta: (chunk, full) => {
          accumulated = full;
          setOut(full);
        },
        onDone: finalFull => {
          const text = finalFull || accumulated || 'Đã hoàn thành luận giải.';
          setOut(text);
          setStreaming(false);
          saveHistory(`Tử Vi: Cung ${cungName || 'Tổng quan'}`, text);
        },
        onError: err => {
          setOut(`⚠️ Chưa thể kết nối AI: ${err.message || err}. Vui lòng thử lại sau ít giây.`);
          setStreaming(false);
        }
      });
    } catch (e) {
      setOut(`⚠️ Lỗi: ${e.message || e}`);
      setStreaming(false);
    } finally {
      setBusy(false);
      setStreaming(false);
    }
  }
  const hasProfile = Boolean(profile.fullName && profile.birthDate);
  const CUNGS = [{
    id: 'ty',
    name: 'Tật Ách',
    chi: 'TỴ',
    tag: 'Hỏa',
    desc: 'Sức khỏe · Bệnh tật · Phòng ách',
    row: 1,
    col: 1
  }, {
    id: 'ngo',
    name: 'Thiên Di',
    chi: 'NGỌ',
    tag: 'Hỏa',
    desc: 'Xuất ngoại · Đi xa · Quý nhân',
    row: 1,
    col: 2
  }, {
    id: 'mui',
    name: 'Nô Bộc',
    chi: 'MÙI',
    tag: 'Thổ',
    desc: 'Bạn bè · Đồng nghiệp · Tri kỷ',
    row: 1,
    col: 3
  }, {
    id: 'than',
    name: 'Quan Lộc',
    chi: 'THÂN',
    tag: 'Kim',
    desc: 'Công danh · Sự nghiệp · Thăng tiến',
    row: 1,
    col: 4
  }, {
    id: 'thin',
    name: 'Tài Bạch',
    chi: 'THÌN',
    tag: 'Thổ',
    desc: 'Tiền tài · Làm ăn · Của cải',
    row: 2,
    col: 1
  }, {
    id: 'dau',
    name: 'Điền Trạch',
    chi: 'DẬU',
    tag: 'Kim',
    desc: 'Nhà cửa · Đất đai · Cơ nghiệp',
    row: 2,
    col: 4
  }, {
    id: 'mao',
    name: 'Tử Tức',
    chi: 'MÃO',
    tag: 'Mộc',
    desc: 'Con cái · Hậu duệ · Duyên nợ',
    row: 3,
    col: 1
  }, {
    id: 'tuat',
    name: 'Phúc Đức',
    chi: 'TUẤT',
    tag: 'Thổ',
    desc: 'Âm phúc · Dòng họ · May mắn',
    row: 3,
    col: 4
  }, {
    id: 'dan',
    name: 'Phu Thê',
    chi: 'DẦN',
    tag: 'Mộc',
    desc: 'Hôn nhân · Vợ chồng · Duyên nợ',
    row: 4,
    col: 1
  }, {
    id: 'suu',
    name: 'Huynh Đệ',
    chi: 'SỬU',
    tag: 'Thổ',
    desc: 'Anh em · Tương trợ · Tri kỷ',
    row: 4,
    col: 2
  }, {
    id: 'ty2',
    name: 'Mệnh',
    chi: 'TÝ',
    tag: 'Thủy',
    desc: 'Bản mệnh · Tính cách · Cốt cách',
    row: 4,
    col: 3
  }, {
    id: 'hoi',
    name: 'Phụ Mẫu',
    chi: 'HỢI',
    tag: 'Thủy',
    desc: 'Cha mẹ · Ân nghĩa · Nâng đỡ',
    row: 4,
    col: 4
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "tuvi-page-shell"
  }, /*#__PURE__*/React.createElement(DestinyModal, {
    isOpen: isModalOpen,
    onClose: () => setIsModalOpen(false),
    profile: profile,
    onSave: handleSaveProfile
  }), /*#__PURE__*/React.createElement("div", {
    className: "tuvi-header-banner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tuvi-header-title-wrap"
  }, /*#__PURE__*/React.createElement("h2", null, "📜 Bàn Lá Số Tử Vi 12 Cung Tương Tác"), /*#__PURE__*/React.createElement("p", null, "Chạm vào cung bất kỳ để Đặng Năm AI luận giải chuyên sâu theo thời gian thực.")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "destiny-quick-edit-btn",
    onClick: () => setIsModalOpen(true)
  }, /*#__PURE__*/React.createElement("span", null, "👤 Hồ Sơ Bản Mệnh"), /*#__PURE__*/React.createElement("span", {
    className: `destiny-badge-status ${hasProfile ? 'saved' : 'not-saved'}`
  }, hasProfile ? 'Đã lưu' : 'Chưa lưu'))), /*#__PURE__*/React.createElement("div", {
    className: "tuvi-board-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tuvi-grid-4x4"
  }, CUNGS.slice(0, 4).map(c => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    className: `cung-cell cell-${c.id} ${activeCung === c.name ? 'active-cung' : ''}`,
    onClick: () => analyzeTuviStream(`Hãy đóng vai bậc thầy Tử Vi Đẩu Số Đặng Năm AI, luận giải chi tiết, thấu đáo và chuyên sâu về Cung ${c.name} (địa chi ${c.chi} - ${c.desc}) cho bản mệnh đương số.`, c.name)
  }, /*#__PURE__*/React.createElement("div", {
    className: "cung-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cung-chi"
  }, c.chi), /*#__PURE__*/React.createElement("span", {
    className: "cung-tag"
  }, c.tag)), /*#__PURE__*/React.createElement("h3", {
    className: "cung-title"
  }, c.name.toUpperCase()), /*#__PURE__*/React.createElement("p", {
    className: "cung-desc"
  }, c.desc), /*#__PURE__*/React.createElement("div", {
    className: "cung-action-pill"
  }, "🔮 Luận Cung"))), /*#__PURE__*/React.createElement("div", {
    className: `cung-cell cell-thin ${activeCung === 'Tài Bạch' ? 'active-cung' : ''}`,
    onClick: () => analyzeTuviStream('Hãy đóng vai bậc thầy Tử Vi Đẩu Số Đặng Năm AI, luận giải chi tiết về Cung Tài Bạch (địa chi Thìn - Tiền tài, của cải, kinh doanh) cho bản mệnh đương số.', 'Tài Bạch')
  }, /*#__PURE__*/React.createElement("div", {
    className: "cung-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cung-chi"
  }, "THÌN"), /*#__PURE__*/React.createElement("span", {
    className: "cung-tag"
  }, "Thổ")), /*#__PURE__*/React.createElement("h3", {
    className: "cung-title"
  }, "TÀI BẠCH"), /*#__PURE__*/React.createElement("p", {
    className: "cung-desc"
  }, "Tiền tài · Làm ăn · Của cải"), /*#__PURE__*/React.createElement("div", {
    className: "cung-action-pill"
  }, "🔮 Luận Cung")), /*#__PURE__*/React.createElement("div", {
    className: "thien-ban"
  }, /*#__PURE__*/React.createElement("div", {
    className: "thien-ban-badge"
  }, "✦ THIÊN BÀN TỬ VI ✦"), /*#__PURE__*/React.createElement("div", {
    className: "thien-ban-brand"
  }, "ĐẶNG NĂM AI · dangnam.online"), /*#__PURE__*/React.createElement("div", {
    className: "thien-ban-info-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tb-name"
  }, profile.fullName || 'Chưa lưu hồ sơ'), /*#__PURE__*/React.createElement("div", {
    className: "tb-grid-details"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tb-item"
  }, /*#__PURE__*/React.createElement("span", null, "Giới tính:"), " ", /*#__PURE__*/React.createElement("b", null, profile.gender || 'Nam')), /*#__PURE__*/React.createElement("div", {
    className: "tb-item"
  }, /*#__PURE__*/React.createElement("span", null, "Lịch:"), " ", /*#__PURE__*/React.createElement("b", null, profile.calendarType === 'lunar' ? 'Âm lịch' : 'Dương lịch')), /*#__PURE__*/React.createElement("div", {
    className: "tb-item"
  }, /*#__PURE__*/React.createElement("span", null, "Ngày sinh:"), " ", /*#__PURE__*/React.createElement("b", null, profile.birthDate || 'Chưa đặt')), /*#__PURE__*/React.createElement("div", {
    className: "tb-item"
  }, /*#__PURE__*/React.createElement("span", null, "Canh giờ:"), " ", /*#__PURE__*/React.createElement("b", null, profile.birthHour || 'Giờ Ngọ')))), /*#__PURE__*/React.createElement("div", {
    className: "thien-ban-controls"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "tb-edit-btn",
    onClick: () => setIsModalOpen(true)
  }, "✏️ Sửa hồ sơ"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "tb-overall-btn",
    onClick: () => analyzeTuviStream('Luận giải tổng quan vận mệnh, cục diện lá số và đại vận then chốt cho đương số.', 'Toàn Cục')
  }, "🔮 Luận Toàn Cục")), /*#__PURE__*/React.createElement("div", {
    className: "thien-ban-quick-prompts"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "tb-chip",
    onClick: () => analyzeTuviStream('Luận giải tổng quan vận mệnh, bản mệnh âm dương ngũ hành và xu hướng cuộc đời', 'Tổng Quan')
  }, "🌟 Vận mệnh"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "tb-chip",
    onClick: () => analyzeTuviStream('Phân tích chi tiết Công danh & Tài lộc năm nay cho đương số', 'Tài Lộc')
  }, "💼 Công danh"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "tb-chip",
    onClick: () => analyzeTuviStream('Luận giải chuyên sâu Tình duyên, Hôn nhân & Gia đạo', 'Tình Duyên')
  }, "❤️ Tình duyên"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "tb-chip",
    onClick: () => analyzeTuviStream('Xem các hạn xấu cần phòng tránh và phương pháp hóa giải, cải vận tích đức', 'Hóa Giải')
  }, "🛡️ Hóa giải hạn"))), /*#__PURE__*/React.createElement("div", {
    className: `cung-cell cell-dau ${activeCung === 'Điền Trạch' ? 'active-cung' : ''}`,
    onClick: () => analyzeTuviStream('Hãy đóng vai bậc thầy Tử Vi Đẩu Số Đặng Năm AI, luận giải chi tiết về Cung Điền Trạch (địa chi Dậu - Đất đai, nhà ở, cơ nghiệp tổ phụ) cho bản mệnh đương số.', 'Điền Trạch')
  }, /*#__PURE__*/React.createElement("div", {
    className: "cung-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cung-chi"
  }, "DẬU"), /*#__PURE__*/React.createElement("span", {
    className: "cung-tag"
  }, "Kim")), /*#__PURE__*/React.createElement("h3", {
    className: "cung-title"
  }, "ĐIỀN TRẠCH"), /*#__PURE__*/React.createElement("p", {
    className: "cung-desc"
  }, "Nhà cửa · Đất đai · Cơ nghiệp"), /*#__PURE__*/React.createElement("div", {
    className: "cung-action-pill"
  }, "🔮 Luận Cung")), /*#__PURE__*/React.createElement("div", {
    className: `cung-cell cell-mao ${activeCung === 'Tử Tức' ? 'active-cung' : ''}`,
    onClick: () => analyzeTuviStream('Hãy đóng vai bậc thầy Tử Vi Đẩu Số Đặng Năm AI, luận giải chi tiết về Cung Tử Tức (địa chi Mão - Con cái, thế hệ nối dõi) cho bản mệnh đương số.', 'Tử Tức')
  }, /*#__PURE__*/React.createElement("div", {
    className: "cung-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cung-chi"
  }, "MÃO"), /*#__PURE__*/React.createElement("span", {
    className: "cung-tag"
  }, "Mộc")), /*#__PURE__*/React.createElement("h3", {
    className: "cung-title"
  }, "TỬ TỨC"), /*#__PURE__*/React.createElement("p", {
    className: "cung-desc"
  }, "Con cái · Hậu duệ · Duyên nợ"), /*#__PURE__*/React.createElement("div", {
    className: "cung-action-pill"
  }, "🔮 Luận Cung")), /*#__PURE__*/React.createElement("div", {
    className: `cung-cell cell-tuat ${activeCung === 'Phúc Đức' ? 'active-cung' : ''}`,
    onClick: () => analyzeTuviStream('Hãy đóng vai bậc thầy Tử Vi Đẩu Số Đặng Năm AI, luận giải chi tiết về Cung Phúc Đức (địa chi Tuất - Âm phúc, phúc trạch dòng họ) cho bản mệnh đương số.', 'Phúc Đức')
  }, /*#__PURE__*/React.createElement("div", {
    className: "cung-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cung-chi"
  }, "TUẤT"), /*#__PURE__*/React.createElement("span", {
    className: "cung-tag"
  }, "Thổ")), /*#__PURE__*/React.createElement("h3", {
    className: "cung-title"
  }, "PHÚC ĐỨC"), /*#__PURE__*/React.createElement("p", {
    className: "cung-desc"
  }, "Âm phúc · Dòng họ · May mắn"), /*#__PURE__*/React.createElement("div", {
    className: "cung-action-pill"
  }, "🔮 Luận Cung")), CUNGS.slice(8, 12).map(c => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    className: `cung-cell cell-${c.id} ${activeCung === c.name ? 'active-cung' : ''}`,
    onClick: () => analyzeTuviStream(`Hãy đóng vai bậc thầy Tử Vi Đẩu Số Đặng Năm AI, luận giải chi tiết, thấu đáo và chuyên sâu về Cung ${c.name} (địa chi ${c.chi} - ${c.desc}) cho bản mệnh đương số.`, c.name)
  }, /*#__PURE__*/React.createElement("div", {
    className: "cung-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cung-chi"
  }, c.chi), /*#__PURE__*/React.createElement("span", {
    className: "cung-tag"
  }, c.tag)), /*#__PURE__*/React.createElement("h3", {
    className: "cung-title"
  }, c.name.toUpperCase()), /*#__PURE__*/React.createElement("p", {
    className: "cung-desc"
  }, c.desc), /*#__PURE__*/React.createElement("div", {
    className: "cung-action-pill"
  }, "🔮 Luận Cung"))))), /*#__PURE__*/React.createElement("div", {
    id: "mobileTuviResult"
  }, /*#__PURE__*/React.createElement(Result, {
    text: out,
    title: `Luận Giải Chuyên Sâu: Cung ${activeCung}`
  }), streaming && /*#__PURE__*/React.createElement("span", {
    className: "streaming-cursor"
  })));
}
function SimpleTool({
  kind,
  title,
  icon,
  preset = '',
  placeholder = 'Bạn muốn hỏi điều gì?'
}) {
  const [q, setQ] = useState('');
  const [out, setOut] = useState('Nhập nội dung rồi bấm luận giải.');
  async function run() {
    setOut('AI đang luận giải...');
    try {
      const d = await apiJSON('/api/multi-ai/chat', {
        message: `${preset || title} ${q}`,
        provider: 'auto',
        model: 'gemini-3.5-flash-lite'
      });
      setOut(d.text || d.reply || 'Không có kết quả');
      saveHistory(title, d.text || d.reply || 'Không có kết quả');
    } catch (e) {
      setOut('⚠️ ' + e.message);
    }
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "tool-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "premium-panel"
  }, /*#__PURE__*/React.createElement("h2", null, icon, " ", title), /*#__PURE__*/React.createElement("textarea", {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: placeholder
  }), /*#__PURE__*/React.createElement("button", {
    className: "primary",
    onClick: run
  }, "Luận giải")), /*#__PURE__*/React.createElement(Result, {
    text: out
  }));
}
function AstrologyTool() {
  const zodiacs = [{
    id: 'Bạch Dương',
    icon: '♈',
    date: '21/03 - 19/04'
  }, {
    id: 'Kim Ngưu',
    icon: '♉',
    date: '20/04 - 20/05'
  }, {
    id: 'Song Tử',
    icon: '♊',
    date: '21/05 - 21/06'
  }, {
    id: 'Cự Giải',
    icon: '♋',
    date: '22/06 - 22/07'
  }, {
    id: 'Sư Tử',
    icon: '♌',
    date: '23/07 - 22/08'
  }, {
    id: 'Xử Nữ',
    icon: '♍',
    date: '23/08 - 22/09'
  }, {
    id: 'Thiên Bình',
    icon: '♎',
    date: '23/09 - 23/10'
  }, {
    id: 'Thiên Yết',
    icon: '♏',
    date: '24/10 - 22/11'
  }, {
    id: 'Nhân Mã',
    icon: '♐',
    date: '23/11 - 21/12'
  }, {
    id: 'Ma Kết',
    icon: '♑',
    date: '22/12 - 19/01'
  }, {
    id: 'Bảo Bình',
    icon: '♒',
    date: '20/01 - 18/02'
  }, {
    id: 'Song Ngư',
    icon: '♓',
    date: '19/02 - 20/03'
  }];
  const [selected, setSelected] = useState('');
  const [q, setQ] = useState('');
  const [out, setOut] = useState('Chọn cung hoàng đạo và nhập câu hỏi.');
  async function run() {
    if (!selected) return setOut('⚠️ Vui lòng chọn cung hoàng đạo của bạn.');
    setOut('AI đang luận giải...');
    try {
      const d = await apiJSON('/api/multi-ai/chat', {
        provider: 'auto',
        model: 'gemini-3.5-flash-lite',
        message: `Luận chiêm tinh theo cung hoàng đạo, thời điểm hiện tại và câu hỏi sau: Cung ${selected}. Câu hỏi: ${q}`
      });
      setOut(d.text || d.reply || 'Không có kết quả');
      saveHistory('Tình duyên', d.text || d.reply || 'Không có kết quả');
    } catch (e) {
      setOut('⚠️ ' + e.message);
    }
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "tool-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "premium-panel"
  }, /*#__PURE__*/React.createElement("h2", null, "🪐 Chiêm tinh"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '8px',
      marginBottom: '15px'
    }
  }, zodiacs.map(z => /*#__PURE__*/React.createElement("div", {
    key: z.id,
    onClick: () => setSelected(z.id),
    style: {
      background: selected === z.id ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)',
      border: selected === z.id ? '1px solid #ffd700' : '1px solid transparent',
      borderRadius: '8px',
      padding: '10px 5px',
      textAlign: 'center',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '24px'
    }
  }, z.icon), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      fontWeight: 'bold',
      marginTop: '4px',
      color: '#fff'
    }
  }, z.id), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '10px',
      color: '#aaa',
      marginTop: '2px'
    }
  }, z.date)))), /*#__PURE__*/React.createElement("textarea", {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "Tình duyên/công việc tháng này thế nào?"
  }), /*#__PURE__*/React.createElement("button", {
    className: "primary",
    onClick: run
  }, "✨ Xem chiêm tinh")), /*#__PURE__*/React.createElement(Result, {
    text: out
  }));
}
function FengShuiTool() {
  return /*#__PURE__*/React.createElement(SimpleTool, {
    kind: "fengshui",
    title: "Phong thủy",
    icon: "☯️",
    preset: "Phân tích phong thủy thực tế, màu hợp, hướng hợp, bố trí không gian theo thông tin sau:",
    placeholder: "Ví dụ: sinh năm 1995, muốn xem hướng bàn làm việc và màu hợp."
  });
}
function TarotTool() {
  const [q, setQ] = useState('');
  const [picked, setPicked] = useState([]);
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState('');
  const resultRef = useRef(null);
  async function draw() {
    if (loading) return;
    setLoading(true);
    const deck = [...TAROT_CARDS_DATA].sort(() => Math.random() - 0.5).slice(0, 3);
    setPicked(deck);
    setOut('⏳ AI đang luận giải 3 lá bài theo câu hỏi của bạn...');
    const userQuestion = q.trim() || 'Tổng quan vận trình, năng lượng và thông điệp vũ trụ hôm nay';
    const deckInfo = deck.map((c, i) => `${['Lá 1 (Hiện tại)', 'Lá 2 (Lời khuyên)', 'Lá 3 (Tương lai gần)'][i]}: ${c.name} (${c.keywords})`).join('\n');
    const prompt = `Bạn là chuyên gia bói bài Tarot huyền học. Người dùng hỏi: "${userQuestion}".\nTrải bài 3 lá:\n${deckInfo}\nHãy luận giải chi tiết, sâu sắc: 1) Ý nghĩa từng lá bài trong vị trí tương ứng. 2) Thông điệp kết nối giữa 3 lá bài. 3) Lời khuyên cụ thể, thực tế và hướng hành động tốt nhất.`;
    try {
      const d = await apiJSON('/api/multi-ai/chat', {
        provider: 'auto',
        model: 'gemini-3.5-flash-lite',
        message: prompt
      });
      const resText = d.text || d.reply || '';
      if (resText) {
        setOut(resText);
      } else {
        throw new Error('Không nhận được nội dung từ AI');
      }
    } catch (e) {
      const fallbackText = `### 🃏 Luận Giải 3 Lá Bài Tarot\n**Câu hỏi:** ${userQuestion}\n\n` + deck.map((c, idx) => `#### ${['1. Hiện tại', '2. Lời khuyên', '3. Tương lai gần'][idx]}: ${c.name} (${c.num})\n- **Từ khóa:** ${c.keywords}\n- **Ý nghĩa:** ${c.mean}`).join('\n\n') + `\n\n---\n💡 **Lời khuyên tổng kết:** Hãy đón nhận các thông điệp với tâm thái bình thản, tập trung vào sức mạnh nội tâm để đưa ra lựa chọn sáng suốt nhất.`;
      setOut(fallbackText);
    } finally {
      setLoading(false);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 150);
    }
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "tool-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "premium-panel"
  }, /*#__PURE__*/React.createElement("h2", null, "🃏 Xem Bói Bài Tarot AI"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '13px',
      color: '#94a3b8',
      margin: '0 0 10px'
    }
  }, "Tập trung tâm trí vào điều bạn đang thắc mắc rồi bấm ", /*#__PURE__*/React.createElement("b", null, "Trải bài Tarot"), " để lắng nghe thông điệp từ vũ trụ."), /*#__PURE__*/React.createElement("textarea", {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "Nhập câu hỏi của bạn (ví dụ: Công việc tháng này, Chuyện tình cảm sắp tới...)",
    disabled: loading,
    rows: 3
  }), /*#__PURE__*/React.createElement("button", {
    className: "primary",
    onClick: draw,
    disabled: loading,
    style: {
      width: '100%',
      height: '46px',
      fontWeight: 'bold',
      fontSize: '15px',
      marginTop: '8px'
    }
  }, loading ? '⏳ AI đang trải bài và luận giải...' : picked.length ? '🔄 Đổi trải bài khác' : '🃏 Trải Bài Tarot Ngay'), picked.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "tarot-cards",
    style: {
      display: 'flex',
      gap: '8px',
      justifyContent: 'center',
      marginTop: '15px',
      flexWrap: 'nowrap'
    }
  }, picked.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    style: {
      flex: 1,
      minWidth: 0,
      textAlign: 'center',
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,215,0,0.3)',
      borderRadius: '12px',
      padding: '10px 4px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '10px',
      color: '#38bdf8',
      textTransform: 'uppercase',
      fontWeight: 'bold',
      marginBottom: '4px'
    }
  }, ['Lá 1: Hiện tại', 'Lá 2: Lời khuyên', 'Lá 3: Tương lai'][i]), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '32px',
      margin: '4px 0',
      filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.6))'
    }
  }, c.icon), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#ffd700',
      lineHeight: '1.2',
      margin: '4px 0'
    }
  }, c.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '10px',
      color: '#94a3b8',
      lineHeight: '1.2'
    }
  }, c.keywords))))), /*#__PURE__*/React.createElement("div", {
    ref: resultRef
  }, out ? /*#__PURE__*/React.createElement(Result, {
    text: out,
    title: "Thông Điệp Vũ Trụ & Luận Giải Tarot"
  }) : null));
}
function NumerologyTool() {
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [out, setOut] = useState('Nhập họ tên và ngày sinh để tính thần số học.');
  function sumDigits(v) {
    let n = String(v).replace(/\D/g, '').split('').reduce((a, b) => a + Number(b), 0);
    while (n > 9 && ![11, 22, 33].includes(n)) n = String(n).split('').reduce((a, b) => a + Number(b), 0);
    return n || 0;
  }
  async function run() {
    if (!String(birth).replace(/\D/g, '')) {
      setOut('Vui lòng nhập ngày sinh hợp lệ để tính thần số học.');
      return;
    }
    const life = sumDigits(birth);
    setOut('Đang tính local và AI luận giải...');
    try {
      const d = await apiJSON('/api/multi-ai/chat', {
        provider: 'auto',
        model: 'gemini-3.5-flash-lite',
        message: `Thần số học cho tên ${name || 'chưa nhập'}, ngày sinh ${birth || 'chưa nhập'}, số chủ đạo local là ${life}. Luận rõ tính cách, tình duyên, công việc, lời khuyên.`
      });
      setOut(d.text || d.reply || `Số chủ đạo: ${life}`);
    } catch (e) {
      setOut(`### 🔢 Kết quả local
- Họ tên: ${name || 'Chưa nhập'}
- Ngày sinh: ${birth || 'Chưa nhập'}
- Số chủ đạo: ${life || 'Chưa đủ dữ liệu'}

Kết quả chỉ mang tính tham khảo.`);
    }
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "tool-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "premium-panel"
  }, /*#__PURE__*/React.createElement("h2", null, "🔢 Thần số học AI"), /*#__PURE__*/React.createElement("input", {
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: "Họ và tên"
  }), /*#__PURE__*/React.createElement("input", {
    value: birth,
    onChange: e => setBirth(e.target.value),
    placeholder: "Ngày sinh: 01/01/2000"
  }), /*#__PURE__*/React.createElement("button", {
    className: "primary",
    onClick: run
  }, "🤖 Luận thần số học")), /*#__PURE__*/React.createElement(Result, {
    text: out
  }));
}
function SimTool() {
  const [phone, setPhone] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [simData, setSimData] = useState(null);
  const [aiOut, setAiOut] = useState('');
  const [error, setError] = useState('');
  async function analyze() {
    const clean = String(phone || '').replace(/\D/g, '');
    if (!clean || clean.length < 10) {
      setError('Vui lòng nhập số điện thoại hợp lệ (tối thiểu 10 chữ số).');
      return;
    }
    setError('');
    setLoading(true);
    setSimData(null);
    setAiOut('');
    try {
      const res = await apiJSON('/api/sim/evaluate', {
        phoneNumber: clean,
        birthYear: birthYear || new Date().getFullYear()
      });
      setSimData(res);
      setAiOut('✦ Chuyên gia AI đang phân tích sâu thế số, ngũ hành, vận 9 và quẻ dịch...');
      const aiRes = await apiJSON('/api/multi-ai/chat', {
        provider: 'auto',
        model: 'gemini-3.5-flash-lite',
        message: res.aiPromptData
      });
      setAiOut(aiRes.text || aiRes.reply || 'Đã phân tích xong.');
    } catch (err) {
      setError(err.message || 'Lỗi khi phân tích sim.');
      setAiOut('');
    } finally {
      setLoading(false);
    }
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "tool-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "premium-panel"
  }, /*#__PURE__*/React.createElement("h2", null, "📱 Định Giá Sim & Phong Thủy Số Học"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '13px',
      opacity: 0.8,
      marginBottom: '12px'
    }
  }, "Định giá chuẩn xác thị trường, ngũ hành sinh khắc, đắc vận 9 và quẻ Kinh Dịch (Chủ & Hỗ)."), /*#__PURE__*/React.createElement("label", null, "Số điện thoại cần thẩm định:", /*#__PURE__*/React.createElement("input", {
    type: "tel",
    value: phone,
    onChange: e => setPhone(e.target.value),
    placeholder: "Ví dụ: 0988686868",
    style: {
      fontSize: '16px',
      fontWeight: 'bold',
      letterSpacing: '1px'
    }
  })), /*#__PURE__*/React.createElement("label", null, "Năm sinh bản mệnh của bạn:", /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: birthYear,
    onChange: e => setBirthYear(e.target.value),
    placeholder: "Ví dụ: 1984, 1990..."
  })), error && /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#f87171',
      fontSize: '13px',
      marginBottom: '10px'
    }
  }, "⚠️ ", error), /*#__PURE__*/React.createElement("button", {
    className: "primary",
    onClick: analyze,
    disabled: loading
  }, loading ? '⏳ Đang tính toán & Luận giải...' : '🔮 Phân Tích Bằng AI & Định Giá'), simData && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '20px',
      padding: '16px',
      borderRadius: '12px',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,215,0,0.3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: '15px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '12px',
      color: '#ffd700',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    }
  }, "Định Giá Thị Trường Ước Tính"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '30px',
      fontWeight: '900',
      color: '#ffd700',
      margin: '4px 0'
    }
  }, simData.price.formattedPrice)), simData.price.tags?.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px',
      justifyContent: 'center',
      marginBottom: '15px'
    }
  }, simData.price.tags.map((t, idx) => /*#__PURE__*/React.createElement("span", {
    key: idx,
    style: {
      padding: '3px 8px',
      borderRadius: '20px',
      background: 'rgba(255,215,0,0.15)',
      color: '#ffe066',
      fontSize: '11px',
      border: '1px solid rgba(255,215,0,0.3)'
    }
  }, "⭐ ", t))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '10px',
      fontSize: '13px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px',
      borderRadius: '8px',
      background: 'rgba(0,0,0,0.25)'
    }
  }, /*#__PURE__*/React.createElement("b", null, "Ngũ Hành Bản Mệnh:"), " Mệnh ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#38bdf8',
      fontWeight: 'bold'
    }
  }, simData.phongThuy.nguHanh.userMenh), " (", simData.phongThuy.nguHanh.userCanChi, ") - Đuôi ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#fbbf24',
      fontWeight: 'bold'
    }
  }, simData.phongThuy.nguHanh.lastDigit, " (", simData.phongThuy.nguHanh.simElement, ")"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      color: '#86efac',
      marginTop: '2px',
      fontWeight: '500'
    }
  }, simData.phongThuy.nguHanh.tuongTac)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px',
      borderRadius: '8px',
      background: 'rgba(0,0,0,0.25)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '4px'
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "Điểm nút:"), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#ffd700',
      fontWeight: 'bold'
    }
  }, simData.phongThuy.nutSo.score), " / 10"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "Âm Dương:"), " ", simData.phongThuy.yinYang.ratio)), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '8px',
      borderRadius: '4px',
      overflow: 'hidden',
      display: 'flex',
      background: '#3b82f6',
      margin: '4px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${simData.phongThuy.yinYang.evenPercent}%`,
      background: '#6366f1'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${simData.phongThuy.yinYang.oddPercent}%`,
      background: '#eab308'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px',
      borderRadius: '8px',
      background: 'rgba(0,0,0,0.25)'
    }
  }, /*#__PURE__*/React.createElement("b", null, "Cửu Tinh Đồ Pháp (Vận 9: 2024-2043):"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      color: '#cbd5e1',
      marginTop: '2px'
    }
  }, simData.phongThuy.van9.evaluation)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px',
      borderRadius: '8px',
      background: 'rgba(0,0,0,0.25)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Quẻ Chủ:"), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#f87171',
      fontWeight: 'bold'
    }
  }, simData.phongThuy.queDich.queChu.ten), " (", simData.phongThuy.queDich.queChu.tinhChat, ") - ", /*#__PURE__*/React.createElement("i", null, "\"", simData.phongThuy.queDich.queChu.yNghia, "\"")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '4px'
    }
  }, /*#__PURE__*/React.createElement("b", null, "Quẻ Hỗ:"), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#c084fc',
      fontWeight: 'bold'
    }
  }, simData.phongThuy.queDich.queHo.ten), " (", simData.phongThuy.queDich.queHo.tinhChat, ") - ", /*#__PURE__*/React.createElement("i", null, "\"", simData.phongThuy.queDich.queHo.yNghia, "\"")))))), /*#__PURE__*/React.createElement(Result, {
    text: aiOut,
    title: "Lời Luận Giải Chi Tiết Của AI"
  }));
}
function Result({
  text,
  title = 'Kết quả luận giải'
}) {
  if (!text) return null;
  return /*#__PURE__*/React.createElement("article", {
    className: "premium-panel result"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
      flexWrap: 'wrap',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0
    }
  }, "📌 ", title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '6px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "small-action-btn",
    onClick: () => {
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text);
        alert('Đã sao chép kết quả!');
      }
    }
  }, "📋 Sao chép"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "small-action-btn",
    onClick: () => exportResultToPrint(title, text)
  }, "🖨️ In / PDF"))), /*#__PURE__*/React.createElement("div", {
    dangerouslySetInnerHTML: {
      __html: markdownLite(text)
    }
  }));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('service-worker.js').catch(() => {}));
}
function DeepTool() {
  const [result, setResult] = useState('Điền thông tin và bấm phân tích để bắt đầu.');
  const [form, setForm] = useState({
    name: '',
    birth: '',
    ask: '',
    focus: 'Tổng quan cuộc đời & Vận hạn'
  });
  const [busy, setBusy] = useState(false);
  async function run() {
    if (!form.ask) return alert('Vui lòng nhập vấn đề cần hỏi.');
    setBusy(true);
    setResult('AI đang tổng hợp dữ liệu đa lớp và phân tích sâu...');
    try {
      const data = await apiJSON('/api/deep-ai', {
        ...form,
        geminiModel: 'gemini-3.5-flash-lite'
      });
      setResult(data.text || data.reply || 'Không có kết quả trả về.');
    } catch (e) {
      setResult('Lỗi: ' + e.message);
    } finally {
      setBusy(false);
    }
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "tool-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "premium-panel"
  }, /*#__PURE__*/React.createElement("h2", null, "🧠 AI Phân Tích Chuyên Sâu PRO"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '13px',
      opacity: 0.8,
      marginBottom: '14px'
    }
  }, "Cung cấp thông tin chi tiết nhất để AI tổng hợp đa lớp và luận giải chuyên sâu."), /*#__PURE__*/React.createElement("input", {
    placeholder: "Họ tên (vd: Nguyễn Văn A)",
    value: form.name,
    onChange: e => setForm({
      ...form,
      name: e.target.value
    })
  }), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: form.birth,
    onChange: e => setForm({
      ...form,
      birth: e.target.value
    })
  }), /*#__PURE__*/React.createElement("textarea", {
    placeholder: "Trình bày rõ vấn đề bạn đang gặp phải hoặc điều muốn hỏi thật chi tiết...",
    value: form.ask,
    onChange: e => setForm({
      ...form,
      ask: e.target.value
    }),
    style: {
      height: '100px'
    }
  }), /*#__PURE__*/React.createElement("select", {
    value: form.focus,
    onChange: e => setForm({
      ...form,
      focus: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", null, "Tổng quan cuộc đời & Vận hạn"), /*#__PURE__*/React.createElement("option", null, "Công danh sự nghiệp & Tài lộc"), /*#__PURE__*/React.createElement("option", null, "Tình duyên & Hôn nhân"), /*#__PURE__*/React.createElement("option", null, "Phân tích tâm lý & Lời khuyên")), /*#__PURE__*/React.createElement("button", {
    className: "primary",
    onClick: run,
    disabled: busy
  }, busy ? 'Đang xử lý...' : '✦ Bắt Đầu Phân Tích')), /*#__PURE__*/React.createElement(Result, {
    text: result
  }));
}