// =====================================================================
// 実績データ（仮）
// 写真ができたら、それぞれの image に画像ファイルのパスを入れてください。
// 例）image: "images/portfolio-1.jpg"
// 画像ファイルは同じフォルダに "images" フォルダを作って、その中に入れてください。
// image が null のあいだは「写真準備中」の枠のまま表示されます。
// =====================================================================
const portfolioItems = [
  { title: "予約システム開発（仮）",     cat: "WEBシステム", desc: "店舗向け予約管理システムの開発事例。写真準備中です。",       image: null },
  { title: "会員管理SaaS（仮）",         cat: "SaaS",         desc: "クラウド型の会員管理サービス。写真準備中です。",           image: null },
  { title: "学校ICT支援（仮）",          cat: "ICT事業",      desc: "学校現場でのICT支援員派遣事例。写真準備中です。",           image: null },
  { title: "在庫管理システム（仮）",     cat: "WEBシステム", desc: "小売業向け在庫管理システムの開発事例。写真準備中です。",   image: null },
  { title: "オンデマンド教材（仮）",     cat: "ICT事業",      desc: "動画教材の制作・提供事例。写真準備中です。",               image: null },
  { title: "業務効率化SaaS（仮）",       cat: "SaaS",         desc: "既存業務のSaaS化による効率化事例。写真準備中です。",       image: null },
];

const grid = document.getElementById('pfGrid');

function thumbHtml(item, size) {
  if (item.image) {
    return `<img src="${item.image}" alt="${item.title}">`;
  }
  const iconSize = size === 'modal' ? 48 : 34;
  return `
    <svg viewBox="0 0 24 24" width="${iconSize}" height="${iconSize}">
      <rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-4 4-3-3-6 6"/>
    </svg>
    <span>写真準備中</span>
  `;
}

portfolioItems.forEach(item => {
  const card = document.createElement('div');
  card.className = 'panel pf-card';
  card.innerHTML = `
    <div class="pf-thumb">${thumbHtml(item)}</div>
    <div class="pf-body">
      <span class="pf-cat">${item.cat}</span>
      <h4>${item.title}</h4>
      <p>${item.desc}</p>
    </div>
  `;
  card.addEventListener('click', () => openModal(item));
  grid.appendChild(card);
});

// ===== ライトボックス =====
const overlay    = document.getElementById('pfOverlay');
const modalThumb = document.getElementById('pfModalThumb');
const modalTitle = document.getElementById('pfModalTitle');
const modalDesc  = document.getElementById('pfModalDesc');
const closeBtn   = document.getElementById('pfClose');

function openModal(item) {
  modalThumb.innerHTML = thumbHtml(item, 'modal');
  modalTitle.textContent = item.title;
  modalDesc.textContent  = item.desc;
  overlay.classList.add('show');
}
closeBtn.addEventListener('click', () => overlay.classList.remove('show'));
overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('show'); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') overlay.classList.remove('show'); });
