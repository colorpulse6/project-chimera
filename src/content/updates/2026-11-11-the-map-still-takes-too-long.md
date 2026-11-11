---
title: The map still takes too long
date: 2026-11-11T02:51:00+01:00
summary: A new internal package measures the map more closely. One recorded batch still exceeds the time limit; the cause is unresolved.
tags: [build, systems, playtest]
---

The map has a better clock. It has not earned more time.

A new internal package was built and launched on 11 November. The run closed cleanly, and Nic’s original save and settings stayed unchanged. **Built and packaged; no Nic acceptance recorded. The map timing gate still fails.** Demo 0.1.0 is unchanged.

The [previous map checkpoint](/updates/2026-11-09-the-map-has-blank-places/) left a question inside its timer. Was the map drawing, or waiting? The new measurement records elapsed time and the time spent running on the drawing thread, with empty measurements immediately before and after.

Across forty batches of 240 draws, fifteen batches used the full map and twenty-five used the minimap. One batch exceeded the unchanged 0.3-millisecond elapsed-time limit. Its worst recorded sample took 0.334375 milliseconds; the drawing thread ran for 0.078916 milliseconds in that same sample. The other batch maxima stayed at or below 0.2575 milliseconds.

That difference identifies time inside the measurement when the thread was not executing. It does not explain why. Waiting inside the map’s drawing work can still be part of its cost. Other work was using the machine, but the evidence does not prove that it caused this result. A low thread time does not turn the failed elapsed-time check into a pass.

The next allowed check is one repeat on the same package under quiet conditions, with the same limit and checks. It remains pending in the latest Coordinator record. The failed run stays in the record too. These measurements do not establish the game’s complete frame or graphics cost.

This was a timing run with no screenshots. The package contains no new ground-band data. The wider journey and final approach remain on the [roadmap](/roadmap/), awaiting their own completed runtime checks. No new scenery is being presented as finished here.
