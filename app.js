// Prices and names are placeholders — edit freely.
// h = display height of the garment in px on the rail.
const PRODUCTS = [
  { img: 'cream-id-tee',    name: 'ID Card Tee — Cream',        price: 35000, h: 190 },
  { img: 'black-id-tee',    name: 'ID Card Tee — Black',        price: 35000, h: 190 },
  { img: 'red-fly-tee',     name: 'Dress Fly Tee — Red',        price: 32000, h: 185 },
  { img: 'white-fly-tee',   name: 'Dress Fly Tee — White',      price: 32000, h: 185 },
  { img: 'black-tank',      name: 'Ghoul Rib Tank — Black',     price: 25000, h: 250 },
  { img: 'white-tank',      name: 'Ghoul Rib Tank — White',     price: 25000, h: 250 },
  { img: 'navy-pants',      name: 'Skull Wide Pants — Navy',    price: 48000, h: 300 },
  { img: 'black-pants',     name: 'Skull Wide Pants — Black',   price: 48000, h: 300 },
  { img: 'black-red-pants', name: 'Skull Wide Pants — Blood',   price: 48000, h: 300 },
  { img: 'red-pants',       name: 'Skull Wide Pants — Red',     price: 48000, h: 300 },
];
const SIZES = ['S', 'M', 'L', 'XL'];
const fmt = n => '₦' + n.toLocaleString('en-NG');

const HANGER = `<svg class="hanger" viewBox="0 0 100 46" fill="none" stroke="#1a1a1a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M50 2c4 0 7 3 7 7 0 3-3 5-6 6l-1 3"/><path d="M50 18 4 40c-2 1-1 4 1 4h90c2 0 3-3 1-4L50 18Z"/></svg>`;

const $ = s => document.querySelector(s);
const rail = $('#rail'), wrap = $('#railWrap'), detail = $('#detail');
let bag = 0, current = null, size = 'M';

function hangerMarkup(p, cls = '') {
  const img = `img/${p.img}.png`;
  return `<div class="flipper">
    <div class="face front">${HANGER}<img class="g" src="${img}" style="height:${cls ? '' : p.h + 'px'}" alt="${p.name}" draggable="false"></div>
    <div class="face back">${HANGER}<img class="g" src="img/${p.img}-back.png" style="height:${cls ? '' : p.h + 'px'}" alt="${p.name} (back)" draggable="false"></div>
  </div>`;
}

// ---- build the rail
PRODUCTS.forEach((p, i) => {
  const el = document.createElement('div');
  el.className = 'item';
  el.dataset.i = i;
  el.innerHTML = `<div class="sway">${hangerMarkup(p)}</div>`;
  el.addEventListener('mouseenter', () => $('#counter').textContent = String(i + 1).padStart(2, '0') + ' / ' + PRODUCTS.length);
  el.addEventListener('click', () => { if (!dragMoved) open(i); });
  rail.appendChild(el);
});

// ---- drag / wheel scroll on the rail
let down = false, sx = 0, sl = 0, dragMoved = false;
wrap.addEventListener('pointerdown', e => { down = true; dragMoved = false; sx = e.clientX; sl = wrap.scrollLeft; });
addEventListener('pointermove', e => {
  if (!down) return;
  const dx = e.clientX - sx;
  if (Math.abs(dx) > 5) { dragMoved = true; wrap.style.cursor = 'grabbing'; wrap.scrollLeft = sl - dx; }
});
addEventListener('pointerup', () => { down = false; wrap.style.cursor = ''; setTimeout(() => dragMoved = false, 0); });
wrap.addEventListener('wheel', e => {
  if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { wrap.scrollLeft += e.deltaY; e.preventDefault(); }
}, { passive: false });

// ---- detail view
function open(i) {
  current = PRODUCTS[i];
  $('#dName').textContent = current.name;
  $('#dPrice').textContent = fmt(current.price);
  $('#dHang').classList.remove('is-back');
  $('#dHang').innerHTML = hangerMarkup(current, 'big');
  document.querySelectorAll('.seg').forEach(b => b.classList.toggle('on', b.dataset.side === 'front'));
  size = 'M';
  $('#dSizes').innerHTML = SIZES.map(s => `<button class="size${s === size ? ' on' : ''}">${s}</button>`).join('');
  wrap.style.opacity = 0; wrap.style.pointerEvents = 'none';
  detail.hidden = false;
}
function close() {
  detail.hidden = true;
  wrap.style.opacity = 1; wrap.style.pointerEvents = '';
}

// ---- intro / home
const intro = $('#intro');
// from a product page the logo goes back to the rail; from the rail it goes to the intro
function goHome() {
  if (!detail.hidden) { close(); return; }
  intro.classList.remove('gone');
}
function enter() { intro.classList.add('gone'); }
$('#enter').onclick = enter;
intro.addEventListener('click', e => { if (e.target === intro) enter(); });
$('#home').addEventListener('click', e => { e.preventDefault(); goHome(); });
$('#back').onclick = close;
addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
document.querySelectorAll('.seg').forEach(b => b.onclick = () => {
  document.querySelectorAll('.seg').forEach(x => x.classList.toggle('on', x === b));
  $('#dHang').classList.toggle('is-back', b.dataset.side === 'back');
});
$('#dSizes').addEventListener('click', e => {
  const b = e.target.closest('.size'); if (!b) return;
  size = b.textContent;
  document.querySelectorAll('.size').forEach(x => x.classList.toggle('on', x === b));
});
$('#dAdd').onclick = () => {
  $('#bagCount').textContent = ++bag;
  const btn = $('#bagBtn'); btn.classList.remove('bump'); void btn.offsetWidth; btn.classList.add('bump');
};
