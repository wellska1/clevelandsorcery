# The Kyle Chronicles · The Acorn Accord

A browser-based adventure game about Kyle, Kenobi, and the friends who keep trying to save Greenwood from a growing Corporate Alliance threat. The story unfolds across four chapters, combining exploration, tactical combat, and a whimsical fantasy setting.

This repository contains a static web game. There is no build pipeline, backend, or install step required to play the game locally.

## Overview

The game follows Kyle and his dog Kenobi through a mix of wilderness, underground tunnels, and the frozen North Pole as they confront droids, rogue factions, and the six-headed villain Cobris.

### Chapters

- Chapter I — The Forest Road
- Chapter II — The Iron Serpent
- Chapter III — Burrow Bastion
- Chapter IV — The North Pole Accord

### Core Themes

- family-friendly fantasy adventure
- light roleplay and quest progression
- tactical turn-based combat
- humor and character personality
- chapter-based story escalation

## Play the Game

### Local Browser Run

Open the project folder and browse to `index.html` directly, or serve it locally:

```bash
cd /path/to/clevelandsorcery
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

### Production Hosting

This project is designed for static hosting. You can deploy it to GitHub Pages, Netlify, or any other static web host by uploading the repo contents or the generated `_site/` output.

## Repository Layout

```text
.
├── index.html
├── style.css
├── chapter2.css
├── game.js
├── chapter2.js
├── README.md
├── LORE_REFERENCE.md
├── assets/
├── _site/
├── _pages/
├── _posts/
├── _projects/
└── ...
```

### Key Files

- `index.html` — main game shell and interface
- `style.css` — global layout and UI styling
- `chapter2.css` — chapter-specific visuals and intro themes
- `game.js` — overall game loop, combat system, and state flow
- `chapter2.js` — chapter content, maps, enemy definitions, and chapter logic
- `LORE_REFERENCE.md` — canonical story and lore notes
- `_site/` — static generated site output

## Controls

### Desktop

- Arrow keys / WASD to move
- Space or interaction button to act with nearby objects
- On-screen buttons and prompts guide progression

### Mobile

- touch controls are included for movement and interaction

## Notes

- Progress is client-side and resets on refresh
- The project is intentionally lightweight and dependency-free
- The art, dialogue, and quest flow are tuned for a playful, story-first browser game experience

## Lore Reference

The game world and character canon live in `LORE_REFERENCE.md` so the story structure remains consistent across chapters and future updates.
