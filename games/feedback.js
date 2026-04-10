(function () {
  'use strict';

  var STORAGE_KEY = 'interview_arcade_feedback_v1';

  var MODULES = [
    'Tic Tac Toe + OOP Quiz',
    'Memory Card Game',
    'Aptitude Quiz',
    'Resume Keyword Matcher',
    'SQL Fill in the Blanks',
    'Image Riddles',
    'DSA Match the Following',
    'Debug the Code',
    'Progress Dashboard'
  ];

  function loadEntries() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveEntries(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  function el(id) {
    return document.getElementById(id);
  }

  function createStarButtons(container, options) {
    var onChange = options.onChange;
    var valueHolder = { value: 0 };

    for (var i = 1; i <= 5; i++) {
      (function (starVal) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'star-btn';
        btn.setAttribute('aria-label', starVal + ' star' + (starVal > 1 ? 's' : ''));
        btn.textContent = '★';
        btn.dataset.value = String(starVal);

        function paint() {
          var v = valueHolder.value;
          container.querySelectorAll('.star-btn').forEach(function (b) {
            var n = parseInt(b.dataset.value, 10);
            b.classList.toggle('is-selected', n <= v && v > 0);
          });
        }

        btn.addEventListener('click', function () {
          valueHolder.value = starVal === valueHolder.value ? 0 : starVal;
          paint();
          if (onChange) onChange(valueHolder.value);
        });

        container.appendChild(btn);
      })(i);
    }

    return {
      getValue: function () {
        return valueHolder.value;
      },
      setValue: function (v) {
        valueHolder.value = typeof v === 'number' && v >= 0 && v <= 5 ? v : 0;
        container.querySelectorAll('.star-btn').forEach(function (b) {
          var n = parseInt(b.dataset.value, 10);
          b.classList.toggle('is-selected', n <= valueHolder.value && valueHolder.value > 0);
        });
      },
      clear: function () {
        valueHolder.value = 0;
        container.querySelectorAll('.star-btn').forEach(function (b) {
          b.classList.remove('is-selected');
        });
      }
    };
  }

  var overallControl;
  var moduleControls = [];

  function buildOverallStars() {
    var wrap = el('overallStars');
    var hint = el('overallHint');
    overallControl = createStarButtons(wrap, {
      onChange: function (v) {
        hint.textContent = v ? v + ' / 5' : 'Select 1–5 stars';
      }
    });
  }

  function buildModuleRows() {
    var root = el('moduleRatings');
    root.innerHTML = '';
    moduleControls = [];

    MODULES.forEach(function (label) {
      var row = document.createElement('div');
      row.className = 'module-row';

      var nameEl = document.createElement('span');
      nameEl.className = 'module-name';
      nameEl.textContent = label;

      var stars = document.createElement('div');
      stars.className = 'star-row';
      stars.setAttribute('role', 'group');
      stars.setAttribute('aria-label', 'Rating for ' + label);

      var ctrl = createStarButtons(stars, {});
      moduleControls.push({ id: label, control: ctrl });

      row.appendChild(nameEl);
      row.appendChild(stars);
      root.appendChild(row);
    });
  }

  function renderSummary() {
    var entries = loadEntries();
    var emptyEl = el('summaryEmpty');
    var contentEl = el('summaryContent');

    if (entries.length === 0) {
      emptyEl.hidden = false;
      contentEl.hidden = true;
      return;
    }

    emptyEl.hidden = true;
    contentEl.hidden = false;

    var sum = 0;
    for (var i = 0; i < entries.length; i++) {
      sum += entries[i].overallRating;
    }
    var avg = sum / entries.length;
    el('avgRating').textContent = avg.toFixed(1);
    el('entryCount').textContent = String(entries.length);

    var recent = entries.slice(-10).reverse();
    var ul = el('recentComments');
    ul.innerHTML = '';

    recent.forEach(function (e) {
      var li = document.createElement('li');
      var meta = document.createElement('div');
      meta.className = 'comment-meta';
      var dateStr = e.createdAt ? new Date(e.createdAt).toLocaleString() : '';
      var starsStr = '';
      var r = e.overallRating;
      for (var s = 0; s < r; s++) starsStr += '★';
      for (var t = r; t < 5; t++) starsStr += '☆';
      meta.innerHTML =
        '<span class="comment-stars">' +
        starsStr +
        '</span> · ' +
        (dateStr || 'Unknown date');

      var text = document.createElement('div');
      text.className = 'comment-text';
      var c = (e.comment || '').trim();
      text.textContent = c || '(No comment)';

      li.appendChild(meta);
      li.appendChild(text);
      ul.appendChild(li);
    });
  }

  function resetForm() {
    overallControl.clear();
    el('overallHint').textContent = 'Select 1–5 stars';
    el('comment').value = '';
    el('charCount').textContent = '0';
    moduleControls.forEach(function (m) {
      m.control.clear();
    });
  }

  function init() {
    buildOverallStars();
    buildModuleRows();

    el('toggleModules').addEventListener('click', function () {
      var panel = el('moduleRatings');
      var open = panel.hidden;
      panel.hidden = !open;
      this.setAttribute('aria-expanded', open ? 'true' : 'false');
      this.textContent = open
        ? '− Hide module ratings'
        : '+ Rate individual modules (optional)';
    });

    el('comment').addEventListener('input', function () {
      el('charCount').textContent = String(this.value.length);
    });

    el('feedbackForm').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var rating = overallControl.getValue();
      if (rating < 1 || rating > 5) {
        el('overallHint').textContent = 'Please choose a rating from 1 to 5 stars.';
        return;
      }

      var moduleRatings = {};
      moduleControls.forEach(function (m) {
        var v = m.control.getValue();
        if (v >= 1 && v <= 5) moduleRatings[m.id] = v;
      });

      var entry = {
        id: 'fb_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9),
        overallRating: rating,
        comment: el('comment').value.trim().slice(0, 500),
        moduleRatings: moduleRatings,
        createdAt: new Date().toISOString()
      };

      var entries = loadEntries();
      entries.push(entry);
      saveEntries(entries);

      var toast = el('toast');
      toast.hidden = false;
      setTimeout(function () {
        toast.hidden = true;
      }, 3500);

      resetForm();
      renderSummary();
    });

    renderSummary();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
