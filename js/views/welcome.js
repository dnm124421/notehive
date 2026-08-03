/**
 * Welcome / Onboarding View (verbatim match to welcome_to_notehive)
 */

window.renderWelcomeView = function(container) {
  container.innerHTML = `
    <div class="flex flex-col w-full min-h-screen relative overflow-hidden bg-background">
      <!-- Graphic Background Elements -->
      <div class="absolute top-[-10%] left-[-10%] w-64 h-64 bg-primary-fixed opacity-20 rounded-full blur-3xl"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-tertiary-container opacity-30 rounded-full blur-3xl"></div>
      
      <!-- Content Container -->
      <div class="flex flex-col flex-1 px-4 pt-12 pb-16 relative z-10 justify-between max-w-md mx-auto w-full">
        <!-- Header / Branding -->
        <div class="flex items-start justify-between w-full">
          <!-- NoteHive Logo Stamp -->
          <div class="w-12 h-12 neo-border bg-white flex items-center justify-center transform -rotate-6 neo-shadow-sm">
            <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L22 7.7735V16.2265L12 22L2 16.2265V7.7735L12 2Z" stroke="#1b1b1b" stroke-linejoin="round" stroke-width="2"></path>
              <path d="M9 10H15M9 14H13" stroke="#6a5f00" stroke-linecap="round" stroke-width="2"></path>
              <path d="M15 10L16 12L15 14" stroke="#6a5f00" stroke-linejoin="round" stroke-width="2"></path>
            </svg>
          </div>
          <span class="font-label-bold text-xs uppercase px-2 py-1 bg-primary-fixed neo-border transform rotate-3">
            STUDENT APPROVED
          </span>
        </div>

        <!-- Main Visual & Typography -->
        <div class="flex flex-col items-center text-center mt-6 space-y-6">
          <!-- Hero Illustration Card -->
          <div class="relative w-full max-w-[280px] aspect-square neo-border bg-surface-container neo-shadow-lg transform -rotate-2 overflow-hidden mx-auto mb-2">
            <div class="absolute inset-0 bg-cover bg-center flex flex-col items-center justify-center p-4 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuBBUledBqNIY4sNImVRzeKrWZdR_b68IKEm5dtKcmsTTsTpf9pGEs7SlGbva4Ibl51d_XIz3m6DN7QXfWytCWMLLuHJxMAlFQ1NpUNFDAsmTmObdNRHutCORj-lStnpi9fYSNcBscwpuffwlD0Qh8koyEeWVOqB0tVO048zTkOcXkrziw1bHx4_THilNA8WNctzw1ctBHOkBO7yrLXtaY7jtcR9wZfkQ8R-ssvlQgfSq5pD2jDyjHpG')]">
              <div class="bg-primary-container p-3 neo-border neo-shadow transform rotate-3">
                <span class="material-symbols-outlined text-5xl text-on-surface">hive</span>
              </div>
            </div>
          </div>

          <!-- Typography -->
          <div class="flex flex-col space-y-2 relative">
            <h1 class="font-headline-lg-mobile text-on-surface uppercase leading-none tracking-tighter">
              Crush <br/>
              <span class="text-tertiary drop-shadow-[2px_2px_0_#1b1b1b]">The Chaos</span>
            </h1>
            <p class="font-body-lg text-on-surface-variant max-w-[280px] mx-auto pt-2 border-t-3 border-on-surface mt-4 border-dashed">
              Organize your notes, ace your exams, and stop stressing. Your hive is waiting.
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="w-full flex flex-col space-y-4 mt-8 mb-4">
          <button id="btn-get-started" class="w-full py-4 bg-primary-fixed neo-border neo-shadow neo-btn flex items-center justify-center space-x-2 group">
            <span class="font-label-bold text-on-primary-fixed uppercase tracking-widest text-lg">Enter Hive</span>
            <span class="material-symbols-outlined text-on-primary-fixed group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
          
          <button id="btn-demo-admin" class="w-full py-3 bg-secondary-fixed neo-border neo-shadow neo-btn flex items-center justify-center space-x-2">
            <span class="font-label-bold text-on-surface uppercase tracking-widest text-sm">Log In as Admin</span>
          </button>
        </div>
      </div>

      <!-- Checkered Divider Bottom -->
      <div class="checkered-divider absolute bottom-0 left-0"></div>
    </div>
  `;

  document.getElementById('btn-get-started').addEventListener('click', () => {
    window.router.navigate('home');
  });

  document.getElementById('btn-demo-admin').addEventListener('click', () => {
    window.store.state.currentUser.role = 'Admin';
    window.router.navigate('home');
  });
};
