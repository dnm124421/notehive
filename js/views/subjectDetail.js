/**
 * Subject Detail View: 4 Tabs (Notes, Assignments, Exam Prep, Resources)
 * Matches data_preprocessing_notes, assignments, and yt_links exports verbatim.
 */

window.renderSubjectDetailView = function(container, params = {}) {
  const subjectId = params.subjectId || 'sbj_dp';
  const activeTab = params.tab || 'notes';
  const subject = window.store.getSubjectById(subjectId) || window.store.state.subjects[0];
  const currentUser = window.store.getCurrentUser();

  // Search & Filter State
  const searchQuery = params.searchQuery || '';
  const selectedTag = params.selectedTag || null;

  let allContent = window.store.getContent(subjectId, activeTab);

  // Apply filters
  if (selectedTag) {
    allContent = allContent.filter(c => c.tags && c.tags.includes(selectedTag));
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    allContent = allContent.filter(c => 
      c.title.toLowerCase().includes(q) || 
      (c.body && c.body.toLowerCase().includes(q))
    );
  }

  const top3 = allContent.slice(0, 3);
  const stash = allContent.slice(3);

  // Exam Countdown calculation
  let examCountdownText = null;
  if (subject.examDate) {
    const diffDays = Math.ceil((new Date(subject.examDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (diffDays > 0) {
      examCountdownText = `${diffDays} Days Until Exam!`;
    }
  }

  const isMuted = currentUser.mutedSubjectIds.includes(subjectId);

  container.innerHTML = `
    <div class="flex flex-col w-full min-h-screen bg-background pb-32">
      <!-- Hero Section -->
      <section class="relative w-full aspect-[4/3] bg-surface border-b-3 border-on-surface overflow-hidden max-w-md mx-auto">
        <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBesDlyqksG4VQgT05QqJiBjz5BiWW87P87ZhZ2akDv3A3Sl_nIdGqCWz5ZJT65KxOyLBhUyjClwrX_wYNZcNoOmwUzn_fWPkRkIYuoKZqj7yAM_WMntcROiyAOiJEB4j--hlIlnudFfRI4TEBuAkm-sX8M2Fi0x8czx4uq36BlG8k3_oUfz3mEnwAul1dOEGsmvRAPGm6FMHrCMTdcCbxwa0URs5rrJSdTUnDDqcUxKheY8HpF_42y')"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-4">
          <div class="flex items-center justify-between z-10 mb-1">
            <span class="font-label-bold text-xs text-primary-container uppercase bg-black px-2 py-0.5 border border-primary-container">
              SUBJECT MODULE
            </span>
            <button id="btn-toggle-mute" class="w-8 h-8 neo-border ${isMuted ? 'bg-error text-white' : 'bg-surface text-on-surface'} flex items-center justify-center neo-shadow-sm">
              <span class="material-symbols-outlined text-sm">${isMuted ? 'notifications_off' : 'notifications_active'}</span>
            </button>
          </div>

          <h2 class="font-display-xl text-4xl text-primary-container leading-tight uppercase drop-shadow-[3px_3px_0_rgba(0,0,0,1)] z-10 break-words font-black">
            ${subject.name.toUpperCase()}
          </h2>
        </div>

        <!-- Stamp -->
        <div class="absolute top-4 right-4 bg-black text-white neo-border p-2 transform rotate-6 neo-shadow">
          <span class="font-label-bold text-xs uppercase text-center block leading-none">NO<br/>GARBAGE</span>
        </div>
      </section>

      <!-- Exam Countdown Banner (If Active) -->
      ${examCountdownText ? `
        <div class="bg-primary-fixed neo-border px-4 py-2 flex items-center justify-between max-w-md mx-auto w-full">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-error font-bold animate-bounce">alarm</span>
            <span class="font-label-bold text-xs uppercase text-on-surface">${examCountdownText}</span>
          </div>
          <span class="bg-black text-white font-label-bold text-[10px] px-2 py-0.5">CHECK TOP 3</span>
        </div>
      ` : ''}

      <!-- Checkered Divider -->
      <div class="checkered-divider max-w-md mx-auto"></div>

      <!-- Tabs Navigation (Sticky) -->
      <nav class="sticky top-16 z-40 bg-surface border-b-3 border-on-surface px-4 py-2 flex gap-2 overflow-x-auto hide-scrollbar max-w-md mx-auto w-full">
        <button data-tab="notes" class="btn-switch-tab flex-shrink-0 ${activeTab === 'notes' ? 'bg-primary-container text-on-primary-container neo-shadow' : 'bg-surface text-on-surface'} neo-border px-3 py-1.5 font-label-bold text-xs uppercase transition-transform">
          Notes
        </button>
        <button data-tab="assignments" class="btn-switch-tab flex-shrink-0 ${activeTab === 'assignments' ? 'bg-primary-container text-on-primary-container neo-shadow' : 'bg-surface text-on-surface'} neo-border px-3 py-1.5 font-label-bold text-xs uppercase transition-transform">
          Assignments
        </button>
        <button data-tab="resources" class="btn-switch-tab flex-shrink-0 ${activeTab === 'resources' ? 'bg-primary-container text-on-primary-container neo-shadow' : 'bg-surface text-on-surface'} neo-border px-3 py-1.5 font-label-bold text-xs uppercase transition-transform">
          YT Links
        </button>
        <button data-tab="exam_prep" class="btn-switch-tab flex-shrink-0 ${activeTab === 'exam_prep' ? 'bg-primary-container text-on-primary-container neo-shadow' : 'bg-surface text-on-surface'} neo-border px-3 py-1.5 font-label-bold text-xs uppercase transition-transform">
          Exam Prep
        </button>
      </nav>

      <!-- Search & Tag Filter Bar -->
      <div class="p-4 flex flex-col gap-2 max-w-md mx-auto w-full">
        <div class="relative">
          <input id="input-subject-search" value="${searchQuery}" class="neo-input w-full pr-10 text-xs" placeholder="Search in ${activeTab}..." />
          <span class="material-symbols-outlined absolute right-3 top-3 text-on-surface-variant">search</span>
        </div>

        <!-- Tag Filters -->
        <div class="flex gap-1.5 overflow-x-auto hide-scrollbar py-1">
          <button data-tag="" class="btn-filter-tag font-label-bold text-[10px] uppercase px-2 py-0.5 neo-border ${!selectedTag ? 'bg-black text-white' : 'bg-surface text-on-surface'}">
            ALL
          </button>
          ${(subject.tags || ['#important', '#unit3', '#exam-2026']).map(tag => `
            <button data-tag="${tag}" class="btn-filter-tag font-label-bold text-[10px] uppercase px-2 py-0.5 neo-border ${selectedTag === tag ? 'bg-black text-white' : 'bg-surface-container text-on-surface'}">
              ${tag}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Main Tab Content Area -->
      <div class="px-4 flex flex-col gap-8 max-w-md mx-auto w-full">
        <!-- Top 3 Pinned Section -->
        <section class="flex flex-col gap-4">
          <div class="flex items-end gap-2 border-b-4 border-on-surface pb-1">
            <h3 class="font-headline-lg-mobile text-2xl uppercase text-on-surface">Top 3</h3>
            <span class="font-body-md text-xs text-on-surface-variant uppercase mb-1">Pinned by Votes</span>
          </div>

          ${top3.length === 0 ? `
            <div class="bg-surface-container neo-border p-6 text-center">
              <p class="font-body-md text-xs text-on-surface-variant mb-2">No contributions in this tab yet!</p>
              <button id="btn-first-post" class="px-4 py-2 bg-primary-fixed neo-border neo-shadow neo-btn font-label-bold text-xs uppercase">
                Post First Note
              </button>
            </div>
          ` : `
            <div class="grid grid-cols-1 gap-4">
              ${top3.map((item, idx) => {
                const cardColors = ['bg-primary-container', 'bg-secondary-container', 'bg-tertiary-container'];
                const rankBg = cardColors[idx % 3];
                const isSaved = currentUser.savedOfflineNoteIds.includes(item.id);

                return `
                  <div class="${rankBg} neo-border neo-shadow p-4 relative overflow-hidden group">
                    <div class="absolute -right-3 -top-5 text-[100px] font-display-xl font-black text-on-surface opacity-15 pointer-events-none leading-none">
                      ${idx + 1}
                    </div>

                    <div class="flex justify-between items-start mb-2 relative z-10">
                      <span class="bg-on-surface text-white font-label-bold text-[10px] px-2 py-0.5 uppercase">
                        ${item.categoryLabel || 'Essential'}
                      </span>
                      <button data-content-id="${item.id}" class="btn-toggle-bookmark w-8 h-8 neo-border ${isSaved ? 'bg-tertiary text-white' : 'bg-surface text-on-surface'} flex items-center justify-center neo-shadow-sm">
                        <span class="material-symbols-outlined text-sm">${isSaved ? 'bookmark' : 'bookmark_border'}</span>
                      </button>
                    </div>

                    <h4 data-content-id="${item.id}" class="btn-open-note font-headline-md text-lg uppercase text-on-surface mb-2 pr-10 line-clamp-2 cursor-pointer hover:underline">
                      ${item.title}
                    </h4>
                    
                    <p data-content-id="${item.id}" class="btn-open-note font-body-md text-xs text-on-surface-variant line-clamp-3 mb-4 cursor-pointer">
                      ${item.body}
                    </p>

                    ${item.externalUrl ? `
                      <a href="${item.externalUrl}" target="_blank" class="mb-4 inline-flex items-center gap-1 font-label-bold text-xs bg-black text-white px-2 py-1 neo-border">
                        <span class="material-symbols-outlined text-sm">open_in_new</span> External Link
                      </a>
                    ` : ''}

                    <div class="flex items-center justify-between border-t-2 border-on-surface pt-2 border-dashed relative z-10">
                      <div class="flex items-center gap-2">
                        <button data-content-id="${item.id}" data-delta="1" class="btn-vote w-8 h-8 bg-surface neo-border neo-shadow-sm neo-btn flex items-center justify-center">
                          <span class="material-symbols-outlined text-sm">arrow_upward</span>
                        </button>
                        <span class="font-label-bold text-sm text-on-surface">${item.score}</span>
                        <button data-content-id="${item.id}" data-delta="-1" class="btn-vote w-8 h-8 bg-surface neo-border neo-shadow-sm neo-btn flex items-center justify-center">
                          <span class="material-symbols-outlined text-sm">arrow_downward</span>
                        </button>
                      </div>

                      <span class="font-label-bold text-xs text-on-surface flex items-center gap-1">
                        <span class="material-symbols-outlined text-sm">workspace_premium</span> ${item.pointsReward || 100} pts
                      </span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </section>

        <!-- The Stash Section -->
        <section class="flex flex-col gap-3">
          <div class="flex items-end gap-2 border-b-4 border-on-surface pb-1">
            <h3 class="font-headline-md text-xl uppercase text-on-surface">The Stash</h3>
            <span class="font-body-md text-xs text-on-surface-variant uppercase">Other Contributions</span>
          </div>

          ${stash.length === 0 ? `
            <p class="font-body-md text-xs text-on-surface-variant italic">No additional items in the stash.</p>
          ` : stash.map(item => `
            <div class="flex items-center bg-surface neo-border p-3 neo-shadow-sm hover:translate-x-0.5 hover:-translate-y-0.5 transition-all">
              <div class="w-10 h-10 flex-shrink-0 bg-secondary-container neo-border flex items-center justify-center mr-3">
                <span class="font-label-bold text-[10px] text-on-surface uppercase">${item.type.substring(0, 3)}</span>
              </div>
              <div data-content-id="${item.id}" class="btn-open-note flex-1 min-w-0 pr-2 cursor-pointer">
                <h5 class="font-label-bold text-xs text-on-surface uppercase truncate">${item.title}</h5>
                <p class="font-body-md text-[10px] text-on-surface-variant truncate">By @${item.authorName}</p>
              </div>
              <div class="flex items-center gap-2">
                <button data-content-id="${item.id}" data-delta="1" class="btn-vote w-7 h-7 bg-surface neo-border neo-shadow-sm neo-btn flex items-center justify-center">
                  <span class="material-symbols-outlined text-xs">arrow_upward</span>
                </button>
                <span class="font-label-bold text-xs">${item.score}</span>
              </div>
            </div>
          `).join('')}
        </section>
      </div>
    </div>
  `;

  // Listeners for Tab Switching
  container.querySelectorAll('.btn-switch-tab').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tab = e.currentTarget.getAttribute('data-tab');
      window.router.navigate('subjectDetail', { subjectId, tab, searchQuery, selectedTag });
    });
  });

  // Search input handler
  const searchInput = container.querySelector('#input-subject-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value;
      window.router.navigate('subjectDetail', { subjectId, tab: activeTab, searchQuery: q, selectedTag });
    });
  }

  // Tag filter handler
  container.querySelectorAll('.btn-filter-tag').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tag = e.currentTarget.getAttribute('data-tag');
      window.router.navigate('subjectDetail', { subjectId, tab: activeTab, searchQuery, selectedTag: tag || null });
    });
  });

  // Voting handler
  container.querySelectorAll('.btn-vote').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const cid = e.currentTarget.getAttribute('data-content-id');
      const delta = parseInt(e.currentTarget.getAttribute('data-delta'));
      window.store.upvoteContent(cid, delta);
      window.router.renderCurrentView();
    });
  });

  // Bookmark / Offline Toggle Handler
  container.querySelectorAll('.btn-toggle-bookmark').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const cid = e.currentTarget.getAttribute('data-content-id');
      window.store.toggleOfflineNote(cid);
      window.showToast("Updated offline saved notes!");
      window.router.renderCurrentView();
    });
  });

  // Open Note Detail Modal
  container.querySelectorAll('.btn-open-note').forEach(el => {
    el.addEventListener('click', (e) => {
      const cid = e.currentTarget.getAttribute('data-content-id');
      window.renderNoteDetailModal(cid);
    });
  });

  // Toggle Mute Subject Notifications
  const muteBtn = container.querySelector('#btn-toggle-mute');
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      window.store.toggleSubjectMute(subjectId);
      const isMutedNow = window.store.getCurrentUser().mutedSubjectIds.includes(subjectId);
      window.showToast(isMutedNow ? `Muted ${subject.name} notifications!` : `Unmuted ${subject.name} notifications!`);
      window.router.renderCurrentView();
    });
  }
};
