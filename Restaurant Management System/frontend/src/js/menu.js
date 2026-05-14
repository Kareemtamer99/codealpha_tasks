import api from './api.js';
import { formatCurrency, categoryEmoji, showToast, openModal, closeModal } from './utils.js';

let menuItems = [];
let currentFilter = 'all';

export async function renderMenu() {
  const container = document.getElementById('page-content');
  container.innerHTML = '<div class="loading-container"><div class="spinner"></div></div>';

  try {
    const res = await api.get('/menu');
    menuItems = res.data;
    renderMenuContent(container);
  } catch (error) {
    container.innerHTML = `<div class="empty-state"><p>Failed to load menu: ${error.message}</p></div>`;
    showToast(error.message, 'error');
  }
}

function renderMenuContent(container) {
  const user = JSON.parse(localStorage.getItem('rms_user') || '{}');
  const isAdmin = user.role === 'admin';

  const filtered = currentFilter === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === currentFilter);

  container.innerHTML = `
    <div class="page-enter">
      <div class="section-header">
        <div class="filter-bar">
          <button class="filter-btn ${currentFilter === 'all' ? 'active' : ''}" data-filter="all">All</button>
          <button class="filter-btn ${currentFilter === 'appetizer' ? 'active' : ''}" data-filter="appetizer">🥗 Appetizers</button>
          <button class="filter-btn ${currentFilter === 'main' ? 'active' : ''}" data-filter="main">🥩 Main</button>
          <button class="filter-btn ${currentFilter === 'dessert' ? 'active' : ''}" data-filter="dessert">🍰 Desserts</button>
          <button class="filter-btn ${currentFilter === 'drink' ? 'active' : ''}" data-filter="drink">🥤 Drinks</button>
          <button class="filter-btn ${currentFilter === 'side' ? 'active' : ''}" data-filter="side">🍟 Sides</button>
        </div>
        ${isAdmin ? `<button class="btn btn-primary" id="add-menu-btn">+ Add Item</button>` : ''}
      </div>

      ${filtered.length > 0 ? `
        <div class="menu-grid">
          ${filtered.map(item => `
            <div class="menu-card" data-id="${item._id}">
              <div class="menu-card-image ${item.category}">
                <span class="menu-emoji-map">${categoryEmoji(item.category)}</span>
                ${!item.available ? '<span class="menu-card-unavailable badge badge-danger">Unavailable</span>' : ''}
              </div>
              <div class="menu-card-body">
                <div class="menu-card-category">${item.category}</div>
                <div class="menu-card-name">${item.name}</div>
                <div class="menu-card-desc">${item.description || 'No description'}</div>
                <div class="menu-card-footer">
                  <span class="menu-card-price">${formatCurrency(item.price)}</span>
                  ${isAdmin ? `<div class="menu-card-actions">
                    <button class="btn btn-ghost btn-sm edit-menu-btn" data-id="${item._id}" title="Edit">✏️</button>
                    <button class="btn btn-ghost btn-sm delete-menu-btn" data-id="${item._id}" title="Delete">🗑️</button>
                  </div>` : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : '<div class="empty-state"><p>No menu items found</p></div>'}
    </div>
  `;

  // Event listeners
  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.filter;
      renderMenuContent(container);
    });
  });

  document.getElementById('add-menu-btn')?.addEventListener('click', () => showMenuModal());

  container.querySelectorAll('.edit-menu-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = menuItems.find(i => i._id === btn.dataset.id);
      if (item) showMenuModal(item);
    });
  });

  container.querySelectorAll('.delete-menu-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (!confirm('Delete this menu item?')) return;
      try {
        await api.delete(`/menu/${btn.dataset.id}`);
        showToast('Menu item deleted', 'success');
        renderMenu();
      } catch (error) {
        showToast(error.message, 'error');
      }
    });
  });
}

function showMenuModal(item = null) {
  const isEdit = !!item;
  openModal(isEdit ? 'Edit Menu Item' : 'Add Menu Item', `
    <form id="menu-form">
      <div class="form-group">
        <label for="menu-name">Name</label>
        <input type="text" id="menu-name" value="${item?.name || ''}" required />
      </div>
      <div class="form-group">
        <label for="menu-desc">Description</label>
        <textarea id="menu-desc" rows="2">${item?.description || ''}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="menu-price">Price ($)</label>
          <input type="number" id="menu-price" step="0.01" min="0" value="${item?.price || ''}" required />
        </div>
        <div class="form-group">
          <label for="menu-category">Category</label>
          <select id="menu-category" required>
            <option value="appetizer" ${item?.category === 'appetizer' ? 'selected' : ''}>Appetizer</option>
            <option value="main" ${item?.category === 'main' ? 'selected' : ''}>Main</option>
            <option value="dessert" ${item?.category === 'dessert' ? 'selected' : ''}>Dessert</option>
            <option value="drink" ${item?.category === 'drink' ? 'selected' : ''}>Drink</option>
            <option value="side" ${item?.category === 'side' ? 'selected' : ''}>Side</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label>
          <input type="checkbox" id="menu-available" ${item?.available !== false ? 'checked' : ''} />
          Available
        </label>
      </div>
      <button type="submit" class="btn btn-primary btn-full mt-2">${isEdit ? 'Update Item' : 'Add Item'}</button>
    </form>
  `);

  document.getElementById('menu-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      name: document.getElementById('menu-name').value,
      description: document.getElementById('menu-desc').value,
      price: parseFloat(document.getElementById('menu-price').value),
      category: document.getElementById('menu-category').value,
      available: document.getElementById('menu-available').checked,
    };

    try {
      if (isEdit) {
        await api.put(`/menu/${item._id}`, data);
        showToast('Menu item updated', 'success');
      } else {
        await api.post('/menu', data);
        showToast('Menu item added', 'success');
      }
      closeModal();
      renderMenu();
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
}
