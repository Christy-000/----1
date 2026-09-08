# AGENTS.md — 灰潮之后 / After the Grey Tide

## Project
This is a Chinese post-apocalyptic RV survival choice game.

Main project folder:
- `v4_clean_working`

Core files:
- `src/scenes.js` = story scenes, choices, effects, backgrounds
- `src/renderer.js` = UI rendering
- `src/game-state.js` = state, effects, endings, survival logic
- `styles/game.css` = UI layout and visual style
- `images/scenes/` = scene backgrounds
- `images/ui/` = UI textures
- `audio/` = sound files

## Hard safety rules

Do not modify these unless the task explicitly asks:
- gameplay numbers
- choice effects
- conditions
- flags
- `next`
- scene ids
- difficulty config
- save/load logic
- ending logic
- audio paths
- image paths
- `dist/grey-tide-standalone.js`

Do not hand-edit `dist/grey-tide-standalone.js`.

Always use UTF-8 when reading/writing files with Chinese text.

After modifying any source file, search for:
- `�`
- `Ã`
- `Â`
- `ï¿½`
- `��`

If new mojibake or replacement characters appear, stop and report.

## UI rules

Do not reuse failed UI experiments from `BAD_UI_archive`.

Do not connect these structural UI image assets unless the task explicitly asks:
- `rust_border_9slice_alpha.png`
- `button_plate_9slice_alpha.png`
- `companion_frame_alpha.png`
- `card_corner_damage_alpha.png`
- `torn_paper_mask.png`
- `resource_icon_sheet.png`

Safe low-risk UI assets:
- `paper_texture.png`
- `grunge_noise.png`
- `radio_scanline.png`

UI style target:
- dark survival game interface
- muted old paper texture only as subtle texture
- no large bright yellow/brown paper panels
- no stretched border images
- readable Chinese text first

## Story text cleanup rules

When asked to clean story text:
- only edit user-visible Chinese strings in `src/scenes.js`
- fix typos, broken punctuation, unnatural wording, and wrong pronouns
- do not change story logic
- do not change effects, flags, conditions, choices count, `next`, ids, or onEnter
- keep tone restrained, bleak, survival-focused
- do not add large new branches unless explicitly asked

## Asset rules

Scene backgrounds should stay in:
- `images/scenes/`

UI textures should stay in:
- `images/ui/`

Reference images should stay in:
- `references/`

Do not connect reference images into runtime UI.

## Testing

When possible, run:
- syntax check
- Playwright tests
- asset/path check

If Playwright fails because of EPERM or environment lock, report it instead of changing game code.