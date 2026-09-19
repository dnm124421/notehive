/**
 * Global Composer Modal ("+" FAB): Clean Flow with 4 Contribution Types
 * Categories: Notes, Assignment, Exam Prep, YT Link
 * - Notes, Assignment, Exam Prep require PDF attachment
 * - YT Link requires pasting a URL
 */

window.renderComposerModal = function(preselectedSubjectId = null, preselectedTab = 'notes') {
  const allSubjects = window.store.state.subjects || [];
  const activeSubjectId = preselectedSubjectId || (allSubjects[0] ? allSubjects[0].id : 'sbj_dp');

  let selectedType = 'note';
  if (preselectedTab === 'assignments') selectedType = 'assignment';
  if (preselectedTab === 'exam_prep') selectedType = 'exam_prep';
  if (preselectedTab === 'resources') selectedType = 'resource_link';

  const modalDiv = document.createElement('div');
  modalDiv.className = "fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto";
  modalDiv.innerHTML = `
    <div class="bg-surface neo-border p-6 neo-shadow-lg w-full max-w-md my-auto flex flex-col gap-4 relative">
      <!-- Close Button -->
      <button id="close-composer-modal" class="absolute top-3 right-3 w-8 h-8 bg-error text-white neo-border flex items-center justify-center font-bold active:translate-x-0.5 active:translate-y-0.5" title="Close Modal">✕</button>

      <!-- Modal Header -->
      <div class="flex items-center gap-3 pr-8">
        <div class="w-10 h-10 bg-primary-fixed neo-border neo-shadow-sm flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined text-xl text-black font-bold">post_add</span>
        </div>
        <div>
          <h2 class="font-headline-md text-xl uppercase leading-none">Share Contribution</h2>
          <p class="font-label-sm text-xs text-on-surface-variant mt-0.5">Post notes or reference material to earn +50 pts</p>
        </div>
      </div>

      <!-- Step 1: Select Subject -->
      <div class="flex flex-col gap-1.5">
        <label class="font-label-bold text-xs uppercase flex items-center gap-1.5">
          <span class="w-5 h-5 rounded-full bg-black text-white text-[10px] font-black flex items-center justify-center">1</span>
          Subject
        </label>
        <select id="composer-subject" class="neo-input text-xs font-label-bold cursor-pointer py-2.5">
          ${allSubjects.map(s => `
            <option value="${s.id}" ${s.id === activeSubjectId ? 'selected' : ''}>
              ${s.name}
            </option>
          `).join('')}
        </select>
      </div>

      <!-- Step 2: Select Type -->
      <div class="flex flex-col gap-1.5">
        <label class="font-label-bold text-xs uppercase flex items-center gap-1.5">
          <span class="w-5 h-5 rounded-full bg-black text-white text-[10px] font-black flex items-center justify-center">2</span>
          Category
        </label>
        <div class="grid grid-cols-4 gap-1.5">
          <button type="button" data-type="note" class="btn-select-category py-2 neo-border font-label-bold text-[11px] uppercase text-center transition-all ${selectedType === 'note' ? 'bg-primary-container neo-shadow' : 'bg-surface'}">
            Notes
          </button>
          <button type="button" data-type="assignment" class="btn-select-category py-2 neo-border font-label-bold text-[11px] uppercase text-center transition-all ${selectedType === 'assignment' ? 'bg-primary-container neo-shadow' : 'bg-surface'}">
            Assignment
          </button>
          <button type="button" data-type="exam_prep" class="btn-select-category py-2 neo-border font-label-bold text-[11px] uppercase text-center transition-all ${selectedType === 'exam_prep' ? 'bg-primary-container neo-shadow' : 'bg-surface'}">
            Exam Prep
          </button>
          <button type="button" data-type="resource_link" class="btn-select-category py-2 neo-border font-label-bold text-[11px] uppercase text-center transition-all ${selectedType === 'resource_link' ? 'bg-primary-container neo-shadow' : 'bg-surface'}">
            YT Link
          </button>
        </div>
      </div>

      <!-- Step 3 (Dynamic): PDF Upload for Notes/Assignment/Exam Prep -->
      <div id="composer-pdf-section" class="${selectedType === 'resource_link' ? 'hidden' : 'flex'} flex-col gap-1.5">
        <label class="font-label-bold text-xs uppercase flex items-center gap-1.5">
          <span class="w-5 h-5 rounded-full bg-black text-white text-[10px] font-black flex items-center justify-center">3</span>
          Upload PDF Document
        </label>
        <div class="bg-surface-container-lowest neo-border p-3 flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span class="flex items-center gap-1.5 font-label-bold text-xs uppercase text-on-surface">
              <span class="material-symbols-outlined text-base text-error">picture_as_pdf</span>
              Attach PDF File
            </span>
            <span class="bg-error text-white font-black text-[9px] px-1.5 py-0.5 uppercase neo-border-sm">REQUIRED *</span>
          </div>
          <input type="file" id="composer-pdf" accept="application/pdf,.pdf" class="neo-input text-xs cursor-pointer bg-surface py-2" />
          <div id="composer-pdf-status" class="font-label-sm text-[11px] text-on-surface-variant italic">
            * PDF file required for Notes, Assignments & Exam Prep.
          </div>
        </div>
      </div>

      <!-- Step 3 (Dynamic): Resource Link for YT Link -->
      <div id="composer-link-section" class="${selectedType === 'resource_link' ? 'flex' : 'hidden'} flex-col gap-1.5">
        <label class="font-label-bold text-xs uppercase flex items-center gap-1.5">
          <span class="w-5 h-5 rounded-full bg-black text-white text-[10px] font-black flex items-center justify-center">3</span>
          Paste Link
        </label>
        <div class="bg-surface-container-lowest neo-border p-3 flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span class="flex items-center gap-1.5 font-label-bold text-xs uppercase text-on-surface">
              <span class="material-symbols-outlined text-base text-tertiary">play_circle</span>
              Paste YouTube / Resource URL
            </span>
            <span class="bg-tertiary text-white font-black text-[9px] px-1.5 py-0.5 uppercase neo-border-sm">REQUIRED *</span>
          </div>
          <input id="composer-yt-link" class="neo-input text-xs bg-surface" placeholder="https://www.youtube.com/watch?v=..." />
        </div>
      </div>

      <!-- Auto-derived Metadata Preview Badge -->
      <div id="composer-auto-preview" class="hidden bg-primary-container neo-border p-2.5 text-xs font-label-bold">
        <div class="text-[10px] uppercase text-on-surface-variant font-black mb-0.5">Auto-Derived Title & Tags</div>
        <div id="composer-preview-title" class="font-headline-md text-xs truncate"></div>
        <div id="composer-preview-tags" class="text-[10px] text-on-surface-variant mt-1 flex flex-wrap gap-1"></div>
      </div>

      <!-- Action Button -->
      <button id="btn-submit-post" disabled class="py-3 bg-surface-container text-on-surface-variant neo-border opacity-50 cursor-not-allowed font-label-bold uppercase text-sm flex items-center justify-center gap-2 mt-1 transition-all">
        <span class="material-symbols-outlined text-lg">send</span>
        Publish to Hive (+50 pts)
      </button>
    </div>
  `;

  document.body.appendChild(modalDiv);

  let pdfName = null;
  let pdfData = null;
  let pdfSize = null;

  const subjectSelect = modalDiv.querySelector('#composer-subject');
  const pdfSection = modalDiv.querySelector('#composer-pdf-section');
  const pdfInput = modalDiv.querySelector('#composer-pdf');
  const pdfStatus = modalDiv.querySelector('#composer-pdf-status');
  const linkSection = modalDiv.querySelector('#composer-link-section');
  const ytInput = modalDiv.querySelector('#composer-yt-link');
  const submitBtn = modalDiv.querySelector('#btn-submit-post');
  const previewBox = modalDiv.querySelector('#composer-auto-preview');
  const previewTitle = modalDiv.querySelector('#composer-preview-title');
  const previewTags = modalDiv.querySelector('#composer-preview-tags');

  // Title formatting helper
  function formatTitleFromFilename(filename, subjectName, categoryType) {
    if (!filename) return `${subjectName} ${categoryType.toUpperCase()}`;
    let clean = filename.replace(/\.[^/.]+$/, ""); // strip extension
    clean = clean.replace(/[-_.]+/g, " "); // replace dashes/underscores with spaces
    clean = clean.replace(/\(\d+\)/g, "").replace(/\bcopy\b/gi, "").trim();
    if (!clean) return `${subjectName} Document`;
    return clean.split(' ').map(w => w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : '').join(' ');
  }

  // Tags auto-generation helper
  function generateAutoTags(subjectName, categoryType) {
    const tags = [];
    if (subjectName) {
      tags.push('#' + subjectName.toLowerCase().replace(/[^a-z0-9]/g, ''));
    }
    if (categoryType === 'resource_link') {
      tags.push('#video');
      tags.push('#yt-resource');
    } else if (categoryType === 'exam_prep') {
      tags.push('#exam-prep');
      tags.push('#pdf');
    } else if (categoryType === 'assignment') {
      tags.push('#assignment');
      tags.push('#pdf');
    } else {
      tags.push('#notes');
      tags.push('#pdf');
    }
    return tags;
  }

  // Check form validity and update UI & button states
  function updateState() {
    const selectedSubjectId = subjectSelect.value;
    const subjectObj = allSubjects.find(s => s.id === selectedSubjectId);
    const subjectName = subjectObj ? subjectObj.name : 'General';
    const isPdfType = selectedType !== 'resource_link';

    const hasPdf = isPdfType && !!pdfData && !!pdfName;
    const ytUrl = ytInput.value.trim();
    const hasYt = !isPdfType && !!ytUrl;

    const isValid = selectedSubjectId && (hasPdf || hasYt);

    if (isValid) {
      submitBtn.disabled = false;
      submitBtn.className = "py-3 bg-primary-fixed text-black neo-border neo-shadow neo-btn cursor-pointer font-label-bold uppercase text-sm flex items-center justify-center gap-2 mt-1 opacity-100 transition-all";
      
      // Update preview badge
      previewBox.classList.remove('hidden');
      previewBox.classList.add('flex', 'flex-col');
      
      let derivedTitle = '';
      let derivedTags = generateAutoTags(subjectName, selectedType);
      
      if (hasPdf) {
        derivedTitle = formatTitleFromFilename(pdfName, subjectName, selectedType);
      } else if (hasYt) {
        derivedTitle = `${subjectName} — Video Resource`;
      }

      previewTitle.innerText = derivedTitle;
      previewTags.innerHTML = derivedTags.map(t => `<span class="bg-surface neo-border px-1.5 py-0.5">${t}</span>`).join('');
    } else {
      submitBtn.disabled = true;
      submitBtn.className = "py-3 bg-surface-container text-on-surface-variant neo-border opacity-50 cursor-not-allowed font-label-bold uppercase text-sm flex items-center justify-center gap-2 mt-1 transition-all";
      previewBox.classList.add('hidden');
      previewBox.classList.remove('flex', 'flex-col');
    }
  }

  // Type Selector Handler
  modalDiv.querySelectorAll('.btn-select-category').forEach(btn => {
    btn.onclick = (e) => {
      modalDiv.querySelectorAll('.btn-select-category').forEach(b => {
        b.classList.remove('bg-primary-container', 'neo-shadow');
        b.classList.add('bg-surface');
      });
      e.currentTarget.classList.remove('bg-surface');
      e.currentTarget.classList.add('bg-primary-container', 'neo-shadow');
      selectedType = e.currentTarget.getAttribute('data-type');

      if (selectedType === 'resource_link') {
        pdfSection.classList.add('hidden');
        pdfSection.classList.remove('flex');
        linkSection.classList.remove('hidden');
        linkSection.classList.add('flex');
      } else {
        linkSection.classList.add('hidden');
        linkSection.classList.remove('flex');
        pdfSection.classList.remove('hidden');
        pdfSection.classList.add('flex');
      }

      updateState();
    };
  });

  // File Upload Handler
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
          pdfStatus.innerText = '* A PDF document file is required.';
          updateState();
          return;
        }
        pdfName = file.name;
        pdfSize = (file.size / 1024).toFixed(1) + ' KB';

        const reader = new FileReader();
        reader.onload = function(evt) {
          pdfData = evt.target.result;
          pdfStatus.className = 'font-label-sm text-[11px] text-secondary font-black flex items-center gap-1';
          pdfStatus.innerHTML = `<span class="material-symbols-outlined text-xs">check_circle</span> Attached: ${pdfName} (${pdfSize})`;
          updateState();
        };
        reader.readAsDataURL(file);
      } else {
        pdfName = null;
        pdfData = null;
        pdfSize = null;
        pdfStatus.className = 'font-label-sm text-[11px] text-on-surface-variant italic';
        pdfStatus.innerText = '* PDF note or assignment file required.';
        updateState();
      }
    };
  }

  // Subject dropdown change listener
  subjectSelect.onchange = () => {
    updateState();
  };

  // YouTube input listener
  ytInput.oninput = () => {
    updateState();
  };

  const closeModal = () => modalDiv.remove();
  document.getElementById('close-composer-modal').onclick = closeModal;

  // Submit Handler
  submitBtn.onclick = () => {
    const subjectId = subjectSelect.value;
    const subjectObj = allSubjects.find(s => s.id === subjectId);
    const subjectName = subjectObj ? subjectObj.name : 'General';
    const isPdfType = selectedType !== 'resource_link';
    const hasPdf = isPdfType && !!pdfData && !!pdfName;
    const externalUrl = ytInput.value.trim();

    if (isPdfType && !hasPdf) {
      alert("Please attach a PDF file before publishing!");
      return;
    }
    if (!isPdfType && !externalUrl) {
      alert("Please paste a resource link before publishing!");
      return;
    }

    let title = '';
    let tabTarget = 'notes';
    let categoryLabel = 'Member Note';
    let tags = generateAutoTags(subjectName, selectedType);

    if (selectedType === 'assignment') {
      tabTarget = 'assignments';
      categoryLabel = 'Assignment Sol.';
    } else if (selectedType === 'exam_prep') {
      tabTarget = 'exam_prep';
      categoryLabel = 'Exam Prep';
    } else if (selectedType === 'resource_link') {
      tabTarget = 'resources';
      categoryLabel = 'Curated Link';
    } else {
      tabTarget = 'notes';
      categoryLabel = 'Member Note';
    }

    if (hasPdf) {
      title = formatTitleFromFilename(pdfName, subjectName, selectedType);
    } else {
      title = `${subjectName} — Video Resource`;
    }

    window.store.createContent({
      subjectId,
      tab: tabTarget,
      type: selectedType,
      title,
      body: `Auto-derived ${categoryLabel} for ${subjectName}`,
      externalUrl: selectedType === 'resource_link' ? externalUrl : null,
      pdfName: hasPdf ? pdfName : null,
      pdfData: hasPdf ? pdfData : null,
      pdfSize: hasPdf ? pdfSize : null,
      tags,
      categoryLabel
    });

    closeModal();
    window.showToast(`Published to ${tabTarget.replace('_', ' ')}! +50 pts added.`);
    window.router.navigate('subjectDetail', { subjectId, tab: tabTarget });
  };
};
