/**
 * storage.js — Interview Arcade
 * Centralized localStorage utility for reading/writing module progress.
 * All game modules should use these helpers to ensure dashboard compatibility.
 */

const Storage = (() => {

  // ── Key Schema ──────────────────────────────────────────────────────────────
  // Each module stores data under:  "arcade_<moduleId>"
  // Shape: { attempts, bestScore, lastScore, completed, lastPlayed, history[] }

  const PREFIX = "arcade_";

  const MODULES = [
    { id: "flashcards",    label: "Flashcard Blitz",   icon: "🃏", category: "Memory"       },
    { id: "quiz",          label: "Quiz Arena",         icon: "🧠", category: "Knowledge"    },
    { id: "coding",        label: "Code Sprint",        icon: "💻", category: "Technical"    },
    { id: "behavioral",    label: "Behavioral Round",   icon: "🎯", category: "Soft Skills"  },
    { id: "vocabulary",    label: "Vocab Vault",        icon: "📖", category: "Language"     },
    { id: "aptitude",      label: "Aptitude Gauntlet",  icon: "📐", category: "Reasoning"    },
    { id: "hr",            label: "HR Simulator",       icon: "🤝", category: "Soft Skills"  },
    { id: "typing",        label: "Typing Trials",      icon: "⌨️",  category: "Speed"        },
    { id: "debugging",     label: "Debug Duel",         icon: "🐛", category: "Technical"    },
    { id: "system_design", label: "System Design",      icon: "🏗️",  category: "Architecture" },
  ];

  // ── Read ─────────────────────────────────────────────────────────────────────

  function getModuleData(moduleId) {
    try {
      const raw = localStorage.getItem(PREFIX + moduleId);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function getAllModulesData() {
    return MODULES.map(mod => {
      const data = getModuleData(mod.id) || {};
      return {
        ...mod,
        attempts:   data.attempts   ?? 0,
        bestScore:  data.bestScore  ?? 0,
        lastScore:  data.lastScore  ?? 0,
        completed:  data.completed  ?? false,
        lastPlayed: data.lastPlayed ?? null,
        history:    data.history    ?? [],
        maxScore:   data.maxScore   ?? 100,
      };
    });
  }

  // ── Write ────────────────────────────────────────────────────────────────────

  function saveModuleResult(moduleId, { score, maxScore = 100, completed = false }) {
    const existing = getModuleData(moduleId) || {
      attempts: 0, bestScore: 0, lastScore: 0,
      completed: false, lastPlayed: null, history: [], maxScore: 100
    };

    const updated = {
      attempts:   existing.attempts + 1,
      bestScore:  Math.max(existing.bestScore, score),
      lastScore:  score,
      maxScore,
      completed:  existing.completed || completed,
      lastPlayed: new Date().toISOString(),
      history:    [...(existing.history || []).slice(-9),
                   { score, maxScore, date: new Date().toISOString() }],
    };

    localStorage.setItem(PREFIX + moduleId, JSON.stringify(updated));
    return updated;
  }

  // ── Aggregates ────────────────────────────────────────────────────────────────

  function getOverallStats() {
    const all        = getAllModulesData();
    const played     = all.filter(m => m.attempts > 0);
    const completed  = all.filter(m => m.completed);
    const totalAttempts = all.reduce((s, m) => s + m.attempts, 0);

    const avgScore = played.length
      ? Math.round(played.reduce((s, m) => s + (m.bestScore / m.maxScore) * 100, 0) / played.length)
      : 0;

    return {
      total:         all.length,
      played:        played.length,
      completed:     completed.length,
      totalAttempts,
      avgScore,
      completionPct: Math.round((completed.length / all.length) * 100),
    };
  }

  // ── Seed Demo Data (dev/demo only) ───────────────────────────────────────────

  function seedDemoData() {
    const samples = [
      { id: "flashcards",  score: 88, maxScore: 100, completed: true  },
      { id: "quiz",        score: 74, maxScore: 100, completed: true  },
      { id: "coding",      score: 61, maxScore: 100, completed: false },
      { id: "behavioral",  score: 90, maxScore: 100, completed: true  },
      { id: "vocabulary",  score: 55, maxScore: 100, completed: false },
      { id: "aptitude",    score: 70, maxScore: 100, completed: true  },
    ];
    samples.forEach(s => {
      const times = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < times; i++) {
        saveModuleResult(s.id, {
          score: Math.max(10, s.score - Math.floor(Math.random() * 15)),
          maxScore: s.maxScore,
          completed: s.completed,
        });
      }
    });
  }

  // ── Clear ────────────────────────────────────────────────────────────────────

  function clearAll() {
    MODULES.forEach(m => localStorage.removeItem(PREFIX + m.id));
  }

  function clearModule(moduleId) {
    localStorage.removeItem(PREFIX + moduleId);
  }

  // ── Public API ───────────────────────────────────────────────────────────────
  return {
    MODULES,
    PREFIX,
    getModuleData,
    getAllModulesData,
    saveModuleResult,
    getOverallStats,
    seedDemoData,
    clearAll,
    clearModule,
  };

})();

// Make available globally
window.ArcadeStorage = Storage;