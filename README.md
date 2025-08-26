# Harish Joshi — Personal Portfolio

Live demo / target deploy: https://ha-ri.sh/

A lightweight, responsive single-page portfolio built with plain HTML, CSS and JavaScript. It showcases a clean hero, about, services and projects sections and includes tasteful, high-performance visuals:

- Three-way theme toggle (Light / System / Dark)
- Smooth, continuous canvas-driven background flow (distinct look per theme)
- Cursor orb that follows the mouse with a natural lag and hides when the cursor leaves the window
- Responsive layout and accessible controls

## Files

- `index.html` — main markup
- `styles.css` — styling, responsive rules and visual polish
- `script.js` — theme logic, canvas background flow, cursor orb logic

## Features and quick notes

- Theme buttons are top-right (`Light`, `System`, `Dark`). The site remembers your selection using `localStorage`.
- Background is rendered on a canvas for smooth, GPU-friendly flow. Theme changes update particle colors and motion.
- Cursor orb uses an eased follow algorithm (visible on mouseenter, hidden on mouseleave) with stronger glow in light mode and cyan glow in dark mode.
- The page is intentionally dependency-free (no build step). Works by opening `index.html` in a browser or serving the folder.

## Run locally

Recommended: serve via a simple static server so the canvas and assets behave consistently.

Using Python (built-in):

```bash
# from the profile folder
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

Or using Node (if you prefer):

```bash
npx serve .
```

Or just open `index.html` directly in the browser for quick checks.

## Customize

- Colors and accent: edit CSS variables in `styles.css` (:root).
- Particle density and behavior: open `script.js` and adjust `FLOW_COUNT` and the particle initialization block.
- Cursor responsiveness: adjust the easing multiplier used in the cursor animation (search for the `orbX +=` line).

## Accessibility & performance tips

- The toggle is keyboard-focusable; add ARIA labels if you need extra screen-reader support.
- To reduce CPU on low-end devices, lower `FLOW_COUNT` or pause the animation when `document.hidden`.

## Deployment

Push this repository to your Git host and point your domain `https://ha-ri.sh/` to the deployed site (for example, GitHub Pages, Netlify, or Vercel). If you want, I can add a minimal `netlify.toml` or `README` deployment steps for any chosen platform.

## License

MIT — feel free to use and adapt.

## Contact

Harish Joshi — links are in the page footer (GitHub / LinkedIn / CodePen).

---

If you'd like, I can also:
- Add a small `netlify.toml` or `CNAME` for `ha-ri.sh` deployment steps.
- Add a small test checklist or automated smoke-test script.
