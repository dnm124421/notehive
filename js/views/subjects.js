/**
 * All Subjects View (verbatim match to all_subjects export)
 */

window.renderSubjectsView = function(container, params = {}) {
  const groupId = params.groupId || 'grp_ds';
  const group = window.store.getGroupById(groupId) || window.store.getGroups()[0];
  const subjects = window.store.getSubjects(group.id);

  container.innerHTML = `
    <div class="flex flex-col w-full min-h-screen bg-background pb-28 pt-20">
      <!-- Content Container -->
      <div class="px-4 flex flex-col gap-6 pt-4 max-w-md mx-auto w-full">
        <!-- Hero / Intro -->
        <div class="flex flex-col gap-2 bg-surface-container-lowest neo-border p-4 relative neo-shadow">
          <div class="absolute -top-3 -right-3 w-14 h-14 bg-primary-container neo-border rounded-full flex items-center justify-center rotate-12 neo-shadow animate-pulse">
            <span class="font-label-bold text-[10px] text-on-surface transform -rotate-12">UPDATE</span>
          </div>
          <h2 class="font-headline-lg-mobile text-on-surface uppercase leading-none">
            ${group.name.split(' ')[0]}<br/>
            <span class="text-tertiary">Modules</span>
          </h2>
          <p class="font-body-md text-xs text-on-surface-variant max-w-[280px]">
            Dive into the core subjects. High voltage learning. No filler.
          </p>
        </div>

        <!-- Checkered Divider -->
        <div class="checkered-divider"></div>

        <!-- List of Subjects -->
        <div class="flex flex-col gap-6">
          ${subjects.map((subject, idx) => {
            const cardBgClass = idx % 3 === 0 ? 'bg-primary-container' : (idx % 3 === 1 ? 'bg-secondary-fixed' : 'bg-tertiary-fixed');

            return `
              <div data-subject-id="${subject.id}" class="btn-select-subject block ${cardBgClass} neo-border p-4 neo-shadow relative group cursor-pointer active:translate-y-1 active:translate-x-1 active:shadow-[2px_2px_0px_0px_#1b1b1b] transition-transform">
                ${subject.hasNewActivity ? `
                  <div class="absolute -top-3 left-4 bg-tertiary px-3 py-1 neo-border">
                    <span class="font-label-bold text-xs text-white uppercase">New Activity</span>
                  </div>
                ` : ''}

                <div class="flex justify-between items-start mb-4 ${subject.hasNewActivity ? 'mt-2' : ''}">
                  <h3 class="font-headline-md text-2xl text-on-surface uppercase leading-none max-w-[70%]">
                    ${subject.name.replace(' ', '<br/>')}
                  </h3>
                  <span class="material-symbols-outlined text-4xl text-on-surface">${subject.icon || 'menu_book'}</span>
                </div>

                <div class="flex flex-wrap gap-2 mb-4">
                  <span class="bg-surface-container-lowest neo-border px-2 py-1 font-label-bold text-xs uppercase">
                    ${subject.lessonsCount || 4} Lessons
                  </span>
                  <span class="bg-surface-container-lowest neo-border px-2 py-1 font-label-bold text-xs uppercase">
                    ${subject.quizzesCount || 2} Quizzes
                  </span>
                  ${subject.examDate ? `
                    <span class="bg-primary-fixed neo-border px-2 py-1 font-label-bold text-xs uppercase flex items-center gap-1">
                      <span class="material-symbols-outlined text-xs">timer</span> Exam Soon
                    </span>
                  ` : ''}
                </div>

                <div class="w-full bg-surface-container-lowest neo-border h-3">
                  <div class="h-full bg-tertiary border-r-4 border-on-surface" style="width: ${subject.progressPercent || 60}%"></div>
                </div>
              </div>
            `;
          }).join('')}

          <!-- Coming Soon Subject Card -->
          <div class="block bg-surface-container-highest neo-border p-4 relative opacity-80 border-dashed">
            <div class="flex justify-between items-start mb-4">
              <h3 class="font-headline-md text-xl text-on-surface-variant uppercase leading-none max-w-[70%]">
                Deep<br/>Learning II
              </h3>
              <span class="material-symbols-outlined text-4xl text-on-surface-variant">psychology</span>
            </div>
            <div class="flex items-center justify-center bg-surface neo-border p-2">
              <span class="font-label-bold text-xs text-on-surface uppercase">Unlocking Next Semester</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Event Listeners
  container.querySelectorAll('.btn-select-subject').forEach(card => {
    card.addEventListener('click', (e) => {
      const sid = e.currentTarget.getAttribute('data-subject-id');
      window.router.navigate('subjectDetail', { subjectId: sid, tab: 'notes' });
    });
  });
};
