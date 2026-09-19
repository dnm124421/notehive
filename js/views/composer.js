/**
 * Global Composer Modal ("+" FAB): Simplified Two-Step Flow
 * Step 1: Select Subject
 * Step 2: Upload PDF Document (with optional secondary link input)
 */

window.renderComposerModal = function(preselectedSubjectId = null, preselectedTab = 'notes') {
  const allSubjects = window.store.state.subjects || [];
  const activeSubjectId = preselectedSubjectId || (allSubjects[0] ? allSubjects[0].id : 'sbj_dp');

  const modalDiv = document.createElement('div');
  modalDiv.className = "fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto";
  modalDiv.innerHTML = `
    <div class="bg-surface neo-border p-6 neo-shadow-lg w-full max-w-md my-auto flex flex-col gap-4 relative">
      <!-- Close Button -->
      <button id="close-composer-modal" class="absolute top-3 right-3 w-8 h-8 bg-error text-white neo-border flex items-center justify-center font-bold active:translate-x-0.5 active:translate-y-0.5" title="Close Modal">✕</button>

      <!-- Modal Title -->
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

      <!-- Step 2: Upload PDF Document -->
      <div class="flex flex-col gap-1.5">
        <label class="font-label-bold text-xs uppercase flex items-center gap-1.5">
          <span class="w-5 h-5 rounded-full bg-black text-white text-[10px] font-black flex items-center justify-center">2</span>
          Upload PDF
        </label>
        <div id="composer-pdf-container" class="bg-surface-container-lowest neo-border p-3 flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span class="flex items-center gap-1.5 font-label-bold text-xs uppercase text-on-surface">
              <span class="material-symbols-outlined text-base text-error">picture_as_pdf</span>
              Attach PDF Document
            </span>
            <span class="bg-error text-white font-black text-[9px] px-1.5 py-0.5 uppercase neo-border-sm">REQUIRED *</span>
          </div>
          <input type="file" id="composer-pdf" accept="application/pdf,.pdf" class="neo-input text-xs cursor-pointer bg-surface py-2" />
          <div id="composer-pdf-status" class="font-label-sm text-[11px] text-on-surface-variant italic">
            * PDF note or assignment file required.
          </div>
        </div>
      </div>

      <!-- Optional Secondary Input: YouTube / Resource Link -->
      <div class="flex flex-col gap-1">
        <button type="button" id="btn-toggle-yt-link" class="text-xs font-label-bold text-on-surface-variant hover:text-black flex items-center gap-1 underline cursor-pointer w-fit">
          <span class="material-symbols-outlined text-sm">link</span>
          <span>Add a link instead (YouTube / Web)</span>
        </button>
        <div id="composer-yt-container" class="hidden flex-col gap-1.5 mt-2 bg-surface-container-low neo-border p-3">
          <label class="font-label-bold text-xs uppercase text-on-surface flex items-center gap-1">
            <span class="material-symbols-outlined text-sm text-tertiary">play_circle</span>
            YouTube / Resource Link
          </label>
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
  const pdfInput = modalDiv.querySelector('#composer-pdf');
  const pdfStatus = modalDiv.querySelector('#composer-pdf-status');
  const ytToggleBtn = modalDiv.querySelector('#btn-toggle-yt-link');
  const ytContainer = modalDiv.querySelector('#composer-yt-container');
  const ytInput = modalDiv.querySelector('#composer-yt-link');
  const submitBtn = modalDiv.querySelector('#btn-submit-post');
  const previewBox = modalDiv.querySelector('#composer-auto-preview');
  const previewTitle = modalDiv.querySelector('#composer-preview-title');
  const previewTags = modalDiv.querySelector('#composer-preview-tags');

  // Title formatting helper
  function formatTitleFromFilename(filename, subjectName) {
    if (!filename) return `${subjectName} Note`;
    let clean = filename.replace(/\.[^/.]+$/, ""); // strip extension
    clean = clean.replace(/[-_.]+/g, " "); // replace dashes/underscores with spaces
    clean = clean.replace(/\(\d+\)/g, "").replace(/\bcopy\b/gi, "").trim();
    if (!clean) return `${subjectName} Note`;
    return clean.split(' ').map(w => w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : '').join(' ');
  }

  // Tags auto-generation helper
  function generateAutoTags(subjectName, isYoutube = false) {
    const tags = [];
    if (subjectName) {
      tags.push('#' + subjectName.toLowerCase().replace(/[^a-z0-9]/g, ''));
    }
    tags.push('#notes');
    if (isYoutube) {
      tags.push('#video');
      tags.push('#yt-resource');
    } else {
      tags.push('#pdf');
      tags.push('#hive-resource');
    }
    return tags;
  }

  // Check form validity and update UI & button states
  function updateState() {
    const selectedSubjectId = subjectSelect.value;
    const subjectObj = allSubjects.find(s => s.id === selectedSubjectId);
    const subjectName = subjectObj ? subjectObj.name : 'General';
    const hasPdf = !!pdfData && !!pdfName;
    const ytUrl = ytInput.value.trim();
    const hasYt = !!ytUrl;

    const isValid = selectedSubjectId && (hasPdf || hasYt);

    if (isValid) {
      submitBtn.disabled = false;
      submitBtn.className = "py-3 bg-primary-fixed text-black neo-border neo-shadow neo-btn cursor-pointer font-label-bold uppercase text-sm flex items-center justify-center gap-2 mt-1 opacity-100 transition-all";
      
      // Update preview badge
      previewBox.classList.remove('hidden');
      previewBox.classList.add('flex', 'flex-col');
      
      let derivedTitle = '';
      let derivedTags = [];
      if (hasPdf) {
        derivedTitle = formatTitleFromFilename(pdfName, subjectName);
        derivedTags = generateAutoTags(subjectName, false);
      } else if (hasYt) {
        derivedTitle = `${subjectName} — Resource Link`;
        derivedTags = generateAutoTags(subjectName, true);
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

  // Toggle optional YouTube input
  if (ytToggleBtn) {
    ytToggleBtn.onclick = () => {
      if (ytContainer.classList.contains('hidden')) {
        ytContainer.classList.remove('hidden');
        ytContainer.classList.add('flex');
        ytToggleBtn.innerHTML = `<span class="material-symbols-outlined text-sm">remove</span> Hide link option`;
      } else {
        ytContainer.classList.add('hidden');
        ytContainer.classList.remove('flex');
        ytInput.value = '';
        ytToggleBtn.innerHTML = `<span class="material-symbols-outlined text-sm">link</span> Add a link instead (YouTube / Web)`;
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
    const hasPdf = !!pdfData && !!pdfName;
    const externalUrl = ytInput.value.trim();

    if (!hasPdf && !externalUrl) {
      alert("Please attach a PDF file or provide a resource URL!");
      return;
    }

    let title = '';
    let selectedType = 'note';
    let tabTarget = 'notes';
    let categoryLabel = 'Member Note';
    let tags = [];

    if (hasPdf) {
      title = formatTitleFromFilename(pdfName, subjectName);
      selectedType = 'note';
      tabTarget = 'notes';
      categoryLabel = 'Member Note';
      tags = generateAutoTags(subjectName, false);
    } else {
      title = `${subjectName} — Resource Link`;
      selectedType = 'resource_link';
      tabTarget = 'resources';
      categoryLabel = 'Curated Link';
      tags = generateAutoTags(subjectName, true);
    }

    window.store.createContent({
      subjectId,
      tab: tabTarget,
      type: selectedType,
      title,
      body: `Auto-derived resource for ${subjectName}`,
      externalUrl: selectedType === 'resource_link' ? externalUrl : null,
      pdfName: hasPdf ? pdfName : null,
      pdfData: hasPdf ? pdfData : null,
      pdfSize: hasPdf ? pdfSize : null,
      tags,
      categoryLabel
    });

    closeModal();
    window.showToast("Published! PDF Attached & +50 pts added to your profile.");
    window.router.navigate('subjectDetail', { subjectId, tab: tabTarget });
  };
};
