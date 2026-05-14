import api from './api.js';
import { formatCurrency, formatDate, statusBadge, showToast, openModal, closeModal } from './utils.js';

let orders = [];
let menuItems = [];

export async function renderOrders() {
  const container = document.getElementById('page-content');
  container.innerHTML = '<div class="loading-container"><div class="spinner"></div></div>';
  try {
    const [ordersRes, menuRes] = await Promise.all([api.get('/orders'), api.get('/menu')]);
    orders = ordersRes.data;
    menuItems = menuRes.data.filter(i => i.available);
    renderContent(container);
  } catch (error) {
    container.innerHTML = `<div class="empty-state"><p>${error.message}</p></div>`;
  }
}

function renderContent(container) {
  const user = JSON.parse(localStorage.getItem('rms_user') || '{}');
  const isAdmin = user.role === 'admin';

  container.innerHTML = `<div class="page-enter">
    <div class="section-header"><h2>Orders (${orders.length})</h2>
    <button class="btn btn-primary" id="create-order-btn">+ New Order</button></div>
    ${orders.length > 0 ? `<div class="orders-table-wrapper"><table class="data-table">
    <thead><tr><th>Customer</th><th>Table</th><th>Items</th><th>Total</th><th>Status</th><th>Time</th><th>Actions</th></tr></thead>
    <tbody>${orders.map(o => `<tr>
      <td><strong>${o.customerName}</strong></td><td>#${o.tableNumber}</td>
      <td><div class="order-items-list">${o.items.map(i => `${i.quantity}× ${i.name}`).join(', ')}</div></td>
      <td><strong>${formatCurrency(o.totalPrice)}</strong></td><td>${statusBadge(o.status)}</td>
      <td style="white-space:nowrap;color:var(--text-muted);font-size:var(--font-sm)">${formatDate(o.createdAt)}</td>
      <td><div class="order-status-actions">${getStatusBtns(o)}
      ${isAdmin ? `<button class="btn btn-ghost btn-sm del-order" data-id="${o._id}">🗑️</button>` : ''}</div></td>
    </tr>`).join('')}</tbody></table></div>` : '<div class="empty-state"><p>No orders yet</p></div>'}
  </div>`;

  document.getElementById('create-order-btn')?.addEventListener('click', showOrderModal);
  container.querySelectorAll('.status-btn').forEach(b => b.addEventListener('click', async () => {
    try { await api.put(`/orders/${b.dataset.id}/status`, { status: b.dataset.status }); showToast('Updated','success'); renderOrders(); } catch(e) { showToast(e.message,'error'); }
  }));
  container.querySelectorAll('.del-order').forEach(b => b.addEventListener('click', async () => {
    if(!confirm('Delete?')) return;
    try { await api.delete(`/orders/${b.dataset.id}`); showToast('Deleted','success'); renderOrders(); } catch(e) { showToast(e.message,'error'); }
  }));
}

function getStatusBtns(order) {
  const t = { pending:['preparing','cancelled'], preparing:['ready','cancelled'], ready:['served','cancelled'], served:[], cancelled:[] };
  return (t[order.status]||[]).map(s => `<button class="order-status-btn ${s} status-btn" data-id="${order._id}" data-status="${s}">${s}</button>`).join('');
}

function showOrderModal() {
  let items = [{ menuItemId:'', quantity:1 }];
  const render = () => {
    const total = items.reduce((s,oi) => { const m = menuItems.find(x=>x._id===oi.menuItemId); return s+(m?m.price*oi.quantity:0); },0);
    openModal('New Order', `<form id="order-form">
      <div class="form-row"><div class="form-group"><label>Customer</label><input type="text" id="o-cust" value="Walk-in" required/></div>
      <div class="form-group"><label>Table #</label><input type="number" id="o-table" min="1" required/></div></div>
      <label style="font-size:var(--font-sm);font-weight:500;color:var(--text-secondary);margin-bottom:8px;display:block">Items</label>
      <div id="oi-c">${items.map((oi,i) => `<div class="order-item-row">
        <div class="form-group" style="margin-bottom:0"><select class="oi-sel" data-i="${i}" required><option value="">Select...</option>
        ${menuItems.map(m=>`<option value="${m._id}" ${oi.menuItemId===m._id?'selected':''}>${m.name} (${formatCurrency(m.price)})</option>`).join('')}</select></div>
        <div class="form-group" style="margin-bottom:0"><input type="number" class="oi-qty" data-i="${i}" min="1" value="${oi.quantity}"/></div>
        <button type="button" class="remove-item-btn" data-i="${i}"${items.length<=1?' disabled':''}>×</button></div>`).join('')}</div>
      <button type="button" class="add-item-btn" id="add-oi">+ Add Item</button>
      <div class="order-total">Total: ${formatCurrency(total)}</div>
      <div class="form-group"><label>Notes</label><textarea id="o-notes" rows="2"></textarea></div>
      <button type="submit" class="btn btn-primary btn-full">Place Order</button></form>`);
    document.querySelectorAll('.oi-sel').forEach(s => s.addEventListener('change', () => { items[+s.dataset.i].menuItemId=s.value; render(); }));
    document.querySelectorAll('.oi-qty').forEach(s => s.addEventListener('input', () => { items[+s.dataset.i].quantity=+s.value||1; render(); }));
    document.querySelectorAll('.remove-item-btn').forEach(b => b.addEventListener('click', () => { items.splice(+b.dataset.i,1); render(); }));
    document.getElementById('add-oi')?.addEventListener('click', () => { items.push({menuItemId:'',quantity:1}); render(); });
    document.getElementById('order-form')?.addEventListener('submit', async e => {
      e.preventDefault();
      const its = items.filter(oi=>oi.menuItemId).map(oi => { const m=menuItems.find(x=>x._id===oi.menuItemId); return {menuItem:m._id,name:m.name,price:m.price,quantity:oi.quantity}; });
      if(!its.length){ showToast('Add items','warning'); return; }
      try { await api.post('/orders',{items:its,customerName:document.getElementById('o-cust').value,tableNumber:+document.getElementById('o-table').value,notes:document.getElementById('o-notes').value}); showToast('Order placed!','success'); closeModal(); renderOrders(); } catch(e){ showToast(e.message,'error'); }
    });
  };
  render();
}
