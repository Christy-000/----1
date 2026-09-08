# 灰潮之后 / After the Grey Tide v4_clean

v4_clean 是从零搭建的自定义 HTML/CSS/JS AVG 生存模拟器。旧版 `legacy_story_source.html` 只作为剧情来源参考，不是入口，也没有被修改。新的游戏入口是 `index.html`。

## 当前架构

- `index.html`：v4_clean 新入口；支持直接双击打开，也支持本地服务器运行。
- `dist/grey-tide-standalone.js`：给 `file://` 直接打开使用的普通脚本 bundle，由 `npm run build:file` 生成。
- `styles/game.css`：固定屏 AVG 布局、HUD、文本框、选择按钮、移动端适配、末日漫画滤镜。
- `src/scenes.js`：全部 scene data，包含 `pages / choices / effects / next / onEnter / condition`。
- `src/game-state.js`：初始资源、同伴、effects、clamp、夜晚结算、无尽夜晚、夜袭风险、结局判定、game over。
- `src/renderer.js`：main-menu、road、scavenge、character、crisis、night、ending、endless-action screen 渲染。
- `src/main.js`：初始化、分页、选择、effects、动态 next、save/load、结局 judge、夜袭路由。
- `src/audio.js`：click/warning/ambient、sound on/off、移动端首次点击解锁。
- `src/save.js`：localStorage 自动存档、继续旅程、新游戏、清除存档。
- `tests/`：Playwright smoke/story/layout/endless 测试与截图。

## 已实现范围

- Start 到 Day7 结局判定的完整主线 vertical slice。
- Day3 医生线、Day5 广播员线、广播真相隐藏值、感染风险线。
- 五个结局：车毁停摆、广播真相、冷酷生存、临时家人、孤路向北。
- 五个 game over：缺水、断粮、燃油耗尽、车毁、感染失控。
- 无尽模式：行动选择、条件补给事件池、夜晚资源压力、夜袭判定、房车升级系统。

## 初始 state

`water: 6`、`food: 8`、`fuel: 5`、`medicine: 2`、`parts: 3`、`battery: 4`、`vehicle: 85`、`infection: 12`、`morale: 50`、`trust: 50`、`noise: 10`、`cold: 0`、`hope: 50`。

## 同伴

- 小满：已实现加入、HUD/状态栏显示、希望提升、夜晚额外消耗。
- 阿森：已实现加入、修车条件选择、夜晚车况修复、Day6 伤口事件。
- 陈医生：已实现加入、感染线处理、夜晚降低感染风险。
- 老周：已实现加入、广播真相线、夜晚推进广播真相。

## 主线场景

| id | type | title | next |
| --- | --- | --- | --- |
| `start_menu` | `main-menu` | 灰潮之后 | `day1_morning` / `endless_start` |
| `day1_morning` | `road-screen` | Day 1｜城市边缘 | `day1_store` |
| `day1_store` | `scavenge-screen` | Day 1｜废弃便利店 | `day1_night` |
| `day1_night` | `crisis-screen` | Day 1｜第一次敲门 | `day1_save_child` / `day2_morning` |
| `day1_save_child` | `character-screen` | Day 1｜新的乘客 | `day2_morning` |
| `day2_morning` | `road-screen` | Day 2｜加油站 | `day2_gas_station` |
| `day2_gas_station` | `scavenge-screen` | Day 2｜废弃加油站 | `day2_mechanic` |
| `day2_mechanic` | `character-screen` | Day 2｜修车工阿森 | `day2_engine_problem` |
| `day2_engine_problem` | `crisis-screen` | Day 2｜引擎过热 | `day2_night` |
| `day2_night` | `night-screen` | Day 2｜夜晚结算 | `day3_morning` / `endless_start` |
| `day3_morning` | `road-screen` | Day 3｜小诊所 | `day3_clinic` |
| `day3_clinic` | `scavenge-screen` | Day 3｜诊所药柜 | `day3_doctor` |
| `day3_doctor` | `character-screen` | Day 3｜陈医生 | `day3_sickness` |
| `day3_sickness` | `crisis-screen` | Day 3｜发烧 | `day3_night` |
| `day3_night` | `night-screen` | Day 3｜夜晚结算 | `day4_morning` |
| `day4_morning` | `road-screen` | Day 4｜服务区 | `day4_service_area` |
| `day4_service_area` | `scavenge-screen` | Day 4｜临时集市 | `day4_trade_or_steal` / `day4_missing_food` |
| `day4_trade_or_steal` | `character-screen` | Day 4｜交易与规矩 | `day4_investigation` / `day4_night` |
| `day4_missing_food` | `crisis-screen` | Day 4｜丢失的食物 | `day4_investigation` / `day4_night` |
| `day4_investigation` | `character-screen` | Day 4｜偷粮的人 | `day4_night` |
| `day4_night` | `night-screen` | Day 4｜夜晚结算 | `day5_morning` |
| `day5_morning` | `road-screen` | Day 5｜广播站 | `day5_broadcast_station` |
| `day5_broadcast_station` | `scavenge-screen` | Day 5｜旧广播站 | `day5_broadcaster` |
| `day5_broadcaster` | `character-screen` | Day 5｜广播员老周 | `day5_car_lights` |
| `day5_car_lights` | `crisis-screen` | Day 5｜远处车灯 | `day5_night` |
| `day5_night` | `night-screen` | Day 5｜夜晚结算 | `day6_morning` |
| `day6_morning` | `road-screen` | Day 6｜断桥 | `day6_blocked_bridge` |
| `day6_blocked_bridge` | `crisis-screen` | Day 6｜封锁桥 | `day6_arsen_conflict` / `day6_rain_leak` |
| `day6_arsen_conflict` | `character-screen` | Day 6｜阿森的伤 | `day6_rain_leak` |
| `day6_rain_leak` | `crisis-screen` | Day 6｜漏雨的车顶 | `day6_night` |
| `day6_night` | `night-screen` | Day 6｜夜晚结算 | `day7_morning` |
| `day7_morning` | `road-screen` | Day 7｜最终封锁线 | `day7_final_blockade` |
| `day7_final_blockade` | `crisis-screen` | Day 7｜净区闸门 | `day7_pay_supplies` / `day7_hard_break` / `day7_negotiate` / `day7_sacrifice` |
| `day7_pay_supplies` | `crisis-screen` | Day 7｜排队 | `day7_ending_judge` |
| `day7_hard_break` | `crisis-screen` | Day 7｜硬闯 | `day7_ending_judge` |
| `day7_negotiate` | `character-screen` | Day 7｜公开广播 | `day7_ending_judge` |
| `day7_sacrifice` | `crisis-screen` | Day 7｜代价 | `day7_sacrifice_result` |
| `day7_sacrifice_result` | `crisis-screen` | Day 7｜留下的座位 | `day7_ending_judge` |
| `day7_ending_judge` | `ending-screen` | Day 7｜结局判定 | dynamic ending |

## 结局与无尽场景

| id | type | title | next |
| --- | --- | --- | --- |
| `ending_vehicle_failure` | `ending-screen` | 结局｜熄火在灰雾中 | `endless_start` / `start_menu` / `day1_morning` |
| `ending_broadcast_truth` | `ending-screen` | 结局｜另一条频率 | `endless_start` / `start_menu` / `day1_morning` |
| `ending_ruthless_survival` | `ending-screen` | 结局｜只剩生存 | `endless_start` / `start_menu` / `day1_morning` |
| `ending_temporary_family` | `ending-screen` | 结局｜临时家人 | `endless_start` / `start_menu` / `day1_morning` |
| `ending_lone_road` | `ending-screen` | 结局｜孤路向北 | `endless_start` / `start_menu` / `day1_morning` |
| `endless_start` | `road-screen` | 第 8 天之前 | `endless_action_select` |
| `endless_action_select` | `endless-action-screen` | 无尽公路｜今日行动 | road/supply/repair/rest/radio/upgrade |
| `endless_highway` | `road-screen` | 无尽公路｜继续上路 | `endless_night` |
| `endless_repair` | `endless-action-screen` | 无尽公路｜维修车辆 | `endless_night` |
| `endless_rest` | `endless-action-screen` | 无尽公路｜短暂休整 | `endless_night` |
| `endless_listen` | `endless-action-screen` | 无尽公路｜监听广播 | `endless_night` |
| `endless_upgrade` | `endless-action-screen` | 无尽公路｜改装房车 | `endless_upgrade` / `endless_night` / `endless_action_select` |
| `endless_station_*` | `scavenge-screen` | 条件补给事件 | `endless_night` |
| `endless_night` | `night-screen` | 无尽公路｜夜晚判定 | `endless_safe_night` / `endless_raid` |
| `endless_safe_night` | `night-screen` | 无尽公路｜安全夜 | `endless_action_select` |
| `endless_raid` | `crisis-screen` | 无尽公路｜夜袭 | `endless_after_raid` |
| `endless_after_raid` | `night-screen` | 无尽公路｜夜袭之后 | `endless_action_select` |

## 参考资料使用

已读取 `REFERENCES.md`。本工程没有下载、导入或复制 Tuesday JS、Monogatari、Narrat、Dendry、Ren'Py 源码，只参考其 AVG 固定背景、scene data、choices/effects/next、state、save/load、移动端布局等架构思想。

## 待人工校对

- Day3-Day7 文本已按 `legacy_story_source.html` 的旧意思迁移和改写，但仍需逐句对照旧版稳定文本做人工校对。
- `day1_morning` 的“只检查房车附近”仍合并回 `day1_store`，后续可恢复为独立分支。
- 无尽事件池目前是第一版条件池，后续可扩充更多地点、长期状态和同伴专属事件。
- 多结局 judge 已可运行，但阈值还需要根据完整 Day1-Day7 平衡测试继续微调。

## 本地运行

可以直接双击打开：

```text
index.html
```

如果使用本地服务器：

```bash
python -m http.server 4173
```

然后打开 `http://127.0.0.1:4173/index.html`。

如果之后改了 `src/*.js`，请刷新直接打开版本：

```bash
npm run build:file
```

## 测试

```bash
npm test
```

测试会生成截图到 `test-results/screenshots/`。
## Checkpoint

- 当前版本：`v4_balance_checkpoint`
- 已完成：difficulty modes, early-game rescue balance
- 下一步：asset-light UI polish
