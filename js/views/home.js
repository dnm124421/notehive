/**
 * Home View: Joined Groups, Group Discovery, and Custom Group Creation
 */

window.renderHomeView = function(container) {
  const currentUser = window.store.getCurrentUser();
  const allGroups = window.store.getGroups();
  const joinedGroups = allGroups.filter(g => currentUser.joinedGroupIds.includes(g.id));
  const discoverGroups = allGroups.filter(g => !currentUser.joinedGroupIds.includes(g.id));

  container.innerHTML = `
    <div class="flex flex-col w-full min-h-screen bg-background pb-28 pt-20 px-4 max-w-md mx-auto">
      <!-- Header Banner -->
      <div class="flex flex-col gap-2 bg-primary-container neo-border p-4 neo-shadow relative mb-6">
        <div class="absolute -top-3 -right-2 bg-tertiary text-white neo-border px-2 py-0.5 transform rotate-6">
          <span class="font-label-bold text-xs uppercase">COLLEGE HUB</span>
        </div>
        <h1 class="font-headline-lg-mobile text-on-surface uppercase leading-none">
          Your <br/><span class="text-tertiary">Hives</span>
        </h1>
        <p class="font-body-md text-on-surface-variant">
          Private department spaces & custom study circles. High voltage notes.
        </p>
      </div>

      <!-- Quick Action Bar -->
      <div class="flex gap-2 mb-6">
        <button id="btn-create-group-modal" class="flex-1 py-3 bg-secondary-container neo-border neo-shadow neo-btn font-label-bold uppercase text-xs flex items-center justify-center gap-1">
          <span class="material-symbols-outlined text-sm">add_circle</span>
          Create Group
        </button>
        <button id="btn-join-token-modal" class="flex-1 py-3 bg-tertiary-container neo-border neo-shadow neo-btn font-label-bold uppercase text-xs flex items-center justify-center gap-1">
          <span class="material-symbols-outlined text-sm">link</span>
          Join via Link
        </button>
      </div>

      <!-- Joined Groups Section -->
      <div class="flex flex-col gap-4 mb-8">
        <div class="flex items-center justify-between border-b-3 border-on-surface pb-2">
          <h2 class="font-headline-md text-xl uppercase text-on-surface">Joined Hives</h2>
          <span class="bg-black text-white font-label-bold text-xs px-2 py-0.5">${joinedGroups.length} Active</span>
        </div>

        ${joinedGroups.map(group => `
          <div class="bg-surface-container-lowest neo-border p-4 neo-shadow relative group">
            <div class="flex justify-between items-start mb-2">
              <div>
                <span class="font-label-bold text-xs uppercase px-2 py-0.5 ${group.type === 'department' ? 'bg-primary-container' : 'bg-secondary-container'} neo-border inline-block mb-1">
                  ${group.type}
                </span>
                <h3 class="font-headline-md text-lg text-on-surface uppercase leading-snug">${group.name}</h3>
              </div>
              <button data-group-id="${group.id}" class="btn-enter-group w-10 h-10 neo-border bg-primary-fixed neo-shadow neo-btn flex items-center justify-center">
                <span class="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
            <p class="font-body-md text-xs text-on-surface-variant line-clamp-2 mb-3">${group.description}</p>
            <div class="flex items-center justify-between text-xs font-label-bold border-t-2 border-on-surface pt-2 border-dashed">
              <span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm">group</span> ${group.memberCount} Members</span>
              <span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm">auto_stories</span> ${group.subjectIds.length} Subjects</span>
              <button data-group-id="${group.id}" class="btn-share-whatsapp text-secondary font-label-bold flex items-center gap-0.5 underline">
                <span class="material-symbols-outlined text-sm">chat</span> WhatsApp
              </button>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Checkered Divider -->
      <div class="checkered-divider mb-8"></div>

      <!-- Discoverable Groups Section -->
      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between border-b-3 border-on-surface pb-2">
          <h2 class="font-headline-md text-xl uppercase text-on-surface">Discover Hives</h2>
          <span class="font-label-sm text-xs text-on-surface-variant">Request Access</span>
        </div>

        ${discoverGroups.length === 0 ? `
          <p class="font-body-md text-sm text-on-surface-variant italic">You have joined all available department hives!</p>
        ` : discoverGroups.map(group => {
          const req = window.store.getJoinRequests().find(r => r.groupId === group.id && r.userId === currentUser.id);
          const isPending = req && req.status === 'pending';

          return `
            <div class="bg-surface-container neo-border p-4 neo-shadow relative opacity-90">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <span class="font-label-bold text-xs uppercase px-2 py-0.5 bg-surface-container-highest neo-border inline-block mb-1">
                    ${group.type}
                  </span>
                  <h3 class="font-headline-md text-base text-on-surface uppercase leading-tight">${group.name}</h3>
                </div>
                ${isPending ? `
                  <span class="px-2 py-1 bg-tertiary-container neo-border font-label-bold text-xs uppercase">
                    Pending Admin
                  </span>
                ` : `
                  <button data-group-id="${group.id}" class="btn-request-access px-3 py-1.5 bg-primary-fixed neo-border neo-shadow neo-btn font-label-bold text-xs uppercase">
                    Request Join
                  </button>
                `}
              </div>
              <p class="font-body-md text-xs text-on-surface-variant line-clamp-2 mb-3">${group.description}</p>
              <div class="flex items-center gap-4 text-xs font-label-bold text-on-surface-variant">
                <span><span class="material-symbols-outlined text-sm">group</span> ${group.memberCount} Members</span>
                <span><span class="material-symbols-outlined text-sm">lock</span> Private Content</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Modals Container -->
    <div id="home-modals"></div>
  `;

  // Event Listeners for enter group
  container.querySelectorAll('.btn-enter-group').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const gid = e.currentTarget.getAttribute('data-group-id');
      window.router.navigate('subjects', { groupId: gid });
    });
  });

  // Share WhatsApp Link Modal
  container.querySelectorAll('.btn-share-whatsapp').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const gid = e.currentTarget.getAttribute('data-group-id');
      const group = window.store.getGroupById(gid);
      window.renderWhatsAppModal(group);
    });
  });

  // Request Access Handler
  container.querySelectorAll('.btn-request-access').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const gid = e.currentTarget.getAttribute('data-group-id');
      const msg = prompt("Enter a brief note for the group admin:");
      if (msg !== null) {
        window.store.requestJoinGroup(gid, msg);
        window.showToast("Join request sent to admin!");
        window.router.renderCurrentView();
      }
    });
  });

  // Modal Triggers
  document.getElementById('btn-create-group-modal').addEventListener('click', () => {
    window.renderCreateGroupModal();
  });

  document.getElementById('btn-join-token-modal').addEventListener('click', () => {
    const token = prompt("Paste Group Invite Token (e.g. ds-dept-2026-secret):");
    if (token) {
      const group = window.store.getGroups().find(g => g.inviteLinkToken === token);
      if (group) {
        if (!currentUser.joinedGroupIds.includes(group.id)) {
          currentUser.joinedGroupIds.push(group.id);
          group.memberIds.push(currentUser.id);
          group.memberCount++;
          window.store.save();
          window.showToast(`Joined ${group.name}!`);
          window.router.navigate('subjects', { groupId: group.id });
        } else {
          window.showToast("You are already a member of this group!");
        }
      } else {
        alert("Invalid invite token!");
      }
    }
  });
};

// Create Custom Group Modal Helper
window.renderCreateGroupModal = function() {
  const modalDiv = document.createElement('div');
  modalDiv.className = "fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4";
  modalDiv.innerHTML = `
    <div class="bg-surface neo-border p-6 neo-shadow-lg w-full max-w-sm flex flex-col gap-4 relative animate-pulse-short">
      <button id="close-create-modal" class="absolute top-3 right-3 w-8 h-8 bg-error text-white neo-border flex items-center justify-center font-bold">✕</button>
      <h2 class="font-headline-md text-xl uppercase">Create Hive Space</h2>
      
      <div class="flex flex-col gap-1">
        <label class="font-label-bold text-xs uppercase">Group Name</label>
        <input id="create-group-name" class="neo-input" placeholder="e.g. ML Hackathon Squad" />
      </div>

      <div class="flex flex-col gap-1">
        <label class="font-label-bold text-xs uppercase">Type</label>
        <select id="create-group-type" class="neo-input">
          <option value="custom">Custom Study Group / Team</option>
          <option value="department">Department Group</option>
        </select>
      </div>

      <div class="flex flex-col gap-1">
        <label class="font-label-bold text-xs uppercase">Description</label>
        <textarea id="create-group-desc" class="neo-input h-20" placeholder="What is this group for?"></textarea>
      </div>

      <div class="flex flex-col gap-1">
        <label class="font-label-bold text-xs uppercase">WhatsApp Group Link (Optional)</label>
        <input id="create-group-wa" class="neo-input" placeholder="https://chat.whatsapp.com/..." />
      </div>

      <button id="btn-submit-create-group" class="py-3 bg-primary-fixed neo-border neo-shadow neo-btn font-label-bold uppercase text-sm mt-2">
        Launch Hive
      </button>
    </div>
  `;

  document.body.appendChild(modalDiv);
  document.getElementById('close-create-modal').onclick = () => modalDiv.remove();

  document.getElementById('btn-submit-create-group').onclick = () => {
    const name = document.getElementById('create-group-name').value.trim();
    const type = document.getElementById('create-group-type').value;
    const desc = document.getElementById('create-group-desc').value.trim();
    const wa = document.getElementById('create-group-wa').value.trim();

    if (!name) {
      alert("Please enter a group name!");
      return;
    }

    const newGroup = window.store.createGroup({ name, type, description: desc, whatsappInviteLink: wa });
    modalDiv.remove();
    window.showToast(`Group "${newGroup.name}" created!`);
    window.router.navigate('subjects', { groupId: newGroup.id });
  };
};

// WhatsApp Bridge Share Modal
window.renderWhatsAppModal = function(group) {
  const modalDiv = document.createElement('div');
  modalDiv.className = "fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4";
  modalDiv.innerHTML = `
    <div class="bg-surface neo-border p-6 neo-shadow-lg w-full max-w-sm flex flex-col gap-4 relative text-center">
      <button id="close-wa-modal" class="absolute top-3 right-3 w-8 h-8 bg-error text-white neo-border flex items-center justify-center font-bold">✕</button>
      <div class="w-16 h-16 bg-secondary-container neo-border neo-shadow mx-auto flex items-center justify-center transform -rotate-3">
        <span class="material-symbols-outlined text-4xl text-secondary">chat</span>
      </div>
      <h2 class="font-headline-md text-xl uppercase">WhatsApp Companion</h2>
      <p class="font-body-md text-xs text-on-surface-variant">
        Connect with members of <strong>${group.name}</strong> on WhatsApp for quick chat and instant updates.
      </p>

      <a href="${group.whatsappInviteLink || '#'}" target="_blank" class="py-3 bg-secondary-fixed neo-border neo-shadow neo-btn font-label-bold uppercase text-sm flex items-center justify-center gap-2">
        <span class="material-symbols-outlined">open_in_new</span>
        Open WhatsApp Group
      </a>

      <div class="border-t-2 border-on-surface pt-3 border-dashed">
        <span class="font-label-bold text-xs uppercase block mb-1">In-App Invite Token:</span>
        <code class="bg-surface-container-highest neo-border px-3 py-1 font-mono text-xs select-all inline-block">${group.inviteLinkToken}</code>
      </div>
    </div>
  `;
  document.body.appendChild(modalDiv);
  document.getElementById('close-wa-modal').onclick = () => modalDiv.remove();
};
