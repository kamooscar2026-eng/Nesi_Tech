// app.js - logic for NESI_Tech
// - renders the grid
// - navigation home <-> classe
// - modal payment simulation
// - storage in localStorage for "unlocked_<id>"

const classes = [
  { id: '3e', nom: '3e Collège', cat: 'Collège', icon: '📚', tag: 'dark', mat: ['Mathématiques 12 chapitres','Physique-Chimie 10 chap','SVT 8 chap','Français Dictées','Anglais Grammar','Histoire-Géo'] },
  { id: '1ereA', nom: '1ere A Littéraire', cat: 'Littéraire', icon: '📖', tag: '', mat: ['Littérature','Langue Française','Anglais','Histoire-Géo','Philosophie','Maths'] },
  { id: '1ereC', nom: '1ere C Scientifique', cat: 'Scientifique', icon: '⚛️', tag: '', mat: ['Maths','Physique','Chimie','SVT','Français','Anglais'] },
  { id: '1ereD', nom: '1ere D Scientifique', cat: 'Scientifique', icon: '🧪', tag: '', mat: ['Maths','Physique','Chimie','SVT','Français','Informatique'] },
  { id: '1ereE', nom: '1ere E Technique', cat: 'Technique', icon: '⚙️', tag: '', mat: ['Maths','Physique','Technologie','Dessin Tech','Français','Anglais'] },
  { id: 'TleA', nom: 'Tle A Littéraire', cat: 'Littéraire', icon: '🎓', tag: '', mat: ['Littérature','Philosophie','Histoire-Géo','Anglais','Maths Gén','Langue'] },
  { id: 'TleC', nom: 'Tle C Scientifique', cat: 'Scientifique', icon: '🔢', tag: '', mat: ['Maths Avancées','Physique','Chimie','SVT','Philo','Anglais'] },
  { id: 'TleD', nom: 'Tle D Scientifique', cat: 'Scientifique', icon: '🧬', tag: '', mat: ['Maths','Physique','Chimie','SVT Bio','Philo','Informatique'] },
  { id: 'TleE', nom: 'Tle E Technique', cat: 'Technique', icon: '🛠️', tag: '', mat: ['Maths','Physique Appliquée','Construction Meca','Automatisme','Français','Anglais Technique'] }
];

let actuelle = null;

const grid = document.getElementById('grid');
const matieresEl = document.getElementById('matieres');
const allCoursesBtn = document.getElementById('allCoursesBtn');
const unlockBtn = document.getElementById('unlockBtn');
const modal = document.getElementById('paymentModal');
const modalClose = modal && modal.querySelector('.modal-close');
const mockPayBtn = document.getElementById('mockPayBtn');
const modalCancel = document.getElementById('modalCancel');
const modalClassName = document.getElementById('modalClassName');

// helpers for localStorage keys
const unlockedKey = id => `unlocked_${id}`;

function isUnlocked(id) {
  try {
    return localStorage.getItem(unlockedKey(id)) === 'true';
  } catch (e) {
    return false;
  }
}

function setUnlocked(id, value = true) {
  try {
    localStorage.setItem(unlockedKey(id), value ? 'true' : 'false');
  } catch (e) {
    console.warn('localStorage non disponible', e);
  }
}

// Render grid once
function renderGrid() {
  if (!grid) return;
  grid.innerHTML = classes.map(c => {
    const tagClass = c.tag ? `tag ${c.tag}` : 'tag';
    const displayId = c.id.replace(/^1ere/, '1ere ');
    const unlocked = isUnlocked(c.id) ? `<span class="unlocked-badge">Débloqué</span>` : '';
    return `<div class="card" role="button" tabindex="0" data-id="${c.id}">
              <span class="${tagClass}">${c.id}</span>
              ${unlocked}
              <div class="icon">${c.icon}</div>
              <b>${displayId}</b>
              <small>${c.cat}</small>
            </div>`;
  }).join('');

  // attach events
  grid.querySelectorAll('.card').forEach(card => {
    const id = card.dataset.id;
    card.addEventListener('click', () => openClasse(id));
    card.addEventListener('keypress', (e) => { if (e.key === 'Enter') openClasse(id); });
  });
}

// Update badges on grid when unlocking
function refreshUnlockedBadges() {
  if (!grid) return;
  grid.querySelectorAll('.card').forEach(card => {
    const id = card.dataset.id;
    const existing = card.querySelector('.unlocked-badge');
    if (isUnlocked(id)) {
      if (!existing) {
        const span = document.createElement('span');
        span.className = 'unlocked-badge';
        span.textContent = 'Débloqué';
        card.appendChild(span);
      }
    } else {
      if (existing) existing.remove();
    }
  });

  // If viewing a classe page, update the unlock button text
  updateUnlockButton();
}

function updateUnlockButton() {
  if (!unlockBtn) return;
  if (actuelle && isUnlocked(actuelle.id)) {
    unlockBtn.textContent = 'Formation débloquée';
    unlockBtn.disabled = true;
    unlockBtn.classList.add('disabled');
  } else {
    unlockBtn.textContent = 'Débloquer maintenant → 1000F';
    unlockBtn.disabled = false;
    unlockBtn.classList.remove('disabled');
  }
}

function show(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('active');
    window.scrollTo(0, 0);
  }
}

function openClasse(id) {
  const found = classes.find(x => x.id === id);
  if (!found) {
    console.warn('Classe non trouvée:', id);
    show('home');
    return;
  }
  actuelle = found;
  const titreEl = document.getElementById('classeTitle');
  const subEl = document.getElementById('classeSub');
  const nameEl = document.getElementById('classeName');
  if (titreEl) titreEl.textContent = actuelle.nom || 'Classe';
  if (subEl) subEl.textContent = 'Programme officiel ' + (actuelle.cat || '') + ' • Cameroun';
  if (nameEl) nameEl.textContent = actuelle.nom || '';

  // matieres
  if (matieresEl) {
    matieresEl.innerHTML = (actuelle.mat || []).map(m => {
      const titre = m.split(' ')[0] || m;
      return `<div class="matiere"><div class="ic">📘</div><div><b>${titre}</b><br><small>${m}</small></div></div>`;
    }).join('');
  }

  // update modal class name
  if (modalClassName) modalClassName.textContent = actuelle.nom || '';

  updateUnlockButton();
  show('classe');
}

// Contact via WhatsApp (opens in new tab with noopener)
function contact(txt) {
  const m = `Bonjour NESI_Tech, je veux ${txt} à 1000F/mois`;
  const url = `https://wa.me/237680944328?text=${encodeURIComponent(m)}`;
  // create a link to ensure rel=noopener works
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  // append invisible, click and remove
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// Payment modal control
function openModal() {
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'false');
  // focus first actionable element if present
  const btn = modal.querySelector('button');
  if (btn) btn.focus();
}

function closeModal() {
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'true');
}

// simulate payment
function simulatePayment() {
  if (!actuelle) return;
  // simulate delay / processing if desired
  setUnlocked(actuelle.id, true);
  refreshUnlockedBadges();
  closeModal();
  // feedback to user
  try {
    alert(`Paiement simulé : la formation "${actuelle.nom}" est maintenant débloquée.`);
  } catch (e) {
    console.log('Paiement simulé : débloqué', actuelle.id);
  }
  updateUnlockButton();
}

// Button -> open modal (or alert if already unlocked)
function payerActuelle() {
  if (!actuelle) {
    alert("Veuillez d'abord choisir une formation.");
    return;
  }
  if (isUnlocked(actuelle.id)) {
    alert("Cette formation est déjà débloquée.");
    return;
  }
  openModal();
}

// resets (dev helper) : window.resetUnlocks()
function resetAllUnlocks() {
  classes.forEach(c => {
    try { localStorage.removeItem(unlockedKey(c.id)); } catch (e) {}
  });
  refreshUnlockedBadges();
  alert('Tous les états "débloqué" ont été réinitialisés.');
}

// Attach global helper for dev/testing
window.resetUnlocks = resetAllUnlocks;
window.openClasseById = openClasse; // small helper

// Events wiring
if (allCoursesBtn) {
  allCoursesBtn.addEventListener('click', () => contact('toutes les formations'));
}

if (unlockBtn) {
  unlockBtn.addEventListener('click', payerActuelle);
}

if (modalClose) {
  modalClose.addEventListener('click', closeModal);
}

if (modalCancel) {
  modalCancel.addEventListener('click', closeModal);
}

if (mockPayBtn) {
  mockPayBtn.addEventListener('click', simulatePayment);
}

// close modal on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal && modal.getAttribute('aria-hidden') === 'false') {
    closeModal();
  }
});

// Initialize
renderGrid();
refreshUnlockedBadges();
