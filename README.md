# Kuang Wang — Academic Homepage

A small academic website built on Jekyll/al-folio, deliberately reduced to the
essentials: **Home**, **Publications**, and **CV**.

## Content map

| What to edit                    | Source of truth                                |
| ------------------------------- | ---------------------------------------------- |
| Biography and research focus    | `_pages/about.md`                              |
| Updates / activities            | `_data/updates.yml`                            |
| Publications                    | `_bibliography/papers.bib`                     |
| Homepage background data        | `_data/cv.yml`                                 |
| English / Chinese CV source     | `../resume/en_resume.tex`, `zh_resume.tex`     |
| Embedded CV PDFs                | `assets/pdf/Kuang_Wang_CV_{en,zh}.pdf`         |
| Social links                    | `_data/socials.yml`                            |
| Site metadata and feature flags | `_config.yml`                                  |
| Homepage interaction            | `assets/js/updates.js`                         |
| Homepage visual system          | `_sass/_components.scss`, `_sass/_themes.scss` |

## Common CRUD operations

### Add an update

Add the newest entry to the **top** of `_data/updates.yml`:

```yaml
- date: 2026-08-01
  label: Paper
  text: "A short, factual update."
  url: https://example.com
  link_text: Details
```

`url` and `link_text` are optional. The homepage automatically picks up the new
entry; do not edit HTML for routine updates.

### Add a publication

Add one BibTeX record to `_bibliography/papers.bib`. Useful custom fields:

```bibtex
abbr        = {ACL},
selected    = {true},
bibtex_show = {true},
pdf         = {https://...},
code        = {https://...},
website     = {https://...}
```

`selected = {true}` includes the paper on the homepage. Every paper appears on
`/publications/`.

### Update the CV

The `/cv/` page embeds the original English or Chinese PDF instead of rebuilding
the resume as HTML. The paired LaTeX sources live in
[`phd_core/05_personal_brand_and_skills/resume`](https://github.com/wangkevin02/phd_core/tree/main/05_personal_brand_and_skills/resume).
With both repositories checked out as siblings, build and copy both PDFs:

```bash
cd ../resume
./build_resume.sh pdf all
cd ../wangkevin02.github.io
cp ../resume/en_resume.pdf assets/pdf/Kuang_Wang_CV_en.pdf
cp ../resume/zh_resume.pdf assets/pdf/Kuang_Wang_CV_zh.pdf
```

The embedded assets are:

```text
assets/pdf/Kuang_Wang_CV_en.pdf
assets/pdf/Kuang_Wang_CV_zh.pdf
```

`_data/cv.yml` remains the structured source for the compact
Experience / Education / Honors summary on the homepage.

## Local development

Docker is the most reproducible path:

```bash
docker compose up --build
```

Open `http://localhost:8080`.

Without Docker, if Ruby dependencies are already installed:

```bash
bundle exec jekyll serve --livereload
```

## Validation checklist

```bash
npx prettier . --write
bundle exec jekyll build
```

Then inspect:

- `/` at desktop and mobile widths;
- dark mode;
- Updates: previous / pause / next, keyboard focus, reduced-motion behavior;
- `/publications/`;
- `/cv/`, its English / Chinese switch, and the current-language PDF fallback.

## Design rules

1. Do not add placeholder content to make the site look fuller.
2. Prefer structured data over hand-written repeated HTML.
3. Keep animation optional and subtle; respect `prefers-reduced-motion`.
4. Keep the homepage scannable: identity, research direction, latest activity,
   and selected work.
5. Verify paper metadata against the official venue or arXiv before publishing.
