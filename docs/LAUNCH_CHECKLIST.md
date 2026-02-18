# Launch Checklist

Status as of 2026-02-17. Automated steps are marked complete.

---

## GitHub (Complete)

- [x] Repo created: https://github.com/colorpulse6/project-chimera
- [x] GitHub Pages enabled (source: GitHub Actions)
- [x] Discussions enabled
- [x] Project board created: https://github.com/users/colorpulse6/projects/3
- [x] Old `chimera-1` branch and `games/chimera/` cleaned up from knicks-knacks

## GitHub Discussions — Manual Setup

Go to **Settings → General → Features → Discussions → Set up categories**

Create these categories (delete defaults you don't need):

| Category | Emoji | Format | Notes |
|----------|-------|--------|-------|
| Announcements | :mega: | Announcement | Already exists — set to admin-only posting |
| Playtest Feedback | :video_game: | Open-ended | |
| Bug Reports | :bug: | Open-ended | |
| Balancing & Mechanics | :scales: | Open-ended | |
| Story & Lore | :scroll: | Open-ended | |
| UI/UX | :art: | Open-ended | |

Optional: delete Ideas, Polls, Q&A, Show and tell if unused.

## itch.io

1. Go to https://itch.io/game/new
2. **Title:** Project Chimera
3. **Kind of project:** HTML
4. **Pricing:** Free / Name your own price
5. **Uploads:** Two channels:
   - **Stable Demo** — production build or link to GitHub Pages
   - **Experimental** — bleeding-edge builds
6. **Description:** FF6-style JRPG about a medieval world that's secretly an AI simulation
7. **Tags:** jrpg, pixel-art, retro, fantasy, browser, open-source
8. Optional: install `butler` CLI for CI uploads (`brew install itchio/butler/butler`)

## Discord

1. Create server: **Project Chimera**
2. Create channels:
   - `#announcements` (admin-only)
   - `#releases` (admin-only)
   - `#devlog`
   - `#playtest-feedback`
   - `#bug-reports`
   - `#lore`
   - `#screenshots-clips`
   - `#general`
3. Generate a permanent invite link (never expires, unlimited uses)

## Wire Up Links

Once itch.io and Discord are live, update `site/_includes/footer.html`:

```html
<a href="https://discord.gg/YOUR_CODE">Discord</a> |
<a href="https://colorpulse6.itch.io/chimera">itch.io</a>
```

Uncomment the two lines and replace the placeholder URLs, then push.
