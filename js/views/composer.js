/**
 * Global Composer Modal ("+" FAB): Post Notes, Assignments, or YT Links
 */

window.renderComposerModal = function(preselectedSubjectId = null) {
  const allSubjects = window.store.state.subjects;
  const activeSubjectId = preselectedSubjectId || (allSubjects[0] ? allSubjects[0].id : 'sbj_dp');

  const modalDiv = document.createElement('div');
  modalDiv.className = "fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto";
  modalDiv.innerHTML = `
    <div class="bg-surface neo-border p-6 neo-shadow-lg w-full max-w-md my-auto flex flex-col gap-4 relative">
      <!-- Close Button -->
      <button id="close-composer-modal" class="absolute top-3 right-3 w-8 h-8 bg-error text-white neo-border flex items-center justify-center font-bold">✕</button>

      <div class="flex items-center gap-2">
        <div class="w-10 h-10 bg-primary-fixed neo-border neo-shadow-sm flex items-center justify-center">
          <span class="material-symbols-outlined text-xl">post_add</span>
        </div>
        <div>
          <h2 class="font-headline-md text-xl uppercase leading-none">Share Contribution</h2>
          <p class="font-label-sm text-xs text-on-surface-variant">Post notes, links, or assignment solutions to your hive.</p>
        </div>
      </div>

      <!-- Content Type Selector -->
      <div class="flex gap-2">
        <button type="button" data-type="note" class="btn-select-type flex-1 py-2 bg-primary-container neo-border font-label-bold text-xs uppercase text-center active-type">
          Note
        </button>
        <button type="button" data-type="assignment" class="btn-select-type flex-1 py-2 bg-surface neo-border font-label-bold text-xs uppercase text-center">
          Assignment
        </button>
        <button type="button" data-type="resource_link" class="btn-select-type flex-1 py-2 bg-surface neo-border font-label-bold text-xs uppercase text-center">
          YT Link
        </button>
      </div>

      <!-- Form Inputs -->
      <div class="flex flex-col gap-3">
        <div class="flex flex-col gap-1">
          <label class="font-label-bold text-xs uppercase">Subject</label>
          <select id="composer-subject" class="neo-input text-xs">
            ${allSubjects.map(s => `
              <option value="${s.id}" ${s.id === activeSubjectId ? 'selected' : ''}>
                ${s.name}
              </option>
            `).join('')}
          </select>
        </div>

        <div class="flex flex-col gap-1">
          <label class="font-label-bold text-xs uppercase">Title</label>
          <input id="composer-title" class="neo-input text-xs" placeholder="e.g. Scaling & Normalization Blueprint" />
        </div>

        <div id="composer-link-container" class="hidden flex-col gap-1">
          <label class="font-label-bold text-xs uppercase">Resource URL (YouTube / Article / PDF)</label>
          <input id="composer-link" class="neo-input text-xs" placeholder="https://www.youtube.com/watch?v=..." />
        </div>

        <div class="flex flex-col gap-1">
          <label class="font-label-bold text-xs uppercase">Content Body / Summary</label>
          <textarea id="composer-body" class="neo-input text-xs h-28" placeholder="Write key notes, steps, or explanation..."></textarea>
        </div>

        <div class="flex flex-col gap-1">
          <label class="font-label-bold text-xs uppercase">Tags (comma separated)</label>
          <input id="composer-tags" class="neo-input text-xs" value="#unit3, #important" placeholder="#unit3, #exam-2026" />
        </div>
      </div>

      <!-- Action Button -->
      <button id="btn-submit-post" class="py-3 bg-primary-fixed neo-border neo-shadow neo-btn font-label-bold uppercase text-sm flex items-center justify-center gap-2 mt-2">
        <span class="material-symbols-outlined">send</span>
        Publish to Hive (+50 pts)
      </button>
    </div>
  `;

  document.body.appendChild(modalDiv);

  let selectedType = 'note';

  // Toggle Type Selection
  modalDiv.querySelectorAll('.btn-select-type').forEach(btn => {
    btn.onclick = (e) => {
      modalDiv.querySelectorAll('.btn-select-type').forEach(b => {
        b.classList.remove('bg-primary-container');
        b.classList.add('bg-surface');
      });
      e.currentTarget.classList.remove('bg-surface');
      e.currentTarget.classList.add('bg-primary-container');
      selectedType = e.currentTarget.getAttribute('data-type');

      const linkContainer = document.getElementById('composer-link-container');
      if (selectedType === 'resource_link') {
        linkContainer.classList.remove('hidden');
        linkContainer.classList.add('flex');
      } else {
        linkContainer.classList.add('hidden');
        linkContainer.classList.remove('flex');
      }
    };
  });

  const closeModal = () => modalDiv.remove();
  document.getElementById('close-composer-modal').onclick = closeModal;

  // Submit Post
  document.getElementById('btn-submit-post').onclick = () => {
    const subjectId = document.getElementById('composer-subject').value;
    const title = document.getElementById('composer-title').value.trim();
    const body = document.getElementById('composer-body').value.trim();
    const externalUrl = document.getElementById('composer-link').value.trim();
    const tagRaw = document.getElementById('composer-tags').value;
    const tags = tagRaw.split(',').map(t => t.trim()).filter(t => t.length > 0);

    if (!title) {
      alert("Please enter a title for your contribution!");
      return;
    }

    let tabTarget = 'notes';
    if (selectedType === 'assignment') tabTarget = 'assignments';
    if (selectedType === 'resource_link') tabTarget = 'resources';

    const newContent = window.store.createContent({
      subjectId,
      tab: tabTarget,
      type: selectedType,
      title,
      body,
      externalUrl: selectedType === 'resource_link' ? externalUrl : null,
      tags,
      categoryLabel: selectedType === 'resource_link' ? 'Curated Link' : 'Member Post'
    });

    closeModal();
    window.showToast("Published! Members notified immediately.");
    window.router.navigate('subjectDetail', { subjectId, tab: tabTarget });
  };
};
