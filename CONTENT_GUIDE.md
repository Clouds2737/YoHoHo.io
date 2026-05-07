# YoHoHo content configuration

This project now includes a lightweight content API in `game-content.js` so game content is easier to update without editing the minified game bundle.

## What you can change

- Maps (id, display name, background texture key).
- Characters (id, name, skin id).
- Character balance values (`damage`, `health`, `speed`, `dashCooldown`).

## Quick usage (browser console)

```js
YohohoContent.getAll();
YohohoContent.addMap({ id: 'reef', name: 'Coral Reef', backgroundTexture: '02g' });
YohohoContent.addCharacter({
  id: 'captain_anne',
  name: 'Captain Anne',
  skinId: 3,
  stats: { damage: 1.25, health: 0.9, speed: 1.1, dashCooldown: 0.9 }
});
YohohoContent.updateCharacterStats('captain_anne', { damage: 1.35 });
YohohoContent.exportJson();
```

## Persistence

- Changes are saved in `localStorage` under key `yohoho.customContent.v1`.
- To reset to defaults:

```js
YohohoContent.resetDefaults();
```
