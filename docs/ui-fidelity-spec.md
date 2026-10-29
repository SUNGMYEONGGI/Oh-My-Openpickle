# Pickle UI fidelity specification

Inspected 2026-10-29. Source root **A**: `/Applications/Pickle.app/Wrapper/Pickle.app` (installed `com.pickle.client` 1.1.15). Clone root **C**: this `pickle` directory. Paths beginning `ui/` below are relative to A.

## Evidence boundary

These are shipped declarations, static asset metadata and current clone source comparisons, not runtime screenshots. Reuses the artifact identity/inventory in `artifact-inventory.md`. No private application data, network service, account or UI interaction was accessed. No further REA-wide inventory was run. `assetutil --info A/Assets.car` confirms named image/vector renditions. A follow-up read-only CoreUI extraction was used for local comparison only; the extracted files are not in this repository (see `icon-attribution.md`). Native `chat_room`, native tab bar, native glass material and live 3D stage still need runtime pixel/interaction verification. A mobile declaration does not establish a desktop breakpoint or sidebar width. The public landing page is a separate reference; it is not specified by these native app files.

## Typography and color

**Observed:** no `.ttf`, `.otf`, `.ttc`, `.woff` or `.woff2` resources anywhere under A; no font registration keys in `Info.plist`; no `font_family`, `font_name`, `font_design` or `font` keys in the inspected UI JSON. Exact resolved native family is **unknown**. A platform system font is an implementation inference, not a recovered font name. Before this revision, C started its CSS stack with `Noto Sans KR` without loading that face; the revised stack starts with Apple/system faces.

Implemented stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans KR", sans-serif`; language `ko`. This preserves Apple native resolution on this Mac, but Windows/Linux glyph widths and variable weight interpolation remain different. No SF Pro or Apple Korean font files are bundled. Per-component size/weight/tracking is mapped from the declarations; source sizes are logical units and CSS px is an implementation mapping.

| Source token / component | Declared values | Source |
|---|---|---|
| Title / heading / body / caption / small | 22 medium / 18 medium / 16 regular / 14 regular / 12 regular | `ui/tokens.json` → `typography.styles` |
| Header name | 16, weight 510, tracking -0.32; one line | `ui/components/chrome/tab_root_header.json` |
| Header status | 13, tracking -0.26, max width 220 | same |
| Invite text | 16, weight 590 | `ui/components/chrome/header_invite_button.json` |
| Drawer row | 16, weight 510 | `ui/components/drawer/drawer_menu_row.json` |
| Drawer name / section | 23, weight 590 / 14, weight 510 | `ui/screens/drawer.json` |
| Archive and My Pickle heading | 20, weight 590, height 24 | `ui/components/archive/archive_chrome.json`; `ui/screens/profile.json` |
| Character profile name / status | 19, weight 590, tracking -0.38 / 16, tracking -0.32 | `ui/components/character/character_profile_header.json` |
| Explore title / detail / count | 16 medium / 15 regular / 14 regular | `ui/components/explore/explore_offer_row_content.json` |

From `ui/tokens.json`, light/dark respectively:

| Role | Light | Dark |
|---|---|---|
| Screen / page | `#FFFFFF` / `#FAFAFA` | `#101114` / `#101114` |
| Card / input field | `#FFFFFF` / `#F3F3F3` | `#1B1D22` / white 9% |
| Primary / secondary / tertiary text | black / black 50% / black 30.2% | `#F4F5F7` / `#B6BAC4` / `#9197A3` |
| Incoming / outgoing chat | `#F4F4F4` / `#4797EF` | `#25272E` / `#2C70D2` |
| Accent / link | `#4797EF` / `#1169E5` | `#78AAFF` / `#78AAFF` |
| Selected fill / hairline | black 5% / black 10% | white 15% / white 14% |
| Danger | `#F96E6E` | same |

Radii: card 20, sheet 24, tile 16, CTA 32, pill 90, content-card 24. Hairline width 0.5. Screen inset 20; list gap 10; section gap 24; control height 44; chip height 32. Card shadow: black 2%, blur radius 15, y=8. Native glass is not equivalent to a solid gray fill or `backdrop-filter` alone.

## Icons and assets

`Assets.car` contains both vector renditions named `.svg` and raster renditions at scale 1/2. The following dimensions are scale-1 **catalog image** dimensions, not inferred stroke widths. The selected tab renditions also include explicit dark variants. Preserve active/inactive geometry instead of only recoloring a shared icon.

| Use | Exact asset names | Catalog / declared display size |
|---|---|---|
| Drawer trigger | `header-icon-drawer` | 24×24 inside 44×44 circle |
| Drawer chat / friends / world / profile | `drawer-icon-chat`, `drawer-icon-friends`, `drawer-icon-world`, `drawer-icon-profile` | 22 / 20 / 20 / 20 |
| Main candidate tab assets | `tab-icon-chat-oval`, `tab-icon-compass`, `tab-icon-archive`, `tab-icon-person` | 24×24; each has `-selected` |
| Additional tab assets present | `tab-icon-chat`, `tab-icon-explore`, `tab-icon-profile`, `tab-icon-world` | Presence does not prove which tab bar variant runs |
| Character segmented tabs | `character-profile-icon-tasks`, `character-profile-icon-schedule`, `character-profile-icon-memories` | 21 / 16 / 17 inside 26×26 glyph box |
| Profile edit | `character-profile-icon-pen` | 18 inside 32×32 glass button |
| File overflow | `archive-icon-menu-dots` | 16 inside 24×24 target, hit inset -10 |
| Share / download / paperclip | `chat-icon-share`, `chat-icon-download`, `chat-icon-paperclip` | 24 / 22 / 22 |
| Copy / reply / voice spectrum | `chat-icon-copy`, `chat-icon-reply`, `chat-icon-spectrum` | 15×16 / 17×17 / 15×15 |
| Other chat context rows | `drawer-icon-rename`, `drawer-icon-stored`, `drawer-icon-delete` | Exact names present; follow menu container metrics |

Custom icons used by JSON are usually named assets; some fallbacks use Apple system symbol names, e.g. `doc`, `doc.richtext`, `person.2.fill`, `play.fill`, `trash`. A generic 24×24 stroke icon is not equivalent to either asset family. The app now uses its own icon drawings sized to these declarations; they are not the original geometry. Do not infer strokes from metadata alone.

Standalone PNGs in `ui/images` support exact empty states and Explore icons: `archive-files-empty-icon`, `archive-media-empty-icon`, `bubbles-empty-icon`, `tasks-empty-illustration`, `explore-icon-*`, `settings-icon-*`. Source ownership remains with Pickle; artifact presence does not establish redistribution terms. Character assets exist in `Jaum/` and `rig/20261009a/`; current C `Character.tsx` is an independently drawn SVG and has no demonstrated shape/material equivalence.

## Layout and interaction contracts

| Surface | Declared layout and behavior | Sources |
|---|---|---|
| Root header | Drawer 44 circle on left; centered live avatar + name/status glass pill; Invite capsule 44 high on right. Header name target pushes `characterProfile`, Invite pushes `inviteSheet`. Identity padding top = safe-area-top + 6. Avatar choices 40/58/68/82; hidden option. Name pill begins 51 + avatar-size adjustment below identity top, padding x=9/y=8, radius 17.5 idle or 16 with status. | `components/chrome/{tab_root_header,header_drawer_button,header_invite_button}.json` |
| Drawer | Six rows in order: 기본 채팅, 친구, 둘러보기, 보관함, 3D 월드, 나의 피클. Row height 48, radius 18, horizontal padding 8, glyph box 32, content gap 10. Other chats below, search, put-away chats. Other-chat long press opens rename / put away / delete; delete opens confirmation. World is dimmed if body kind is not critter and can show entry notice. | `screens/drawer.json`, `components/drawer/drawer_menu_row.json` |
| Chat | Full-height native `chat_room`, offline band, exhausted-credit tail card, activity reflected in header (thinking/typing/retrying/search/etc.). Intro tap opens character profile. Native renderer owns detailed composer, message layout and many message interactions; JSON alone is incomplete. | `screens/chat.json`, `screens/chatRoom.json`, `ui/vocabulary.json` atom `chat_room` |
| Character profile | 80 live avatar, 32 edit overlay, centered name/status, three-way capsule segment: **한 일 / 예약한 작업 / 함께한 추억**. Segment icon boxes 26, internal padding 4, spacing 2. Content switches via pager and updates section/progress; date-grouped task list, embedded scheduled list, embedded bubbles. | `screens/characterProfile.json`, `components/character/character_profile_header.json` |
| My Pickle | A separate settings root, not the character profile. Heading, account row, connections card (count/icons), vault, sharing, notifications, appearance, home-widget guide, language, issue report/legal/version. Card radius 24, section gap 24. | `screens/profile.json`, `components/settings/my_pickle_settings_list.json` |
| Archive | Heading, two-way capsule **아티팩트 / 미디어**, paged content, create sheet. Artifacts are date-grouped rows: thumbnail 58 square/radius 6, gap 16, row x=10/y=8, name 16 and detail 14. Media grid has 3 square columns and 4-unit gaps; radius 2; video duration bottom-right. | `components/archive/{archive_chrome,archive_files_page,archive_media_page}.json` |
| Archive menus | Artifact tap opens page detail or file. Long-press and overflow menu: Share, Download (non-page only), Show in chat. Image menu adds Copy; videos omit Copy. Loading state prevents duplicate opens; failures produce notice. Create sheet offers Document and Image, sending a chosen draft to the character. | same; `screens/archiveCreate.json`, `components/archive/archive_create_option.json` |
| Explore | All + **돈 / 쇼핑 / 건강 / 사람·반려동물 / 일·서류 / 여행 / 집 / 즐길 거리** horizontal 32-high chips. Category/date/section-dependent offer lists; see-all/show-less; pull-to-refresh declaration. Row x=10/y=16, icon 37, gap 12; title/detail vertical gaps 6/8. | `screens/exploreFeed.json`, `components/explore/explore_offer_row_content.json` |
| Explore interaction | Tap opens offer detail sheet with 18/590 title, 15 detail, numbered execution steps, and Start. Long press has Start and Delete. Delete shows Undo; failed accept/reject restores state and reports error. Backend action names are `offer_accept`, `offer_reject`, `offer_reject_undo`; declaring them does not prove service operation. | `components/explore/explore_offer_item.json`, `screens/exploreFeed.json` |
| Scheduled | One-time / repeating / paused lists. Create opens character-room draft rather than immediately opening a date form. Existing rows support pause/resume and detail/run history. | `screens/scheduledActions.json`, `screens/scheduledActionDetail.json`, `components/scheduled/*` |
| Bubbles | Date-grouped memory timeline with calendar selection, detail and edit screens. Empty state explains accumulating memories through time with the character. | `screens/bubbles.json`, `screens/bubble.json`, `screens/bubbleEdit.json` |

All source paths in this table are under `ui/`. `navigation.json` defines root versus push-sheet versus card/embedded presentation. Match those transitions; converting every interaction to the same centered modal loses the navigation hierarchy. Native screen presentation geometry requires runtime confirmation before claiming 1:1 desktop behavior.

## Motion constants worth preserving

Source `ui/motion.json`: sheet enter 480ms `cubic-bezier(.22,1,.36,1)` with 360 offset; exit 320ms `cubic-bezier(.4,0,1,1)`. Card press scale .985/opacity .8, release 150ms ease-out. Strong press scale .94/opacity .82, spring response .26/damping .7. Segment page 360ms `cubic-bezier(.2,.9,.35,1)`. Popover 200ms from .95 scale. Toast enter 310ms / hold 2.5s / exit 590ms; Undo holds 4s. Chat bubble appears from .86 scale (response .36/damping 1); send/receive vertical offset 56. Long-press bubble lift scale 1.04 with .35s hold; context pop begins at .4 scale. Reduced-motion handling is declared for relevant effects. Web spring approximations must be labeled approximations.

## Concrete discrepancies in current clone (snapshot before fidelity edits)

| Current source | Directly observed discrepancy |
|---|---|
| `app/globals.css` | Root text `#171817`, secondary `#6b706b`, tertiary `#6f6f6f` diverge from black/50%/30.2%; body 15 and widespread 11–14px control text instead of measured 15–16px. Outgoing message is hardcoded light blue in dark theme. Generic `.98` button press and .2s appearance replace named motion. |
| `components/Icon.tsx` | All icons are handwritten outline SVG with uniform stroke 1.8; no selected-geometry or dark asset variants. |
| `components/PickleApp.tsx` | Right header says 추억 and opens memories instead of 초대/invite sheet; name opens settings root rather than character-profile tabs. Four menu tabs plus custom memories/tasks shortcuts omit original Friends/World drawer rows. Extra brand/local badge/new-chat button/footer slogan and permanent desktop sidebar are clone design choices, not established native declarations. |
| `components/Chat.tsx` | Invented greeting and starter prompts; always-visible save/remember tools on each message; no recovered native message menu implementation. Voice button invokes browser dictation/read-aloud rather than original live-call behavior. Exact original composer and bubble geometry remain unverified. |
| `components/Profile.tsx` | Custom counter cards and model configuration dominate My Pickle; lacks original character profile's 3-way segment and settings menu structure. Model configuration is a necessary clone-specific feature but should not be presented as original UI evidence. |
| `components/WorkspacePanels.tsx` → Archive | Two-column note cards and search/import toolbar instead of two-way file/media page with date-grouped rows and media grid. New opens direct editor instead of Document/Image choice sheet. Missing share/download/show-in-chat context menus. |
| same → Explore | Six invented prompt rows/categories with emoji; choosing goes directly to chat draft. Original has eight domain filters and offer detail/Start/Delete/Undo flow with custom 37px icons. |
| same → Tasks/Memories | Custom direct CRUD forms and text search replace profile segments, date calendar, detailed task/schedule navigation. Local reminder functionality is not server agent execution. |
| `components/Modal.tsx` | Shared centered dialog cannot alone reproduce push sheets, content-detent cards, embedded panels and anchored context menus. |

The discrepancies above are factual source comparisons, not a severity score. Preserve working local persistence/error handling when changing the surfaces. A faithful local implementation can implement the declared navigation and local interactions while explicitly separating network-dependent invitations, social graph, live calls, real purchases and service integrations from verified functionality.

## Implemented revision and remaining differences

The revised app uses the system stack, source color/size tokens and its own icon set sized to the declarations. Header, six-row drawer, separate character profile, selected tab geometry, file/media archive and eight Explore domains now follow the declarations. Conversation rename/delete confirmation, message menus and quoted reply, profile keyboard navigation, date-filtered memories, scheduled groups and Explore hide/undo/start run against local state. Dialog, bottom sheet and drawer are separate presentations with focus return and reduced-motion support.

Secondary/tertiary light text deliberately stays darker than the source opacity tokens for readability. CSS masks use SVG geometry and current text color. Native glass, live 3D avatar, spring physics, push gestures, complete account/settings flows, server-created files, share/show-in-chat menus and all network-backed operations still differ. Local document creation and direct reminder forms remain functional substitutes. The original native app did not launch in this session, so no current side-by-side pixel or interaction equivalence claim is made. See `verification.md` for observed outcomes.
