# Atlas Games Website — Copilot Agent Step-by-Step Prompts

This document contains a breakdown of the Copilot Agent prompt into small, auditable steps to reduce hallucinations.  
Copy and paste each step into WebStorm's Copilot Agent prompt one at a time.

---

## STEP 0 — CONTRACT & SCOPE

You are GitHub Copilot Agent in WebStorm. We will work in SMALL, AUDITABLE steps. If you are unsure about ANYTHING, ask exactly one clarifying question and STOP.

RULES (apply to every step):
1) Only do the single step requested. Do not anticipate later steps.
2) Output strictly in the “OUTPUT FORMAT” specified. No extra commentary.
3) Don’t invent files/paths. If a requested path doesn’t exist, ask to create it.
4) If a file already exists, produce a unified diff (diff-only). Otherwise output the full file content.
5) Never change branding/colors/fonts without instruction.

Acknowledge with exactly:
OK — READY. WHAT STEP?

---

## STEP 1 — SCAFFOLD ONLY (folders + empty files; no content yet)

Goal: Create the exact folder/file scaffold below. Empty files are fine. Do not write HTML/CSS/JS content yet.

(REQUIRED TREE same as original spec — omitted here for brevity, keep in your original detailed structure)

OUTPUT FORMAT:
- First block: ```CREATED``` listing one relative path per line that you created.
- Second block: ```EXISTING``` listing any pre-existing paths you detected.
- Third block: ```TREE``` print the tree from project root.
- Fourth block: ```NEXT``` one sentence stating you are ready for Step 2.

---

## STEP 2 — REUSABLE INCLUDES (header/nav/footer + includes.js)

Goal: Implement header.html, navigationbar.html, footer.html and includes.js that inject them into every page on DOMContentLoaded.

Constraints:
- Branding: Poppins; Colors: #C62828, #121212, #4F4F4F, #F2F2F2.
- Nav links: Home (/index.html), Games (/games.html), Blogs (/blogs.html), Team (/team.html), Awards (/awards.html), Contact (/contact.html).
- Active-link highlighting via pathname match.

OUTPUT FORMAT:
- For each file changed/created, output as:
```FILE: reusables/header.html
<full content>
```
(repeat for navigationbar.html, footer.html, assets/css/style.css additions, assets/js/includes.js)
- Then ```VERIFY``` with a checklist confirming: injection works on index.html & games.html, active state works, no external libs used.
- Then ```NEXT``` proposing Step 3.

---

## STEP 3 — DATA SCHEMAS + MINIMAL SAMPLE DATA

Goal: Write JSON schemas (as comments at top of each file) and add ONE sample entry in each:
- /data/games.json
- /data/blogs.json
- /data/team.json
- /data/awards.json
- /data/patch-notes.json

Rules:
- Use the exact fields and types from our Atlas Games spec.
- Use repository-relative paths.
- Validate JSON.

OUTPUT FORMAT:
One block per file:
```FILE: data/games.json
<full JSON>
```
…repeat for all.
Then ```VERIFY``` listing keys present and confirming valid JSON.
Then ```NEXT```.

---

## STEP 4 — LISTINGS (render from JSON)

Goal: Implement client-side rendering for games.html, blogs.html, team.html, awards.html using /assets/js/listing-loader.js, /assets/js/search.js, /assets/js/filters.js.

Requirements:
- Search, filter, sort; no page reload.
- Data from /data/*.json.

OUTPUT FORMAT:
- Diffs or full contents for relevant HTML & JS files.
- ```VERIFY``` with manual test plan.
- ```NEXT```.

---

## STEP 5 — DETAIL PAGES & TEMPLATES

Goal: Implement templates in /templates and create one working example per collection folder. Include:
- Breadcrumbs, back-to-list.
- Fields and JSON-LD schema.org markup.

OUTPUT FORMAT:
- ```FILE: path``` blocks for all created/changed files.
- ```VERIFY``` list of required fields and where they appear.
- ```NEXT```.

---

## STEP 6 — SEARCH/FILTER POLISH + BREADCRUMBS + ROUTING

Goal:
- Breadcrumbs reflect paths.
- Persist state via URL.
- Prev/next links in details.

OUTPUT FORMAT:
- Diffs only.
- ```VERIFY``` accessibility checklist.
- ```NEXT```.

---

## STEP 7 — SEO, SOCIAL, PERFORMANCE

Goal:
- Unique titles & meta descriptions.
- OG + Twitter cards.
- Lazy-load images, defer JS.

OUTPUT FORMAT:
- Diffs across pages.
- ```VERIFY``` meta tags present.
- ```NEXT```.

---

## STEP 8 — 404, SITEMAP, ROBOTS

Goal:
- Custom 404.html
- sitemap.xml
- robots.txt

OUTPUT FORMAT:
- Full contents for each.
- ```VERIFY``` link checks.
- ```NEXT```.

---

## STEP 9 — FINAL QA & HANDOFF

Goal:
- Final tree, pages table, test script, README snippet.

OUTPUT FORMAT:
- ```TREE```
- ```PAGES_TABLE```
- ```TEST_SCRIPT```
- ```README_SNIPPET```
