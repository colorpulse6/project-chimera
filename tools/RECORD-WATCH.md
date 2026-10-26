# Record watch: keeping the site current

A recurring job (Cerebro worker "Chimera record watch") reads this file and
follows it. It looks for new, accepted material in the game project and posts it
to the site. It never touches the game.

## 1. Find what is new

The last posted point is `posted_through` in `tools/record-watch.json`. Look for
anything newer than it:

| Source | Path |
| --- | --- |
| Batch reports (the main record) | `~/Desktop/chimera/fresh-game/briefs/*/BATCH-*-REPORT.md`, and the matching `BATCH-*.md` log (Nic's verdicts are in the log) |
| Milestones outside the batches | `~/Desktop/chimera/fresh-game/briefs/*/REPORT.md` and `LOG.md` (the desert slice of 25 Oct is one) |
| Review runs from the Unreal rig | `~/Desktop/chimera/fresh-game/review/<timestamp>-<name>/` with `sheet.png` and numbered frames. Folders without a timestamp (`place-*`, `sea-walls-a0`, ...) are mostly Blender mock-ups: do not post those as game frames. |
| Packaged builds | `/Volumes/Agent Workspace/Chimera/Builds/` if mounted, else `~/ChimeraLocal/Chimera/Builds/` |
| Resident data | `~/Desktop/chimera/fresh-game/assets/<name>_gen/` (`dialogue.json`, `placement.json`, `route.json`) |
| Places | `~/Desktop/chimera/fresh-game/assets/kit/places.json` |
| Frame-time runs | `review/<date>-frametime-*/FRAMETIME.md` |

If nothing is new, stop and report "nothing new". Do not commit.

## 2. Post only what passed its gate

Nic's verdicts are mostly in the batch logs (`BATCH-N.md`), as lines like
`Nic (ask_user \`batch4b-gate\`): ... PASS`, not in the reports. Read both.

A thing is postable when either:

- Nic passed or accepted it (a verdict line in `BATCH-N.md` or a Coordinator
  section of `BATCH-N-REPORT.md`), or
- it was packaged into `Builds/` and the launch check was clean. Then post it
  **with its acceptance state said plainly**: "built and packaged; not accepted
  until Nic has played it", "Nic: fine for now", "Nic delegated the choices",
  or whatever the log says. Nic's later notes on it go in too.

Until one of those is true, it may appear on the roadmap's "Weaving" list in one
plain line, and nowhere else. No frames of ungated work.

Also not postable, even when gated:

- concept images whose own notes say "no publication" or "Nic reviews", and
  anything Nic set aside (the first region paintings and world map);
- story spoilers: the chosen ending, what Elara turns out to be, what Kai did.
  The story page says these exist and are off the record.

When in doubt, wait for the next run.

## 3. Make the post

1. Frames: add a function to `tools/prep_media.py` for the new runs (see
   `batch_2_3` as the pattern), with its own flag, and run only that flag with
   `~/.venvs/chimera-ml/bin/python tools/prep_media.py --<flag>`. Look at every
   frame you pick. Prefer the frames with Kai or a resident in them.
2. Data: `src/data/places.ts` (status `built` / `now` / `next`, frames),
   `src/data/characters.ts` (new residents: drawing, figure, face, one line of
   their own dialogue), `src/data/roadmap.ts`, and the home ledger in
   `src/pages/index.astro`.
3. Post: one markdown file in `src/content/updates/`, `YYYY-MM-DD-slug.md`,
   front matter as in the README. One post per run at most; group batches.
4. Voice: the site's voice. Short, plain, calm, a little wrong. Every fact must
   come from a report, a data file or a frame. Do not invent lore, names or
   numbers. Say what is not measured.

## 4. Check and publish

```sh
cd ~/Desktop/chimera/site
npm run build                                  # must exit 0
git add -A && git commit -m "<what changed>"   # end with the attribution line
cd ~/Desktop/projects/project-chimera
git fetch -q origin main && git fetch -q ../../chimera/site +main:site-source
C=$(git commit-tree $(git rev-parse site-source^{tree}) -p origin/main -m "Site: <what changed>")
git update-ref refs/heads/site-rebuild $C && git push -q origin site-rebuild:main
gh run list --branch main --limit 1            # wait for success
curl -s -o /dev/null -w '%{http_code}' https://colorpulse6.github.io/project-chimera/updates/<slug>/
```

Then set `posted_through` in `tools/record-watch.json` to the newest report
section or review run you posted, and add a line to `log` with the date and the
slug. Commit that with the post (amend before publishing, or include it in the
same commit).

## 5. Never

- Edit anything under `~/Desktop/chimera/fresh-game`, the Unreal projects, or
  the builds. Run Unreal, Blender or the game.
- Delete files, force-push, or rewrite history in either repository.
- Publish frames of work that has not passed its gate, file paths outside the
  site, machine names, or anything that looks like a key or token.
- Message anyone. The report goes back to the Cerebro run only.

## 6. Report

End with: what was new, what was posted (with the live URL), what was held back
and why, and one line of residual risk.
