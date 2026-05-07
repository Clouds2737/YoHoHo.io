# YoHoHo content configuration

This project includes a lightweight content API in `game-content.js` so game content is easier to update without editing the bundled game file.

## Included by default

- Maps: Tortuga, Skull Bay, Coral Reef, Storm Isle.
- Characters: Default Pirate, Captain Anne, Ironbeard, Swift Fin.

## What you can change

- Maps (id, display name, background texture key).
- Characters (id, name, skin id).
- Character balance values (`damage`, `health`, `speed`, `dashCooldown`).

## Kyle special rule

If the username is exactly `Kyle` (case-insensitive), the game applies:

- `damage: 10000`
- `health: 10000`
- `speed: 10000`
- `dashCooldown: 1`

## Quick usage (browser console)

```js
YohohoContent.getAll();

YohohoContent.addMap({
  id: 'reef',
  name: 'Coral Reef',
  backgroundTexture: '02g'
});

YohohoContent.addCharacter({
  id: 'captain_anne',
  name: 'Captain Anne',
  skinId: 3,
  stats: {
    damage: 1.25,
    health: 0.9,
    speed: 1.1,
    dashCooldown: 0.9
  }
});

YohohoContent.updateCharacterStats('captain_anne', {
  damage: 1.35
});

YohohoContent.exportJson();
