import { initAuth, checkAuth, logout } from './auth.js';
import { initRouter } from './router.js';
import { closeModal } from './utils.js';

// ---- Theme Management ----
function initTheme() {
  const saved = localStorage.getItem('rms_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('rms_theme', next);
  });
}

// ---- Sidebar ----
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('sidebar-toggle');
  const closeBtn = document.getElementById('sidebar-toggle-close');

  toggleBtn?.addEventListener('click', () => sidebar.classList.toggle('open'));
  closeBtn?.addEventListener('click', () => sidebar.classList.remove('open'));

  // Close sidebar on nav click (mobile)
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => sidebar.classList.remove('open'));
  });
}

// ---- Modal close ----
function initModal() {
  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initAuth();
  initModal();

  if (checkAuth()) {
    initSidebar();
    initRouter();
  } else {
    // After login, init sidebar and router
    const observer = new MutationObserver(() => {
      if (!document.getElementById('app').classList.contains('hidden')) {
        initSidebar();
        initRouter();
        observer.disconnect();
      }
    });
    observer.observe(document.getElementById('app'), { attributes: true, attributeFilter: ['class'] });
  }

  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', logout);
});
