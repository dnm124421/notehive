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

  // Helper: get user's vote on an item (returns 1, -1, or 0)
  const getUserVote = (contentId) => {
    const vote = window.store.state.votes.find(v => v.contentId === contentId && v.userId === currentUser.id);
    return vote ? vote.value : 0;
  };

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
            <div class="flex items-center gap-2">
              <button id="btn-subject-back-header" class="bg-black text-primary-container neo-border px-2 py-0.5 font-label-bold text-xs uppercase flex items-center gap-1 cursor-pointer">
                <span class="material-symbols-outlined text-xs">arrow_back</span> Back
              </button>
              <span class="font-label-bold text-xs text-primary-container uppercase bg-black px-2 py-0.5 border border-primary-container">
                SUBJECT MODULE
              </span>
            </div>
            <button id="btn-toggle-mute" class="w-8 h-8 neo-border ${isMuted ? 'bg-error text-white' : 'bg-surface text-on-surface'} flex items-center justify-center neo-shadow-sm">
              <span class="material-symbols-outlined text-sm">${isMuted ? 'notifications_off' : 'notifications_active'}</span>
            </button>
          </div>

          <h2 class="font-display-xl text-4xl text-primary-container leading-tight uppercase drop-shadow-[3px_3px_0_rgba(0,0,0,1)] z-10 break-words font-black">
            ${subject.name.toUpperCase()}
          </h2>
        </div>

        <!-- Floating Bolt Sticker (Midnight Radical) -->
        <div class="absolute top-12 left-4 rotate-12 opacity-80 z-20">
          <div class="w-16 h-16 neo-border rounded-full flex items-center justify-center bg-secondary neo-shadow-sm">
            <span class="material-symbols-outlined text-on-secondary text-3xl">bolt</span>
          </div>
        </div>

        <!-- Stamp -->
        <div class="absolute top-4 right-4 bg-black text-white neo-border p-2 transform rotate-6 neo-shadow z-20">
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

        ${activeTab === 'resources' ? `
          <!-- Intro Block -->
          <div class="neo-border bg-primary-container p-6 relative neo-shadow">
            <div class="absolute -top-4 -right-4 w-10 h-10 bg-on-background text-primary-container flex items-center justify-center font-headline-md rotate-12 neo-border">
              !
            </div>
            <h2 class="font-headline-lg-mobile text-headline-lg-mobile text-on-primary-container uppercase leading-[0.9] mb-4 tracking-tighter italic">
              WATCH &amp;<br/>LEARN
            </h2>
            <p class="font-body-lg text-body-lg text-on-primary-container font-black leading-tight">
              CURATED TUTORIALS AND DEEP DIVES FOR ${subject.name.toUpperCase()}. UPVOTE THE ONES THAT SAVED YOUR LIFE.
            </p>
          </div>

          <!-- Pinned Section - HIGH IMPACT YELLOW BLOCK -->
          <section class="flex flex-col gap-6 mt-2 bg-primary-container p-4 neo-border neo-shadow">
            <div class="inline-flex items-center gap-3 bg-on-background px-6 py-2 self-start neo-border -ml-8 -rotate-2">
              <span class="material-symbols-outlined text-primary-container text-[24px] fill-1">push_pin</span>
              <span class="font-label-bold text-[18px] text-on-primary uppercase tracking-tighter">Top 3 Pinned</span>
            </div>

            ${top3.length === 0 ? `
              <div class="bg-surface neo-border p-6 text-center">
                <p class="font-body-md text-xs text-on-surface-variant mb-2">No videos contributed yet!</p>
              </div>
            ` : top3.map((item, idx) => {
              const cardBgs = ['bg-white', 'bg-tertiary-container', 'bg-surface-variant'];
              const cardBg = cardBgs[idx % 3];
              const isSaved = currentUser.savedOfflineNoteIds.includes(item.id);

              return `
                <article class="neo-border ${cardBg} flex flex-col neo-shadow group relative">
                  ${idx === 0 ? `
                    <!-- Stamp -->
                    <div class="absolute -top-4 -left-4 bg-tertiary px-3 py-1 neo-border z-10 -rotate-6 neo-shadow-sm">
                      <span class="font-label-bold text-label-bold text-on-tertiary uppercase italic">#1 Pick</span>
                    </div>
                  ` : ''}

                  <div class="h-44 w-full border-b-[4px] border-on-background relative overflow-hidden bg-cover bg-center" style="background-image: url('${item.thumbnailUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSkApLlzseeAtgJ-ijN_b9NRQ2tN2JYCIOENESGN1BBHYmKjp-vRmyWck2CsSprDXzGlPrVcC06RlxCTAt9e_487kFX50kidvx-rCAg-5p1sAxJPdGq6ikfU9Uf7OHGqzwmsscl5TRrfGazpKyh78fDMlBcFh8wYkzxn7QYvMYFmgkYrDIEY-LlG_IzVnG_dHsYlubvkQjynUrAmrkSHVBKMoy3xNnht5X47TR0UgNQjC4VTeJu51Z'}');">
                    <div class="absolute bottom-3 right-3 bg-on-background px-3 py-1 neo-border">
                      <span class="font-label-bold text-label-sm text-primary-container">${item.duration || '15:00'}</span>
                    </div>
                  </div>

                  <div class="p-5 flex flex-col gap-3">
                    <h3 data-content-id="${item.id}" class="btn-open-note font-headline-md text-[24px] leading-none text-on-surface uppercase line-clamp-2 tracking-tighter cursor-pointer hover:underline">
                      ${item.title}
                    </h3>
                    <div class="flex items-center justify-between mt-2">
                      <div class="flex items-center gap-2">
                        <div class="w-10 h-10 bg-secondary-container neo-border flex items-center justify-center overflow-hidden">
                          <span class="font-label-bold text-label-bold text-on-surface">${item.authorInitials || 'YT'}</span>
                        </div>
                        <span class="font-label-bold text-label-bold text-on-surface uppercase">${item.authorName}</span>
                      </div>
                      <button data-content-id="${item.id}" data-delta="1" class="btn-vote flex items-center gap-1 bg-white px-4 py-2 neo-border neo-shadow-sm active:translate-y-1 active:shadow-none transition-all">
                        <span class="material-symbols-outlined text-[20px] font-black">arrow_upward</span>
                        <span class="font-label-bold text-[16px]">${item.score}</span>
                      </button>
                    </div>
                  </div>
                </article>
              `;
            }).join('')}
          </section>

          <!-- Divider -->
          <div class="w-full h-2 bg-black my-2"></div>

          <!-- Community Feed Section -->
          <section class="flex flex-col gap-6">
            <div class="flex items-center justify-between">
              <h2 class="font-headline-md text-headline-md uppercase text-on-surface tracking-tighter italic">Fresh Drops</h2>
              <button class="w-12 h-12 bg-on-background text-primary-container flex items-center justify-center neo-border rounded-full neo-shadow-sm hover:bg-tertiary hover:text-white transition-all active:translate-y-1 active:shadow-none">
                <span class="material-symbols-outlined font-black">filter_list</span>
              </button>
            </div>

            ${stash.length === 0 ? `
              <p class="font-body-md text-xs text-on-surface-variant italic">No extra videos in community feed.</p>
            ` : stash.map((item, idx) => {
              const feedBgs = ['bg-white', 'bg-tertiary-container', 'bg-secondary-container'];
              const feedBg = feedBgs[idx % 3];
              return `
                <div class="flex gap-4 p-4 ${feedBg} neo-border neo-shadow-sm items-center">
                  <div class="w-28 h-20 shrink-0 bg-surface-variant neo-border relative overflow-hidden bg-cover bg-center" style="background-image: url('${item.thumbnailUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKdhMsoZsiPF4TKXXyj-XU56IIOR81KNWd_Rl6s_yQJP5HCBqdrmyNu5dd1aHQsSxZg8jQ3WkJo-YG61iPpakfJvZKx7DyPCqsU58GPDf_kQ991mFXjYeIsxcrr9YMNGcWx4JshsxiqO1VSBUps3g43Dbo_AyEvmZG6kkQssYPCuf2BNR1iq0oHFYvzrhx5tWfKTzEmIBEELlaCPlzAv-6emPdt7F6lKHG-TERDA4YbQySxHTzkb3b'}');">
                    <div class="absolute bottom-1 right-1 bg-on-background px-1 border border-white">
                      <span class="text-[10px] text-primary-container font-black uppercase">${item.duration || '10:00'}</span>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 data-content-id="${item.id}" class="btn-open-note font-label-bold text-[16px] leading-tight text-on-surface truncate uppercase tracking-tighter cursor-pointer hover:underline">${item.title}</h4>
                    <p class="font-label-sm text-label-sm text-on-surface-variant truncate mt-1 italic">by ${item.authorName}</p>
                  </div>
                  <div class="flex flex-col items-center shrink-0 bg-primary-container p-2 neo-border">
                    <button data-content-id="${item.id}" data-delta="1" class="btn-vote text-on-surface ${getUserVote(item.id) === 1 ? 'bg-secondary text-white' : ''}">
                      <span class="material-symbols-outlined text-[24px] font-black">keyboard_arrow_up</span>
                    </button>
                    <span class="font-label-bold text-label-bold text-on-surface">${item.score}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </section>
        ` : `
          <!-- Top 3 Pinned Section for Notes, Assignments, Exam Prep -->
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

                      <!-- Decorative Tape (Midnight Radical) -->
                      <div class="absolute -top-3 -left-3 bg-secondary-container px-3 py-1 text-on-secondary font-label-bold uppercase text-[12px] rotate-[-5deg] z-20 neo-border neo-shadow-sm">
                        LEVEL ${idx + 1}
                      </div>

                      <div class="flex justify-between items-start mb-2 relative z-10 mt-2">
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

                      ${(item.pdfData || item.pdfName) ? `
                        <div class="mb-4 inline-flex items-center gap-1 font-label-bold text-xs bg-error text-white px-2 py-1 neo-border">
                          <span class="material-symbols-outlined text-sm">picture_as_pdf</span> PDF Attached
                        </div>
                      ` : ''}

                      <div class="flex items-center justify-between border-t-2 border-on-surface pt-2 border-dashed relative z-10">
                        <div class="flex items-center gap-2">
                          <button data-content-id="${item.id}" data-delta="1" class="btn-vote w-8 h-8 ${getUserVote(item.id) === 1 ? 'bg-secondary text-white' : 'bg-surface'} neo-border neo-shadow-sm neo-btn flex items-center justify-center">
                            <span class="material-symbols-outlined text-sm">arrow_upward</span>
                          </button>
                          <span class="font-label-bold text-sm text-on-surface">${item.score}</span>
                          <button data-content-id="${item.id}" data-delta="-1" class="btn-vote w-8 h-8 ${getUserVote(item.id) === -1 ? 'bg-error text-white' : 'bg-surface'} neo-border neo-shadow-sm neo-btn flex items-center justify-center">
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
                  <div class="flex items-center gap-1">
                    <h5 class="font-label-bold text-xs text-on-surface uppercase truncate">${item.title}</h5>
                    ${(item.pdfData || item.pdfName) ? '<span class="material-symbols-outlined text-xs text-error">picture_as_pdf</span>' : ''}
                  </div>
                  <p class="font-body-md text-[10px] text-on-surface-variant truncate">By @${item.authorName}</p>
                </div>
                <div class="flex items-center gap-2">
                  <button data-content-id="${item.id}" data-delta="1" class="btn-vote w-7 h-7 ${getUserVote(item.id) === 1 ? 'bg-secondary text-white' : 'bg-surface'} neo-border neo-shadow-sm neo-btn flex items-center justify-center">
                    <span class="material-symbols-outlined text-xs">arrow_upward</span>
                  </button>
                  <span class="font-label-bold text-xs">${item.score}</span>
                </div>
              </div>
            `).join('')}
          </section>
        `}
      </div>
    </div>
  `;

  // Listener for Post First Note button
  const firstPostBtn = container.querySelector('#btn-first-post');
  if (firstPostBtn) {
    firstPostBtn.addEventListener('click', () => {
      window.renderComposerModal(subjectId, activeTab);
    });
  }

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

  // Voting handler with self-vote prevention
  container.querySelectorAll('.btn-vote').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const cid = e.currentTarget.getAttribute('data-content-id');
      const delta = parseInt(e.currentTarget.getAttribute('data-delta'));
      // Self-vote prevention
      const contentItem = window.store.state.content.find(c => c.id === cid);
      if (contentItem && contentItem.authorId === currentUser.id) {
        window.showToast("You can't vote on your own content!");
        return;
      }
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

  // In-page Back Button (hero header)
  const subjectBackBtn = container.querySelector('#btn-subject-back-header');
  if (subjectBackBtn) {
    subjectBackBtn.addEventListener('click', () => {
      window.router.goBack();
    });
  }
};
