# YoHoHo content configuration

Use `game-content.js` to tune maps and character stats without editing the bundled game file.

## Included by default now

- Maps: Tortuga, Skull Bay, Coral Reef, Storm Isle.
- Characters: Default Pirate, Captain Anne, Ironbeard, Swift Fin.

## Kyle special rule

If the username is exactly `Kyle` (case-insensitive), the game applies:

- `damage: 10000`
- `health: 10000`
- `speed: 10000`
- `dashCooldown: 1`

## Console examples

```js
YohohoContent.getAll();
YohohoContent.addMap({ id: 'sunken_keep', name: 'Sunken Keep', backgroundTexture: '05g' });
YohohoContent.addCharacter({
  id: 'blackwake',
  name: 'Blackwake',
  skinId: 5,
  stats: { damage: 1.4, health: 1.2, speed: 0.95, dashCooldown: 1 }
});
YohohoContent.updateCharacterStats('blackwake', { damage: 1.6 });
```
