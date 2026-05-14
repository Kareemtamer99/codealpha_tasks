import api from './api.js';
import { showToast, openModal, closeModal, formatDate } from './utils.js';

let items = [];

export async function renderInventory() {
  const container = document.getElementById('page-content');
  container.innerHTML = '<div class="loading-container"><div class="spinner"></div></div>';
  try {
    const res = await api.get('/inventory');
    items = res.data;
    renderContent(container);
  } catch (error) {
    container.innerHTML = `<div class="empty-state"><p>${error.message}</p></div>`;
  }
}

function renderContent(container) {
  const user = JSON.parse(localStorage.getItem('rms_user') || '{}');
  const isAdmin = user.role === 'admin';

  container.innerHTML = `<div class="page-enter">
    <div class="section-header"><h2>Inventory (${items.length})</h2>
    ${isAdmin ? `<button class="btn btn-primary" id="add-inv-btn">+ Add Item</button>` : ''}</div>
    ${items.length > 0 ? `<div class="inventory-table-wrapper"><table class="data-table">
    <thead><tr><th>Item</th><th>Quantity</th><th>Unit</th><th>Stock Level</th><th>Last Restocked</th>${isAdmin ? '<th>Actions</th>' : ''}</tr></thead>
    <tbody>${items.map(i => {
      const pct = Math.min((i.quantity / (i.lowStockThreshold * 4)) * 100, 100);
      const level = i.isLowStock ? 'low' : pct > 50 ? 'high' : 'medium';
      return `<tr class="${i.isLowStock ? 'low-stock-row' : ''}">
        <td><strong>${i.itemName}</strong>${i.isLowStock ? ' <span class="restock-badge">⚠ Low</span>' : ''}</td>
        <td>${i.quantity}</td><td>${i.unit}</td>
        <td><div class="stock-bar"><div class="stock-bar-fill ${level}" style="width:${pct}%"></div></div></td>
        <td style="color:var(--text-muted);font-size:var(--font-sm)">${formatDate(i.lastRestocked)}</td>
        ${isAdmin ? `<td><div class="flex gap-1">
          <button class="btn btn-ghost btn-sm edit-inv" data-id="${i._id}">✏️</button>
          <button class="btn btn-ghost btn-sm del-inv" data-id="${i._id}">🗑️</button>
        </div></td>` : ''}</tr>`;
    }).join('')}</tbody></table></div>` : '<div class="empty-state"><p>No inventory items</p></div>'}
  </div>`;

  document.getElementById('add-inv-btn')?.addEventListener('click', () => showInvModal());
  container.querySelectorAll('.edit-inv').forEach(b => b.addEventListener('click', () => {
    const i = items.find(x=>x._id===b.dataset.id); if(i) showInvModal(i);
  }));
  container.querySelectorAll('.del-inv').forEach(b => b.addEventListener('click', async () => {
    if(!confirm('Delete?')) return;
    try { await api.delete(`/inventory/${b.dataset.id}`); showToast('Deleted','success'); renderInventory(); } catch(e) { showToast(e.message,'error'); }
  }));
}

function showInvModal(item = null) {
  const isEdit = !!item;
  openModal(isEdit ? 'Edit Item' : 'Add Item', `<form id="inv-form">
    <div class="form-group"><label>Name</label><input type="text" id="inv-name" value="${item?.itemName||''}" required/></div>
    <div class="form-row">
      <div class="form-group"><label>Quantity</label><input type="number" id="inv-qty" min="0" value="${item?.quantity||''}" required/></div>
      <div class="form-group"><label>Unit</label><select id="inv-unit" required>
        ${['kg','g','L','ml','pcs','boxes','bags'].map(u=>`<option value="${u}" ${item?.unit===u?'selected':''}>${u}</option>`).join('')}
      </select></div></div>
    <div class="form-group"><label>Low Stock Threshold</label><input type="number" id="inv-thresh" min="0" value="${item?.lowStockThreshold||10}"/></div>
    <button type="submit" class="btn btn-primary btn-full mt-2">${isEdit?'Update':'Add'}</button></form>`);
  document.getElementById('inv-form').addEventListener('submit', async e => {
    e.preventDefault();
    const data = { itemName:document.getElementById('inv-name').value, quantity:+document.getElementById('inv-qty').value, unit:document.getElementById('inv-unit').value, lowStockThreshold:+document.getElementById('inv-thresh').value };
    if(!isEdit) data.lastRestocked = new Date();
    try {
      if(isEdit) await api.put(`/inventory/${item._id}`, data); else await api.post('/inventory', data);
      showToast(isEdit?'Updated':'Added','success'); closeModal(); renderInventory();
    } catch(e) { showToast(e.message,'error'); }
  });
}
