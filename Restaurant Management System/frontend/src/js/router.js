import { renderDashboard } from './dashboard.js';
import { renderMenu } from './menu.js';
import { renderOrders } from './orders.js';
import { renderTables } from './tables.js';
import { renderInventory } from './inventory.js';

const routes = {
  '/dashboard': { title: 'Dashboard', render: renderDashboard },
  '/menu': { title: 'Menu', render: renderMenu },
  '/orders': { title: 'Orders', render: renderOrders },
  '/tables': { title: 'Tables', render: renderTables },
  '/inventory': { title: 'Inventory', render: renderInventory },
};

export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

function handleRoute() {
  if (document.getElementById('app').classList.contains('hidden')) return;

  const hash = window.location.hash.replace('#', '') || '/dashboard';
  const route = routes[hash];

  if (!route) {
    window.location.hash = '#/dashboard';
    return;
  }

  // Update page title
  document.getElementById('page-title').textContent = route.title;

  // Update active nav link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === hash.replace('/', ''));
  });

  // Render the page
  route.render();
}

export function navigateTo(path) {
  window.location.hash = `#${path}`;
}
