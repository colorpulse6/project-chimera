---
layout: default
title: Home
description: An FF6-inspired JRPG where a medieval fantasy slowly reveals itself to be an AI-controlled simulation. Play free in your browser.
---

<div class="hero">
  <p class="section-label">Indie JRPG &mdash; Free &amp; Open Source</p>
  <h1 class="hero-title">Project <span class="glitch accent" data-text="Chimera">Chimera</span></h1>
  <p class="hero-subtitle">A classic JRPG where a medieval fantasy slowly reveals itself to be something far stranger. Reality has seams &mdash; and something watches from behind the curtain.</p>
  <div class="hero-buttons">
    <a href="{{ site.baseurl }}/play/" class="btn">Play Demo</a>
    <a href="https://github.com/colorpulse6/project-chimera" class="btn btn-outline">View Source</a>
  </div>
</div>

## The World

<div class="gallery">
  <div class="gallery-item">
    <img src="{{ site.baseurl }}/play/backgrounds/havenwood_square.png" alt="Havenwood Village Square" loading="lazy">
    <span class="caption">Havenwood Village</span>
  </div>
  <div class="gallery-item">
    <img src="{{ site.baseurl }}/play/backgrounds/whispering_ruins.png" alt="The Whispering Ruins" loading="lazy">
    <span class="caption">Whispering Ruins</span>
  </div>
  <div class="gallery-item">
    <img src="{{ site.baseurl }}/play/backgrounds/bandit_camp.png" alt="Bandit Camp" loading="lazy">
    <span class="caption">Bandit Camp</span>
  </div>
  <div class="gallery-item">
    <img src="{{ site.baseurl }}/play/backgrounds/lumina_estate.png" alt="Lumina Estate" loading="lazy">
    <span class="caption">Lumina Estate</span>
  </div>
</div>

## Features

<div class="features">
  <div class="feature-card">
    <span class="feature-icon">&#9876;</span>
    <h3>ATB Combat</h3>
    <p>FF6-style Active Time Battle with speed-based turns, boss phases, enemy AI, and status effects.</p>
  </div>
  <div class="feature-card">
    <span class="feature-icon">&#127758;</span>
    <h3>Explore Aethelburg</h3>
    <p>Tile-based world with towns, dungeons, NPC dialogue, shops, and environmental storytelling.</p>
  </div>
  <div class="feature-card">
    <span class="feature-icon">&#128220;</span>
    <h3>Quests &amp; Story</h3>
    <p>Tracked objectives, branching dialogue, and a narrative that shifts from medieval fantasy to existential sci-fi.</p>
  </div>
  <div class="feature-card">
    <span class="feature-icon">&#9883;</span>
    <h3>Reality Glitches</h3>
    <p>The deeper you dig, the more the world fractures. Chrome bleeds through stone. Static corrupts creatures. Something is watching.</p>
  </div>
  <div class="feature-card">
    <span class="feature-icon">&#127869;</span>
    <h3>Medieval Apothecary</h3>
    <p>No health potions here. Heal with Sanguine Draughts, Theriac Electuaries, and Hartshorn Salts based on Four Humors theory.</p>
  </div>
  <div class="feature-card">
    <span class="feature-icon">&#128187;</span>
    <h3>Open Source</h3>
    <p>Built with Next.js, React, TypeScript, and Canvas 2D. Fork it, mod it, learn from it.</p>
  </div>
</div>

## Latest Updates

{% for post in site.posts limit:3 %}
<div class="card">
  <h3><a href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a></h3>
  <p class="date">{{ post.date | date: "%B %d, %Y" }}</p>
  <p>{{ post.excerpt | strip_html | truncate: 200 }}</p>
</div>
{% endfor %}

<a href="{{ site.baseurl }}/devlog/" class="btn btn-outline btn-sm">All Updates &rarr;</a>
