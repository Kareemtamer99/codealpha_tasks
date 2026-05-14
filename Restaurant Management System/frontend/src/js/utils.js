/**
 * Toast notification system
 */
export function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

/**
 * Modal helpers
 */
export function openModal(title, bodyHTML) {
  const overlay = document.getElementById('modal-overlay');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');

  modalTitle.textContent = title;
  modalBody.innerHTML = bodyHTML;
  overlay.classList.remove('hidden');
}

export function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}

/**
 * Format currency
 */
export function formatCurrency(amount) {
  return `$${Number(amount).toFixed(2)}`;
}

/**
 * Format date
 */
export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get status badge HTML
 */
export function statusBadge(status) {
  const map = {
    pending: 'warning',
    preparing: 'info',
    ready: 'info',
    served: 'success',
    cancelled: 'danger',
    available: 'success',
    occupied: 'danger',
    reserved: 'warning',
  };
  const variant = map[status] || 'neutral';
  return `<span class="badge badge-${variant}">${status}</span>`;
}

/**
 * Get category emoji
 */
export function categoryEmoji(category) {
  const map = {
    appetizer: '🥗',
    main: '🥩',
    dessert: '🍰',
    drink: '🥤',
    side: '🍟',
  };
  return map[category] || '🍽️';
}
