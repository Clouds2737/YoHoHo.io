(function () {
  var STORAGE_KEY = 'yohoho.customContent.v1';

  var defaultContent = {
    maps: [
      { id: 'tortuga', name: 'Tortuga', backgroundTexture: '01g' }
    ],
    characters: [
      {
        id: 'pirate_default',
        name: 'Default Pirate',
        skinId: 1,
        stats: {
          damage: 1,
          health: 1,
          speed: 1,
          dashCooldown: 1
        }
      }
    ]
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function sanitize(content) {
    var normalized = clone(defaultContent);
    if (!content || typeof content !== 'object') {
      return normalized;
    }

    if (Array.isArray(content.maps) && content.maps.length) {
      normalized.maps = content.maps
        .filter(function (m) { return m && typeof m.id === 'string' && typeof m.name === 'string'; })
        .map(function (m) {
          return {
            id: m.id,
            name: m.name,
            backgroundTexture: typeof m.backgroundTexture === 'string' ? m.backgroundTexture : '01g'
          };
        });
    }

    if (Array.isArray(content.characters) && content.characters.length) {
      normalized.characters = content.characters
        .filter(function (c) { return c && typeof c.id === 'string' && typeof c.name === 'string'; })
        .map(function (c) {
          var stats = c.stats || {};
          return {
            id: c.id,
            name: c.name,
            skinId: Number.isFinite(c.skinId) ? c.skinId : 1,
            stats: {
              damage: Number.isFinite(stats.damage) ? stats.damage : 1,
              health: Number.isFinite(stats.health) ? stats.health : 1,
              speed: Number.isFinite(stats.speed) ? stats.speed : 1,
              dashCooldown: Number.isFinite(stats.dashCooldown) ? stats.dashCooldown : 1
            }
          };
        });
    }

    return normalized;
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? sanitize(JSON.parse(raw)) : clone(defaultContent);
    } catch (err) {
      console.warn('Unable to read custom content, falling back to defaults.', err);
      return clone(defaultContent);
    }
  }

  function save(content) {
    var safeContent = sanitize(content);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeContent));
    return safeContent;
  }

  var content = load();

  window.YohohoContent = {
    getAll: function () { return clone(content); },
    replaceAll: function (nextContent) {
      content = save(nextContent);
      return clone(content);
    },
    addMap: function (map) {
      content.maps.push(map);
      content = save(content);
      return clone(content.maps);
    },
    addCharacter: function (character) {
      content.characters.push(character);
      content = save(content);
      return clone(content.characters);
    },
    updateCharacterStats: function (characterId, nextStats) {
      var character = content.characters.find(function (c) { return c.id === characterId; });
      if (!character) {
        throw new Error('Character not found: ' + characterId);
      }
      character.stats = Object.assign({}, character.stats, nextStats || {});
      content = save(content);
      return clone(character);
    },
    resetDefaults: function () {
      content = save(defaultContent);
      return clone(content);
    },
    exportJson: function () { return JSON.stringify(content, null, 2); }
  };
})();
