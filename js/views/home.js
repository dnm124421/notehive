/**
 * New Home View — "Today's Feed"
 * Features:
 *  1. Streak / Activity Strip (Streak Days, Today's Pts, Tier Progress)
 *  2. Trending Now (Horizontal Card Carousel)
 *  3. Main Feed (Filter Chips: All, New, Popular, Bookmarked, rich Neo-Brutalist note cards)
 */

window.renderHomeView = function(container, params = {}) {
  const currentFilter = params.filter || 'all';
  const searchQuery = params.searchQuery || '';
  const currentUser = window.store.getCurrentUser();
  const activity = window.store.getUserActivityStats();
  const trendingNotes = window.store.getTrendingContent(5);
  const feedNotes = window.store.getAllContentFeed({ filter: currentFilter, searchQuery });

  container.innerHTML = `
    <div class="flex flex-col w-full min-h-screen bg-background pb-32 pt-20 px-4 max-w-md mx-auto">
      
      <!-- STREAK & ACTIVITY STRIP (Hero Header) -->
      <div class="bg-primary-container neo-border p-4 neo-shadow relative mb-6">
        <!-- Sticker Badge -->
        <div class="absolute -top-3 -right-2 bg-tertiary text-white neo-border px-2 py-0.5 transform rotate-3 neo-shadow-sm">
          <span class="font-label-bold text-[10px] uppercase tracking-wider">DAILY HIGH VOLTAGE</span>
        </div>

        <div class="flex items-center justify-between mb-3 border-b-2 border-on-surface pb-2 border-dashed">
          <div class="flex items-center gap-1.5 bg-black text-primary-container px-2.5 py-1 neo-border">
            <span class="text-sm">🔥</span>
            <span class="font-label-bold text-xs uppercase tracking-tight">${activity.streakDays} DAY STREAK</span>
          </div>

          <div class="flex items-center gap-1 bg-secondary-container px-2 py-1 neo-border text-on-surface">
            <span class="material-symbols-outlined text-xs font-black">bolt</span>
            <span class="font-label-bold text-[11px] uppercase">+${activity.todayPoints} PTS TODAY</span>
          </div>
        </div>

        <!-- Rank & Progress Bar -->
        <div class="flex flex-col gap-1">
          <div class="flex items-center justify-between text-xs font-label-bold text-on-surface">
            <span class="flex items-center gap-1 uppercase">
              <span class="material-symbols-outlined text-sm text-tertiary">military_tech</span>
              ${activity.rankTitle}
            </span>
            <span class="text-[10px] uppercase text-on-surface-variant font-bold">${activity.percent}% TO NEXT TIER</span>
          </div>
          <div class="w-full bg-surface neo-border h-3 overflow-hidden">
            <div class="h-full bg-tertiary border-r-2 border-on-surface transition-all duration-500" style="width: ${Math.max(5, activity.percent)}%"></div>
          </div>
        </div>
      </div>

      <!-- TRENDING NOW CAROUSEL -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-tertiary font-black text-xl animate-pulse">local_fire_department</span>
            <h2 class="font-headline-md text-lg uppercase text-on-surface tracking-tight">Trending Now</h2>
          </div>
          <span class="font-label-bold text-[10px] uppercase bg-black text-white px-2 py-0.5">24H HOT</span>
        </div>

        <!-- Horizontal Scroll Carousel -->
        <div class="flex gap-3 overflow-x-auto hide-scrollbar pb-2 pt-1 -mx-4 px-4">
          ${trendingNotes.map((note, idx) => {
            const cardBgs = ['bg-secondary-container', 'bg-tertiary-container', 'bg-surface-variant', 'bg-primary-container'];
            const bgClass = cardBgs[idx % cardBgs.length];

            return `
              <div data-content-id="${note.id}" class="btn-open-note flex-shrink-0 w-60 ${bgClass} neo-border p-3 neo-shadow cursor-pointer relative group active:translate-x-0.5 active:translate-y-0.5">
                <div class="flex justify-between items-center mb-2">
                  <span class="bg-black text-white font-label-bold text-[9px] uppercase px-1.5 py-0.5 truncate max-w-[120px]">
                    ${note.subjectName}
                  </span>
                  <div class="flex items-center gap-0.5 bg-surface neo-border px-1.5 py-0.5 text-[10px] font-label-bold">
                    <span class="material-symbols-outlined text-xs">arrow_upward</span>
                    <span>${note.score}</span>
                  </div>
                </div>

                <h3 class="font-headline-md text-sm uppercase text-on-surface line-clamp-2 leading-tight mb-3 group-hover:underline">
                  ${note.title}
                </h3>

                <div class="flex items-center justify-between border-t border-on-surface pt-2 border-dashed text-[10px] font-label-bold text-on-surface-variant">
                  <span class="truncate">By @${note.authorName}</span>
                  <span class="material-symbols-outlined text-xs">arrow_forward</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- MAIN FEED HEADER & SEARCH -->
      <div class="flex flex-col gap-3 mb-4">
        <div class="flex items-center justify-between">
          <h2 class="font-headline-md text-xl uppercase text-on-surface">Today's Feed</h2>
          <span class="font-label-bold text-xs text-on-surface-variant uppercase">${feedNotes.length} Notes</span>
        </div>

        <!-- Search Input -->
        <div class="relative">
          <input id="feed-search-input" value="${searchQuery}" class="neo-input w-full pr-10 text-xs" placeholder="Search notes, subjects, authors..." />
          <span class="material-symbols-outlined absolute right-3 top-3 text-on-surface-variant text-base">search</span>
        </div>

        <!-- Filter Chips -->
        <div class="flex gap-1.5 overflow-x-auto hide-scrollbar py-1">
          <button data-filter="all" class="btn-feed-filter font-label-bold text-[10px] uppercase px-3 py-1.5 neo-border ${currentFilter === 'all' ? 'bg-black text-white neo-shadow-sm' : 'bg-surface text-on-surface'}">
            🔥 ALL NOTES
          </button>
          <button data-filter="new" class="btn-feed-filter font-label-bold text-[10px] uppercase px-3 py-1.5 neo-border ${currentFilter === 'new' ? 'bg-black text-white neo-shadow-sm' : 'bg-surface text-on-surface'}">
            ⚡ NEW DROPS
          </button>
          <button data-filter="popular" class="btn-feed-filter font-label-bold text-[10px] uppercase px-3 py-1.5 neo-border ${currentFilter === 'popular' ? 'bg-black text-white neo-shadow-sm' : 'bg-surface text-on-surface'}">
            🏆 POPULAR
          </button>
          <button data-filter="bookmarked" class="btn-feed-filter font-label-bold text-[10px] uppercase px-3 py-1.5 neo-border ${currentFilter === 'bookmarked' ? 'bg-black text-white neo-shadow-sm' : 'bg-surface text-on-surface'}">
            🔖 SAVED
          </button>
        </div>
      </div>

      <!-- MAIN FEED CONTENT LIST -->
      <div class="flex flex-col gap-4">
        ${feedNotes.length === 0 ? `
          <div class="bg-surface-container neo-border p-8 text-center flex flex-col items-center gap-2">
            <span class="material-symbols-outlined text-4xl text-on-surface-variant">search_off</span>
            <p class="font-headline-md text-base uppercase text-on-surface">No Notes Found</p>
            <p class="font-body-md text-xs text-on-surface-variant">Try adjusting your filter chips or search query.</p>
          </div>
        ` : feedNotes.map(item => {
          const isSaved = currentUser.savedOfflineNoteIds.includes(item.id);
          const vote = window.store.getUserVote(item.id);
          const userVoteVal = vote ? vote.value : 0;

          return `
            <div class="bg-surface-container-lowest neo-border p-4 neo-shadow relative group flex flex-col gap-3">
              <!-- Top Row: Subject Tag + Bookmark Button -->
              <div class="flex items-start justify-between gap-2">
                <div class="flex flex-wrap gap-1.5 items-center">
                  <span class="bg-primary-container neo-border px-2 py-0.5 font-label-bold text-[10px] uppercase text-on-surface">
                    ${item.subjectName}
                  </span>
                  <span class="bg-surface-container-high neo-border px-1.5 py-0.5 font-label-bold text-[9px] uppercase text-on-surface-variant">
                    ${item.categoryLabel || 'Essential'}
                  </span>
                </div>

                <button data-content-id="${item.id}" class="btn-toggle-bookmark w-8 h-8 neo-border ${isSaved ? 'bg-tertiary text-white' : 'bg-surface text-on-surface'} flex items-center justify-center neo-shadow-sm active:translate-x-0.5 active:translate-y-0.5">
                  <span class="material-symbols-outlined text-base">${isSaved ? 'bookmark' : 'bookmark_border'}</span>
                </button>
              </div>

              <!-- Title & Body Snippet -->
              <div data-content-id="${item.id}" class="btn-open-note cursor-pointer flex flex-col gap-1">
                <h3 class="font-headline-md text-lg text-on-surface uppercase leading-tight group-hover:underline">
                  ${item.title}
                </h3>
                <p class="font-body-md text-xs text-on-surface-variant line-clamp-3 leading-snug">
                  ${item.body}
                </p>
              </div>

              <!-- Badges (PDF / External Link) -->
              <div class="flex flex-wrap gap-2">
                ${item.pdfName || item.pdfData ? `
                  <div class="inline-flex items-center gap-1 font-label-bold text-[10px] uppercase bg-error text-white px-2 py-0.5 neo-border">
                    <span class="material-symbols-outlined text-xs">picture_as_pdf</span> PDF ATTACHED
                  </div>
                ` : ''}
                ${item.externalUrl ? `
                  <a href="${item.externalUrl}" target="_blank" class="inline-flex items-center gap-1 font-label-bold text-[10px] uppercase bg-black text-white px-2 py-0.5 neo-border">
                    <span class="material-symbols-outlined text-xs">link</span> LINK
                  </a>
                ` : ''}
              </div>

              <!-- Bottom Row: Upvote / Downvote, Comments, Author -->
              <div class="flex items-center justify-between border-t-2 border-on-surface pt-2.5 border-dashed">
                <div class="flex items-center gap-2">
                  <button data-content-id="${item.id}" data-delta="1" class="btn-feed-vote w-8 h-8 ${userVoteVal === 1 ? 'bg-secondary text-white' : 'bg-surface'} neo-border neo-shadow-sm flex items-center justify-center active:translate-y-0.5">
                    <span class="material-symbols-outlined text-sm">arrow_upward</span>
                  </button>

                  <span class="font-label-bold text-xs text-on-surface min-w-[16px] text-center">${item.score}</span>

                  <button data-content-id="${item.id}" data-delta="-1" class="btn-feed-vote w-8 h-8 ${userVoteVal === -1 ? 'bg-error text-white' : 'bg-surface'} neo-border neo-shadow-sm flex items-center justify-center active:translate-y-0.5">
                    <span class="material-symbols-outlined text-sm">arrow_downward</span>
                  </button>
                </div>

                <div data-content-id="${item.id}" class="btn-open-note cursor-pointer flex items-center gap-1 text-xs font-label-bold text-on-surface-variant hover:text-on-surface">
                  <span class="material-symbols-outlined text-sm">chat_bubble_outline</span>
                  <span>${item.commentsCount} Comments</span>
                </div>

                <div class="text-[10px] font-label-bold text-on-surface-variant text-right">
                  <span>By @${item.authorName}</span>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;

  // EVENT LISTENERS

  // Open Note Detail
  container.querySelectorAll('.btn-open-note').forEach(el => {
    el.addEventListener('click', (e) => {
      const contentId = e.currentTarget.getAttribute('data-content-id');
      if (contentId) {
        window.router.navigate('noteDetail', { contentId });
      }
    });
  });

  // Upvote / Downvote Feed Buttons
  container.querySelectorAll('.btn-feed-vote').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const contentId = e.currentTarget.getAttribute('data-content-id');
      const delta = parseInt(e.currentTarget.getAttribute('data-delta'));
      const res = window.store.upvoteContent(contentId, delta);

      if (res.error === "SELF_VOTE") {
        window.showToast("Cannot vote on your own post!");
      } else {
        window.router.renderCurrentView();
      }
    });
  });

  // Bookmark Toggle
  container.querySelectorAll('.btn-toggle-bookmark').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const contentId = e.currentTarget.getAttribute('data-content-id');
      window.store.toggleOfflineNote(contentId);
      const isSaved = currentUser.savedOfflineNoteIds.includes(contentId);
      window.showToast(isSaved ? "Saved note for offline!" : "Removed from offline notes!");
      window.router.renderCurrentView();
    });
  });

  // Filter Chips
  container.querySelectorAll('.btn-feed-filter').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const filterVal = e.currentTarget.getAttribute('data-filter');
      window.router.navigate('home', { filter: filterVal, searchQuery });
    });
  });

  // Search Bar Input Event (debounce/keyup)
  const searchInput = container.querySelector('#feed-search-input');
  if (searchInput) {
    let timeout = null;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(timeout);
      const val = e.target.value;
      timeout = setTimeout(() => {
        window.router.navigate('home', { filter: currentFilter, searchQuery: val });
      }, 300);
    });
  }
};
