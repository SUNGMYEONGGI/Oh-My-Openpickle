# Pickle shipped-artifact inventory

Inspected 2026-10-28. App: `com.pickle.client` version `1.1.15`.
Artifact root: `/Applications/Pickle.app/Wrapper/Pickle.app`.

## Evidence boundary

This is read-only static inspection of files shipped inside the app. It establishes declarations, token values, asset presence, navigation targets and sample-data shapes. It does not establish native runtime behavior, API availability, authentication, server-side agents, or end-to-end feature equivalence. No app user-data directories or credentials were inspected.

## Inventory

- UI screen JSON: 120.
- Component JSON: 248.
- `ui/images` PNG images: 200.
- Localization catalog: 2553 entries; English catalog and Korean/Japanese localization.
- Root routes declared: home, chat, explore, archive, profile, friends.

## Screen and action map

| Surface | Observed declaration | Source under artifact root |
|---|---|---|
| Drawer | Chat, Friends, Explore, Archive, 3D World, My Pickle; search; other-chat rename/store/delete | `ui/screens/drawer.json` |
| Chat | Native `chat_room` host; avatar header; activity states Thinking/Typing/Searching/Working; profile navigation | `ui/screens/chat.json` |
| Character profile | 80px live avatar, editable name/profile, three segmented pages: Tasks / Scheduled / Bubbles | `ui/screens/characterProfile.json`, `ui/components/character/character_profile_header.json` |
| Tasks | Date sections, task state/result/time/log; task empty state and Ask CTA | `ui/screens/tasks.json`, `ui/components/handoff/tasks_list.json`, `ui/components/handoff/tasks_empty_state.json` |
| Scheduled | One-time, repeating, paused lists; creation opens chat with a draft; suggested email monitor/news/weekend ideas | `ui/screens/scheduledActions.json` |
| Bubbles | Memories grouped by date, calendar selection, detail and edit routes | `ui/screens/bubbles.json`, `bubble.json`, `bubbleEdit.json` |
| Archive | Media/files pages and creation sheet | `ui/screens/archive.json`, `ui/components/archive/*` |
| My Pickle | Profile/settings composition, connection catalog | `ui/screens/profile.json`, `ui/components/settings/my_pickle_settings_list.json` |
| Connections | Search, category selection, enabled list, detail and add-through-chat | `ui/screens/connections.json` |
| Character look | Jaum / solid color / 3D creatures; photo and color settings; save action | `ui/screens/characterLook.json`, `characterColors.json`, `jaumCustomize.json` |
| Appearance | System/light/dark; avatar size; outgoing chat bubble color; text size | `ui/screens/appearance.json` |
| Voice | Attachments, live video toggle, text composer, mute and hang-up | `ui/screens/voiceCall.json` |
| World | 3D stage controls, map, camera reset, follow self/peer, profile, energy/level/XP, AR | `ui/screens/home.json`, `ui/components/home/*` |

## Design tokens

Exact source: `ui/tokens.json` and `ui/styles.json`. Slash-separated colors encode light/dark variants.

| Token | Light | Dark |
|---|---|---|
| screen | `#FFFFFF` | `#101114` |
| page | `#FAFAFA` | `#101114` |
| card | `#FFFFFF` | `#1B1D22` |
| primary text | `#000000` | `#F4F5F7` |
| incoming bubble | `#F4F4F4` | `#25272E` |
| outgoing bubble | `#4797EF` | `#2C70D2` |
| accent | `#4797EF` | `#78AAFF` |

- Title 22px/medium, heading 18px/medium, body 16px/regular, caption 14px, small 12px.
- Screen horizontal inset 20px; section gap 24px; list gap 10px; control height 44px.
- Card radius 20px; sheet/content-card 24px; tile 16px; pill 90px.
- Profile header avatar 80×80; name 19px; status 16px; 3-way capsule segment.
- Native glass/material and 3D stage need web equivalents; these declarations do not provide pixel screenshots.

## Korean navigation labels

- `common.my_pickle`: 나의 피클
- `common.friends_3`: 친구
- `common.explore`: 둘러보기
- `common.archive`: 보관함
- `drawer.chat`: 기본 채팅
- `drawer.3d_world`: 3D 월드
- `drawer.other_chats`: 추가 대화
- `common.bubbles`: 함께한 추억
- `characterProfile.tasks`: ${session.character_name_subject} 한 일
- `scheduledActions.scheduled`: 미리 예약해 놓은 작업들

## Visual assets

These are shipped Pickle assets, not newly authored or independently licensed assets. Presence is evidence; any redistribution decision remains separate.

- `onboarding-splash-character@2x.png` — format-specific dimensions unresolved (not a standard PNG IHDR layout).
- `ui/images/onboarding-login-jaum-mieum.png` — 223×223.
- `ui/images/tasks-empty-illustration.png` — 338×238.
- `ui/images/bubbles-empty-icon.png` — 90×90.
- `ui/images/archive-files-empty-icon.png` — 162×174.
- `ui/images/archive-media-empty-icon.png` — 108×108.
- `rig/20261009a/critter-webrig-v1.glb`, `rig/20261009a/jelly-orb-v1.glb` — 3D assets.
- `Jaum/jaum-outlines.json`, `Jaum/jaum-cells.json`, `Jaum/motions/*.json`, `Jaum/matcaps/*.png` — character shape/motion/material data.

## Reproducible local scope and unknowns

A local implementation can reproduce the declared navigation, token system, avatar/profile editing, chat UI, dated memories, task lists, schedule CRUD and archive. To make these independently functional, the clone must supply its own storage and AI provider integration; these are new implementation decisions, not recovered Pickle backend behavior.

Server-based social graph, native realtime voice/video, background task execution, real service connections, payments/credentials, AR and world synchronization cannot be verified from these JSON declarations. Bundled sample data demonstrates field shape only. The native `chat_room` renderer and character stage are opaque to this static JSON inventory.

## Selected source identities

- `Info.plist` — SHA-256 `dec243a0f24efa797e280c05e152d9df84963fc59004f16a5775e6f87426f15b`
- `ui/tokens.json` — SHA-256 `5447d872e1e196feb804bee1d2c0cfe355bf2c42504a73b6fec3a8e19ae6f592`
- `ui/navigation.json` — SHA-256 `0b082acccea64a129535cffa7585614404487f6c7de6792c00f38694a531c1bf`
- `ui/screens/chat.json` — SHA-256 `7c0d2ab1d6e46db8f55ce280c2c42c619f37f638652786a787a56d0c99beac5c`
- `ui/screens/drawer.json` — SHA-256 `17f18bc0abe6471e9d3b1de69ce9890eb866b6265287c18d5ad7b0cc0c19ec6c`
- `ui/screens/characterProfile.json` — SHA-256 `23792c284973e18f3361cc57bf91cfc9c0573495ab5477610f886a489a8145d6`
- `ui/screens/bubbles.json` — SHA-256 `703ddd0fdf2ce063411916897e80f9e2f4b138784333e791fb8b8f26a54879ea`
- `ui/screens/scheduledActions.json` — SHA-256 `3fe3d0f73987e2cfd0a9d6fb34dcb183a66789331b33fcbf362eff4e97f7a26b`
- `ui-strings/catalog.json` — SHA-256 `09c03057b64505c23815b05fb6ce7bb933005897a0551388da4ef77e617435b9`
