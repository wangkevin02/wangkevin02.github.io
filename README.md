# Kuang Wang — Academic Homepage

A small academic website built on Jekyll/al-folio, deliberately reduced to the
essentials: **Home**, **Publications**, and **CV**.

## Content map

| What to edit                    | Source of truth                                     |
| ------------------------------- | --------------------------------------------------- |
| Biography and research focus    | `_pages/about.md`                                   |
| Updates / activities            | `_data/updates.yml`                                 |
| Publications                    | `_bibliography/papers.bib`                          |
| Homepage background data        | `_data/cv.yml`                                      |
| English / Chinese CV source     | `../resume/en_resume.tex`, `zh_resume.tex`          |
| Embedded CV PDFs                | `assets/pdf/Kuang_Wang_CV_{en,zh}.pdf`              |
| Social links                    | `_data/socials.yml`                                 |
| Site metadata and feature flags | `_config.yml`                                       |
| Homepage layout and news        | `_layouts/about.liquid`, `_includes/updates.liquid` |
| Homepage visual system          | `_sass/_home.scss`, `_sass/_themes.scss`            |

## Common CRUD operations

### Add an update

Add an entry to `_data/updates.yml`:

```yaml
- date: 2026-08-01
  label: Paper
  text: "A short, factual update."
  url: https://example.com
  link_text: Details
```

`url` and `link_text` are optional. The homepage sorts entries by date, shows the
latest three, and keeps older entries under “More updates”. No JavaScript is
required for this section.

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

`selected = {true}` marks homepage highlights: primarily Kuang Wang's first-author papers,
plus explicitly selected collaborations such as MMAPIS.
Every paper appears at the bottom of the homepage and on `/publications/`,
grouped by year with milestone headings, newest first by `sort_date = {YYYY-MM}`.
Use the formal publication month for conference papers and the first arXiv month
for preprints; also set `month` for the displayed date. All authors are shown in
their original order, with Kuang Wang highlighted.

Resource buttons follow PDF → Code → Demo (when available) → Video (when available)
→ BibTeX. Use `website` for the official paper landing page, linked from the title,
and `demo` for a separate demonstration page. arXiv abstract links are available
through preprint titles; DOI metadata remains in BibTeX without a duplicate button.

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

## Design rules

1. Do not add placeholder content to make the site look fuller.
2. Prefer structured data over hand-written repeated HTML.
3. Keep animation optional and subtle; respect `prefers-reduced-motion`.
4. Keep the homepage scannable: identity, research direction, latest activity,
   and selected work.
5. Verify paper metadata against the official venue or arXiv before publishing.
