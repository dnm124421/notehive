/**
 * Profile View: Badges, Offline Saved Notes, Preferences, and Admin Access
 */

window.renderProfileView = function(container) {
  const currentUser = window.store.getCurrentUser();
  const offlineNotes = window.store.state.content.filter(c => currentUser.savedOfflineNoteIds.includes(c.id));
  const isDarkMode = document.documentElement.classList.contains('dark');

  container.innerHTML = `
    <div class="flex flex-col w-full min-h-screen bg-background pb-32 pt-20 px-4 max-w-md mx-auto">
      <!-- Profile Header Card -->
      <div class="bg-primary-container neo-border p-6 neo-shadow relative flex flex-col items-center text-center mb-6">
        <div class="absolute -top-3 right-4 bg-black text-white neo-border px-2 py-0.5 font-label-bold text-xs uppercase transform rotate-3">
          ${currentUser.role || 'Member'}
        </div>

        <div class="relative mb-3">
          <img class="w-20 h-20 object-cover border-4 border-black neo-shadow bg-white" src="${currentUser.avatarUrl}" />
          <div class="absolute -bottom-2 -right-2 bg-secondary-container neo-border p-1">
            <span class="material-symbols-outlined text-sm text-secondary">verified</span>
          </div>
        </div>

        <h1 class="font-headline-md text-2xl uppercase text-on-surface leading-none mb-1">${currentUser.name}</h1>
        <span class="font-label-bold text-xs uppercase px-2 py-0.5 bg-surface neo-border mb-3">${currentUser.department}</span>

        <div class="flex gap-4 border-t-3 border-on-surface pt-3 w-full justify-center border-dashed">
          <div>
            <span class="font-headline-md text-xl block leading-none">${currentUser.points.toLocaleString()}</span>
            <span class="font-label-sm text-[10px] uppercase text-on-surface-variant">Points</span>
          </div>
          <div class="border-r-2 border-on-surface"></div>
          <div>
            <span class="font-headline-md text-xl block leading-none">${currentUser.badges.length}</span>
            <span class="font-label-sm text-[10px] uppercase text-on-surface-variant">Badges</span>
          </div>
          <div class="border-r-2 border-on-surface"></div>
          <div>
            <span class="font-headline-md text-xl block leading-none">${offlineNotes.length}</span>
            <span class="font-label-sm text-[10px] uppercase text-on-surface-variant">Offline</span>
          </div>
        </div>
      </div>

      <!-- Admin Queue Button (If Admin) -->
      ${currentUser.role === 'Admin' ? `
        <button id="btn-open-moderation" class="w-full py-3 bg-tertiary-container neo-border neo-shadow neo-btn font-label-bold uppercase text-xs flex items-center justify-center gap-2 mb-6">
          <span class="material-symbols-outlined text-sm text-tertiary">admin_panel_settings</span>
          Admin Moderation & Join Queue (${window.store.getJoinRequests().filter(r => r.status === 'pending').length})
        </button>
      ` : ''}

      <!-- Earned Badges Section -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex items-center justify-between border-b-3 border-on-surface pb-1">
          <h2 class="font-headline-md text-lg uppercase text-on-surface">Contributor Badges</h2>
          <span class="font-label-sm text-xs text-on-surface-variant">Unlocked</span>
        </div>

        <div class="grid grid-cols-2 gap-2">
          ${currentUser.badges.map(badge => `
            <div class="bg-surface-container-lowest neo-border p-2.5 neo-shadow-sm flex items-center gap-2">
              <div class="w-8 h-8 bg-secondary-container neo-border flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined text-sm text-secondary">workspace_premium</span>
              </div>
              <span class="font-label-bold text-xs uppercase leading-tight truncate">${badge}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Offline Downloads Manager Section -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex items-center justify-between border-b-3 border-on-surface pb-1">
          <h2 class="font-headline-md text-lg uppercase text-on-surface">Offline Storage</h2>
          <span class="font-label-bold text-xs uppercase bg-black text-white px-2 py-0.5">${offlineNotes.length} Items</span>
        </div>

        ${offlineNotes.length === 0 ? `
          <div class="bg-surface-container neo-border p-4 text-center">
            <p class="font-body-md text-xs text-on-surface-variant">No notes saved offline yet. Tap the bookmark icon on any note to cache for offline reading.</p>
          </div>
        ` : offlineNotes.map(note => `
          <div class="bg-surface-container-lowest neo-border p-3 neo-shadow-sm flex items-center justify-between">
            <div class="min-w-0 pr-2">
              <h4 class="font-label-bold text-xs uppercase truncate">${note.title}</h4>
              <span class="font-label-sm text-[10px] text-on-surface-variant">Cached locally in IndexedDB</span>
            </div>
            <button data-content-id="${note.id}" class="btn-remove-offline w-8 h-8 bg-error text-white neo-border flex items-center justify-center neo-shadow-sm">
              <span class="material-symbols-outlined text-sm">delete</span>
            </button>
          </div>
        `).join('')}
      </div>

      <!-- Settings & Preferences -->
      <div class="flex flex-col gap-3">
        <div class="border-b-3 border-on-surface pb-1">
          <h2 class="font-headline-md text-lg uppercase text-on-surface">App Settings</h2>
        </div>

        <div class="bg-surface neo-border p-4 neo-shadow-sm flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-lg">dark_mode</span>
            <span class="font-label-bold text-xs uppercase">High-Contrast Dark Mode</span>
          </div>
          <button id="btn-toggle-dark-mode" class="w-12 h-6 neo-border ${isDarkMode ? 'bg-primary-container' : 'bg-surface-container'} relative transition-colors">
            <div class="w-4 h-4 bg-black absolute top-0.5 ${isDarkMode ? 'right-1' : 'left-1'} transition-all"></div>
          </button>
        </div>
      </div>
    </div>
  `;

  // Remove Offline note handler
  container.querySelectorAll('.btn-remove-offline').forEach(btn => {
    btn.onclick = (e) => {
      const cid = e.currentTarget.getAttribute('data-content-id');
      window.store.toggleOfflineNote(cid);
      window.showToast("Removed from offline storage!");
      window.router.renderCurrentView();
    };
  });

  // Dark Mode Toggle
  const darkBtn = container.querySelector('#btn-toggle-dark-mode');
  if (darkBtn) {
    darkBtn.onclick = () => {
      document.documentElement.classList.toggle('dark');
      window.router.renderCurrentView();
    };
  }

  // Open Moderation Queue
  const modBtn = container.querySelector('#btn-open-moderation');
  if (modBtn) {
    modBtn.onclick = () => {
      window.router.navigate('moderation');
    };
  }
};
