---
title: The road is there when the town wakes
date: 2026-10-27T12:58:00-05:00
summary: The Long Road now loads with normal play. B1 passed its packaged launch checks, and a signed Mac test ran cleanly. The walk from the town is still missing.
cover: ../../assets/media/b1-longroad-arrival.jpg
coverAlt: Kai at the Long Road arrival, between low stone walls with cypresses and a red-roofed house ahead. A B1 Development package capture.
tags: [build, places]
---

The Long Road used to need a special start. Without it, the town woke and the road did not.

B1 changes that. The route now loads with Havenwood in normal play, including the build mode intended for release. It has not moved. No new geography comes with this change, and there is still no normal walk from the town to the road. The frame above was reached through the development review route.

## What passed

The B1 Development package passed its campaign launch, Long Road launch and Continue checks. The road reported no missing assets. Continue returned Kai to the courtyard. Nic's save was unchanged after the checks.

The work also caught a defect in the distance. Seven far pieces of Long Road scenery could cut sky-coloured holes into the mountains seen from town. They now show only while the Long Road's look is active. The town keeps its own view.

A separate signed Mac test, built in release mode, launched and ran for seventy-five seconds before a clean quit. It used its own data container. The development frame recorder is absent from that build. That is a launch test, not a playtest or a public release. B1 is built and packaged; Nic has not accepted it yet.

## A small measurement

With the road loaded in normal play, two of 5,054 street frames took longer than 16.67 milliseconds. At the Long Road arrival, three of 5,038 did. The 99th percentiles were 9.25 and 10.24 milliseconds respectively.

Those were Development-build samples: about forty-two focused seconds after fifteen seconds of warmup, on AC power with Low Power Mode off. The recorder was stopped before its planned end. They support the coordinator's finding of no measurable added cost in those views. They do not measure the signed release build or a whole walk through the world.

Earlier today Nic played world1 from the arrival through the river crossing to the village. The log records a clean exit, not a blanket acceptance of every view. The route still keeps its changes only for the session. Its loading has joined the town. Its paths have not.
