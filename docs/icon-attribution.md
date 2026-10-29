# Icons

Every icon in the app and on the website is drawn for this project as a 24×24 stroke SVG in `components/Icon.tsx` (and inline in `site/`). No icon file from the Pickle app bundle is shipped in this repository.

Earlier development builds used SVG renditions extracted from the installed Pickle `Assets.car` for comparison. They were removed before the repository was made public, because their redistribution terms are unknown. The UI specification in `ui-fidelity-spec.md` still names the original asset identifiers so sizes and selected/unselected behavior can be matched; it does not include their geometry.

Selected tab icons use a heavier stroke (and a fill for chat and profile) instead of copying the original selected variants.
