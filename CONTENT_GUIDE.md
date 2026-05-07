# YoHoHo content configuration

This build now force-enables full progression for everyone.

## Global unlocks enabled

- Everyone gets **20,000,000 coins/bloons**.
- All skins are unlocked (IDs `1..120`).
- All pets are unlocked (IDs `0..60`).
- Pet is auto-set with a very high level.

These values are continuously reapplied while the page is open.

## Kyle special rule

If username is `Kyle` (case-insensitive), boosted stats are applied:

- `damage: 10000`
- `health: 10000`
- `speed: 10000`
- `dashCooldown: 1`

## API

```js
YohohoContent.getAll();
YohohoContent.grantEverything();
YohohoContent.addCharacter({ id: 'blackwake', name: 'Blackwake', skinId: 5, stats: { damage: 1.4, health: 1.2, speed: 0.95, dashCooldown: 1 }});
```
