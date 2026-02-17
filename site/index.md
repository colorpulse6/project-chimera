---
layout: default
title: Home
---

<div class="hero">
  <h1>Project Chimera</h1>
  <p>A classic JRPG inspired by Final Fantasy VI, where a medieval fantasy slowly reveals itself to be something far stranger.</p>
  <a href="{{ site.baseurl }}/play/" class="btn">Play Demo</a>
  <a href="{{ site.baseurl }}/devlog/" class="btn btn-outline">Read Devlog</a>
</div>

## Current Focus

Project Chimera is in active development. We're building out Act I of the story — the adventure begins in the village of Havenwood, where a young man named Kai searches for his missing sister. Beneath the medieval surface, cracks in reality hint at something deeper.

## What's New

{% for post in site.posts limit:3 %}
<div class="card">
  <h3><a href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a></h3>
  <p class="date">{{ post.date | date: "%B %d, %Y" }}</p>
  <p>{{ post.excerpt | strip_html | truncate: 200 }}</p>
</div>
{% endfor %}

## Links

- [Play the Demo]({{ site.baseurl }}/play/) — Browser-based, no download required
- [Public Roadmap]({{ site.baseurl }}/roadmap/) — See what's planned
- [Give Feedback]({{ site.baseurl }}/feedback/) — Help shape the game
- [GitHub](https://github.com/colorpulse6/project-chimera) — Source code and discussions
