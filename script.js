/* ============================================================
   script.js – Phường Hạ Long
   ============================================================ */

/* ===== VIDEO PANEL ===== */
const openBtn    = document.getElementById('openUpload');
const closeBtn   = document.getElementById('closePanel');
const panel      = document.getElementById('uploadPanel');
const overlay    = document.getElementById('overlay');
const dropZone   = document.getElementById('dropZone');
const fileInput  = document.getElementById('fileInput');
const submitBtn  = document.getElementById('submitVideo');
const videoGrid  = document.getElementById('videoGrid');

let uploadedFile = null;

/* ===== PPTX PANEL ===== */
const openPptxBtn   = document.getElementById('openPptx');
const closePptxBtn  = document.getElementById('closePptx');
const pptxPanel     = document.getElementById('pptxPanel');
const pptxDropZone  = document.getElementById('pptxDropZone');
const pptxInput     = document.getElementById('pptxInput');
const submitPptxBtn = document.getElementById('submitPptx');
const pptxGrid      = document.getElementById('pptxGrid');

let uploadedPptx = null;

/* ---- Open / Close helpers ---- */
function openPanel(el)  { el.classList.add('open');  overlay.classList.add('active');  document.body.style.overflow = 'hidden'; }
function closeAllPanels(){ 
  panel.classList.remove('open');
  pptxPanel.classList.remove('open');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

openBtn.addEventListener('click',     () => { closeAllPanels(); openPanel(panel); });
closeBtn.addEventListener('click',    closeAllPanels);
openPptxBtn.addEventListener('click', () => { closeAllPanels(); openPanel(pptxPanel); });
closePptxBtn.addEventListener('click',closeAllPanels);
overlay.addEventListener('click',     closeAllPanels);

/* ---- VIDEO: Drag & Drop ---- */
dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', ()  => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', e => {
  e.preventDefault(); dropZone.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('video/')) handleVideoFile(file);
});
fileInput.addEventListener('change', () => { if (fileInput.files[0]) handleVideoFile(fileInput.files[0]); });

function handleVideoFile(file) {
  uploadedFile = file;
  dropZone.querySelector('.drop-text').textContent = `✓ ${file.name}`;
  dropZone.style.borderColor = '#1b5e20'; dropZone.style.background = 'rgba(27,94,32,0.05)';
}

/* ---- PPTX: Drag & Drop ---- */
pptxDropZone.addEventListener('dragover', e => { e.preventDefault(); pptxDropZone.classList.add('dragover'); });
pptxDropZone.addEventListener('dragleave', ()  => pptxDropZone.classList.remove('dragover'));
pptxDropZone.addEventListener('drop', e => {
  e.preventDefault(); pptxDropZone.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) handlePptxFile(file);
});
pptxInput.addEventListener('change', () => { if (pptxInput.files[0]) handlePptxFile(pptxInput.files[0]); });

function handlePptxFile(file) {
  uploadedPptx = file;
  pptxDropZone.querySelector('.drop-text').textContent = `✓ ${file.name}`;
  pptxDropZone.style.borderColor = '#c05621'; pptxDropZone.style.background = 'rgba(192,86,33,0.05)';
}

/* ---- VIDEO Submit ---- */
submitBtn.addEventListener('click', () => {
  const title  = document.getElementById('videoTitle').value.trim();
  const desc   = document.getElementById('videoDesc').value.trim();
  const author = document.getElementById('videoAuthor').value.trim();
  if (!title)  { shake(document.getElementById('videoTitle'));  return; }
  if (!author) { shake(document.getElementById('videoAuthor')); return; }
  addVideoCard({ title, desc, author, file: uploadedFile });
  closeAllPanels(); resetVideoForm();
  showToast('Video đã được đăng thành công!');
});

/* ---- PPTX Submit ---- */
submitPptxBtn.addEventListener('click', () => {
  const title   = document.getElementById('pptxTitle').value.trim();
  const subject = document.getElementById('pptxSubject').value;
  const desc    = document.getElementById('pptxDesc').value.trim();
  const author  = document.getElementById('pptxAuthor').value.trim();
  if (!title)  { shake(document.getElementById('pptxTitle'));  return; }
  if (!author) { shake(document.getElementById('pptxAuthor')); return; }
  addPptxCard({ title, subject: subject || 'Khác', desc, author, file: uploadedPptx });
  closeAllPanels(); resetPptxForm();
  showToast('PowerPoint đã được đăng thành công!');
});

/* ---- VIDEO Card ---- */
const GRADIENTS = [
  'linear-gradient(135deg,#1a237e,#3f51b5)',
  'linear-gradient(135deg,#004d40,#00897b)',
  'linear-gradient(135deg,#4a148c,#9c27b0)',
  'linear-gradient(135deg,#bf360c,#f4511e)',
  'linear-gradient(135deg,#0d47a1,#1976d2)',
  'linear-gradient(135deg,#33691e,#8bc34a)',
];
let gradIdx = 0;

function addVideoCard({ title, desc, author, file }) {
  const card = document.createElement('div');
  card.className = 'video-card new-card';
  const today = new Date().toLocaleDateString('vi-VN');
  const grad  = GRADIENTS[gradIdx++ % GRADIENTS.length];
  let videoHTML = '';
  if (file) { const src = URL.createObjectURL(file); videoHTML = `<video class="card-video" controls src="${src}"></video>`; }

  card.innerHTML = `
    <div class="card-thumb" style="background:${grad}">
      <span class="card-play">▶</span>
      <span class="card-duration">--:--</span>
      ${videoHTML}
    </div>
    <div class="card-body">
      <span class="card-category">Mới đăng</span>
      <h4 class="card-title">${escHtml(title)}</h4>
      ${desc ? `<p style="font-size:.8rem;color:var(--text-muted);margin-bottom:.6rem;line-height:1.5">${escHtml(desc)}</p>` : ''}
      <div class="card-meta">
        <span class="card-author">
          <svg viewBox="0 0 20 20" fill="currentColor" width="14"><path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 1114 0H3z"/></svg>
          ${escHtml(author)}
        </span>
        <span class="card-date">${today}</span>
      </div>
    </div>`;

  const thumb = card.querySelector('.card-thumb');
  const video = card.querySelector('.card-video');
  const playIcon = card.querySelector('.card-play');
  if (video) {
    thumb.addEventListener('click', () => {
      if (video.style.display === 'block') { video.pause(); video.style.display = 'none'; playIcon.style.display = 'flex'; }
      else { video.style.display = 'block'; playIcon.style.display = 'none'; video.play(); }
    });
  }
  videoGrid.prepend(card);
  requestAnimationFrame(() => card.style.animation = 'fadeUp 0.45s ease both');
}

/* ---- PPTX Card ---- */
const PPTX_GRADS = [
  'linear-gradient(135deg,#c05621,#ed8936)',
  'linear-gradient(135deg,#2c5282,#4299e1)',
  'linear-gradient(135deg,#276749,#48bb78)',
  'linear-gradient(135deg,#744210,#d69e2e)',
  'linear-gradient(135deg,#702459,#d53f8c)',
  'linear-gradient(135deg,#2d3748,#718096)',
];
let pptxGradIdx = 0;

function addPptxCard({ title, subject, desc, author, file }) {
  const card = document.createElement('div');
  card.className = 'pptx-card new-card';
  const today = new Date().toLocaleDateString('vi-VN');
  const grad  = PPTX_GRADS[pptxGradIdx++ % PPTX_GRADS.length];
  const downloadHref = file ? URL.createObjectURL(file) : '#';
  const downloadName = file ? file.name : '';

  card.innerHTML = `
    <div class="pptx-thumb" style="background:${grad}">
      <div class="pptx-preview-icon">
        <svg viewBox="0 0 48 48" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="1.6" width="52" height="52">
          <rect x="6" y="4" width="36" height="40" rx="3"/>
          <rect x="12" y="14" width="14" height="16" rx="2"/>
          <line x1="28" y1="16" x2="36" y2="16"/>
          <line x1="28" y1="21" x2="34" y2="21"/>
          <line x1="12" y1="36" x2="36" y2="36"/>
        </svg>
      </div>
      <span class="pptx-slides-badge">Mới đăng</span>
    </div>
    <div class="pptx-body">
      <span class="pptx-category-tag">${escHtml(subject)}</span>
      <h4 class="pptx-card-title">${escHtml(title)}</h4>
      ${desc ? `<p style="font-size:.8rem;color:var(--text-muted);margin-bottom:.6rem;line-height:1.5">${escHtml(desc)}</p>` : ''}
      <div class="pptx-meta">
        <span class="card-author">
          <svg viewBox="0 0 20 20" fill="currentColor" width="13"><path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 1114 0H3z"/></svg>
          ${escHtml(author)}
        </span>
        <a class="pptx-download" href="${downloadHref}" download="${downloadName}">
          <svg viewBox="0 0 20 20" fill="currentColor" width="14"><path d="M13 8V2H7v6H3l7 7 7-7h-4zm-7 8v2h8v-2H6z"/></svg>
          Tải xuống
        </a>
      </div>
    </div>`;

  pptxGrid.prepend(card);
  requestAnimationFrame(() => card.style.animation = 'fadeUp 0.45s ease both');
}

/* ---- Reset Forms ---- */
function resetVideoForm() {
  ['videoTitle','videoDesc','videoAuthor'].forEach(id => document.getElementById(id).value = '');
  fileInput.value = ''; uploadedFile = null;
  dropZone.querySelector('.drop-text').textContent = 'Kéo thả video vào đây';
  dropZone.style.borderColor = ''; dropZone.style.background = '';
}
function resetPptxForm() {
  ['pptxTitle','pptxDesc','pptxAuthor'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('pptxSubject').value = '';
  pptxInput.value = ''; uploadedPptx = null;
  pptxDropZone.querySelector('.drop-text').textContent = 'Kéo thả file PowerPoint vào đây';
  pptxDropZone.style.borderColor = ''; pptxDropZone.style.background = '';
}

/* ---- Toast ---- */
function showToast(msg) {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = '✓ ' + msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

/* ---- Shake (validation) ---- */
function shake(el) {
  el.style.animation = 'none'; el.offsetHeight;
  el.style.animation = 'shakeX 0.4s ease';
  el.style.borderColor = '#c62828';
  setTimeout(() => { el.style.animation = ''; el.style.borderColor = ''; }, 500);
}

/* ---- Feed tabs ---- */
document.querySelectorAll('.feed-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.feed-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

/* ---- Injected keyframes ---- */
const style = document.createElement('style');
style.textContent = `@keyframes shakeX {
  0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)}
  40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)}
}`;
document.head.appendChild(style);

/* ---- Escape HTML ---- */
function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

