---
name: maimemo-table
description: Render pasted, Markdown, LaTeX, or structured comparison tables as polished Maimemo-style HTML and transparent PNG images. Use for 墨墨表格、墨墨风格表格、表格转图片、夜间模式透明表格, or when the user invokes Maimemo Table; do not use it to manage Markji decks, cards, or APIs.
---

# Maimemo Table

Turn table content into an editable HTML file and a crisp transparent PNG. Preserve the user's wording and data; normalize punctuation or spacing only when it improves rendering without changing meaning. Do not silently correct factual content.

## Default visual language

- Canvas outside the table is transparent.
- Title color: `#36b59d`.
- Important header row: `#36b59d` background with white text.
- Ordinary data cells have a fully transparent background with deep green text.
- First-column row labels use a subtle translucent light-green background with deep green text.
- Use thin green dividers, generous cell padding, centered headers, and left-aligned body content.
- Prefer Microsoft YaHei or another available CJK sans-serif font.
- Render at 2000 px wide by default so dense Chinese comparison tables remain legible.

Treat these as defaults. Preserve a user's explicit palette, font, dimensions, alignment, background, or hierarchy choices.

## Choose the corner style first

Before creating the table, determine whether the user wants `square`（直角）or `rounded`（圆角）corners.

- If the user has not explicitly chosen, ask one concise question before rendering: “这张表格使用直角还是圆角？”
- Do not render until the user answers.
- Do not ask again when the user already specified a style or is continuing an existing table whose style is clear.
- `square` keeps crisp conventional table corners.
- `rounded` uses a 32 px clipped outer radius with clean internal dividers and no glow or heavy shadow.

## Render workflow

1. Parse the source into a title, a header array, and same-length row arrays. Convert intentional line breaks to `\n`; keep cell data as plain text.
2. Write a UTF-8 JSON input matching:

   ```json
   {
     "title": "标题",
     "cornerStyle": "rounded",
     "headers": ["特征", "类别 A", "类别 B"],
     "rows": [["项目", "内容 A", "内容 B"]]
   }
   ```

3. Locate the bundled Node.js executable and packages with the workspace dependency helper. Set `NODE_PATH` to the returned Node packages directory, then run:

   ```text
   node scripts/render_table.cjs input.json output.png output.html
   ```

   The third argument is optional; when omitted, the HTML is saved beside the PNG with the same basename. Set `cornerStyle` to `square` or `rounded` from the user's answer. The script also accepts optional `width`, `fontFamily`, and `theme` fields. Supported theme keys are `accent`, `light`, `deep`, and `white`.

4. If launching the installed browser requires approval, request it for the local headless render. Do not download or install a browser unless the user approves.
5. Visually inspect the PNG. Confirm that Chinese text is not garbled, no cell is truncated, line breaks are sensible, and the title and columns are balanced.
6. Verify the PNG has an alpha channel and that a corner pixel is fully transparent. Present the PNG inline and retain the HTML as the editable source.

## Boundaries

This skill creates local visual artifacts only. It does not authorize uploading the image, editing a Markji card, or changing a deck. Use the relevant Markji/MaiMemo skill only when the user separately requests an API or live-card operation.
