/**
 * Interview Arcade — shared localStorage for progress + feedback.
 * Other modules call IAStorage.recordModule(...) after gameplay.
 */
(function (w) {
  var PREFIX = 'ia_';
  var KEY_PROGRESS = PREFIX + 'module_progress';
  var KEY_FEEDBACK = PREFIX + 'feedback_entries';

  function safeParse(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (raw == null || raw === '') return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
  }

  /** @type {{ id: string, title: string }[]} */
  var MODULES = [
    { id: 'tictactoe', title: 'Tic Tac Toe + OOP Quiz' },
    { id: 'memory', title: 'Memory Card Game' },
    { id: 'aptitude', title: 'Aptitude Quiz' },
    { id: 'resume', title: 'Resume Keyword Matcher' },
    { id: 'sql', title: 'SQL Fill in the Blanks' },
    { id: 'riddles', title: 'Image Riddles' },
    { id: 'dsa', title: 'DSA Match the Following' },
    { id: 'debug', title: 'Debug the Code' },
    { id: 'feedback', title: 'Feedback System' },
    { id: 'dashboard', title: 'Progress Dashboard' }
  ];

  function defaultProgress() {
    return {
      attempts: 0,
      completions: 0,
      bestScorePercent: 0,
      lastScorePercent: null,
      bestMemoryAttempts: null,
      lastMemoryAttempts: null,
      lastPlayed: null,
      tttXWins: 0,
      tttOWins: 0,
      tttDraws: 0,
      tttQuizCorrectX: 0,
      tttQuizCorrectO: 0
    };
  }

  function recordModule(moduleId, patch) {
    var all = safeParse(KEY_PROGRESS, {});
    if (!all || typeof all !== 'object') all = {};
    var m = Object.assign({}, defaultProgress(), all[moduleId] || {});
    if (patch.addAttempts) m.attempts += Number(patch.addAttempts) || 0;
    if (patch.addCompletions) m.completions += Number(patch.addCompletions) || 0;
    if (typeof patch.scorePercent === 'number') {
      m.lastScorePercent = patch.scorePercent;
      m.bestScorePercent = Math.max(m.bestScorePercent || 0, patch.scorePercent);
    }
    if (typeof patch.memoryAttempts === 'number') {
      m.lastMemoryAttempts = patch.memoryAttempts;
      if (m.bestMemoryAttempts == null || patch.memoryAttempts < m.bestMemoryAttempts) {
        m.bestMemoryAttempts = patch.memoryAttempts;
      }
    }
    if (patch.tttRoundOutcome === 'X') {
      m.tttXWins = (m.tttXWins || 0) + 1;
    } else if (patch.tttRoundOutcome === 'O') {
      m.tttOWins = (m.tttOWins || 0) + 1;
    } else if (patch.tttRoundOutcome === 'draw') {
      m.tttDraws = (m.tttDraws || 0) + 1;
    }
    if (typeof patch.tttQuizDeltaX === 'number' && patch.tttQuizDeltaX > 0) {
      m.tttQuizCorrectX = (m.tttQuizCorrectX || 0) + patch.tttQuizDeltaX;
    }
    if (typeof patch.tttQuizDeltaO === 'number' && patch.tttQuizDeltaO > 0) {
      m.tttQuizCorrectO = (m.tttQuizCorrectO || 0) + patch.tttQuizDeltaO;
    }
    m.lastPlayed = new Date().toISOString();
    all[moduleId] = m;
    save(KEY_PROGRESS, all);
  }

  function getAllProgress() {
    return safeParse(KEY_PROGRESS, {});
  }

  function getModuleProgress(moduleId) {
    var all = getAllProgress();
    return Object.assign({}, defaultProgress(), all[moduleId] || {});
  }

  function appendFeedback(entry) {
    var list = safeParse(KEY_FEEDBACK, []);
    if (!Array.isArray(list)) list = [];
    var row = {
      id: 'fb_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
      at: new Date().toISOString(),
      platformStars: entry.platformStars,
      comment: (entry.comment || '').trim(),
      moduleRatings: entry.moduleRatings || {}
    };
    list.push(row);
    save(KEY_FEEDBACK, list);
    return row;
  }

  function getFeedbackEntries() {
    var list = safeParse(KEY_FEEDBACK, []);
    return Array.isArray(list) ? list : [];
  }

  function feedbackSummary() {
    var list = getFeedbackEntries();
    if (!list.length) {
      return { count: 0, avgStars: null, recent: [] };
    }
    var sum = 0;
    for (var i = 0; i < list.length; i++) {
      sum += Number(list[i].platformStars) || 0;
    }
    var recent = list.slice(-12).reverse();
    return {
      count: list.length,
      avgStars: Math.round((sum / list.length) * 10) / 10,
      recent: recent
    };
  }

  w.IAStorage = {
    MODULES: MODULES,
    recordModule: recordModule,
    getAllProgress: getAllProgress,
    getModuleProgress: getModuleProgress,
    appendFeedback: appendFeedback,
    getFeedbackEntries: getFeedbackEntries,
    feedbackSummary: feedbackSummary
  };
})(typeof window !== 'undefined' ? window : this);
