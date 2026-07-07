// ===== ヘッダー：スクロールで背景 =====
const hdr = document.getElementById('hdr');
addEventListener('scroll', () => hdr.classList.toggle('on', scrollY > 40));

// ===== スクロール出現アニメ =====
const io = new IntersectionObserver(
  es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
  { threshold: .12 }
);
document.querySelectorAll('[data-rv]').forEach(el => io.observe(el));

// ===== ドラッグ可能なボタン =====
const stage = document.getElementById('top');
const btns = [...document.querySelectorAll('.gbtn')];

// 初期配置（画面幅で切り替え）
function layout() {
  const w = stage.clientWidth, h = stage.clientHeight;
  const wide = w > 760;
  const pos = wide
    ? [[12, 26], [68, 20], [20, 68], [72, 64], [44, 80]]
    : [[8, 20], [52, 16], [10, 72], [54, 68], [30, 86]];
  btns.forEach((b, i) => {
    if (b.dataset.moved) return; // 一度動かしたボタンは動かさない
    const [px, py] = pos[i];
    b.style.left = (w * px / 100) + 'px';
    b.style.top  = (h * py / 100) + 'px';
  });
}
layout();
addEventListener('resize', layout);

let active = null, sx, sy, ox, oy, moved = false;
btns.forEach(b => {
  b.addEventListener('pointerdown', e => {
    active = b; moved = false; sx = e.clientX; sy = e.clientY;
    const r = b.getBoundingClientRect(), sr = stage.getBoundingClientRect();
    ox = r.left - sr.left; oy = r.top - sr.top;
    b.setPointerCapture(e.pointerId);
    b.classList.add('grabbed');
  });
  b.addEventListener('pointermove', e => {
    if (active !== b) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) moved = true;
    let nx = ox + dx, ny = oy + dy;
    const sr = stage.getBoundingClientRect();
    nx = Math.max(-10, Math.min(nx, sr.width  - b.offsetWidth + 10));
    ny = Math.max(60,  Math.min(ny, sr.height - b.offsetHeight - 6));
    b.style.left = nx + 'px'; b.style.top = ny + 'px';
  });
  const end = () => {
    if (active !== b) return;
    b.classList.remove('grabbed');
    if (moved) {
      b.dataset.moved = '1';
    } else {
      // 動かさずにクリックした場合はセクションへスクロール
      const t = document.getElementById(b.dataset.go);
      if (t) t.scrollIntoView({ behavior: 'smooth' });
    }
    active = null;
  };
  b.addEventListener('pointerup', end);
  b.addEventListener('pointercancel', end);
});

// ===== フォーム送信 =====
const form = document.getElementById('cform');
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

form.addEventListener('submit', e => {
  e.preventDefault();
  let ok = true;
  const set = (name, valid) => {
    const f = form[name].closest('.fld');
    f.classList.toggle('err', !valid);
    if (!valid) ok = false;
  };
  set('name',  form.name.value.trim() !== '');
  set('email', emailRe.test(form.email.value.trim()));
  set('type',  form.type.value !== '');
  if (!ok) {
    form.querySelector('.fld.err input, .fld.err select')?.focus();
    return;
  }
  form.style.display = 'none';
  document.getElementById('done').classList.add('show');
});

window.resetForm = () => {
  form.reset();
  form.querySelectorAll('.fld.err').forEach(f => f.classList.remove('err'));
  document.getElementById('done').classList.remove('show');
  form.style.display = 'block';
};
