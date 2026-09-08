# 灰潮之后 v4_clean Asset Manifest

## Scene Backgrounds

### Core existing scenes
- `images/scenes/rv_interior_day.png`
  - Use for: main menu, daytime RV interior, safe internal narration.
- `images/scenes/rv_interior_night.png`
  - Use for: night settlement, night dialogue, low-risk night scenes.
- `images/scenes/grey_highway.png`
  - Use for: normal road travel, morning route choices.
- `images/scenes/abandoned_gas_station.png`
  - Use for: gas station, fuel scavenging.
- `images/scenes/service_area.png`
  - Use for: service area, abandoned shop, convenience-store-like scenes.
- `images/scenes/infected_raid.png`
  - Use for: infected raid, crisis, night attack, high-danger events.

### New scenes
- `images/scenes/roadside_camp_day.png`
  - Use for: daytime camp, rest, resource sorting, low-pressure companion dialogue.
- `images/scenes/roadside_camp_night.png`
  - Use for: night camp, night rest, tense companion dialogue.
- `images/scenes/rv_breakdown.png`
  - Use for: engine overheating, vehicle damage, repair scenes, mechanic-related events.
- `images/scenes/survivor_encounter.png`
  - Use for: meeting survivors, rescue choices, trust/morality decisions.
- `images/scenes/road_checkpoint.png`
  - Use for: roadblock, military checkpoint, risky route decision, forced detour.
- `images/scenes/supply_storage_room.png`
  - Use for: warehouse scavenging, high-resource but risky supply events.
- `images/scenes/abandoned_house.png`
  - Use for: abandoned home, food/medicine search, personal story clues.
- `images/scenes/storm_highway.png`
  - Use for: storm road, low visibility, fuel/vehicle risk events.

## UI Textures

- `images/ui/paper_texture.png`
  - Use for: story card, difficulty card, log card.
- `images/ui/grunge_noise.png`
  - Use for: low-opacity screen overlay only.
- `images/ui/rust_border_9slice.png`
  - Use for: panel border via CSS `border-image`.
  - Do not use as a full background.
  - Do not use `fill` unless tested.
- `images/ui/button_plate_9slice.png`
  - Use for: menu buttons and action cards.
- `images/ui/warning_stamp.png`
  - Use for: warning banner / crisis decoration.
- `images/ui/blood_splatter.png`
  - Use only for crisis screen, low opacity.
- `images/ui/radio_scanline.png`
  - Use for radio panel overlay.
- `images/ui/companion_frame.png`
  - Use for companion portrait frame or companion card.
- `images/ui/card_corner_damage.png`
  - Use as corner decoration only.
- `images/ui/torn_paper_mask.png`
  - Use only if CSS mask works safely.
- `images/ui/title_grunge_overlay.png`
  - Use for title texture only, do not reduce readability.
- `images/ui/resource_icon_sheet.png`
  - Optional icon sheet. If slicing is hard, do not use yet.

## Integration Rules

1. Do not modify gameplay logic.
2. Do not modify difficulty values.
3. Do not modify rescue balance.
4. Do not modify save/load structure.
5. Only map scene backgrounds to existing scene types.
6. Keep fallback CSS if any image fails to load.
7. Do not use UI texture as full-screen background.
8. Keep all text rendered by HTML/CSS.
9. Do not write Chinese text into image assets.
10. Test desktop and mobile after integration.