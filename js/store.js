/**
 * NoteHive Reactive State & Transactional Storage Engine
 */

class StoreEngine {
  constructor() {
    this.STORAGE_KEY = 'NOTEHIVE_STATE_V1';
    this.listeners = [];
    this.broadcastChannel = null;
    this.init();
  }

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.state = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved state, resetting to seed data", e);
        this.state = window.SEED_DATA;
      }
    } else {
      this.state = window.SEED_DATA;
      this.save();
    }

    // Set up BroadcastChannel for cross-tab real-time sync
    if ('BroadcastChannel' in window) {
      this.broadcastChannel = new BroadcastChannel('notehive_realtime_channel');
      this.broadcastChannel.onmessage = (event) => {
        if (event.data && event.data.type === 'SYNC_STATE') {
          this.state = event.data.state;
          this.notifyListeners('realtime');
        }
      };
    }

    this.initIndexedDB();
  }

  initIndexedDB() {
    return new Promise((resolve) => {
      const request = indexedDB.open('NoteHiveOfflineDB', 1);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('offline_notes')) {
          db.createObjectStore('offline_notes', { keyPath: 'id' });
        }
      };
      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };
      request.onerror = () => resolve(null);
    });
  }

  save() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({ type: 'SYNC_STATE', state: this.state });
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners(reason = 'update') {
    this.listeners.forEach(fn => fn(this.state, reason));
  }

  // Getters
  getCurrentUser() {
    return this.state.currentUser;
  }

  getGroups() {
    return this.state.groups;
  }

  getGroupById(id) {
    return this.state.groups.find(g => g.id === id);
  }

  getSubjects(groupId) {
    return this.state.subjects.filter(s => s.groupId === groupId);
  }

  getSubjectById(id) {
    return this.state.subjects.find(s => s.id === id);
  }

  getContent(subjectId, tab) {
    let items = this.state.content.filter(c => c.subjectId === subjectId);
    if (tab) {
      items = items.filter(c => c.tab === tab);
    }
    // Sort descending by score
    return items.sort((a, b) => b.score - a.score);
  }

  getTop3Content(subjectId, tab) {
    const all = this.getContent(subjectId, tab);
    return all.slice(0, 3);
  }

  getStashContent(subjectId, tab) {
    const all = this.getContent(subjectId, tab);
    return all.slice(3);
  }

  getLeaderboard() {
    return [...this.state.users].sort((a, b) => b.points - a.points);
  }

  getNotifications() {
    return this.state.notifications;
  }

  getSubjectRequests(groupId) {
    if (!this.state.subjectRequests) this.state.subjectRequests = [];
    if (groupId) {
      return this.state.subjectRequests.filter(sr => sr.groupId === groupId);
    }
    return this.state.subjectRequests;
  }

  getRankFromPoints(points) {
    const pts = Math.max(0, points || 0);
    const tiers = [
      { name: 'BRONZE III', min: 0, max: 332 },
      { name: 'BRONZE II', min: 333, max: 665 },
      { name: 'BRONZE I', min: 666, max: 999 },
      { name: 'SILVER III', min: 1000, max: 2332 },
      { name: 'SILVER II', min: 2333, max: 3665 },
      { name: 'SILVER I', min: 3666, max: 4999 },
      { name: 'GOLD III', min: 5000, max: 6665 },
      { name: 'GOLD II', min: 6666, max: 8332 },
      { name: 'GOLD I', min: 8333, max: 9999 },
      { name: 'PLATINUM III', min: 10000, max: 13332 },
      { name: 'PLATINUM II', min: 13333, max: 16665 },
      { name: 'PLATINUM I', min: 16666, max: 19999 },
      { name: 'DIAMOND IV', min: 20000, max: 27499 },
      { name: 'DIAMOND III', min: 27500, max: 34999 },
      { name: 'DIAMOND II', min: 35000, max: 42499 },
      { name: 'DIAMOND I', min: 42500, max: 49999 },
      { name: 'HEROIC', min: 50000, max: Infinity }
    ];

    for (let i = 0; i < tiers.length; i++) {
      const tier = tiers[i];
      if (pts >= tier.min && pts <= tier.max) {
        const nextTier = tiers[i + 1];
        const nextMin = nextTier ? nextTier.min : tier.min;
        const progressRange = (nextMin - tier.min) || 1;
        const percent = nextTier ? Math.min(100, Math.floor(((pts - tier.min) / progressRange) * 100)) : 100;
        return {
          title: tier.name,
          currentPoints: pts,
          nextThreshold: nextMin,
          percent
        };
      }
    }
    return { title: 'BRONZE III', currentPoints: pts, nextThreshold: 333, percent: 0 };
  }

  getUserVote(contentId) {
    const userId = this.state.currentUser.id;
    return this.state.votes.find(v => v.contentId === contentId && v.userId === userId);
  }

  // Actions
  upvoteContent(contentId, delta) {
    const item = this.state.content.find(c => c.id === contentId);
    if (!item) return { error: "NOT_FOUND" };

    const userId = this.state.currentUser.id;

    // Self-vote prevention rule
    if (item.authorId === userId) {
      return { error: "SELF_VOTE" };
    }

    const existingVote = this.state.votes.find(v => v.contentId === contentId && v.userId === userId);

    if (existingVote) {
      if (existingVote.value === delta) {
        // Toggle off vote
        if (delta === 1) item.upvotes--;
        else item.downvotes--;
        this.state.votes = this.state.votes.filter(v => v.id !== existingVote.id);
      } else {
        // Switch vote
        if (delta === 1) {
          item.upvotes++;
          item.downvotes--;
        } else {
          item.downvotes++;
          item.upvotes--;
        }
        existingVote.value = delta;
      }
    } else {
      // New vote
      if (delta === 1) item.upvotes++;
      else item.downvotes++;
      this.state.votes.push({
        id: 'v_' + Date.now(),
        contentId,
        userId,
        value: delta
      });
    }

    item.score = item.upvotes - item.downvotes;
    item.pointsReward = Math.max(0, item.score * 10);

    // Recalculate author's total profile points
    this.recalculateUserPoints(item.authorId);

    this.save();
    this.notifyListeners('upvote');
    return { success: true };
  }

  recalculateUserPoints(authorId) {
    const author = this.state.users.find(u => u.id === authorId) || (this.state.currentUser.id === authorId ? this.state.currentUser : null);
    if (!author) return;

    const authorPosts = this.state.content.filter(c => c.authorId === authorId);
    const postBonus = authorPosts.length * 20;

    const netVotePoints = authorPosts.reduce((acc, note) => {
      const net = (note.upvotes || 0) - (note.downvotes || 0);
      return acc + net;
    }, 0);

    const baseSeed = 21000;
    const totalPoints = Math.max(0, baseSeed + postBonus + netVotePoints * 10);
    author.points = totalPoints;

    if (authorId === this.state.currentUser.id) {
      this.state.currentUser.points = totalPoints;
    }
  }

  createContent({ subjectId, tab, type, title, body, externalUrl, pdfName, pdfData, pdfSize, tags, categoryLabel }) {
    const author = this.state.currentUser;
    const newContent = {
      id: 'content_' + Date.now(),
      subjectId,
      tab: tab || 'notes',
      type: type || 'note',
      title,
      body: body || '',
      externalUrl: externalUrl || null,
      pdfName: pdfName || null,
      pdfData: pdfData || null,
      pdfSize: pdfSize || null,
      thumbnailUrl: externalUrl && externalUrl.includes('youtube.com') ? 
        `https://img.youtube.com/vi/${this.extractYTId(externalUrl)}/hqdefault.jpg` : null,
      tags: tags || [],
      authorId: author.id,
      authorName: author.name,
      upvotes: 1,
      downvotes: 0,
      score: 1,
      pointsReward: 50,
      categoryLabel: categoryLabel || 'Member Post',
      versionHistory: [
        {
          editedAt: new Date().toISOString(),
          editedBy: author.name,
          summary: 'Created post'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.state.content.unshift(newContent);

    // Update subject activity
    const subject = this.getSubjectById(subjectId);
    if (subject) {
      subject.hasNewActivity = true;
    }

    // Trigger Notification for all users
    this.state.notifications.unshift({
      id: 'notif_' + Date.now(),
      userId: 'user_all',
      groupId: subject ? subject.groupId : 'grp_ds',
      subjectId,
      type: 'new_content',
      title: `New ${type.replace('_', ' ')} in ${subject ? subject.name : 'Subject'}`,
      message: `${author.name} added: "${title}"`,
      isRead: false,
      createdAt: new Date().toISOString()
    });

    // Reward author for posting
    author.points += 20;

    this.save();
    this.notifyListeners('create_content');
    return newContent;
  }

  extractYTId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  }

  saveNoteVersion(contentId, newBody, editSummary) {
    const item = this.state.content.find(c => c.id === contentId);
    if (!item) return;

    if (!item.versionHistory) item.versionHistory = [];
    item.versionHistory.unshift({
      editedAt: new Date().toISOString(),
      editedBy: this.state.currentUser.name,
      summary: editSummary || 'Updated content',
      previousBody: item.body
    });

    item.body = newBody;
    item.updatedAt = new Date().toISOString();

    this.save();
    this.notifyListeners('update_version');
  }

  revertNoteVersion(contentId, versionIndex) {
    const item = this.state.content.find(c => c.id === contentId);
    if (!item || !item.versionHistory || !item.versionHistory[versionIndex]) return;

    const targetVersion = item.versionHistory[versionIndex];
    if (targetVersion.previousBody) {
      item.body = targetVersion.previousBody;
      item.versionHistory.unshift({
        editedAt: new Date().toISOString(),
        editedBy: this.state.currentUser.name,
        summary: `Reverted to version from ${new Date(targetVersion.editedAt).toLocaleTimeString()}`
      });
      item.updatedAt = new Date().toISOString();
      this.save();
      this.notifyListeners('revert_version');
    }
  }

  requestJoinGroup(groupId, message) {
    const user = this.state.currentUser;
    const existing = this.state.joinRequests.find(r => r.groupId === groupId && r.userId === user.id);
    if (existing) return existing;

    const newReq = {
      id: 'req_' + Date.now(),
      groupId,
      userId: user.id,
      userName: user.name,
      userDepartment: user.department,
      userAvatar: user.avatarUrl,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      message: message || 'I request to join this academic group.'
    };

    this.state.joinRequests.unshift(newReq);
    this.save();
    this.notifyListeners('join_request');
    return newReq;
  }

  approveJoinRequest(requestId) {
    const req = this.state.joinRequests.find(r => r.id === requestId);
    if (!req) return;

    req.status = 'approved';
    const group = this.getGroupById(req.groupId);
    if (group && !group.memberIds.includes(req.userId)) {
      group.memberIds.push(req.userId);
      group.memberCount++;
    }

    if (req.userId === this.state.currentUser.id) {
      if (!this.state.currentUser.joinedGroupIds.includes(req.groupId)) {
        this.state.currentUser.joinedGroupIds.push(req.groupId);
      }
    }

    this.save();
    this.notifyListeners('admin_approve');
  }

  rejectJoinRequest(requestId) {
    const req = this.state.joinRequests.find(r => r.id === requestId);
    if (req) {
      req.status = 'rejected';
      this.save();
      this.notifyListeners('admin_reject');
    }
  }

  createGroup({ name, type, description, whatsappInviteLink }) {
    const user = this.state.currentUser;
    const newGroup = {
      id: 'grp_' + Date.now(),
      name,
      type: type || 'custom',
      description,
      memberCount: 1,
      adminIds: [user.id],
      memberIds: [user.id],
      inviteLinkToken: 'invite-' + Math.random().toString(36).substring(2, 9),
      whatsappInviteLink: whatsappInviteLink || 'https://chat.whatsapp.com/CustomGroupInvite',
      subjectIds: []
    };

    this.state.groups.unshift(newGroup);
    user.joinedGroupIds.push(newGroup.id);
    this.save();
    this.notifyListeners('create_group');
    return newGroup;
  }

  toggleOfflineNote(noteId) {
    const user = this.state.currentUser;
    const idx = user.savedOfflineNoteIds.indexOf(noteId);
    if (idx >= 0) {
      user.savedOfflineNoteIds.splice(idx, 1);
    } else {
      user.savedOfflineNoteIds.push(noteId);
      // Cache note in IndexedDB
      const note = this.state.content.find(c => c.id === noteId);
      if (note && this.db) {
        const tx = this.db.transaction('offline_notes', 'readwrite');
        tx.objectStore('offline_notes').put(note);
      }
    }
    this.save();
    this.notifyListeners('offline_toggle');
  }

  toggleSubjectMute(subjectId) {
    const user = this.state.currentUser;
    const idx = user.mutedSubjectIds.indexOf(subjectId);
    if (idx >= 0) {
      user.mutedSubjectIds.splice(idx, 1);
    } else {
      user.mutedSubjectIds.push(subjectId);
    }
    this.save();
    this.notifyListeners('mute_toggle');
  }

  markAllNotificationsRead() {
    this.state.notifications.forEach(n => n.isRead = true);
    this.save();
    this.notifyListeners('notif_read');
  }

  reportContent(contentId, reason) {
    this.state.reports.unshift({
      id: 'rep_' + Date.now(),
      contentId,
      reportedBy: this.state.currentUser.name,
      reason,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    this.save();
    this.notifyListeners('report_sent');
  }

  getUnreadNotificationCount() {
    return this.state.notifications.filter(n => !n.isRead).length;
  }

  getJoinRequests() {
    return this.state.joinRequests;
  }

  // Subject Request Actions
  requestSubject({ groupId, subjectName, description }) {
    if (!this.state.subjectRequests) this.state.subjectRequests = [];
    const user = this.state.currentUser;
    const newReq = {
      id: 'sreq_' + Date.now(),
      groupId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatarUrl,
      subjectName,
      description: description || '',
      status: 'pending',
      requestedAt: new Date().toISOString()
    };
    this.state.subjectRequests.unshift(newReq);
    this.save();
    this.notifyListeners('subject_request');
    return newReq;
  }

  approveSubjectRequest(requestId) {
    if (!this.state.subjectRequests) return;
    const req = this.state.subjectRequests.find(r => r.id === requestId);
    if (!req) return;

    req.status = 'approved';
    const group = this.getGroupById(req.groupId);
    const newSubjectId = 'sbj_' + Date.now();

    const newSubject = {
      id: newSubjectId,
      groupId: req.groupId,
      name: req.subjectName,
      icon: 'book',
      lessonsCount: 0,
      quizzesCount: 0,
      progressPercent: 0,
      hasNewActivity: true,
      pendingAssignment: false,
      examDate: null,
      tags: []
    };

    this.state.subjects.push(newSubject);
    if (group && !group.subjectIds.includes(newSubjectId)) {
      group.subjectIds.push(newSubjectId);
    }

    // Notify requester
    this.state.notifications.unshift({
      id: 'notif_' + Date.now(),
      userId: req.userId,
      groupId: req.groupId,
      subjectId: newSubjectId,
      type: 'subject_approved',
      title: 'Subject Request Approved',
      message: `Your request for "${req.subjectName}" was approved and added to ${group ? group.name : 'the Hive'}!`,
      isRead: false,
      createdAt: new Date().toISOString()
    });

    this.save();
    this.notifyListeners('subject_approved');
  }

  rejectSubjectRequest(requestId, reason) {
    if (!this.state.subjectRequests) return;
    const req = this.state.subjectRequests.find(r => r.id === requestId);
    if (!req) return;
    req.status = 'rejected';
    req.rejectionReason = reason || '';

    const group = this.getGroupById(req.groupId);
    this.state.notifications.unshift({
      id: 'notif_' + Date.now(),
      userId: req.userId,
      groupId: req.groupId,
      type: 'subject_rejected',
      title: 'Subject Request Rejected',
      message: `Your request for "${req.subjectName}" was rejected${reason ? ': ' + reason : ''}.`,
      isRead: false,
      createdAt: new Date().toISOString()
    });

    this.save();
    this.notifyListeners('subject_rejected');
  }

  addSubjectDirect({ groupId, subjectName }) {
    const group = this.getGroupById(groupId);
    const newSubjectId = 'sbj_' + Date.now();
    const newSubject = {
      id: newSubjectId,
      groupId,
      name: subjectName,
      icon: 'book',
      lessonsCount: 0,
      quizzesCount: 0,
      progressPercent: 0,
      hasNewActivity: true,
      pendingAssignment: false,
      examDate: null,
      tags: []
    };
    this.state.subjects.push(newSubject);
    if (group && !group.subjectIds.includes(newSubjectId)) {
      group.subjectIds.push(newSubjectId);
    }
    this.save();
    this.notifyListeners('subject_added');
    return newSubject;
  }

  // Avatar & Theme Preferences
  updateUserAvatar(avatarUrl) {
    this.state.currentUser.avatarUrl = avatarUrl;
    const user = this.state.users.find(u => u.id === this.state.currentUser.id);
    if (user) user.avatarUrl = avatarUrl;
    this.save();
    this.notifyListeners('avatar_update');
  }

  setThemePreference(theme) {
    localStorage.setItem('NOTEHIVE_THEME', theme);
    document.documentElement.classList.remove('dark', 'dark-hc');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'dark-hc') {
      document.documentElement.classList.add('dark-hc');
    }
  }

  // Feed Aggregation Helpers
  getAllContentFeed(options = {}) {
    const filter = options.filter || 'all';
    const searchQuery = (options.searchQuery || '').toLowerCase();
    const currentUser = this.getCurrentUser();

    let items = [...this.state.content].map(item => {
      const subject = this.getSubjectById(item.subjectId);
      const group = subject ? this.getGroupById(subject.groupId) : null;
      return {
        ...item,
        subjectName: subject ? subject.name : 'General',
        groupName: group ? group.name : 'Academic Hive',
        commentsCount: item.versionHistory ? Math.max(1, item.versionHistory.length - 1) : 1
      };
    });

    if (searchQuery) {
      items = items.filter(i => 
        i.title.toLowerCase().includes(searchQuery) ||
        (i.body && i.body.toLowerCase().includes(searchQuery)) ||
        i.subjectName.toLowerCase().includes(searchQuery) ||
        i.authorName.toLowerCase().includes(searchQuery)
      );
    }

    if (filter === 'bookmarked') {
      items = items.filter(i => currentUser.savedOfflineNoteIds.includes(i.id));
    } else if (filter === 'popular') {
      items.sort((a, b) => (b.score || 0) - (a.score || 0));
    } else if (filter === 'new') {
      items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else {
      // Default: mix of score and recency
      items.sort((a, b) => {
        const scoreDiff = (b.score || 0) - (a.score || 0);
        if (scoreDiff !== 0) return scoreDiff;
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
    }

    return items;
  }

  getTrendingContent(limit = 5) {
    const all = this.getAllContentFeed({ filter: 'popular' });
    return all.slice(0, limit);
  }

  getUserActivityStats() {
    const user = this.getCurrentUser();
    const rankInfo = this.getRankFromPoints(user.points || 0);
    return {
      streakDays: 5,
      todayPoints: 150,
      rankTitle: rankInfo.title,
      nextThreshold: rankInfo.nextThreshold,
      currentPoints: rankInfo.currentPoints,
      percent: rankInfo.percent
    };
  }
}

window.store = new StoreEngine();

// Apply saved theme on load
(function() {
  const theme = localStorage.getItem('NOTEHIVE_THEME');
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (theme === 'dark-hc') {
    document.documentElement.classList.add('dark-hc');
  }
})();
