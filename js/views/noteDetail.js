/**
 * Note Detail Modal: Full Reader, Version History, Version Revert, and Offline Toggle
 */

window.renderNoteDetailModal = function(contentId) {
  const item = window.store.state.content.find(c => c.id === contentId);
  if (!item) return;

  const currentUser = window.store.getCurrentUser();
  const isSaved = currentUser.savedOfflineNoteIds.includes(contentId);

  const modalDiv = document.createElement('div');
  modalDiv.className = "fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto";
  modalDiv.innerHTML = `
    <div class="bg-surface neo-border p-6 neo-shadow-lg w-full max-w-md my-auto flex flex-col gap-4 relative">
      <!-- Close Button -->
      <button id="close-note-modal" class="absolute top-3 right-3 w-8 h-8 bg-error text-white neo-border flex items-center justify-center font-bold">✕</button>

      <!-- Category Header -->
      <div class="flex items-center justify-between">
        <span class="bg-primary-container text-on-surface font-label-bold text-xs uppercase px-2 py-0.5 neo-border">
          ${item.categoryLabel || 'Note'}
        </span>
        
        <div class="flex items-center gap-2">
          <button id="btn-modal-offline" class="px-2 py-1 ${isSaved ? 'bg-tertiary text-white' : 'bg-surface-container'} neo-border font-label-bold text-xs flex items-center gap-1">
            <span class="material-symbols-outlined text-xs">${isSaved ? 'check_circle' : 'download'}</span>
            ${isSaved ? 'Saved Offline' : 'Save Offline'}
          </button>
          
          <button id="btn-modal-report" class="p-1 bg-surface text-error neo-border flex items-center justify-center">
            <span class="material-symbols-outlined text-xs">flag</span>
          </button>
        </div>
      </div>

      <!-- Title & Meta -->
      <div>
        <h2 class="font-headline-md text-2xl uppercase text-on-surface leading-tight">${item.title}</h2>
        <p class="font-label-sm text-xs text-on-surface-variant mt-1">
          Posted by <strong>@${item.authorName}</strong> · ${new Date(item.createdAt).toLocaleDateString()}
        </p>
      </div>

      <!-- Main Body Text / Markdown Renderer -->
      <div class="bg-surface-container-lowest neo-border p-4 text-xs font-body-md text-on-surface leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap">
        ${item.body}
      </div>

      <!-- External URL embedded link if present -->
      ${item.externalUrl ? `
        <div class="bg-surface-container neo-border p-3 flex flex-col gap-2">
          <span class="font-label-bold text-xs uppercase text-secondary">Curated Resource Link</span>
          <a href="${item.externalUrl}" target="_blank" class="font-body-md text-xs text-blue-700 underline break-all font-semibold">
            ${item.externalUrl}
          </a>
        </div>
      ` : ''}

      <!-- Version History Accordion / Drawer -->
      <div class="border-t-3 border-on-surface pt-3">
        <div class="flex items-center justify-between cursor-pointer" id="toggle-version-history">
          <span class="font-label-bold text-xs uppercase flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">history</span>
            Version History (${(item.versionHistory || []).length})
          </span>
          <span class="material-symbols-outlined text-sm" id="version-history-chevron">expand_more</span>
        </div>

        <div id="version-history-list" class="hidden flex-col gap-2 mt-3 max-h-40 overflow-y-auto">
          ${(item.versionHistory || []).length === 0 ? `
            <p class="font-body-md text-[11px] text-on-surface-variant italic">No previous revisions recorded.</p>
          ` : item.versionHistory.map((ver, vIdx) => `
            <div class="bg-surface-container neo-border p-2 text-[11px] flex justify-between items-center">
              <div>
                <span class="font-label-bold block">${new Date(ver.editedAt).toLocaleString()} by ${ver.editedBy}</span>
                <span class="text-on-surface-variant italic">${ver.summary}</span>
              </div>
              ${vIdx > 0 ? `
                <button data-version-idx="${vIdx}" class="btn-revert-version px-2 py-0.5 bg-primary-fixed neo-border font-label-bold text-[10px] uppercase">
                  Revert
                </button>
              ` : `
                <span class="font-label-bold text-[10px] uppercase bg-black text-white px-1.5 py-0.5">Current</span>
              `}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Action Footer -->
      <div class="flex gap-2 border-t-2 border-on-surface pt-3 border-dashed">
        <button id="btn-edit-note-body" class="flex-1 py-2 bg-secondary-container neo-border neo-shadow neo-btn font-label-bold uppercase text-xs">
          Edit Note
        </button>
        <button id="close-note-modal-btn" class="flex-1 py-2 bg-surface-container neo-border neo-shadow neo-btn font-label-bold uppercase text-xs">
          Close
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modalDiv);

  const closeModal = () => modalDiv.remove();
  document.getElementById('close-note-modal').onclick = closeModal;
  document.getElementById('close-note-modal-btn').onclick = closeModal;

  // Save Offline toggle
  document.getElementById('btn-modal-offline').onclick = () => {
    window.store.toggleOfflineNote(contentId);
    closeModal();
    window.showToast("Offline preferences updated!");
    window.router.renderCurrentView();
  };

  // Report Modal
  document.getElementById('btn-modal-report').onclick = () => {
    const reason = prompt("Enter reason for reporting this content (Spam, Inaccurate, Irrelevant):");
    if (reason) {
      window.store.reportContent(contentId, reason);
      window.showToast("Report submitted to group admin.");
    }
  };

  // Toggle Version History list
  const historyToggle = document.getElementById('toggle-version-history');
  const historyList = document.getElementById('version-history-list');
  const chevron = document.getElementById('version-history-chevron');
  if (historyToggle) {
    historyToggle.onclick = () => {
      const hidden = historyList.classList.contains('hidden');
      if (hidden) {
        historyList.classList.remove('hidden');
        historyList.classList.add('flex');
        chevron.innerText = 'expand_less';
      } else {
        historyList.classList.add('hidden');
        historyList.classList.remove('flex');
        chevron.innerText = 'expand_more';
      }
    };
  }

  // Revert version event listeners
  modalDiv.querySelectorAll('.btn-revert-version').forEach(btn => {
    btn.onclick = (e) => {
      const vIdx = parseInt(e.currentTarget.getAttribute('data-version-idx'));
      if (confirm("Revert note text to this previous revision?")) {
        window.store.revertNoteVersion(contentId, vIdx);
        closeModal();
        window.showToast("Note restored to previous version!");
        window.router.renderCurrentView();
      }
    };
  });

  // Edit Note Body
  document.getElementById('btn-edit-note-body').onclick = () => {
    const newText = prompt("Edit note body content:", item.body);
    if (newText !== null && newText !== item.body) {
      const summary = prompt("Brief summary of your changes:", "Updated content details");
      window.store.saveNoteVersion(contentId, newText, summary);
      closeModal();
      window.showToast("Saved new note revision!");
      window.router.renderCurrentView();
    }
  };
};
