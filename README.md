# News English Hub

## Add or edit a lesson

You do not need to edit the page layout. Open **`lessons.json`** on GitHub, click the pencil icon, and copy one lesson object to add a new lesson. Change these fields:

- `title`
- `date`
- `level` (`B1`, `B2` or `C1`)
- `topic`
- `description`
- `presentation` — the full link to your presentation
- `worksheet` — the full link to your worksheet PDF
- `image` — the full link to an image

Example:

```json
{
  "title": "The future of AI in schools",
  "date": "25 September 2026",
  "level": "B2",
  "topic": "Technology",
  "description": "A short description for the homepage.",
  "presentation": "https://your-link-to-the-presentation",
  "worksheet": "https://your-link-to-the-worksheet.pdf",
  "image": "https://your-link-to-the-image.jpg"
}
```

Keep commas between objects, but not after the final object. After committing the edit, GitHub Pages will rebuild the site automatically. The first lesson in the file is shown as **Today's Lesson**; the remaining lessons appear in **Latest lessons**.

For now, the example links point to Google Drive. Replace them with your real presentation and worksheet links. Make sure the files are shared so that people with the link can view them.
