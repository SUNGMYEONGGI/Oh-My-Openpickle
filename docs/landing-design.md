# Website design

The static site in `site/` is published to <https://sungmyeonggi.github.io/Oh-My-Openpickle/> by `.github/workflows/pages.yml`. It follows the structure and design system of the [PixelBot site](https://sungmyeonggi.github.io/PixelBot/), with section ideas from [CopilotKit OpenBot](https://www.copilotkit.ai/openbot), [openbot.run](https://openbot.run/) and [Lunaread](https://sungmyeonggi.github.io/Lunaread/).

## System

- Type: Bricolage Grotesque for headings, Instrument Sans for text (Google Fonts), as on PixelBot.
- Color: PixelBot's neutral light and dark palettes, with the accent changed to Pickle green (`#16a34a` light, `#3ddc74` dark).
- Layout: a 1200 px column with a fixed gutter, hairline-bordered grids and rounded cards.
- Character: the project's own jelly pickle SVG in six colors, drawn in `main.js`. No Pickle assets are used.

## Sections

1. Hero: pill, headline, two CTAs and a row of pickles you can squish.
2. Demo: a macOS-style window with a sidebar, a scripted chat and Pickle's profile panel, which opens when a memory is saved. A replay button appears at the end.
3. Model marquee: Ollama models you can run.
4. How it works: a flow diagram (browser and desktop app to the local Next.js server to Ollama and local storage) with animated beams, three points and a local request log.
5. Features: a bento grid of memories, reminders, Explore, Archive, colors and backup.
6. Running locally, Install (four steps), Questions, final call to action and footer.

## Rules

- Copy describes only what the app does today; unsupported features are named as such in the FAQ.
- `prefers-reduced-motion` shows a static demo and stops the log and marquee.
- Works at 390 px with no horizontal scroll.
