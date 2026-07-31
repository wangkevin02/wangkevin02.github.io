# Kuang Wang — Academic Homepage

A small academic website built on Jekyll/al-folio, deliberately reduced to the
essentials: **Home**, **Publications**, and **CV**.

## Content map

| What to edit                    | Source of truth                                |
| ------------------------------- | ---------------------------------------------- |
| Biography and research focus    | `_pages/about.md`                              |
| Updates / activities            | `_data/updates.yml`                            |
| Publications                    | `_bibliography/papers.bib`                     |
| Web CV and generated PDF        | `_data/cv.yml`                                 |
| CV typography and colors        | `assets/rendercv/design.yaml`                  |
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

Edit `_data/cv.yml`, then generate the PDF:

```bash
python -m pip install -r requirements.txt
rendercv render _data/cv.yml --settings assets/rendercv/settings.yaml
```

The expected PDF path is:

```text
assets/rendercv/rendercv_output/Kuang_Wang_CV.pdf
```

GitHub Actions also runs the RenderCV workflow when the CV data or design
changes.

The Chinese CV is maintained in `../resume/zh_resume.tex`. Compile it with:

```bash
tectonic ../resume/zh_resume.tex
cp ../resume/zh_resume.pdf assets/pdf/Kuang_Wang_CV_zh.pdf
```

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
- `/cv/` and the PDF download.

## Design rules

1. Do not add placeholder content to make the site look fuller.
2. Prefer structured data over hand-written repeated HTML.
3. Keep animation optional and subtle; respect `prefers-reduced-motion`.
4. Keep the homepage scannable: identity, research direction, latest activity,
   and selected work.
5. Verify paper metadata against the official venue or arXiv before publishing.
