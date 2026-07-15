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

// 初期配置（画面幅で切り替え、7ボタン対応）
function layout() {
  const w = stage.clientWidth, h = stage.clientHeight;
  const wide = w > 760;
  const pos = wide
    ? [[10, 24], [66, 18], [18, 66], [72, 62], [42, 82], [82, 78], [6, 88]]
    : [[6, 18], [50, 14], [8, 68], [52, 64], [28, 84], [70, 88], [8, 94]];
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
      const target = b.dataset.go;
      // .html を含んでいたら別ページへ遷移、それ以外はセクションへスクロール
      if (target.includes('.html')) {
        window.location.href = target;
      } else {
        const t = document.getElementById(target);
        if (t) t.scrollIntoView({ behavior: 'smooth' });
      }
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

  // 連続送信のブロック（同じブラウザから60秒以内の再送信を防ぐ）
  const lastSent = Number(localStorage.getItem('lw_last_sent') || 0);
  const now = Date.now();
  if (now - lastSent < 60000) {
    alert('送信済みです。しばらく経ってから、もう一度お試しください。');
    return;
  }

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

  const submitBtn = form.querySelector('.submit');
  const originalLabel = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = '送信中…';

  fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  })
  .then(res => {
    if (res.ok) {
      localStorage.setItem('lw_last_sent', String(Date.now()));
      form.style.display = 'none';
      document.getElementById('done').classList.add('show');
    } else {
      throw new Error('send failed');
    }
  })
  .catch(() => {
    alert('送信に失敗しました。お手数ですが、メールまたはお電話にてご連絡ください。');
  })
  .finally(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = originalLabel;
  });
});

window.resetForm = () => {
  form.reset();
  form.querySelectorAll('.fld.err').forEach(f => f.classList.remove('err'));
  document.getElementById('done').classList.remove('show');
  form.style.display = 'block';
};
