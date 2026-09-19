/**
 * Profile View: User Stats, Rank Display, Badges, Contributions, Offline Saved Notes, 
 * 3-State Theme Toggle, and Admin Access
 */

window.renderProfileView = function(container) {
  const currentUser = window.store.getCurrentUser();
  const offlineNotes = window.store.state.content.filter(c => (currentUser.savedOfflineNoteIds || []).includes(c.id));
  const userContributions = window.store.state.content.filter(c => c.authorId === currentUser.id);
  const currentTheme = window.store.getThemePreference();

  // Calculate rank from leaderboard
  const leaderboard = window.store.getLeaderboard();
  const userRank = leaderboard.findIndex(u => u.id === currentUser.id) + 1;
  const rankTitle = userRank === 1 ? 'Hive Queen' : userRank <= 3 ? 'Elite Contributor' : userRank <= 6 ? 'Rising Star' : 'Active Member';

  // Pending subject+join requests count
  const pendingJoins = (window.store.getJoinRequests() || []).filter(r => r.status === 'pending').length;
  const pendingSubjects = (window.store.state.subjectRequests || []).filter(r => r.status === 'pending').length;
  const totalPending = pendingJoins + pendingSubjects;

  container.innerHTML = `
    <div class="flex flex-col w-full min-h-screen bg-background pb-32 pt-20 px-4 max-w-md mx-auto">
      <!-- Profile Header Card -->
      <div class="bg-primary-container neo-border p-6 neo-shadow relative flex flex-col items-center text-center mb-6">
        <div class="absolute -top-3 right-4 bg-black text-white neo-border px-2 py-0.5 font-label-bold text-xs uppercase transform rotate-3">
          ${currentUser.role || 'Member'}
        </div>

        <!-- Avatar with change button -->
        <div class="relative mb-3">
          <img id="profile-avatar-img" class="w-20 h-20 object-cover border-4 border-black neo-shadow bg-white" src="${currentUser.avatarUrl}" alt="${currentUser.name}" />
          <button id="btn-change-avatar" class="absolute -bottom-2 -right-2 bg-secondary-container neo-border p-1 cursor-pointer active:translate-x-0.5 active:translate-y-0.5" title="Change Avatar">
            <span class="material-symbols-outlined text-sm text-secondary">edit</span>
          </button>
        </div>

        <h1 class="font-headline-md text-2xl uppercase text-on-surface leading-none mb-1">${currentUser.name}</h1>
        <span class="font-label-bold text-xs uppercase px-2 py-0.5 bg-surface neo-border mb-2">${currentUser.department}</span>

        <!-- Rank Badge -->
        <div class="flex items-center gap-1 bg-tertiary text-white neo-border px-3 py-1 mb-3">
          <span class="material-symbols-outlined text-sm">military_tech</span>
          <span class="font-label-bold text-xs uppercase">#${userRank} · ${rankTitle}</span>
        </div>

        <div class="grid grid-cols-4 gap-2 border-t-3 border-on-surface pt-3 w-full border-dashed text-center">
          <div>
            <span class="font-headline-md text-lg block leading-none">${currentUser.points.toLocaleString()}</span>
            <span class="font-label-sm text-[9px] uppercase text-on-surface-variant">Points</span>
          </div>
          <div>
            <span class="font-headline-md text-lg block leading-none">${userContributions.length}</span>
            <span class="font-label-sm text-[9px] uppercase text-on-surface-variant">Posts</span>
          </div>
          <div>
            <span class="font-headline-md text-lg block leading-none">${currentUser.badges.length}</span>
            <span class="font-label-sm text-[9px] uppercase text-on-surface-variant">Badges</span>
          </div>
          <div>
            <span class="font-headline-md text-lg block leading-none">${offlineNotes.length}</span>
            <span class="font-label-sm text-[9px] uppercase text-on-surface-variant">Offline</span>
          </div>
        </div>
      </div>

      <!-- Admin Queue Button (If Admin) -->
      ${currentUser.role === 'Admin' ? `
        <button id="btn-open-moderation" class="w-full py-3 bg-tertiary-container neo-border neo-shadow neo-btn font-label-bold uppercase text-xs flex items-center justify-center gap-2 mb-6">
          <span class="material-symbols-outlined text-sm text-tertiary">admin_panel_settings</span>
          Admin Moderation & Queue (${totalPending})
        </button>
      ` : ''}

      <!-- Theme Switcher Section -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex items-center justify-between border-b-3 border-on-surface pb-1">
          <h2 class="font-headline-md text-lg uppercase text-on-surface">Theme Vibe</h2>
          <span class="font-label-sm text-xs text-on-surface-variant uppercase font-bold">${currentTheme}</span>
        </div>
        <div class="grid grid-cols-3 gap-2">
          <button data-theme="light" class="btn-theme-toggle py-2 neo-border font-label-bold text-xs uppercase ${currentTheme === 'light' ? 'bg-primary-container neo-shadow' : 'bg-surface'} flex items-center justify-center gap-1 active:translate-x-0.5 active:translate-y-0.5">
            <span class="material-symbols-outlined text-sm">light_mode</span> Light
          </button>
          <button data-theme="dark" class="btn-theme-toggle py-2 neo-border font-label-bold text-xs uppercase ${currentTheme === 'dark' ? 'bg-primary-container neo-shadow' : 'bg-surface'} flex items-center justify-center gap-1 active:translate-x-0.5 active:translate-y-0.5">
            <span class="material-symbols-outlined text-sm">dark_mode</span> Dark
          </button>
          <button data-theme="dark-hc" class="btn-theme-toggle py-2 neo-border font-label-bold text-xs uppercase ${currentTheme === 'dark-hc' ? 'bg-primary-container neo-shadow' : 'bg-surface'} flex items-center justify-center gap-1 active:translate-x-0.5 active:translate-y-0.5">
            <span class="material-symbols-outlined text-sm">contrast</span> Radical
          </button>
        </div>
      </div>

      <!-- My Contributions Section -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex items-center justify-between border-b-3 border-on-surface pb-1">
          <h2 class="font-headline-md text-lg uppercase text-on-surface">My Contributions</h2>
          <span class="font-label-bold text-xs uppercase bg-black text-white px-2 py-0.5">${userContributions.length} Items</span>
        </div>

        ${userContributions.length === 0 ? `
          <div class="bg-surface-container neo-border p-4 text-center">
            <p class="font-body-md text-xs text-on-surface-variant">No contributions published yet. Tap the '+' button to post notes & earn points!</p>
          </div>
        ` : userContributions.map(item => {
          const subject = window.store.getSubjectById(item.subjectId);
          return `
            <div data-content-id="${item.id}" class="btn-view-contribution bg-surface-container-lowest neo-border p-3 neo-shadow-sm flex items-center justify-between cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition-all">
              <div class="min-w-0 pr-2">
                <span class="font-label-sm text-[10px] uppercase text-tertiary font-bold">${subject ? subject.name : 'General'}</span>
                <h4 class="font-label-bold text-xs uppercase truncate text-on-surface">${item.title}</h4>
                <div class="flex items-center gap-2 text-[10px] text-on-surface-variant mt-0.5 font-label-bold">
                  <span>▲ ${item.score || 1} pts</span>
                  <span>•</span>
                  <span>${item.pdfName ? 'PDF Document' : 'Resource Link'}</span>
                </div>
              </div>
              <span class="material-symbols-outlined text-sm text-on-surface">chevron_right</span>
            </div>
          `;
        }).join('')}
      </div>

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

    </div>
  `;

  // Theme Toggle Handler
  container.querySelectorAll('.btn-theme-toggle').forEach(btn => {
    btn.onclick = (e) => {
      const theme = e.currentTarget.getAttribute('data-theme');
      window.store.setThemePreference(theme);
      window.router.renderCurrentView();
    };
  });

  // View Contribution Handler
  container.querySelectorAll('.btn-view-contribution').forEach(item => {
    item.onclick = (e) => {
      const contentId = e.currentTarget.getAttribute('data-content-id');
      window.router.navigate('noteDetail', { contentId });
    };
  });

  // Remove Offline note handler
  container.querySelectorAll('.btn-remove-offline').forEach(btn => {
    btn.onclick = (e) => {
      const cid = e.currentTarget.getAttribute('data-content-id');
      window.store.toggleOfflineNote(cid);
      window.showToast("Removed from offline storage!");
      window.router.renderCurrentView();
    };
  });

  // Open Avatar Selector
  const avatarBtn = container.querySelector('#btn-change-avatar');
  if (avatarBtn) {
    avatarBtn.onclick = () => {
      window.renderAvatarSelectorModal();
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

// Avatar Selector Modal
window.renderAvatarSelectorModal = function() {
  const presets = window.AVATAR_PRESETS || [];
  const currentUser = window.store.getCurrentUser();

  const modalDiv = document.createElement('div');
  modalDiv.className = "fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4";
  modalDiv.innerHTML = `
    <div class="bg-surface neo-border p-6 neo-shadow-lg w-full max-w-sm flex flex-col gap-4 relative">
      <button id="close-avatar-modal" class="absolute top-3 right-3 w-8 h-8 bg-error text-white neo-border flex items-center justify-center font-bold">✕</button>
      
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined text-lg text-tertiary">face</span>
        <h2 class="font-headline-md text-xl uppercase">Choose Avatar</h2>
      </div>

      <p class="font-body-md text-xs text-on-surface-variant">
        Select a preset avatar for your profile. Your identity, your vibe.
      </p>

      <div class="grid grid-cols-3 gap-3">
        ${presets.map(av => `
          <button data-avatar-url="${av.url}" class="btn-select-avatar flex flex-col items-center gap-1 p-2 neo-border ${currentUser.avatarUrl === av.url ? 'bg-primary-container neo-shadow' : 'bg-surface-container'} cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition-all">
            <img class="w-14 h-14 object-cover border-2 border-black bg-white" src="${av.url}" alt="${av.name}" />
            <span class="font-label-bold text-[9px] uppercase truncate w-full text-center">${av.name}</span>
          </button>
        `).join('')}
      </div>

      <div class="border-t-2 border-on-surface pt-3 border-dashed flex flex-col gap-2">
        <label class="font-label-bold text-xs uppercase">Custom URL</label>
        <div class="flex gap-2">
          <input id="custom-avatar-url" class="neo-input flex-1 text-xs" placeholder="https://example.com/avatar.jpg" />
          <button id="btn-apply-custom-avatar" class="px-3 py-2 bg-primary-fixed neo-border neo-shadow neo-btn font-label-bold text-xs uppercase">
            Apply
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modalDiv);
  document.getElementById('close-avatar-modal').onclick = () => modalDiv.remove();

  // Preset avatar select
  modalDiv.querySelectorAll('.btn-select-avatar').forEach(btn => {
    btn.onclick = (e) => {
      const url = e.currentTarget.getAttribute('data-avatar-url');
      window.store.updateUserAvatar(url);
      modalDiv.remove();
      window.showToast("Avatar updated!");
      window.router.renderCurrentView();
    };
  });

  // Custom URL apply
  document.getElementById('btn-apply-custom-avatar').onclick = () => {
    const url = document.getElementById('custom-avatar-url').value.trim();
    if (url) {
      window.store.updateUserAvatar(url);
      modalDiv.remove();
      window.showToast("Custom avatar applied!");
      window.router.renderCurrentView();
    } else {
      alert("Enter a valid image URL!");
    }
  };
};
