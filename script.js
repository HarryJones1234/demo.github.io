/* ============================================================
   script.js – Phường Hạ Long
   ============================================================ */

const openBtn    = document.getElementById('openUpload');
const closeBtn   = document.getElementById('closePanel');
const panel      = document.getElementById('uploadPanel');
const overlay    = document.getElementById('overlay');
const dropZone   = document.getElementById('dropZone');
const fileInput  = document.getElementById('fileInput');
const submitBtn  = document.getElementById('submitVideo');
const videoGrid  = document.getElementById('videoGrid');

let uploadedFile = null;

/* ---- Open / Close Panel ---- */
function openPanel()  { panel.classList.add('open'); overlay.classList.add('active'); document.body.style.overflow = 'hidden'; }
function closePanel() { panel.classList.remove('open'); overlay.classList.remove('active'); document.body.style.overflow = ''; }

openBtn.addEventListener('click', openPanel);
closeBtn.addEventListener('click', closePanel);
overlay.addEventListener('click', closePanel);

/* ---- Drag & Drop ---- */
dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', ()  => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('video/')) handleFile(file);
});

fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) handleFile(fileInput.files[0]);
});

function handleFile(file) {
  uploadedFile = file;
  dropZone.querySelector('.drop-text').textContent = `✓ ${file.name}`;
  dropZone.style.borderColor = '#1b5e20';
  dropZone.style.background  = 'rgba(27,94,32,0.05)';
}

/* ---- Submit ---- */
submitBtn.addEventListener('click', () => {
  const title  = document.getElementById('videoTitle').value.trim();
  const desc   = document.getElementById('videoDesc').value.trim();
  const author = document.getElementById('videoAuthor').value.trim();

  if (!title)  { shake(document.getElementById('videoTitle'));  return; }
  if (!author) { shake(document.getElementById('videoAuthor')); return; }

  addVideoCard({ title, desc, author, file: uploadedFile });
  closePanel();
  resetForm();
  showToast('Video đã được đăng thành công!');
});

/* ---- Create Card ---- */
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
  const card    = document.createElement('div');
  card.className = 'video-card new-card';

  const today   = new Date().toLocaleDateString('vi-VN');
  const grad    = GRADIENTS[gradIdx++ % GRADIENTS.length];
  const duration = '--:--';

  let videoHTML = '';
  if (file) {
    const src = URL.createObjectURL(file);
    videoHTML = `<video class="card-video" controls src="${src}"></video>`;
  }

  card.innerHTML = `
    <div class="card-thumb" style="background:${grad}">
      <span class="card-play">▶</span>
      <span class="card-duration">${duration}</span>
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
    </div>
  `;

  /* Play button shows video */
  const thumb = card.querySelector('.card-thumb');
  const video = card.querySelector('.card-video');
  const playIcon = card.querySelector('.card-play');

  if (video) {
    thumb.addEventListener('click', () => {
      if (video.style.display === 'block') {
        video.pause(); video.style.display = 'none'; playIcon.style.display = 'flex';
      } else {
        video.style.display = 'block'; playIcon.style.display = 'none'; video.play();
      }
    });
  }

  videoGrid.prepend(card);
  /* Trigger animation */
  requestAnimationFrame(() => card.style.animation = 'fadeUp 0.45s ease both');
}

/* ---- Reset Form ---- */
function resetForm() {
  document.getElementById('videoTitle').value  = '';
  document.getElementById('videoDesc').value   = '';
  document.getElementById('videoAuthor').value = '';
  fileInput.value = '';
  uploadedFile = null;
  dropZone.querySelector('.drop-text').textContent = 'Kéo thả video vào đây';
  dropZone.style.borderColor = '';
  dropZone.style.background  = '';
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
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = 'shakeX 0.4s ease';
  el.style.borderColor = '#c62828';
  setTimeout(() => { el.style.animation = ''; el.style.borderColor = ''; }, 500);
}

/* ---- Feed tabs (UI only) ---- */
document.querySelectorAll('.feed-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.feed-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

/* ---- Shake keyframes (injected) ---- */
const style = document.createElement('style');
style.textContent = `@keyframes shakeX {
  0%,100%{transform:translateX(0)}
  20%{transform:translateX(-6px)}
  40%{transform:translateX(6px)}
  60%{transform:translateX(-4px)}
  80%{transform:translateX(4px)}
}`;
document.head.appendChild(style);

/* ---- Escape HTML ---- */
function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
