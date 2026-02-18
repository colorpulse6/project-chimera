---
layout: default
title: Devlog
description: Development updates, design decisions, and behind-the-scenes looks at building Project Chimera.
---

# Devlog

Development updates, design decisions, and behind-the-scenes looks at building Project Chimera.

---

{% for post in site.posts %}
<div class="card">
  <h3><a href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a></h3>
  <p class="date">{{ post.date | date: "%B %d, %Y" }}</p>
  <p>{{ post.excerpt | strip_html | truncate: 300 }}</p>
  <a href="{{ post.url | prepend: site.baseurl }}">Read more &rarr;</a>
</div>
{% endfor %}

{% if site.posts.size == 0 %}
<p>No posts yet. Check back soon.</p>
{% endif %}
