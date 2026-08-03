/**
 * In-App Notification Center Drawer
 */

window.renderNotificationDrawer = function() {
  const notifications = window.store.getNotifications();
  
  const drawerDiv = document.createElement('div');
  drawerDiv.className = "fixed inset-0 z-50 bg-black/70 flex justify-end";
  drawerDiv.innerHTML = `
    <div class="bg-surface neo-border-l border-b-0 border-t-0 border-r-0 w-full max-w-xs h-full p-4 flex flex-col gap-4 relative animate-slide-left overflow-y-auto">
      <div class="flex items-center justify-between border-b-3 border-on-surface pb-3">
        <h2 class="font-headline-md text-lg uppercase flex items-center gap-1">
          <span class="material-symbols-outlined text-xl">notifications</span>
          Notifications
        </h2>
        <button id="close-notif-drawer" class="w-8 h-8 bg-error text-white neo-border font-bold">✕</button>
      </div>

      <button id="btn-mark-all-read" class="py-1.5 bg-primary-container neo-border font-label-bold text-xs uppercase">
        Mark All as Read
      </button>

      <div class="flex flex-col gap-3">
        ${notifications.length === 0 ? `
          <p class="font-body-md text-xs text-on-surface-variant italic text-center py-8">No notifications yet!</p>
        ` : notifications.map(notif => `
          <div class="p-3 neo-border ${notif.isRead ? 'bg-surface-container' : 'bg-primary-fixed'} neo-shadow-sm flex flex-col gap-1 relative">
            <span class="font-label-bold text-[10px] uppercase ${notif.type === 'exam_alert' ? 'bg-error text-white' : 'bg-black text-white'} px-1.5 py-0.5 inline-block w-max">
              ${notif.title}
            </span>
            <p class="font-body-md text-xs text-on-surface font-medium leading-snug">${notif.message}</p>
            <span class="font-label-sm text-[9px] text-on-surface-variant text-right block mt-1">
              ${new Date(notif.createdAt).toLocaleTimeString()}
            </span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.body.appendChild(drawerDiv);

  document.getElementById('close-notif-drawer').onclick = () => drawerDiv.remove();
  document.getElementById('btn-mark-all-read').onclick = () => {
    window.store.markAllNotificationsRead();
    drawerDiv.remove();
    window.showToast("All notifications marked as read!");
    window.router.renderCurrentView();
  };
};
