/**
 * NoteHive Core App Router & SPA Controller
 */

class Router {
  constructor() {
    this.currentRoute = 'welcome';
    this.currentParams = {};
    this.historyStack = [];
  }

  navigate(route, params = {}, isBack = false) {
    if (!isBack && this.currentRoute) {
      const last = this.historyStack[this.historyStack.length - 1];
      if (!last || last.route !== this.currentRoute || JSON.stringify(last.params) !== JSON.stringify(this.currentParams)) {
        this.historyStack.push({
          route: this.currentRoute,
          params: { ...this.currentParams }
        });
      }
    }

    this.currentRoute = route;
    this.currentParams = params;

    if (!isBack && window.history && route !== 'welcome') {
      window.history.pushState({ route, params }, '', '#' + route);
    }

    this.renderCurrentView();
    window.scrollTo(0, 0);
  }

  goBack() {
    if (this.historyStack.length > 0) {
      const previous = this.historyStack.pop();
      if (previous.route === 'welcome') {
        this.navigate('home', {}, true);
      } else {
        this.navigate(previous.route, previous.params, true);
      }
    } else {
      if (this.currentRoute === 'subjectDetail') {
        this.navigate('department', {}, true);
      } else if (this.currentRoute === 'subjects') {
        this.navigate('department', {}, true);
      } else {
        this.navigate('home', {}, true);
      }
    }
  }

  renderCurrentView() {
    const mainContainer = document.getElementById('app-main-content');
    if (!mainContainer) return;

    // Update bottom nav active state & header back button
    this.updateBottomNav();
    this.updateBackButton();

    // Toggle Shell Headers & Nav Visibility
    const header = document.getElementById('app-header');
    const bottomNav = document.getElementById('app-bottom-nav');
    const fab = document.getElementById('app-fab');

    if (this.currentRoute === 'welcome') {
      if (header) header.style.display = 'none';
      if (bottomNav) bottomNav.style.display = 'none';
      if (fab) fab.style.display = 'none';
      window.renderWelcomeView(mainContainer);
    } else {
      if (header) header.style.display = 'block';
      if (bottomNav) bottomNav.style.display = 'block';
      if (fab) fab.style.display = 'flex';

      switch (this.currentRoute) {
        case 'home':
          window.renderHomeView(mainContainer, this.currentParams);
          break;
        case 'department':
          window.renderDepartmentView(mainContainer, this.currentParams);
          break;
        case 'subjects':
          window.renderSubjectsView(mainContainer, this.currentParams);
          break;
        case 'subjectDetail':
          window.renderSubjectDetailView(mainContainer, this.currentParams);
          break;
        case 'leaderboard':
          window.renderLeaderboardView(mainContainer, this.currentParams);
          break;
        case 'profile':
          window.renderProfileView(mainContainer, this.currentParams);
          break;
        case 'moderation':
          window.renderModerationView(mainContainer, this.currentParams);
          break;
        default:
          window.renderHomeView(mainContainer, this.currentParams);
      }
    }

    this.updateNotificationBadge();
  }

  updateBackButton() {
    const backBtn = document.getElementById('header-back-btn');
    if (backBtn) {
      if (this.currentRoute !== 'welcome' && (this.historyStack.length > 0 || this.currentRoute !== 'home')) {
        backBtn.style.display = 'flex';
      } else {
        backBtn.style.display = 'none';
      }
    }
  }

  updateBottomNav() {
    const navLinks = document.querySelectorAll('.app-nav-item');
    navLinks.forEach(link => {
      const target = link.getAttribute('data-route');
      if (target === this.currentRoute) {
        link.className = "app-nav-item flex flex-col items-center justify-center gap-0.5 px-3 py-1 border-4 border-black bg-primary-container shadow-none translate-x-1 translate-y-1 transition-all";
      } else {
        link.className = "app-nav-item flex flex-col items-center justify-center gap-0.5 px-3 py-1 border-4 border-black bg-white neo-shadow-sm transition-all";
      }
    });
  }

  updateNotificationBadge() {
    const unreadCount = window.store.getUnreadNotificationCount();
    const badge = document.getElementById('header-notif-badge');
    if (badge) {
      if (unreadCount > 0) {
        badge.innerText = unreadCount > 9 ? '9+' : unreadCount;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    }
  }
}

window.router = new Router();

// Toast helper
window.showToast = function(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = "toast-animate bg-primary-container neo-border neo-shadow px-4 py-3 text-xs font-label-bold uppercase text-on-surface flex items-center gap-2 pointer-events-auto max-w-xs w-full";
  toast.innerHTML = `
    <span class="material-symbols-outlined text-sm">notifications_active</span>
    <span class="flex-1">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// Initialize App on DOM Loaded
document.addEventListener('DOMContentLoaded', () => {
  // Back Button Navigation
  const backBtn = document.getElementById('header-back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.router.goBack();
    });
  }

  // Handle browser back/forward buttons
  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.route) {
      window.router.navigate(e.state.route, e.state.params || {}, true);
    } else {
      window.router.goBack();
    }
  });

  // Bottom Nav Navigation
  document.querySelectorAll('.app-nav-item').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const route = link.getAttribute('data-route');
      window.router.navigate(route);
    });
  });

  // Floating Action Button (+) Composer Trigger
  const fab = document.getElementById('app-fab');
  if (fab) {
    fab.addEventListener('click', () => {
      const activeSubjectId = window.router.currentParams.subjectId || null;
      window.renderComposerModal(activeSubjectId);
    });
  }

  // Header Notification Bell
  const notifBtn = document.getElementById('header-notif-btn');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      window.renderNotificationDrawer();
    });
  }

  // Header Profile Icon
  const profileBtn = document.getElementById('header-profile-btn');
  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      window.router.navigate('profile');
    });
  }

  // Subscribe to state updates for automatic re-renders
  window.store.subscribe(() => {
    window.router.updateNotificationBadge();
  });

  // Render initial route
  window.router.navigate('welcome');
});
