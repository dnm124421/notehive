/**
 * Global Composer Modal ("+" FAB): Post Notes, Assignments, or YT Links
 */

window.renderComposerModal = function(preselectedSubjectId = null, preselectedTab = 'notes') {
  const allSubjects = window.store.state.subjects;
  const activeSubjectId = preselectedSubjectId || (allSubjects[0] ? allSubjects[0].id : 'sbj_dp');

  let selectedType = 'note';
  if (preselectedTab === 'assignments') selectedType = 'assignment';
  if (preselectedTab === 'resources') selectedType = 'resource_link';

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
        <button type="button" data-type="note" class="btn-select-type flex-1 py-2 ${selectedType === 'note' ? 'bg-primary-container' : 'bg-surface'} neo-border font-label-bold text-xs uppercase text-center">
          Note
        </button>
        <button type="button" data-type="assignment" class="btn-select-type flex-1 py-2 ${selectedType === 'assignment' ? 'bg-primary-container' : 'bg-surface'} neo-border font-label-bold text-xs uppercase text-center">
          Assignment
        </button>
        <button type="button" data-type="resource_link" class="btn-select-type flex-1 py-2 ${selectedType === 'resource_link' ? 'bg-primary-container' : 'bg-surface'} neo-border font-label-bold text-xs uppercase text-center">
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

        <div id="composer-link-container" class="${selectedType === 'resource_link' ? 'flex' : 'hidden'} flex-col gap-1">
          <label class="font-label-bold text-xs uppercase">Resource URL (YouTube / Article / Link)</label>
          <input id="composer-link" class="neo-input text-xs" placeholder="https://www.youtube.com/watch?v=..." />
        </div>

        <!-- Compulsory PDF Attachment for Notes & Assignments -->
        <div id="composer-pdf-container" class="${selectedType === 'resource_link' ? 'hidden' : 'flex'} flex-col gap-1 bg-surface-container-lowest neo-border p-3">
          <label class="font-label-bold text-xs uppercase text-on-surface flex items-center justify-between">
            <span class="flex items-center gap-1">
              <span class="material-symbols-outlined text-sm text-error">picture_as_pdf</span>
              Attach PDF File
            </span>
            <span class="bg-error text-white font-black text-[9px] px-1.5 py-0.5 uppercase neo-border-sm">COMPULSORY *</span>
          </label>
          <input type="file" id="composer-pdf" accept="application/pdf,.pdf" class="neo-input text-xs cursor-pointer bg-surface" />
          <div id="composer-pdf-status" class="font-label-sm text-[11px] text-error font-bold italic">
            * A PDF document file is required for Notes & Assignments.
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <label class="font-label-bold text-xs uppercase">Content Body / Summary</label>
          <textarea id="composer-body" class="neo-input text-xs h-24" placeholder="Write key notes, steps, or explanation..."></textarea>
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

  let pdfName = null;
  let pdfData = null;
  let pdfSize = null;

  // File Upload Reader Handler
  const pdfInput = modalDiv.querySelector('#composer-pdf');
  const pdfStatus = modalDiv.querySelector('#composer-pdf-status');

  if (pdfInput) {
    pdfInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
          alert('Please select a valid PDF document!');
          pdfInput.value = '';
          pdfName = null;
          pdfData = null;
          pdfSize = null;
          pdfStatus.className = 'font-label-sm text-[11px] text-error font-bold italic';
          pdfStatus.innerText = '* A PDF document file is required for Notes & Assignments.';
          return;
        }
        pdfName = file.name;
        pdfSize = (file.size / 1024).toFixed(1) + ' KB';

        const reader = new FileReader();
        reader.onload = function(evt) {
          pdfData = evt.target.result;
          pdfStatus.className = 'font-label-sm text-[11px] text-secondary font-black flex items-center gap-1';
          pdfStatus.innerHTML = `<span class="material-symbols-outlined text-xs">check_circle</span> Attached: ${pdfName} (${pdfSize})`;
        };
        reader.readAsDataURL(file);
      }
    };
  }

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
      const pdfContainer = document.getElementById('composer-pdf-container');

      if (selectedType === 'resource_link') {
        linkContainer.classList.remove('hidden');
        linkContainer.classList.add('flex');
        pdfContainer.classList.add('hidden');
        pdfContainer.classList.remove('flex');
      } else {
        linkContainer.classList.add('hidden');
        linkContainer.classList.remove('flex');
        pdfContainer.classList.remove('hidden');
        pdfContainer.classList.add('flex');
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

    // Compulsory check for PDF in Notes and Assignments
    if ((selectedType === 'note' || selectedType === 'assignment') && (!pdfData || !pdfName)) {
      alert("COMPULSORY REQUIREMENT: You must attach a PDF file before publishing Notes or Assignments!");
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
      pdfName: (selectedType === 'note' || selectedType === 'assignment') ? pdfName : null,
      pdfData: (selectedType === 'note' || selectedType === 'assignment') ? pdfData : null,
      pdfSize: (selectedType === 'note' || selectedType === 'assignment') ? pdfSize : null,
      tags,
      categoryLabel: selectedType === 'resource_link' ? 'Curated Link' : (selectedType === 'assignment' ? 'Assignment Sol.' : 'Member Note')
    });

    closeModal();
    window.showToast("Published! PDF Attached & Members notified immediately.");
    window.router.navigate('subjectDetail', { subjectId, tab: tabTarget });
  };
};

