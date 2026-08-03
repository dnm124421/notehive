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

  getUnreadNotificationCount() {
    return this.state.notifications.filter(n => !n.isRead).length;
  }

  getJoinRequests() {
    return this.state.joinRequests;
  }

  // Actions
  upvoteContent(contentId, delta) {
    const item = this.state.content.find(c => c.id === contentId);
    if (!item) return;

    const userId = this.state.currentUser.id;
    const existingVote = this.state.votes.find(v => v.contentId === contentId && v.userId === userId);

    if (existingVote) {
      if (existingVote.value === delta) {
        // Toggle off
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

    // Award points to author (+10 per net upvote)
    const author = this.state.users.find(u => u.id === item.authorId);
    if (author && delta === 1) {
      author.points += 10;
      if (author.id === this.state.currentUser.id) {
        this.state.currentUser.points += 10;
      }
    }

    this.save();
    this.notifyListeners('upvote');
  }

  createContent({ subjectId, tab, type, title, body, externalUrl, tags, categoryLabel }) {
    const author = this.state.currentUser;
    const newContent = {
      id: 'content_' + Date.now(),
      subjectId,
      tab: tab || 'notes',
      type: type || 'note',
      title,
      body: body || '',
      externalUrl: externalUrl || null,
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
}

window.store = new StoreEngine();
