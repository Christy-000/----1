# 灰潮之后 v4 Clean｜剧情 QA 与路线审计

审计日期：2026-05-27

## 本轮范围

- 只修复明显文本错漏：残句、错字、重复标点、漏引号、少量称谓/代词不一致。
- 未改 UI 结构、贴图接入、数值、difficulty、save/load、scene id、next、choices、effects。
- 未手工修改 dist。

## 文本 QA 结果

已修复的明显问题包括：

- 「返回主菜。」「重新开。」「进入下一。」等残句按钮文案。
- 「陈医。」标签残缺。
- 多处中文右引号缺失。
- 多处「。。」「，，」和疑问句句号错误。
- 「你要什么搜？」等表达不顺。
- 「沉淢水」「疲惫会杢人」「一些，烧药」等明显误字。
- Day 3 陈医生拒绝选项的代词错误。

复扫结果：

- `src/scenes.js` 无 `�`。
- 未发现未闭合中文引号。
- 未发现本轮定义的明显残句/重复标点模式。

## 路线结构

总场景数：69

类型分布：

- main-menu：1
- status-screen：1
- road-screen：9
- scavenge-screen：13
- crisis-screen：13
- character-screen：8
- night-screen：8
- ending-screen：11
- endless-action-screen：5

主线结构：

```text
start_menu
  -> difficulty_select
  -> day1_morning
  -> day1_store
  -> day1_night
  -> day2_morning
  -> day2_gas_station
  -> day2_mechanic
  -> day2_engine_problem
  -> day2_night
  -> day3_morning
  -> day3_clinic
  -> day3_doctor
  -> day3_sickness
  -> day3_night
  -> day4_morning
  -> day4_service_area
  -> day4_trade_or_steal / day4_missing_food
  -> day4_investigation / day4_night
  -> day5_morning
  -> day5_broadcast_station
  -> day5_broadcaster
  -> day5_car_lights
  -> day5_night
  -> day6_morning
  -> day6_blocked_bridge
  -> day6_arsen_conflict / day6_rain_leak
  -> day6_night
  -> day7_morning
  -> day7_final_blockade
  -> day7_pay_supplies / day7_hard_break / day7_negotiate / day7_sacrifice
  -> day7_ending_judge
  -> ending_*
  -> endless_start
```

无尽模式结构：

```text
start_menu
  -> endless_start
  -> endless_action_select
     -> endless_highway
     -> @endless_supply
        -> endless_station_service / camp / gas / garage / water / farm / pharmacy / crash
     -> endless_repair
     -> endless_rest
     -> endless_listen
     -> endless_upgrade
  -> endless_night
  -> endless_safe_night / endless_raid
  -> endless_after_raid
  -> endless_action_select
```

## 结构校验

- `src/scenes.js` 中全部 `next` 目标存在。
- `@endless_supply` 是唯一动态路线，目标由 `selectEndlessSupplyScene` 决定。
- 全部场景背景图存在。
- Day1 road / store / night 存在并可连通。
- 救人路线存在：`day1_night -> day1_save_child -> day2_morning`。
- 无尽模式入口存在：主菜单入口与结局后入口均存在。
- 结局判定、game over、无尽夜袭属于代码自动路由，不是普通 choice 链接。

## 后续建议

优先级从高到低：

1. 增加同伴在场反应，让小满、阿森、陈医生、老周在 Day4-Day7 有更多短句反馈。
2. 给 Day7 结局判定增加可读性，让玩家更容易理解哪些长期选择影响了结局。
3. 扩展无尽模式事件池，避免补给/夜袭循环太快重复。
4. 增加一条自动化测试：扫描剧情文本里的未闭合引号、重复标点和残句按钮文案。
5. 在确认剧情结构稳定后，再考虑最小范围 UI 可读性优化。
