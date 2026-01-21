---
layout: page
title: decks
permalink: /decks/
description: A growing collection of your cool decks.
nav: true
nav_order: 3
display_categories: [work, fun]
horizontal: false
---

<!-- pages/decks.md -->
<div class="decks">
{% if site.enable_project_categories and page.display_categories %}
  <!-- Display categorized decks -->
  {% for category in page.display_categories %}
  <a id="{{ category }}" href=".#{{ category }}">
    <h2 class="category">{{ category }}</h2>
  </a>
  {% assign categorized_decks = site.decks | where: "category", category %}
  {% assign sorted_decks = categorized_decks | sort: "importance" %}
  <!-- Generate cards for each deck -->
  {% if page.horizontal %}
  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for deck in sorted_decks %}
      {% include decks_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for deck in sorted_decks %}
      {% include decks.liquid %}
    {% endfor %}
  </div>
  {% endif %}
  {% endfor %}

{% else %}

<!-- Display decks without categories -->

{% assign sorted_decks = site.decks | sort: "importance" %}

  <!-- Generate cards for each deck -->

{% if page.horizontal %}

  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for deck in sorted_decks %}
      {% include decks_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for deck in sorted_decks %}
      {% include decks.liquid %}
    {% endfor %}
  </div>
  {% endif %}
{% endif %}
</div>
