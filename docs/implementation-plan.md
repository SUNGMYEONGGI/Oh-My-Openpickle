# Oh-My-Picklebot UI/UX, web and desktop implementation plan

2026-10-29. Based on the installed Pickle 1.1.15, the [UI specification](ui-fidelity-spec.md) and local data format version 1.

## Order of work and done criteria

1. **Visual tokens**: apply the original colors, the 22/18/16/14/12 px sizes, per-component weights, 20 px insets, 44 px controls and selected icon shapes everywhere. The original registers no fonts, so Apple system fonts come first; fallback fonts on other systems will differ.
2. **App controls**: wire up the root header (menu, character, invite), the drawer, a separate character profile (Done / Scheduled / Memories), conversation rename and delete confirmation, and the message menu (copy, remember, archive, reply). Verify focus, Escape, touch and keyboard access in dialogs.
3. **Archive and Explore**: switch between artifacts and media, list documents by date, import local media with detail and download. Explore uses the original eight areas with detail, start, hide and undo. Example copy is written independently.
4. **Landing page**: a product page at `/` with an explicit demo, the features that actually exist, getting started and FAQ. Never claim another product's features, numbers or platforms as ours.
5. **Shared runtime**: `/app` is the real Next.js app, and Electron opens the same path. The storage name and local origin stay the same so existing data still loads. Only external HTTPS links open in the system browser.
6. **Verification**: unit tests, typecheck and production build; the main interactions on desktop web and at 390 px; launching the macOS app with data kept. Record platforms that were not checked and differences from the original runtime.

## Where the changes land

- Routes: `app/page.tsx`, `app/app/page.tsx`, metadata.
- Shared UI: app shell, icons, dialogs and sheets, character profile, chat, archive, explore, settings, CSS.
- Data: existing save and restore paths, conversation invariants, backward-compatible validation of optional media fields.
- Runtime: Electron URL and navigation policy, display name, packaging and run docs.
- Evidence: UI specification, icon notes, screenshots, verification log.

## Boundaries kept

State changes reach the screen only after validation and a successful save. No original account, user feed or service keys are carried over. Remote invitations, friends, calls, 3D World and payments are not presented as working local features, and unimplemented screens say so when opened. Native glass and physics-based motion are CSS approximations, not 1:1 equivalents.

## Result

Steps 1 to 5 are implemented and step 6 was completed for web and macOS: 24 tests, typecheck, production build, macOS packaging and a real app run. The new media fields are optional, so version 1 backups still load. File import and backup restore were checked with the real file picker in the macOS app. Details and remaining differences are in the [verification log](verification.md). Full feature parity with the original and real Windows/Linux testing are follow-up work.
