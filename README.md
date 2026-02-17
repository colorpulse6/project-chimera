# Project Chimera

An FF6-inspired JRPG built for the browser, where a medieval fantasy slowly reveals itself to be a simulation controlled by an amoral AI.

**[Play the Demo](https://colorpulse6.github.io/project-chimera/play/)** | **[Hub Site](https://colorpulse6.github.io/project-chimera/)** | **[Devlog](https://colorpulse6.github.io/project-chimera/devlog/)**

## About

Project Chimera is a classic JRPG with ATB combat, tile-based exploration, and a story that questions the nature of reality. It runs entirely in the browser — no download required.

**Tech:** Next.js 15, React, TypeScript, Zustand, Canvas 2D, Tailwind CSS

## Features

- Active Time Battle (ATB) combat system with enemy AI and boss phases
- Tile-based world exploration with NPCs, shops, and quests
- Story-driven progression with branching dialogue
- Medieval apothecary item system (Four Humors lore)
- Quest tracking with objectives and rewards

## Development

```bash
cd game
npm install
npm run dev
```

The game runs at `http://localhost:3000`.

## Contributing

This project is open source but not accepting pull requests at this time. The best way to contribute is through:

- [GitHub Discussions](https://github.com/colorpulse6/project-chimera/discussions) — Feedback, ideas, and discussion
- [Issues](https://github.com/colorpulse6/project-chimera/issues) — Bug reports

## Project Structure

```
project-chimera/
├── game/           # Next.js game application
├── site/           # Jekyll hub site (GitHub Pages)
├── docs/           # Internal story and design documentation
├── drafts/         # Content pipeline staging area
├── prompts/        # AI art generation prompt templates
└── CLAUDE.md       # Development guide
```

## License

All rights reserved. Source code is visible for transparency and learning, but may not be copied, modified, or distributed without permission.
