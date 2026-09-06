# Darrick Li · Personal homepage

Bilingual research and project portfolio: https://darrickli.github.io

A lightweight static site with Chinese / English content, light / dark themes, responsive layouts, and Markdown-managed profile, projects, and notes. No build step or runtime dependencies.

## Local preview

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

Open http://127.0.0.1:8765. Query parameters `?lang=zh` and `?lang=en` select a language. Language and theme preferences persist in the visitor's browser when storage is available.

## Structure

- `index.html`: semantic page structure, Chinese UI text, featured thesis and public links.
- `assets/site.css`: responsive layouts, typography, and themes.
- `assets/site.js`: English UI translations, Markdown rendering, content loading, and interactions.
- `content/{zh,en}/profile.md`: personal introduction.
- `content/{zh,en}/projects.md`: three selected project cards.
- `content/{zh,en}/notes.md`: learning links and earlier research experience.
- `assets/photos/`: original portrait and life photographs.
- `assets/cv-{zh,en}.pdf`: existing CV downloads (not regenerated in the September 2026 homepage update).

See [EDIT_GUIDE.md](EDIT_GUIDE.md) for content maintenance.

## Publishing

The existing `.github/workflows/pages.yml` deploys the repository through GitHub Actions to GitHub Pages when `main` is pushed. A branch push alone does not deploy.

## September 2026 update

- Editorial layout with an ivory / forest-green palette, portrait, education milestones, featured research, and project cards.
- Added Young Gifted Class background, university entry at 14, PhD at 21, and practical AI collaboration.
- Updated the thesis to its public reproduction repository, with numerical results and their scope stated explicitly.
- Distinguished exploratory Oraclient and private Nash from released public tools.
- Kept the original photos, CV files, and links; removed public-facing template instructions.
- Improved keyboard focus, navigation anchors, Markdown link rendering, failed-load recovery, and cancellation of stale language requests.

Typography uses Google Fonts with system-font fallbacks. The site remains usable if the fonts cannot be loaded.
