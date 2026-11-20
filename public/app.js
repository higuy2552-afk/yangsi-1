const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const loader = $('#loader');
const mainContent = $('#mainContent');
const loaderProgress = $('#loaderProgress');
const loaderPercent = $('#loaderPercent');
const loaderStatus = $('#loaderStatus');
const enterButton = $('#enterButton');
let progress = 0;
const statusLines = ['คัดลอกตราประทับ...', 'ตรวจสอบชื่อผู้เยี่ยมชม...', 'เปิดกล่องหลักฐาน...', 'แฟ้มพร้อมอ่าน'];

const loadingTimer = setInterval(() => {
  progress = Math.min(100, progress + Math.floor(Math.random() * 13) + 4);
  loaderProgress.style.width = `${progress}%`;
  loaderPercent.textContent = `${String(progress).padStart(2, '0')}%`;
  loaderStatus.textContent = statusLines[Math.min(statusLines.length - 1, Math.floor(progress / 28))];
  if (progress >= 100) {
    clearInterval(loadingTimer);
    enterButton.disabled = false;
    enterButton.classList.add('ready');
  }
}, 130);

function openArchive() {
  loader.classList.add('is-hidden');
  mainContent.removeAttribute('aria-hidden');
  mainContent.classList.add('is-visible');
  document.body.classList.add('archive-open');
  setTimeout(() => $$('.reveal').forEach((el, index) => setTimeout(() => el.classList.add('visible'), Math.min(index * 35, 600))), 450);
}
enterButton.addEventListener('click', openArchive);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
$$('.reveal').forEach((el) => observer.observe(el));

const tiltCard = $('[data-tilt]');
if (tiltCard && window.matchMedia('(pointer:fine)').matches) {
  tiltCard.addEventListener('pointermove', (event) => {
    const box = tiltCard.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - .5;
    const y = (event.clientY - box.top) / box.height - .5;
    tiltCard.style.transform = `rotateY(${x * 8}deg) rotateX(${y * -8}deg) translateY(-4px)`;
  });
  tiltCard.addEventListener('pointerleave', () => { tiltCard.style.transform = ''; });
}

const glow = $('.cursor-glow');
window.addEventListener('pointermove', (event) => {
  if (glow) { glow.style.left = `${event.clientX}px`; glow.style.top = `${event.clientY}px`; }
}, { passive: true });

const menuButton = $('#menuButton');
const mobileMenu = $('#mobileMenu');
menuButton.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
$$('#mobileMenu a').forEach((link) => link.addEventListener('click', () => mobileMenu.classList.remove('open')));

$('#lightToggle').addEventListener('click', (event) => {
  document.body.classList.toggle('light-mode');
  event.currentTarget.textContent = document.body.classList.contains('light-mode') ? '◑' : '◐';
});

const appearancePanel = $('#appearance');
$$('[data-open-panel]').forEach((button) => button.addEventListener('click', () => {
  appearancePanel.classList.add('open');
  button.textContent = 'ปิดรายละเอียด −';
  appearancePanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
}));
$('.panel-close').addEventListener('click', () => {
  appearancePanel.classList.remove('open');
  $('[data-open-panel]').innerHTML = 'อ่านรายละเอียด <span>+</span>';
});

const notes = [
  'เขาไม่ได้มองนานเพราะสนใจ — เขามองนานเพราะกำลังจำรายละเอียด',
  'นมอุ่นหนึ่งแก้ว กับบทสนทนาที่อีกฝ่ายคิดว่าไม่มีใครจำได้',
  'ถ้าความเงียบมีรูปทรง มันคงเป็นสีแดงเข้มแบบผมของเขา',
  'คนเรามักเผยตัวเองตอนคิดว่าไม่มีใครกำลังมองอยู่'
];
const toast = $('#quoteToast');
const toastText = $('#quoteToast p');
let toastTimeout;
$('#quoteButton').addEventListener('click', () => {
  toastText.textContent = notes[Math.floor(Math.random() * notes.length)];
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 5000);
});

const galleryImages = [
  ['https://i.postimg.cc/5NT38fZw/mi-m-ch-x-15-20261120111941.png', '01 / RED ROOM'],
  ['https://i.postimg.cc/9Frb4DNp/mi-m-ch-x-15-20261120112217.png', '02 / AFTER HOURS'],
  ['https://i.postimg.cc/rF3J5qvj/mi-m-ch-x-15-20261120112322.png', '03 / OBSERVER'],
  ['https://i.postimg.cc/TYF9nTZJ/mi-m-ch-x-15-20261120112809.png', '04 / PRIVATE NOTE'],
  ['https://i.postimg.cc/MKv5cnrV/mi-m-ch-x-15-20261120113228.png', '05 / THE VISITOR RETURNS']
];
const galleryModal = $('#galleryModal');
const modalImage = $('#modalImage');
const modalCaption = $('#modalCaption');
const modalCount = $('#modalCount');
let galleryIndex = 0;
function showImage(index) {
  galleryIndex = (index + galleryImages.length) % galleryImages.length;
  const [src, caption] = galleryImages[galleryIndex];
  modalImage.src = src;
  modalImage.alt = caption;
  modalCaption.textContent = caption;
  modalCount.textContent = `${String(galleryIndex + 1).padStart(2, '0')} / ${String(galleryImages.length).padStart(2, '0')}`;
}
function closeGallery() { galleryModal.classList.remove('open'); document.body.style.overflow = ''; }
$$('.gallery-item').forEach((item) => item.addEventListener('click', () => {
  showImage(Number(item.dataset.galleryIndex));
  galleryModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}));
$('#modalClose').addEventListener('click', closeGallery);
$('#modalPrev').addEventListener('click', () => showImage(galleryIndex - 1));
$('#modalNext').addEventListener('click', () => showImage(galleryIndex + 1));
galleryModal.addEventListener('click', (event) => { if (event.target === galleryModal) closeGallery(); });
window.addEventListener('keydown', (event) => {
  if (!galleryModal.classList.contains('open')) return;
  if (event.key === 'Escape') closeGallery();
  if (event.key === 'ArrowLeft') showImage(galleryIndex - 1);
  if (event.key === 'ArrowRight') showImage(galleryIndex + 1);
});
