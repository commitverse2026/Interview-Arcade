(function () {
  'use strict';

  function $(id) {
    return document.getElementById(id);
  }

  function renderStars(container, name, value, onChange) {
    container.innerHTML = '';
    container.setAttribute('role', 'group');
    container.setAttribute('aria-label', name);
    for (var s = 1; s <= 5; s++) {
      (function (star) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'star-btn';
        b.textContent = '★';
        b.setAttribute('aria-label', star + ' star' + (star > 1 ? 's' : ''));
        if (value >= star) b.classList.add('is-on');
        b.addEventListener('click', function () {
          onChange(star);
          renderStars(container, name, star, onChange);
        });
        container.appendChild(b);
      })(s);
    }
  }

  var platformStars = 0;
  var moduleStars = {};

  function initPlatformStars() {
    var el = $('platformStars');
    renderStars(el, 'Platform rating', platformStars, function (n) {
      platformStars = n;
    });
  }

  function buildModuleRatings() {
    var wrap = $('moduleRatings');
    wrap.innerHTML = '';
    var mods = IAStorage.MODULES.filter(function (m) {
      return m.id !== 'feedback' && m.id !== 'dashboard';
    });
    for (var i = 0; i < mods.length; i++) {
      (function (mod) {
        var row = document.createElement('div');
        row.className = 'mod-rate-row';

        var lab = document.createElement('span');
        lab.className = 'mod-rate-label';
        lab.textContent = mod.title;

        var stars = document.createElement('div');
        stars.className = 'star-row-inline';
        var val = moduleStars[mod.id] || 0;
        renderStars(stars, mod.title, val, function (n) {
          moduleStars[mod.id] = n;
        });

        var skip = document.createElement('button');
        skip.type = 'button';
        skip.className = 'skip-mod';
        skip.textContent = 'Skip';
        skip.addEventListener('click', function () {
          delete moduleStars[mod.id];
          renderStars(stars, mod.title, 0, function (n) {
            moduleStars[mod.id] = n;
          });
        });

        row.appendChild(lab);
        row.appendChild(stars);
        row.appendChild(skip);
        wrap.appendChild(row);
      })(mods[i]);
    }
  }

  function refreshSummary() {
    var s = IAStorage.feedbackSummary();
    $('sumCount').textContent = String(s.count);
    if (s.avgStars == null) {
      $('sumAvg').textContent = '—';
    } else {
      $('sumAvg').textContent = String(s.avgStars) + ' / 5';
    }

    var list = $('recentList');
    list.innerHTML = '';
    if (!s.recent.length) {
      list.innerHTML = '<li class="recent-empty">No submissions yet.</li>';
      return;
    }
    for (var i = 0; i < s.recent.length; i++) {
      var e = s.recent[i];
      var li = document.createElement('li');
      li.className = 'recent-item';
      var date = new Date(e.at);
      var head = document.createElement('div');
      head.className = 'recent-head';
      head.innerHTML =
        '<span class="recent-stars">' +
        '★'.repeat(Number(e.platformStars) || 0) +
        '☆'.repeat(5 - (Number(e.platformStars) || 0)) +
        '</span>' +
        '<span class="recent-date">' +
        date.toLocaleString() +
        '</span>';
      var body = document.createElement('p');
      body.className = 'recent-comment';
      body.textContent = e.comment || '(No comment)';
      li.appendChild(head);
      li.appendChild(body);
      list.appendChild(li);
    }
  }

  function onSubmit(ev) {
    ev.preventDefault();
    if (platformStars < 1) {
      $('formError').hidden = false;
      $('formError').textContent = 'Please rate the platform with at least one star.';
      return;
    }
    $('formError').hidden = true;
    var ratings = {};
    for (var k in moduleStars) {
      if (moduleStars[k] > 0) ratings[k] = moduleStars[k];
    }
    IAStorage.appendFeedback({
      platformStars: platformStars,
      comment: $('comment').value,
      moduleRatings: ratings
    });
    $('comment').value = '';
    platformStars = 0;
    moduleStars = {};
    initPlatformStars();
    buildModuleRatings();
    refreshSummary();
    $('thanks').hidden = false;
    window.setTimeout(function () {
      $('thanks').hidden = true;
    }, 4000);
  }

  function init() {
    initPlatformStars();
    buildModuleRatings();
    refreshSummary();
    $('fbForm').addEventListener('submit', onSubmit);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
