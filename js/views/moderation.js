/**
 * Admin Moderation Panel: Join Request Approvals & Flagged Content Management
 */

window.renderModerationView = function(container) {
  const requests = window.store.getJoinRequests();
  const pendingRequests = requests.filter(r => r.status === 'pending');
  const reports = window.store.state.reports;
  const pendingReports = reports.filter(r => r.status === 'pending');

  container.innerHTML = `
    <div class="flex flex-col w-full min-h-screen bg-background pb-32 pt-20 px-4 max-w-md mx-auto">
      <!-- Header -->
      <div class="bg-tertiary-container neo-border p-4 neo-shadow relative mb-6">
        <h1 class="font-headline-lg-mobile text-on-surface uppercase leading-none">
          Admin <br/><span class="text-tertiary">Moderation</span>
        </h1>
        <p class="font-body-md text-xs text-on-surface-variant mt-1">
          Review outsider join requests and manage content quality.
        </p>
      </div>

      <!-- Pending Join Requests Queue -->
      <div class="flex flex-col gap-3 mb-8">
        <div class="flex items-center justify-between border-b-3 border-on-surface pb-1">
          <h2 class="font-headline-md text-lg uppercase text-on-surface">Join Requests</h2>
          <span class="font-label-bold text-xs uppercase bg-black text-white px-2 py-0.5">${pendingRequests.length} Pending</span>
        </div>

        ${pendingRequests.length === 0 ? `
          <div class="bg-surface-container neo-border p-4 text-center">
            <p class="font-body-md text-xs text-on-surface-variant italic">No pending join requests.</p>
          </div>
        ` : pendingRequests.map(req => `
          <div class="bg-surface-container-lowest neo-border p-4 neo-shadow-sm flex flex-col gap-2">
            <div class="flex items-center gap-3">
              <img class="w-10 h-10 object-cover border-2 border-black bg-surface" src="${req.userAvatar}" />
              <div class="min-w-0 flex-1">
                <h4 class="font-label-bold text-xs uppercase truncate">${req.userName}</h4>
                <span class="font-label-sm text-[10px] text-on-surface-variant block">${req.userDepartment}</span>
              </div>
            </div>

            <p class="font-body-md text-xs bg-surface-container neo-border p-2 italic text-on-surface">
              "${req.message}"
            </p>

            <div class="flex gap-2 mt-1">
              <button data-req-id="${req.id}" class="btn-approve-req flex-1 py-2 bg-secondary-container neo-border font-label-bold text-xs uppercase neo-btn">
                Approve Access
              </button>
              <button data-req-id="${req.id}" class="btn-reject-req flex-1 py-2 bg-error text-white neo-border font-label-bold text-xs uppercase neo-btn">
                Reject
              </button>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Flagged Content Queue -->
      <div class="flex flex-col gap-3">
        <div class="flex items-center justify-between border-b-3 border-on-surface pb-1">
          <h2 class="font-headline-md text-lg uppercase text-on-surface">Flagged Content</h2>
          <span class="font-label-bold text-xs uppercase bg-error text-white px-2 py-0.5">${pendingReports.length} Flagged</span>
        </div>

        ${pendingReports.length === 0 ? `
          <div class="bg-surface-container neo-border p-4 text-center">
            <p class="font-body-md text-xs text-on-surface-variant italic">No content reports requiring review.</p>
          </div>
        ` : pendingReports.map(rep => {
          const item = window.store.state.content.find(c => c.id === rep.contentId);

          return `
            <div class="bg-surface-container-lowest neo-border p-4 neo-shadow-sm flex flex-col gap-2">
              <div class="flex justify-between items-start">
                <span class="bg-error text-white font-label-bold text-[10px] px-2 py-0.5 uppercase">
                  Reason: ${rep.reason}
                </span>
                <span class="font-label-sm text-[10px] text-on-surface-variant">Reported by @${rep.reportedBy}</span>
              </div>

              <h4 class="font-label-bold text-xs uppercase">${item ? item.title : 'Content Item'}</h4>
              <p class="font-body-md text-xs text-on-surface-variant line-clamp-2">${item ? item.body : ''}</p>

              <div class="flex gap-2 mt-1">
                <button data-rep-id="${rep.id}" data-content-id="${rep.contentId}" class="btn-remove-content flex-1 py-2 bg-error text-white neo-border font-label-bold text-xs uppercase neo-btn">
                  Remove Content
                </button>
                <button data-rep-id="${rep.id}" class="btn-dismiss-report flex-1 py-2 bg-surface-container neo-border font-label-bold text-xs uppercase neo-btn">
                  Keep Content
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  // Approve / Reject Handlers
  container.querySelectorAll('.btn-approve-req').forEach(btn => {
    btn.onclick = (e) => {
      const rid = e.currentTarget.getAttribute('data-req-id');
      window.store.approveJoinRequest(rid);
      window.showToast("Member approved!");
      window.router.renderCurrentView();
    };
  });

  container.querySelectorAll('.btn-reject-req').forEach(btn => {
    btn.onclick = (e) => {
      const rid = e.currentTarget.getAttribute('data-req-id');
      window.store.rejectJoinRequest(rid);
      window.showToast("Join request rejected.");
      window.router.renderCurrentView();
    };
  });

  // Moderation Content Handlers
  container.querySelectorAll('.btn-remove-content').forEach(btn => {
    btn.onclick = (e) => {
      const repId = e.currentTarget.getAttribute('data-rep-id');
      const cid = e.currentTarget.getAttribute('data-content-id');
      window.store.state.content = window.store.state.content.filter(c => c.id !== cid);
      const rep = window.store.state.reports.find(r => r.id === repId);
      if (rep) rep.status = 'resolved';
      window.store.save();
      window.showToast("Content removed!");
      window.router.renderCurrentView();
    };
  });

  container.querySelectorAll('.btn-dismiss-report').forEach(btn => {
    btn.onclick = (e) => {
      const repId = e.currentTarget.getAttribute('data-rep-id');
      const rep = window.store.state.reports.find(r => r.id === repId);
      if (rep) rep.status = 'dismissed';
      window.store.save();
      window.showToast("Report dismissed.");
      window.router.renderCurrentView();
    };
  });
};
