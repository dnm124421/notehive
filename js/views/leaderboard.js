/**
 * Leaderboard View (verbatim match to leaderboard export)
 */

window.renderLeaderboardView = function(container) {
  const leaderboard = window.store.getLeaderboard();
  const currentUser = window.store.getCurrentUser();

  const rank1 = leaderboard[0] || { name: 'Riot_Grrl', points: 21500 };
  const rank2 = leaderboard[1] || { name: 'Zane.X', points: 14200 };
  const rank3 = leaderboard[2] || { name: 'Echo.V', points: 11800 };
  const rest = leaderboard.slice(3);

  container.innerHTML = `
    <div class="flex flex-col w-full min-h-screen bg-surface pb-32 pt-20 px-4 max-w-md mx-auto">
      <!-- Header Area -->
      <div class="flex flex-col gap-2 mt-2 relative">
        <h1 class="font-headline-lg-mobile uppercase tracking-tighter leading-none relative z-10">
          <span class="bg-black text-white px-2 py-1 inline-block -rotate-2 transform shadow-[3px_3px_0px_0px_#fde400]">Top</span><br/>
          <span class="text-black inline-block mt-2">Hivers</span>
        </h1>
        <p class="font-body-md text-xs text-on-surface-variant max-w-[85%] border-l-4 border-black pl-3 ml-1 mt-1">
          The undisputed champions of the hive. Climb the ranks or get left behind.
        </p>
      </div>

      <!-- Podium Section -->
      <div class="relative w-full pt-12 pb-6 flex items-end justify-center gap-2">
        <!-- Rank 2 -->
        <div class="flex flex-col items-center w-1/3 relative z-10">
          <div class="relative mb-2">
            <img class="w-14 h-14 object-cover border-3 border-black neo-shadow-sm bg-secondary-fixed" src="${rank2.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuARo7NRwfX-W2Rp6vXmShKvuX2Mi2Ma5aQ0nkuZDhJoiI_DM0FITQO50WltQJjwlnQe2jRnd2C6NYBNdLCbOFcsqVql9T_4iJs8uOmcoSJsRbo7EaSa0BplOTw7TBcTLOg-4pLuYxje29NB5_aRkWH7bgxcF5PCiH-zN5OpUfn1K4qKJHWen6mZGlyD9lxzofKy8EcZy-5bkcvwoToSwkUAzmLofY2efb1bH9tV9JauvNlCHu0WqWSN'}" />
            <div class="absolute -top-2 -right-2 w-6 h-6 border-2 border-black bg-surface flex items-center justify-center font-label-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">2</div>
          </div>
          <div class="w-full h-28 bg-tertiary-fixed border-3 border-black neo-shadow-sm flex flex-col items-center justify-start pt-3">
            <span class="font-label-bold text-xs text-on-tertiary-fixed truncate w-full text-center px-1">${rank2.name}</span>
            <span class="font-label-sm text-[10px] text-on-tertiary-fixed opacity-80 mt-1">${rank2.points.toLocaleString()} pts</span>
          </div>
        </div>

        <!-- Rank 1 -->
        <div class="flex flex-col items-center w-1/3 relative z-20 -mx-1">
          <!-- Crown Icon -->
          <div class="absolute -top-10 left-1/2 -translate-x-1/2 w-10 h-10 text-primary-fixed drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] z-30">
            <span class="material-symbols-outlined text-4xl text-primary-fixed font-black">crown</span>
          </div>
          <div class="relative mb-2">
            <img class="w-16 h-16 object-cover border-4 border-black neo-shadow bg-primary-fixed" src="${rank1.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuARTa22du4fYi27s_Vkt69UInhvij7lPi5jhxYUFhVa8vktN4aJqgF-OjgWyU4W_-mxG0knPGY2eIfo596BhPh92KgAo3FYvSHFe_8zW0LDvkUbMPl80pqCFkCIwCu3jBoyg4blxNDK--kyCBpEzx7mpjRroD8BXyZ7EIqjiVQlt_gVWwJj9ZAnSZDHNjZDZ7OnBCr6uK3h4frU21FfYhpfH1dxbTWexqa3kWEKvP4Bn0wB32DA0bLx'}" />
            <div class="absolute -top-2 -right-2 w-8 h-8 border-3 border-black bg-primary-fixed flex items-center justify-center font-headline-md text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform rotate-6">1</div>
          </div>
          <div class="w-full h-36 bg-primary-fixed border-4 border-black neo-shadow flex flex-col items-center justify-start pt-4">
            <span class="font-headline-md text-sm text-on-primary-fixed truncate w-full text-center px-1 uppercase tracking-tighter leading-none">${rank1.name}</span>
            <span class="font-label-bold text-xs text-on-primary-fixed mt-2 bg-black text-white px-2 py-0.5">${rank1.points.toLocaleString()} pts</span>
          </div>
        </div>

        <!-- Rank 3 -->
        <div class="flex flex-col items-center w-1/3 relative z-10">
          <div class="relative mb-2">
            <img class="w-14 h-14 object-cover border-3 border-black neo-shadow-sm bg-secondary-container" src="${rank3.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdig4FH8lGfSQ5mDy8igJMrwVOwawMl5pNW3lQmRiObN8K1qtzy918CNOOpF6fodQgbFkNhhzaxkAsTjb-52mctOlqk9vPlIug3h-zK1wAJornlHFNhZNsxsA5A-fQszSqfvnwuHf4K3J72MFkgdW6-1mZEJGYzERXa4NQ3Nw3V5tLnYFDvgYsApLSl21HrltZxv7dUajhZWraB6ZesWFzQB844nJiYpa0n-1rYSaMrT7z_jhp94ev'}" />
            <div class="absolute -top-2 -right-2 w-6 h-6 border-2 border-black bg-surface flex items-center justify-center font-label-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">3</div>
          </div>
          <div class="w-full h-24 bg-secondary-fixed border-3 border-black neo-shadow-sm flex flex-col items-center justify-start pt-3">
            <span class="font-label-bold text-xs text-on-secondary-fixed truncate w-full text-center px-1">${rank3.name}</span>
            <span class="font-label-sm text-[10px] text-on-secondary-fixed opacity-80 mt-1">${rank3.points.toLocaleString()} pts</span>
          </div>
        </div>
      </div>

      <div class="checkered-divider my-4"></div>

      <!-- Rest of Leaderboard List -->
      <div class="flex flex-col gap-3">
        ${rest.map((user, idx) => {
          const rankNum = idx + 4;
          const isCurrentUser = user.id === currentUser.id;

          return `
            <div class="flex items-center gap-3 ${isCurrentUser ? 'bg-primary-fixed' : 'bg-white'} border-3 border-black p-3 neo-shadow-sm relative overflow-hidden">
              ${isCurrentUser ? `
                <div class="absolute -right-6 -top-6 w-16 h-16 bg-black text-white font-label-bold text-[9px] uppercase flex items-end justify-center pb-1 rotate-45 z-10">YOU</div>
              ` : ''}
              <div class="w-6 font-headline-md text-base text-center">${rankNum}</div>
              <img class="w-10 h-10 object-cover border-2 border-black bg-surface" src="${user.avatarUrl}" />
              <div class="flex-1 min-w-0">
                <div class="font-label-bold text-xs uppercase truncate">${user.name}</div>
                <div class="font-label-sm text-[10px] text-on-surface-variant truncate">${user.department || 'Data Science'}</div>
              </div>
              <div class="font-label-bold text-xs px-2 py-1 ${isCurrentUser ? 'bg-black text-white' : 'bg-surface-container'} border-2 border-black">
                ${user.points.toLocaleString()} pts
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
};
