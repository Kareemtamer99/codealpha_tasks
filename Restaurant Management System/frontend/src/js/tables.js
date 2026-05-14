import api from './api.js';
import { statusBadge, showToast, openModal, closeModal } from './utils.js';

let tables = [];

export async function renderTables() {
  const container = document.getElementById('page-content');
  container.innerHTML = '<div class="loading-container"><div class="spinner"></div></div>';
  try {
    const res = await api.get('/tables');
    tables = res.data;
    renderContent(container);
  } catch (error) {
    container.innerHTML = `<div class="empty-state"><p>${error.message}</p></div>`;
  }
}

function renderContent(container) {
  const user = JSON.parse(localStorage.getItem('rms_user') || '{}');
  const isAdmin = user.role === 'admin';

  container.innerHTML = `<div class="page-enter">
    <div class="section-header"><h2>Tables (${tables.length})</h2>
    ${isAdmin ? `<button class="btn btn-primary" id="add-table-btn">+ Add Table</button>` : ''}</div>
    <div class="tables-grid">${tables.map(t => `
      <div class="table-card ${t.status}">
        <div class="table-card-number">${t.number}</div>
        <div class="table-card-label">Table</div>
        <div class="table-card-capacity">👥 ${t.capacity} seats</div>
        <div class="table-card-status"><span class="status-dot ${t.status}"></span>${statusBadge(t.status)}</div>
        ${t.reservedBy ? `<div class="table-card-reserved-by">Reserved by: ${t.reservedBy}</div>` : ''}
        ${isAdmin ? `<div class="table-card-actions">
          ${t.status === 'available' ? `<button class="btn btn-warning btn-sm reserve-btn" data-id="${t._id}">Reserve</button>` : ''}
          ${t.status !== 'available' ? `<button class="btn btn-success btn-sm release-btn" data-id="${t._id}">Release</button>` : ''}
          <button class="btn btn-ghost btn-sm edit-table-btn" data-id="${t._id}">✏️</button>
        </div>` : ''}
      </div>`).join('')}
    </div></div>`;

  document.getElementById('add-table-btn')?.addEventListener('click', () => showTableModal());
  container.querySelectorAll('.reserve-btn').forEach(b => b.addEventListener('click', () => {
    openModal('Reserve Table', `<form id="reserve-form"><div class="form-group"><label>Reserved By</label>
    <input type="text" id="reserve-name" required/></div><button type="submit" class="btn btn-primary btn-full">Reserve</button></form>`);
    document.getElementById('reserve-form').addEventListener('submit', async e => {
      e.preventDefault();
      try { await api.put(`/tables/${b.dataset.id}/reserve`, { reservedBy: document.getElementById('reserve-name').value }); showToast('Table reserved','success'); closeModal(); renderTables(); } catch(err) { showToast(err.message,'error'); }
    });
  }));
  container.querySelectorAll('.release-btn').forEach(b => b.addEventListener('click', async () => {
    try { await api.put(`/tables/${b.dataset.id}/release`); showToast('Table released','success'); renderTables(); } catch(e) { showToast(e.message,'error'); }
  }));
  container.querySelectorAll('.edit-table-btn').forEach(b => b.addEventListener('click', () => {
    const t = tables.find(x=>x._id===b.dataset.id); if(t) showTableModal(t);
  }));
}

function showTableModal(table = null) {
  const isEdit = !!table;
  openModal(isEdit ? 'Edit Table' : 'Add Table', `<form id="table-form">
    <div class="form-row"><div class="form-group"><label>Number</label><input type="number" id="t-num" min="1" value="${table?.number||''}" required/></div>
    <div class="form-group"><label>Capacity</label><input type="number" id="t-cap" min="1" max="20" value="${table?.capacity||''}" required/></div></div>
    ${isEdit ? `<div class="form-group"><label>Status</label><select id="t-status">
    <option value="available" ${table.status==='available'?'selected':''}>Available</option>
    <option value="occupied" ${table.status==='occupied'?'selected':''}>Occupied</option>
    <option value="reserved" ${table.status==='reserved'?'selected':''}>Reserved</option></select></div>` : ''}
    <button type="submit" class="btn btn-primary btn-full mt-2">${isEdit?'Update':'Add'}</button></form>`);
  document.getElementById('table-form').addEventListener('submit', async e => {
    e.preventDefault();
    const data = { number: +document.getElementById('t-num').value, capacity: +document.getElementById('t-cap').value };
    if(isEdit) data.status = document.getElementById('t-status').value;
    try {
      if(isEdit) await api.put(`/tables/${table._id}`, data); else await api.post('/tables', data);
      showToast(isEdit?'Updated':'Added','success'); closeModal(); renderTables();
    } catch(e) { showToast(e.message,'error'); }
  });
}
