# Implementation and verification log

## 2026-10-29 · UI/UX revision and website

Built the Next.js `/` landing page, the `/app` app and the Electron entry into `/app`. The original's static declarations and the scope of this work are in the [UI specification](ui-fidelity-spec.md), and the order of work is in the [implementation plan](implementation-plan.md). The October 28 log below is kept as a record of the earlier version.

### Second look at the original

- Checked the original Assets.car with REA `inspect_asset_catalog`. Evidence: `ev_b0b028b76596dc015b66d68ac360cd699d8a02b42b57a0640d983db59ad6751d`.
- The original binary SHA matched the record below. Launching the original app failed in that session with `kLSExecutableIncorrectFormat`, so a direct pixel comparison of the current screens was not completed.
- Extracted 32 SVG variants of 26 names with CoreUI for local comparison (32/32 byte SHA matches; SVG safety checks and 5 malicious SVG fixtures rejected). Before the repository went public, the extracted icons were removed and replaced with the project's own icons. See [Icons](icon-attribution.md).
- No font files or font registration keys were found in the original. The system font choice is an implementation inference. Native glass and springs are web approximations, and the character is the project's own SVG.

### Automated checks and packaging

- `npm test`: **24/24 passed**, covering storage, input, origin and Ollama boundaries, conversation rename/delete invariants, media validation and the Electron link policy.
- `npm run typecheck`: passed.
- `npm run dist:mac`: Next production build and Electron arm64 packaging passed, including the final date filter fix.
- `git diff --check`: passed.
- Output: `dist/mac-arm64/Oh My Picklebot.app`. Not signed or notarized. The OS app icon is the default Electron icon.

### Hands-on UI checks

Drove the web app through Chrome and the built macOS app through native computer use.

- Landing page: switching the chat/memories/schedule previews, the schedule toggle, the Windows/Linux install tabs, opening FAQ items and the web CTA to `/app`. At 390×844, `innerWidth = scrollWidth = 390`.
- Mobile app: open the drawer, create a conversation, send a demo message and get a reply, rename it, cancel the delete confirmation, and start a quoted reply draft.
- Character profile: back navigation, selecting the three tabs, arrow key switching and selected state. Entering a date with no memories shows an empty result; the original date shows its memories.
- Explore: Travel filter, detail, hide, undo, start, and the chat draft. Remote agent execution was not verified.
- Web archive: existing document detail; new document, save, and detail view.
- macOS archive: imported `docs/mobile.png` through the native file picker, saw it in the media list and opened the image detail.
- macOS backup: exported the current state, chose the same file, a pre-restore backup was saved, restored, and the media item remained. The user's existing state was not replaced with a different fixture. The Chrome file-access limit from October 28 was worked around by verifying in the native app, without changing permissions.
- After the final rebuild and relaunch, `/app` opened and existing conversations were kept. The `pickle-local` package identifier, origin port 3211 and the localStorage key are unchanged.

### Screenshot evidence

> The three screenshots below showed the extracted original icons, so they were removed from the repository before it went public. For the current screens see `app-chat.png`, `app-explore.png` and `site.png`.

REA launched its own temporary Chrome, and every scenario had 0 page errors. These results show the screens and actions worked; they do not prove equivalence with the original.

| Scenario | File | Evidence |
|---|---|---|
| 1280×900 landing page | `landing-desktop.png` (removed) | `ev_a3c1fb1e3679a86883e2e70415f3a57a3ac1d9aeb31fa48bb26893c1b6752f2d` |
| 390×844 web app start | `fidelity-app-mobile.png` (removed) | `ev_ce36fb8e1dd5303c05f7ab03522b564089c68b1994f51a80562ea5e3e78c8986` |
| Final package server on 3211, 1280×850, header to character profile | `fidelity-profile-desktop.png` (removed) | `ev_770f6043c53e2d10e5fd3a1d4cd109a4947779fd2734e7b940bcc9618c4362a5` |

### Remaining differences

Not verified: Windows/Linux builds and runs, real Ollama inference, microphone and TTS, and a pixel comparison against the running original. Not implemented: remote friends, invitations, calls, 3D World, payments, autonomous execution, the full original settings and server-side artifact creation. The original images and motion are not fully reproduced, and small gray text is darker than the original for readability. The open work is tracked in the [v0.2.0 milestone](https://github.com/SUNGMYEONGGI/Oh-My-Openpickle/milestone/1).

## 2026-10-28 · Initial implementation

macOS arm64. Project directory: `pickle/`.

### Looking at the original

Opened `/Applications/Pickle.app/Wrapper/Pickle.app/Pickle` with REA MCP 6.7.0, ran `inspect_macho`, `inspect_plist` and `inspect_artifact`, exported the evidence and closed the session.

- Original version 1.1.15, build 202610230910, bundle ID `com.pickle.client`.
- Executable SHA-256: `ed670a7fc2cbbcc39c0dd2c3a3fa2dbec1319a92c2812bcb68a6fc1935c07c61`.
- Mach-O evidence: `ev_7224ca26854343f5c65fb4b671672ac51b5181ae09a96ad1be7125e2cfc3e4f0`.
- plist evidence: `ev_fa118ec984b7efa8754bae0e6d207a6adf3fb0de2adf5087e7b971360de518d0`.
- Observed the original's Chat, My Pickle, Archive and Explore screens. Did not send messages, change the account, buy anything or invite friends. No feed or name from the user's account was copied into the clone's seed data.
- Bundled JSON: 120 screens, 248 components, the original design tokens and the Korean string catalog. Static declarations are not evidence of server behavior.

### Screen checks

Used Chrome on desktop and at 390×844, plus separate REA temporary-browser scenarios.

| Scenario | Result | Evidence |
|---|---|---|
| 1280×850, first screen and screenshot | completed, 0 page errors | `ev_35ec8ed7d47a11126fe34b6c7ecb1c17d053b5eacc93a731a15cd4edc49813a1` |
| 390×844, type, send, demo reply | 5 steps completed, 0 page errors | `ev_2512badee0507db9afb7d67ff2def6788a36a6ae2ab2b0d827bcf11763fecf9a` |
| Final package server (3211), 1280×850 | 2 steps completed, 0 page errors | `ev_d63754dd217dee7c39b3f6e50c2c8d961eaa1f92386672fac860f91b554820f4` |

No claim of pixel identity or of equivalence with the original 3D rendering is made.

### Checks

- `npm run typecheck`: passed.
- `npm test`: 15 passed, covering input validation, same origin, the demo/Ollama boundary, UTF-8 backup size, and message and reminder limits.
- `npm run dist:mac`: Next production build and arm64 packaging passed.
- `npm audit --omit=dev`: 0 known vulnerabilities.

### Flows checked by hand

- Add a memory, and the demo chat shows it.
- Create a document, and it appears in the archive.
- Create a reminder and change its time; it posts into the chat when due and stays after a reload.
- No horizontal overflow on mobile (`innerWidth = scrollWidth = 390`).
- Dark theme applies.
- With Ollama not running, the connection failure is shown. Real model inference was not verified.
- The macOS package launches, sends a message and gets a reply from the local API.
- Closing the macOS window stops the server on port 3211; relaunching keeps saved conversations.

### Problems found and fixed

- The Next dev server's internal localhost name differed from the browser's 127.0.0.1 origin: checks now use the validated loopback host, with regression tests for port, protocol and external host blocking.
- Electron packaging missed the standalone `node_modules`: added an explicit resource mapping and confirmed the app runs.
- The date input's DOM value differed from React state: submit now reads the date from FormData.
- Long demo memories and model replies could exceed the storage schema limits: the demo says how many were left out, and an over-long model reply returns an explicit error.
- State changes now reach the screen only after validation and the localStorage write succeed. On failure the edit stays in place, with a path to back up and retry.
- Character count and UTF-8 byte size of Korean backups now agree, so an exported file can always be imported again.

### Limitations

Not checked: Windows/Linux, macOS signing and notarization, a real Ollama model, microphone and TTS hardware. The original's remote social graph, autonomous execution, calls, payments and AR/3D World were not recovered.
