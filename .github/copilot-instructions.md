# Copilot Instructions for al-folio

## Project Overview

This is **al-folio**, a Jekyll-based static site generator for academic/professional homepages. The Cleveland Sorcery instance customizes this for a TCG (trading card game) blog. The site compiles Markdown files into a static website with Liquid templates, using Ruby plugins for enhanced functionality.

## Key Architecture

### Static Site Generation Pipeline
- **Source**: Markdown files in `_pages/`, `_posts/`, `_projects/`, `_news/`, `_bibliography/`
- **Processing**: Jekyll + 20+ plugins (see Gemfile) compile everything via Liquid templates
- **Output**: Static HTML in `_site/` (auto-generated, never edit)
- **Deployment**: GitHub Actions auto-deploys to `gh-pages` branch on main push

### Main Content Collections
- `_posts/`: Blog posts (filename format: `YYYY-MM-DD-title.md`)
- `_pages/`: Static pages (about, decks, repositories, etc.)
- `_news/`: News items displayed on about page
- `_decks/`: Deck showcases (YAML list in `_data/repositories.yml`)
- `_bibliography/`: BibTeX references processed by jekyll-scholar

### Template Hierarchy
- `_layouts/`: Page templates (`default.liquid`, `post.liquid`, `distill.liquid`)
- `_includes/`: Reusable components (`header.liquid`, `footer.liquid`, `figure.liquid`)
- `_sass/`: Styling with Bootstrap 5 integration

## Critical Developer Workflows

### Local Development (Recommended: Docker)
```bash
# Start Docker development server
docker compose up
# Visit http://localhost:8080

# Alternative: slim image (~100MB vs 400MB)
docker compose -f docker-compose-slim.yml up
```

### Troubleshooting Docker
```bash
docker compose logs          # View build errors
docker compose exec -it jekyll /bin/bash
# Inside container:
bundle install              # Fix gem issues
./bin/entry_point.sh       # Re-run Jekyll build
```

### Build & Deploy
- **Config file**: `_config.yml` - requires rebuild to apply (Liquid variables don't auto-refresh)
- **Content changes**: Post/page Markdown changes appear immediately (refresh browser)
- **Auto-deploy**: Push to `main` branch → GitHub Actions builds → `gh-pages` branch
- **Manual deploy** (if needed): `bin/deploy` script

### Key Build Commands
```bash
bundle exec jekyll serve    # Legacy local serve
bundle exec jekyll build    # Build only (outputs to _site/)
```

## Project-Specific Patterns & Conventions

### Markdown Frontmatter (YAML)
Every content file requires frontmatter with layout and metadata:
```yaml
---
layout: post
title: "Event Name"
date: 2025-10-11 22:22:22
author: Kyle Wells
description: Brief summary
tags: tag1 tag2
categories: tournament
thumbnail: assets/img/image.jpg
toc:
  sidebar: left        # Optional: enables sidebar TOC
images:
  photoswipe: true     # Optional: lightbox gallery
giscus_comments: true  # Optional: enable comments
---
```

### Custom Jekyll Plugins (in `_plugins/`)
- `details.rb`: `{% details %}` tag for collapsible content
- `google-scholar-citations.rb`: Fetches citation counts from Google Scholar
- `jekyll-scholar`: Renders BibTeX bibliography
- `jekyll-get-json`: Fetches external JSON data
- Custom plugins are Ruby filters/tags—modify carefully, test locally

### Liquid Template Syntax (Not Jinja/ERB)
- Variables: `{{ page.title }}` (not `{#` comments)
- Filters: `{{ content | markdownify }}`
- Loops: `{% for post in site.posts %}`
- Conditionals: `{% if page.toc.sidebar %}`
- **Note**: Liquid has different syntax than Jinja2; don't assume Python template knowledge

### Configuration (`_config.yml`)
Critical settings that require **rebuild** to apply:
- `url`, `baseurl`: Site root URL (GitHub Pages requires exact naming)
- `collections`: Defines custom content types (books, news, projects)
- `plugins`: Enables Jekyll gem plugins
- `include`, `exclude`: What files Jekyll processes
- `third_party_libraries`: CDN URLs for Bootstrap, icons, fonts

### File Organization Patterns
- `assets/`: Static files (images, CSS, JS) - use `{{ '/path' | relative_url }}` for links
- `_data/cv.yml` or `assets/json/resume.json`: Two alternate CV formats (fallback chain)
- `_data/repositories.yml`: GitHub user/repo metadata for display
- `_data/socials.yml`: Social links & contact info
- Theme imports from `_sass/font-awesome/` and `_sass/tabler-icons/`

## Integration Points & Dependencies

### External APIs
- **Google Scholar**: Citation counts via `google-scholar-citations.rb`
- **GitHub Stats**: Repository data via jekyll-get-json
- **Giscus**: Comment system (configured in `_config.yml`)
- **Google Analytics**: Optional tracking

### Third-Party Libraries (CDN)
All configured in `_config.yml` under `third_party_libraries`:
- Bootstrap 5 (CSS framework)
- MDB (Material Design Bootstrap)
- Academicons + Scholar Icons (academic symbols)
- PhotoSwipe (image lightbox)
- Google Fonts

### Build Dependencies (Gemfile)
- **Core**: Jekyll, jekyll-scholar (BibTeX), jekyll-paginate-v2
- **Media**: jekyll-imagemagick (image optimization)
- **Content**: jekyll-tabs, jekyll-toc, jekyll-jupyter-notebook
- **Optimization**: jekyll-minifier, jekyll-terser (CSS/JS minification)

## Common Development Tasks

### Add a Blog Post
1. Create file: `_posts/YYYY-MM-DD-title.md`
2. Add frontmatter with `layout: post`
3. Tag with relevant categories/tags
4. Push to `main` → auto-deploys

### Add a Deck
1. Create file: `_decks/deckname.md`
2. Add frontmatter with `layout: page`
3. Add relevant fields (category, importance)
4. Push to `main` → auto-deploys

### Customize Layout
1. Copy layout from `_layouts/` to modify
2. Edit Liquid template code
3. Reference in frontmatter: `layout: custom-name`
4. No rebuild needed for layout changes (only config)

### Debug Build Failures
1. Check `docker compose logs` for error messages
2. Common: missing Gem in Gemfile, broken Liquid syntax, bad YAML frontmatter
3. Ensure Markdown uses kramdown syntax (GFM flavor)

### Add Custom Plugin
1. Create `.rb` file in `_plugins/`
2. Follow Jekyll plugin pattern (register tag/filter with Liquid)
3. Rebuild with `bundle exec jekyll serve`
4. Test locally before deploying

## Known Gotchas

- **Config changes**: Editing `_config.yml` requires rebuild; content changes auto-refresh
- **Liquid not Python**: `{% if %}` syntax is Liquid, not Jinja2
- **GitHub Pages branch**: Must deploy to `gh-pages` branch; `main` is source only
- **File naming**: Posts must follow `YYYY-MM-DD-title.md` format
- **Relative URLs**: Always use `{{ '/path' | relative_url }}` to handle baseurl correctly
- **BibTeX**: jekyll-scholar requires `.bib` file in `_bibliography/` with specific formatting

## Resources

- [Jekyll Docs](https://jekyllrb.com/docs/)
- [Liquid Template Syntax](https://shopify.github.io/liquid/)
- [al-folio GitHub](https://github.com/alshedivat/al-folio)
- Local: `CUSTOMIZE.md`, `INSTALL.md`, `FAQ.md`
