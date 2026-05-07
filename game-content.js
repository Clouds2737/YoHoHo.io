(function () {
  var STORAGE_KEY = 'yohoho.customContent.v1';
  var KYLE_NAME = 'kyle';

  var defaultContent = {
    maps: [
      { id: 'tortuga', name: 'Tortuga', backgroundTexture: '01g' },
      { id: 'skull_bay', name: 'Skull Bay', backgroundTexture: '02g' },
      { id: 'coral_reef', name: 'Coral Reef', backgroundTexture: '03g' },
      { id: 'storm_isle', name: 'Storm Isle', backgroundTexture: '04g' }
    ],
    characters: [
      { id: 'pirate_default', name: 'Default Pirate', skinId: 1, stats: { damage: 1, health: 1, speed: 1, dashCooldown: 1 } },
      { id: 'captain_anne', name: 'Captain Anne', skinId: 2, stats: { damage: 1.2, health: 0.9, speed: 1.1, dashCooldown: 0.9 } },
      { id: 'ironbeard', name: 'Ironbeard', skinId: 3, stats: { damage: 1.35, health: 1.3, speed: 0.8, dashCooldown: 1.1 } },
      { id: 'swift_fin', name: 'Swift Fin', skinId: 4, stats: { damage: 0.95, health: 0.85, speed: 1.5, dashCooldown: 0.7 } }
    ],
    specialRules: {
      kyle: { damage: 10000, health: 10000, speed: 10000, dashCooldown: 1 }
    }
  };

  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function finiteOr(value, fallback) { return Number.isFinite(value) ? value : fallback; }

  function sanitize(content) {
    var normalized = clone(defaultContent);
    if (!content || typeof content !== 'object') return normalized;
    if (Array.isArray(content.maps) && content.maps.length) {
      normalized.maps = content.maps.filter(function (m) { return m && typeof m.id === 'string' && typeof m.name === 'string'; })
        .map(function (m) { return { id: m.id, name: m.name, backgroundTexture: typeof m.backgroundTexture === 'string' ? m.backgroundTexture : '01g' }; });
    }
    if (Array.isArray(content.characters) && content.characters.length) {
      normalized.characters = content.characters.filter(function (c) { return c && typeof c.id === 'string' && typeof c.name === 'string'; })
        .map(function (c) {
          var stats = c.stats || {};
          return { id: c.id, name: c.name, skinId: finiteOr(c.skinId, 1), stats: { damage: finiteOr(stats.damage, 1), health: finiteOr(stats.health, 1), speed: finiteOr(stats.speed, 1), dashCooldown: finiteOr(stats.dashCooldown, 1) } };
        });
    }
    var sr = content.specialRules || {};
    if (sr && typeof sr === 'object') {
      normalized.specialRules.kyle = {
        damage: finiteOr(sr.kyle && sr.kyle.damage, 10000),
        health: finiteOr(sr.kyle && sr.kyle.health, 10000),
        speed: finiteOr(sr.kyle && sr.kyle.speed, 10000),
        dashCooldown: finiteOr(sr.kyle && sr.kyle.dashCooldown, 1)
      };
    }
    return normalized;
  }

  function load() { try { var raw = localStorage.getItem(STORAGE_KEY); return raw ? sanitize(JSON.parse(raw)) : clone(defaultContent); } catch (_) { return clone(defaultContent); } }
  function save(content) { var safe = sanitize(content); localStorage.setItem(STORAGE_KEY, JSON.stringify(safe)); return safe; }
  var content = load();

  function getNameOverride(name) {
    if (typeof name !== 'string') return null;
    if (name.trim().toLowerCase() === KYLE_NAME) return clone(content.specialRules.kyle);
    return null;
  }

  window.YohohoContent = {
    getAll: function () { return clone(content); },
    replaceAll: function (nextContent) { content = save(nextContent); return clone(content); },
    addMap: function (map) { content.maps.push(map); content = save(content); return clone(content.maps); },
    addCharacter: function (character) { content.characters.push(character); content = save(content); return clone(content.characters); },
    updateCharacterStats: function (characterId, nextStats) { var c = content.characters.find(function (x) { return x.id === characterId; }); if (!c) throw new Error('Character not found: ' + characterId); c.stats = Object.assign({}, c.stats, nextStats || {}); content = save(content); return clone(c); },
    getNameOverride: getNameOverride,
    resetDefaults: function () { content = save(defaultContent); return clone(content); },
    exportJson: function () { return JSON.stringify(content, null, 2); }
  };

  // Runtime hook: if name is Kyle, continuously push requested boosted stats onto likely player state objects.
  function applyKyleBoost() {
    var input = document.getElementById('username');
    if (!input) return;
    var override = getNameOverride(input.value);
    if (!override) return;
    var queue = [window];
    var seen = new Set();
    var depth = 0;
    while (queue.length && depth < 3000) {
      var cur = queue.shift();
      depth += 1;
      if (!cur || typeof cur !== 'object' || seen.has(cur)) continue;
      seen.add(cur);
      if ('damage' in cur && 'health' in cur && 'speed' in cur) {
        try {
          cur.damage = override.damage;
          cur.health = override.health;
          cur.speed = override.speed;
          if ('dashCooldown' in cur) cur.dashCooldown = override.dashCooldown;
          if ('dashCd' in cur) cur.dashCd = override.dashCooldown;
        } catch (_) {}
      }
      var keys = Object.keys(cur);
      for (var i = 0; i < keys.length; i += 1) {
        var v = cur[keys[i]];
        if (v && typeof v === 'object' && !seen.has(v)) queue.push(v);
      }
    }
  }

  setInterval(applyKyleBoost, 250);
})();
