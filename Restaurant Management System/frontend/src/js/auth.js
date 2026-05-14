import api from './api.js';
import { showToast } from './utils.js';

export function initAuth() {
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.textContent = '';

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('login-btn');

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner" style="width:20px;height:20px;border-width:2px;"></span>';

    try {
      const res = await api.post('/auth/login', { email, password });
      api.setToken(res.data.token);
      localStorage.setItem('rms_user', JSON.stringify(res.data.user));

      // Update user display
      document.getElementById('user-name').textContent = res.data.user.name;
      document.getElementById('user-role').textContent = res.data.user.role;

      // Show app, hide login
      document.getElementById('auth-screen').classList.add('hidden');
      document.getElementById('app').classList.remove('hidden');

      // Navigate to dashboard
      window.location.hash = '#/dashboard';
      showToast(`Welcome back, ${res.data.user.name}!`, 'success');
    } catch (error) {
      loginError.textContent = error.message;
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<span>Sign In</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
    }
  });
}

export function checkAuth() {
  const token = api.getToken();
  const user = JSON.parse(localStorage.getItem('rms_user') || 'null');

  if (token && user) {
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-role').textContent = user.role;
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    return true;
  }
  return false;
}

export function logout() {
  api.setToken(null);
  localStorage.removeItem('rms_user');
  document.getElementById('app').classList.add('hidden');
  document.getElementById('auth-screen').classList.remove('hidden');
  document.getElementById('login-form').reset();
  document.getElementById('login-error').textContent = '';
  window.location.hash = '';
  showToast('Logged out successfully', 'info');
}
