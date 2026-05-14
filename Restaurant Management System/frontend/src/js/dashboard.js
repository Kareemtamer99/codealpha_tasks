import api from './api.js';
import { formatCurrency, formatDate, statusBadge, showToast } from './utils.js';

export async function renderDashboard() {
  const container = document.getElementById('page-content');
  container.innerHTML = '<div class="loading-container"><div class="spinner"></div></div>';

  try {
    const res = await api.get('/dashboard/stats');
    const stats = res.data;

    container.innerHTML = `
      <div class="page-enter">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-card-header">
              <span class="stat-card-title">Today's Orders</span>
              <span class="stat-card-icon">📋</span>
            </div>
            <div class="stat-card-value">${stats.todayOrders}</div>
            <div class="stat-card-sub">${stats.pendingOrders} pending</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-header">
              <span class="stat-card-title">Revenue</span>
              <span class="stat-card-icon">💰</span>
            </div>
            <div class="stat-card-value">${formatCurrency(stats.totalRevenue)}</div>
            <div class="stat-card-sub">Today's earnings</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-header">
              <span class="stat-card-title">Active Tables</span>
              <span class="stat-card-icon">🪑</span>
            </div>
            <div class="stat-card-value">${stats.activeTables}/${stats.totalTables}</div>
            <div class="stat-card-sub">${stats.totalTables - stats.activeTables} available</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-header">
              <span class="stat-card-title">Low Stock</span>
              <span class="stat-card-icon">⚠️</span>
            </div>
            <div class="stat-card-value">${stats.lowStockItems}</div>
            <div class="stat-card-sub">Items need restocking</div>
          </div>
        </div>

        <div class="dashboard-grid">
          <div class="dashboard-section">
            <div class="dashboard-section-title">📝 Recent Orders</div>
            ${stats.recentOrders.length > 0 ? stats.recentOrders.map(order => `
              <div class="recent-order-item">
                <div class="recent-order-info">
                  <span class="recent-order-name">${order.customerName}</span>
                  <span class="recent-order-table">Table ${order.tableNumber} · ${formatDate(order.createdAt)}</span>
                </div>
                <div style="display:flex;align-items:center;gap:12px;">
                  ${statusBadge(order.status)}
                  <span class="recent-order-price">${formatCurrency(order.totalPrice)}</span>
                </div>
              </div>
            `).join('') : '<div class="empty-state"><p>No orders yet</p></div>'}
          </div>

          <div class="dashboard-section">
            <div class="dashboard-section-title">📊 Quick Stats</div>
            <div class="quick-stat">
              <span class="quick-stat-label">Menu Items</span>
              <span class="quick-stat-value">${stats.totalMenuItems}</span>
            </div>
            <div class="quick-stat">
              <span class="quick-stat-label">Total Tables</span>
              <span class="quick-stat-value">${stats.totalTables}</span>
            </div>
            <div class="quick-stat">
              <span class="quick-stat-label">Pending Orders</span>
              <span class="quick-stat-value" style="color:var(--warning)">${stats.pendingOrders}</span>
            </div>
            <div class="quick-stat">
              <span class="quick-stat-label">Low Stock Alerts</span>
              <span class="quick-stat-value" style="color:var(--danger)">${stats.lowStockItems}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    container.innerHTML = `<div class="empty-state"><p>Failed to load dashboard: ${error.message}</p></div>`;
    showToast(error.message, 'error');
  }
}
