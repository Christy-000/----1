# References for 灰潮之后 v4_clean

This project should be built as a custom HTML/CSS/JS data-driven AVG survival narrative game.

Do not copy code directly from reference projects.
Only learn architecture and UI patterns.

## Project Definition

灰潮之后 / After the Grey Tide should be understood as:

A post-apocalyptic AVG survival simulator.

Core structure:
- Background image
- Fixed game screen
- Text box
- Click-to-continue narrative pages
- Final choices
- Resource state
- Companion state
- Hidden values
- Branching endings
- Endless mode

This is closer to:
- 橙光 / 宫斗模拟器 style AVG
- Web visual novel
- Narrative survival management game

It should not be treated as:
- A normal scrolling Twine page
- A dashboard web app
- A Harlowe DOM overlay project
- A Unity/Godot action game

## 1. Tuesday JS

Link: https://github.com/Kirilllive/tuesday-js

Learning points:
- Web-based open-source visual novel editor.
- Background image + dialogue box + choices.
- Browser-based AVG structure.
- Click-to-continue text flow.
- HTML/CSS/JS visual novel UI.

Use this only as a reference for:
- Fixed-screen AVG layout
- Dialogue box structure
- Choice button placement
- Web visual novel style

Do not copy its source code directly.

## 2. Monogatari

Link: https://monogatari.io/

Learning points:
- Modern web visual novel engine.
- Scene/script data separated from UI.
- Backgrounds, dialogue, choices, save/load, settings.
- Web distribution model.

Use this only as a reference for:
- Scene data structure
- Save/load system
- Settings menu
- Web visual novel project organisation

Do not migrate this project to Monogatari.

## 3. Narrat

Link: https://narrat.dev/

Learning points:
- Narrative game engine with RPG features.
- Branching choices.
- Variables and conditions.
- Skills, items, inventory, and quests.
- Useful reference for resources, state, hidden values, and story conditions.

Use this only as a reference for:
- Resource system
- State conditions
- Hidden values
- Companion effects
- Future quest/log systems

Do not migrate this project to Narrat.

## 4. Dendry / Storylet Design

Learning points:
- Condition-based event pool.
- Useful for Endless mode.
- Events can appear based on hidden values, resources, companions, or day count.

Use this only as a reference for:
- Endless mode event selection
- Conditional event triggers
- Resource-based random encounters
- Hidden-value event logic

## 5. Ren'Py

Link: https://www.renpy.org/

Learning points:
- Standard visual novel structure.
- Background + text box + choices + screens.
- Good reference for AVG screen layout.

Use this only as a reference for:
- Dialogue box layout
- Choice menu layout
- Visual novel screen logic

Do not migrate this project to Ren'Py now.

## Rules for Codex

Do not import these engines.
Do not copy their source code.
Do not mix their folders into this project.
Do not download these projects into the main game directory.
Use them only as architecture inspiration.

The actual project should be built as:

- Custom HTML
- Custom CSS
- Custom JavaScript
- Data-driven scenes
- Resource state system
- Companion state system
- Save/load with localStorage
- Fixed-screen AVG UI
- Playwright tests

## Target v4_clean Architecture

Expected folder structure:

灰潮之后_v4_clean/
  index.html
  styles/
    game.css
  src/
    main.js
    scenes.js
    game-state.js
    renderer.js
    audio.js
    save.js
    utils.js
  tests/
    v4-smoke.spec.js
    v4-story.spec.js
    v4-layout.spec.js
  audio/
  images/
  references/
  legacy_story_source.html
  REFERENCES.md
  README_V4.md

## Do Not Use Old v3 Architecture

Do not reuse:
- cinematic-ui.js
- cinematic-ui.css
- renderProjectedScreen
- makeDisplayBodyClone
- data-projected-ui
- raw-screen fallback
- Harlowe DOM overlay
- clone/hide/move Harlowe link strategy

Old Twine/Harlowe files should only be used as story source.

## Final Goal

Build 灰潮之后 v4_clean as:

A fixed-screen post-apocalyptic AVG survival simulator.

Player flow:
1. See background image.
2. Read short narrative page.
3. Click continue.
4. Reach final page.
5. Choose an action.
6. Action changes resources / companions / hidden values.
7. Game moves to next scene.
8. State affects future events and endings.