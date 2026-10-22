---
title: The painting is the asset
date: 2026-10-17
summary: The first playable slice that was approved. The courtyard painting became the level, and Kai came out of a drawing through image-to-3D.
cover: ../../assets/media/kai-hero.jpg
coverAlt: Kai mid-stride on the painted courtyard, a dark drawn figure on a gouache ground.
tags: [milestone, characters, pipeline]
---

Three earlier attempts had rebuilt the same corner of Havenwood in full 3D and each was rejected for the same reason: geometry and shading that read as toy bricks. The decision on 17 October was to stop rebuilding and let the approved painting be the level.

The courtyard painting got a depth map and became a relief. Rendered from the painting's own camera it matched the painting to within a fraction of a level per channel, and a figure walking in front of it was occluded correctly by the well and the planter.

Kai came next. A procedural figure built in Blender was rejected as blocky and choppy. The route that worked: take the illustration of Kai, run it through a local image-to-3D model, project the drawing back onto the mesh so the ink and colour are the illustrator's, rig it with weights by body region, and solve the walk and run from the leg geometry so the feet plant. At 10:25 the verdict was "this is the direction, keep going on this build", the first approved playable since the project started.

By evening the same day there were four places, travel between them with Kai walking out of the picture, and a motion test of townsfolk on a shared body. The design chosen for the townsfolk was the masks-and-holes lineup: tall faceless or masked figures, one round void each.
