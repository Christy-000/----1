export const SCENES = {
  start_menu: {
    id: "start_menu",
    type: "main-menu",
    title: "灰潮之后",
    day: 0,
    location: "旧房车",
    background: "images/scenes/rv_interior_day.png",
    ambience: "audio/ambient.mp3",
    tags: ["SURVIVAL LOG", "DAY 0"],
    pages: [
      "灰潮爆发后的第七天还没有到来。城市边缘已经断电，广播却还在重复同一句话，像有人故意不让它停下。",
      "你坐在一辆旧房车里，车窗外是灰色的城市边缘。远处有黑烟，废弃车辆堵在高速入口旁边。",
      "无线电：“北方净区仍在接收幸存者，沿 17 号高速前进。”你不知道这是真的，还是一个陷阱，但油箱还没空，车还能开。",
    ],
  },

  difficulty_select: {
    id: "difficulty_select",
    type: "status-screen",
    title: "选择难度",
    day: 1,
    location: "出发前",
    background: "images/scenes/rv_interior_day.png",
    ambience: "audio/ambient.mp3",
    tags: ["DIFFICULTY"],
    pages: [
      "出发前，你重新清点房车里的物资，并决定这趟旅程要承受怎样的压力。",
      "难度只影响资源宽容度和风险倍率，不会改变剧情路线，救人选择或结局判定。",
    ],
    choices: [
      {
        text: "简单｜资源更宽松，适合先看剧情",
        risk: "low",
        difficulty: "easy",
        effects: { set: { difficulty: "easy" }, flags: { selected_difficulty: "easy" } },
        next: "day1_morning",
      },
      {
        text: "普通｜推荐，标准生存压力",
        risk: "medium",
        difficulty: "normal",
        effects: { set: { difficulty: "normal" }, flags: { selected_difficulty: "normal" } },
        next: "day1_morning",
      },
      {
        text: "困难｜资源紧张，风险更高",
        risk: "high",
        difficulty: "hard",
        effects: { set: { difficulty: "hard" }, flags: { selected_difficulty: "hard" } },
        next: "day1_morning",
      },
    ],
  },

  day1_morning: {
    id: "day1_morning",
    type: "road-screen",
    title: "Day 1｜城市边缘",
    day: 1,
    location: "城市边缘",
    background: "images/scenes/rv_interior_day.png",
    ambience: "audio/ambient.mp3",
    tags: ["MORNING", "ROAD"],
    onEnter: { set: { day: 1 } },
    pages: [
      "早上。房车里还算干净。",
      "储物柜里有几包压缩饼干，几瓶水、半箱旧药，还有一张皱掉的高速地图。",
      "窗外是城市边缘，远处有烟，街上没有活人，只有被撞坏的车和空荡荡的便利店。",
      "今天你必须出去找物资。你决定去哪里？",
    ],
    choices: [
      {
        text: "去废弃便利店",
        risk: "medium",
        effects: { flags: { day1_destination: "store" } },
        next: "day1_store",
      },
      {
        text: "只检查房车附近",
        risk: "low",
        effects: { battery: 1, parts: 1, flags: { day1_destination: "van_area" } },
        next: "day1_store",
      },
    ],
  },

  day1_store: {
    id: "day1_store",
    type: "scavenge-screen",
    title: "Day 1｜废弃便利店",
    day: 1,
    location: "废弃便利店",
    background: "images/scenes/service_area.png",
    ambience: "audio/ambient.mp3",
    tags: ["SCAVENGE"],
    pages: [
      "便利店的玻璃门碎了一半。",
      "地上有干掉的血。货架大部分已经空了，但仓库门还关着。",
      "这里可能还能找到食物和水，也可能把附近的东西都引过来。你有三种选择。",
    ],
    choices: [
      {
        text: "快速搜索就走",
        risk: "medium",
        effects: { food: 2, water: 1, noise: 5 },
        next: "day1_night",
      },
      {
        text: "仔细搜索仓库",
        risk: "high",
        effects: { food: 3, water: 2, parts: 1, noise: 12 },
        next: "day1_night",
      },
      {
        text: "不进去，只检查外围",
        risk: "low",
        effects: { water: 1, cold: 1 },
        next: "day1_night",
      },
    ],
  },

  day1_night: {
    id: "day1_night",
    type: "crisis-screen",
    title: "Day 1｜第一次敲门",
    day: 1,
    location: "房车内部",
    background: "images/scenes/rv_interior_night.png",
    ambience: "audio/rain.mp3",
    tags: ["NIGHT EVENT", "DANGER"],
    pages: [
      "夜里，房车外突然传来敲门声。",
      "很轻。不像成年人。",
      "你从窗帘缝里看出去，门外站着一个十二岁左右的女孩，她背着一个脏兮兮的书包，脸上全是灰。",
      "她说：“我叫林小满。我的爸妈去了北方净区。你能带我一程吗？”",
      "你知道，如果让她上车，食物和水会消耗得更快。但如果不开门，她可能活不过今晚。",
    ],
    choices: [
      {
        text: "让她上车",
        risk: "unknown",
        effects: {
          saved_child: true,
          food: 1,
          water: 1,
          medicine: 1,
          hope: 6,
          trust: 5,
          flags: { child_found_emergency_pack: true },
        },
        next: "day1_save_child",
      },
      {
        text: "给她一瓶水，但不让她上车",
        risk: "medium",
        effects: { water: -1, hope: 2, cold: 1, flags: { helped_child_at_door: true } },
        next: "day2_morning",
      },
      {
        text: "不开门",
        risk: "low",
        effects: { cold: 2, trust: -5, hope: -3, flags: { ignored_child: true } },
        next: "day2_morning",
      },
    ],
  },

  day1_save_child: {
    id: "day1_save_child",
    type: "character-screen",
    title: "Day 1｜新的乘客",
    day: 1,
    location: "房车内部",
    background: "images/scenes/rv_interior_night.png",
    ambience: "audio/rain.mp3",
    tags: ["COMPANION", "小满"],
    pages: [
      "你打开车门。",
      "女孩爬上车后，第一件事不是找吃的，而是小心地把鞋底在门口蹭干净。",
      "她把书包放在副驾驶座下面。房车里多了一条儿童毯子。",
      "从现在开始，每天会多消耗 1 份食物和 1 份水。",
      "你没有说话，她也没有，但房车里不再只有你一个人的呼吸声。",
    ],
    choices: [
      {
        text: "进入第 2 天",
        risk: "low",
        effects: { flags: { child_settled_in_van: true } },
        next: "day2_morning",
      },
    ],
  },

  day2_morning: {
    id: "day2_morning",
    type: "road-screen",
    title: "Day 2｜加油站",
    day: 2,
    location: "灰色公路",
    background: "images/scenes/grey_highway.png",
    ambience: "audio/engine.mp3",
    tags: ["MORNING", "ROAD"],
    onEnter: { set: { day: 2 } },
    pages: [
      "第二天早上。",
      "房车外的雾比昨天更重。油表已经快到底了，如果今天找不到燃油，你可能开不到 17 号高速。",
      {
        when: { saved_child: true },
        text: "小满坐在副驾驶后面，抱着她的书包。她没有问你昨天晚上睡没睡着。",
      },
      {
        when: { saved_child: false },
        text: "副驾驶座是空的，车窗上的小手印还在。",
      },
      "今天你决定去废弃加油站。",
    ],
    choices: [
      {
        text: "开车去加油。",
        risk: "medium",
        effects: { fuel: -1, flags: { day2_destination: "gas_station" } },
        next: "day2_gas_station",
      },
    ],
  },

  day2_gas_station: {
    id: "day2_gas_station",
    type: "scavenge-screen",
    title: "Day 2｜废弃加油站",
    day: 2,
    location: "废弃加油站",
    background: "images/scenes/abandoned_gas_station.png",
    ambience: "audio/ambient.mp3",
    tags: ["SCAVENGE", "FUEL"],
    pages: [
      "加油站的招牌歪在路边。地上全是碎玻璃和黑色油污。",
      "两辆废车堵在入口。远处的油泵还在闪红灯。",
      "这里可能有燃油，也可能有别人留下的陷阱，你要什么搜？",
    ],
    choices: [
      {
        text: "抽油",
        risk: "high",
        effects: { water: 1, fuel: 4, noise: 15 },
        next: "day2_mechanic",
      },
      {
        text: "拆废车找零件",
        risk: "medium",
        effects: { parts: 2, fuel: 1, noise: 8 },
        next: "day2_mechanic",
      },
      {
        text: "只拿能带走的小东西",
        risk: "low",
        effects: { battery: 1, water: 1, noise: 3 },
        next: "day2_mechanic",
      },
    ],
  },

  day2_mechanic: {
    id: "day2_mechanic",
    type: "character-screen",
    title: "Day 2｜修车工阿森",
    day: 2,
    location: "废弃加油站",
    background: "images/scenes/abandoned_gas_station.png",
    ambience: "audio/ambient.mp3",
    tags: ["COMPANION", "阿森"],
    pages: [
      "你准备离开时，便利店后面传来金属碰撞声。",
      "一个男人从废车下面爬出来，他三十多岁，脸上有油污，手里拿着扳手。",
      "他说自己叫阿森，灾难前，他是修车工。",
      "他看了一眼你的房车，说：“你这辆车再这样开，最多撑三天。让我上车，我能帮你修。”",
      "你注意到，他左手手臂上缠着一圈脏纱布。纱布下面像是有血。你怎么处理？",
    ],
    choices: [
      {
        text: "让阿森上车",
        risk: "unknown",
        effects: {
          saved_mechanic: true,
          food: -1,
          fuel: 1,
          parts: 1,
          trust: 5,
          vehicle: 5,
          infection: 2,
          flags: { mechanic_checked_fuel_line: true },
        },
        next: "day2_engine_problem",
      },
      {
        text: "先检查他的伤口",
        risk: "medium",
        effects: {
          saved_mechanic: true,
          medicine: -1,
          fuel: 1,
          parts: 1,
          trust: 3,
          vehicle: 5,
          infection: -2,
          flags: { mechanic_checked_fuel_line: true },
        },
        next: "day2_engine_problem",
      },
      {
        text: "拒绝他",
        risk: "low",
        effects: { cold: 1, trust: -3, hope: -2 },
        next: "day2_engine_problem",
      },
    ],
  },

  day2_engine_problem: {
    id: "day2_engine_problem",
    type: "crisis-screen",
    title: "Day 2｜引擎过热",
    day: 2,
    location: "高速路边",
    background: "images/scenes/grey_highway.png",
    ambience: "audio/engine.mp3",
    tags: ["SYSTEM FAILURE", "WARNING"],
    pages: [
      "傍晚，你开车离开加油站。",
      "没过多久，房车突然剧烈抖动，仪表盘上的温度指针冲到红区。",
      "你把车停在路边，引擎盖下面冒出白烟。",
      {
        when: { saved_mechanic: true },
        text: "阿森皱着眉下车，打开引擎盖，他说：“水箱漏了，还能修，但要用零件。，他看起来很熟练，但他手臂上的纱布已经被汗浸湿。",
      },
      {
        when: { saved_mechanic: false },
        text: "你一个人站在车头前，你知道车坏了，但你不知道具体坏在哪里，风从高速路上吹过来，你突然觉得这辆房车比昨天更脆弱。",
      },
      "你要怎么处理。",
    ],
    choices: [
      {
        text: "让阿森修车",
        risk: "medium",
        condition: { saved_mechanic: true },
        effects: { parts: -1, trust: 5, vehicle: 8 },
        next: "day2_night",
      },
      {
        text: "自己硬修",
        risk: "high",
        condition: { saved_mechanic: false },
        effects: { parts: -2, vehicle: -8, noise: 5 },
        next: "day2_night",
      },
      {
        text: "不修，继续开",
        risk: "high",
        effects: { vehicle: -12, fuel: -1, noise: 8 },
        next: "day2_night",
      },
    ],
  },

  day2_night: {
    id: "day2_night",
    type: "night-screen",
    title: "Day 2｜夜晚结算",
    day: 2,
    location: "废弃高速边",
    background: "images/scenes/rv_interior_night.png",
    ambience: "audio/rain.mp3",
    tags: ["NIGHT SETTLEMENT"],
    onEnter: { nightSettlement: true },
    pages: [
      "夜里，房车停在一段废弃高速边。",
      "你把窗帘拉紧。外面偶尔有车灯闪过，但没有人靠近。",
      "今天你找到了燃油，也遇到了一个可能有用，也可能危险的人。",
      {
        when: { saved_mechanic: true },
        text: "阿森坐在车尾，低头擦他的扳手。他没有主动说起手臂上的伤。",
      },
      {
        when: { saved_mechanic: false },
        text: "你想起加油站那个修车工，也许他现在还活着。也许已经没有了。",
      },
      "夜晚结算完成。7 号高速还在北面，第三天的雾会更重。",
    ],
    choices: [
      {
        text: "进入第 3 天",
        risk: "medium",
        effects: { flags: { entered_day3: true } },
        next: "day3_morning",
      },
      {
        text: "直接驶入无尽公路",
        risk: "unknown",
        effects: { flags: { entered_endless_from_day2: true } },
        next: "endless_start",
      },
    ],
  },

  day3_morning: {
    id: "day3_morning",
    type: "road-screen",
    title: "Day 3｜小诊所",
    day: 3,
    location: "17 号高速支路",
    background: "images/scenes/grey_highway.png",
    ambience: "audio/engine.mp3",
    tags: ["MORNING", "MEDICAL"],
    onEnter: { set: { day: 3 } },
    pages: [
      "第三天早上，广播里第一次出现了杂音以外的尖锐蜂鸣。",
      "小满盯着窗外一块写着“社区诊所”的路牌。阿森说那条支路绕一点，但可能有药。",
      "房车里的旧药不多了，如果感染风险继续上升，谁都不敢保证下一次发烧还能撑过去。",
      "你把车开向诊所。门口的急救灯早就灭了，玻璃上贴着一张褪色的分诊表。",
    ],
    choices: [
      {
        text: "进入小诊所",
        risk: "medium",
        effects: { fuel: -1, flags: { day3_destination: "clinic" } },
        next: "day3_clinic",
      },
    ],
  },

  day3_clinic: {
    id: "day3_clinic",
    type: "scavenge-screen",
    title: "Day 3｜诊所药柜",
    day: 3,
    location: "社区诊所",
    background: "images/scenes/service_area.png",
    ambience: "audio/ambient.mp3",
    tags: ["SCAVENGE", "MEDICINE"],
    pages: [
      "诊所里很冷，消毒水味和潮气混在一起。",
      "药柜被撬过，但底层还有几盒抗生素和绷带，走廊另一头传来压低的争执声。",
      "一个穿白大褂的女人正在替伤员止血。她看见你拿起药，眼神一下变得很警惕。",
    ],
    choices: [
      {
        text: "偷拿药品立刻离开",
        risk: "high",
        effects: { medicine: 3, cold: 2, trust: -5, noise: 6 },
        next: "day3_doctor",
      },
      {
        text: "帮她救伤员",
        risk: "medium",
        effects: { medicine: 1, trust: 10, hope: 2, infection: -1 },
        next: "day3_doctor",
      },
      {
        text: "用食物和她交易",
        risk: "low",
        effects: { food: -1, medicine: 2, trust: 2 },
        next: "day3_doctor",
      },
    ],
  },

  day3_doctor: {
    id: "day3_doctor",
    type: "character-screen",
    title: "Day 3｜陈医生",
    day: 3,
    location: "社区诊所",
    background: "images/scenes/service_area.png",
    ambience: "audio/ambient.mp3",
    tags: ["COMPANION", "陈医。"],
    pages: [
      "女人自称陈医生，她说诊所已经撑不下去了，伤员有自己的家属会带走。",
      "她看了看你的房车，又看了看你手里的药箱：“你们要往北？那条路上会有人发烧，受伤，被咬，没有医生，车再好也没用。。",
      {
        when: { saved_child: true },
        text: "小满从车门后探出头，陈医生看到她，语气软了一点：“孩子不能再这样吃冷东西。。",
      },
      {
        when: { saved_mechanic: true },
        text: "阿森把受伤的手臂藏到身后，但陈医生已经看见了纱布上的血。",
      },
      "她想上车，但你知道，多一个人就多一份消耗。",
    ],
    choices: [
      {
        text: "让陈医生上车",
        risk: "unknown",
        effects: {
          saved_doctor: true,
          food: -1,
          medicine: 1,
          trust: 8,
          hope: 1,
          infection: -3,
          flags: { doctor_sorted_medkit: true },
        },
        next: "day3_sickness",
      },
      {
        text: "拒绝他",
        risk: "medium",
        effects: { water: -1, hope: 1, cold: 1, flags: { helped_doctor_without_joining: true } },
        next: "day3_sickness",
      },
      {
        text: "威胁她交出更多药",
        risk: "high",
        effects: { medicine: 2, cold: 3, trust: -10, noise: 5 },
        next: "day3_sickness",
      },
    ],
  },

  day3_sickness: {
    id: "day3_sickness",
    type: "crisis-screen",
    title: "Day 3｜发烧",
    day: 3,
    location: "高速路边",
    background: "images/scenes/rv_interior_night.png",
    ambience: "audio/rain.mp3",
    tags: ["INFECTION", "WARNING"],
    pages: [
      "傍晚，车里有人开始发烧，额头滚烫，呼吸急促。",
      {
        when: { saved_child: true },
        text: "小满缩在毯子里，小声问：“如果到了净区，他们会检查我们吗？。",
      },
      {
        when: { saved_mechanic: true },
        text: "阿森的伤口边缘发黑他说只是旧伤，但他的手在抖。",
      },
      {
        when: { saved_doctor: true },
        text: "陈医生打开药箱，说：“现在处理还来得及，但别再拖。”",
      },
      "你必须决定要不要消耗药品。",
    ],
    choices: [
      {
        text: "让陈医生处理",
        risk: "low",
        condition: { saved_doctor: true },
        effects: { medicine: -1, trust: 5, infection: -4 },
        next: "day3_night",
      },
      {
        text: "自己用药处理",
        risk: "medium",
        condition: { saved_doctor: false },
        effects: { medicine: -2, infection: -3, morale: -2 },
        next: "day3_night",
      },
      {
        text: "不用药，先熬过今。",
        risk: "high",
        effects: { infection: 12, trust: -3, hope: -2 },
        next: "day3_night",
      },
    ],
  },

  day3_night: {
    id: "day3_night",
    type: "night-screen",
    title: "Day 3｜夜晚结算",
    day: 3,
    location: "支路尽头",
    background: "images/scenes/rv_interior_night.png",
    ambience: "audio/rain.mp3",
    tags: ["NIGHT SETTLEMENT"],
    onEnter: { nightSettlement: true },
    pages: [
      "雨点敲在车顶，像有人在外面用指甲刮铁皮。",
      "药味在车厢里散开。你清点剩下的药品，第一次觉得数字比广播更诚实。",
      {
        when: { saved_doctor: true },
        text: "陈医生在小桌边记录症状，她没有问你信不信她，只说：“明天尽量别进人多的地方。。",
      },
      "夜晚结算完成。明天必须重新找食物和水。",
    ],
    choices: [
      {
        text: "进入第 4 天",
        risk: "medium",
        effects: { flags: { entered_day4: true } },
        next: "day4_morning",
      },
    ],
  },

  day4_morning: {
    id: "day4_morning",
    type: "road-screen",
    title: "Day 4｜服务区",
    day: 4,
    location: "高速服务区外",
    background: "images/scenes/grey_highway.png",
    ambience: "audio/engine.mp3",
    tags: ["MORNING", "SUPPLIES"],
    onEnter: { set: { day: 4 } },
    pages: [
      "第四天早上，水箱见底的声音比闹钟更早响起。",
      "前方有一处高速服务区。停车场里有火堆，有人影，还有临时搭起的路障。",
      "这不是空地方。里面有物资，也有规矩。",
    ],
    choices: [
      {
        text: "进入服务。",
        risk: "medium",
        effects: { fuel: -1, flags: { day4_destination: "service_area" } },
        next: "day4_service_area",
      },
    ],
  },

  day4_service_area: {
    id: "day4_service_area",
    type: "scavenge-screen",
    title: "Day 4｜临时集市",
    day: 4,
    location: "高速服务区",
    background: "images/scenes/service_area.png",
    ambience: "audio/ambient.mp3",
    tags: ["SCAVENGE", "TRADE"],
    pages: [
      "服务区被改成了临时集市，几辆车围成圈，圈内的人用旧衣服、药、燃油和罐头交换。",
      "入口处有人检查车辆一个戴红袖章的男人说：“不换就走，别在这里乱翻。。",
      "你看见货架后面还有水和干粮，但看守的人也看见了你。",
    ],
    choices: [
      {
        text: "用零件换补给",
        risk: "low",
        effects: { parts: -1, food: 2, water: 2, trust: 2 },
        next: "day4_trade_or_steal",
      },
      {
        text: "趁乱偷一批食。",
        risk: "high",
        effects: { food: 4, cold: 2, noise: 10, trust: -6 },
        next: "day4_missing_food",
      },
      {
        text: "只买燃油，马上离开",
        risk: "medium",
        effects: { food: -1, fuel: 3, noise: 3 },
        next: "day4_trade_or_steal",
      },
    ],
  },

  day4_trade_or_steal: {
    id: "day4_trade_or_steal",
    type: "character-screen",
    title: "Day 4｜交易与规矩",
    day: 4,
    location: "服务区集市",
    background: "images/scenes/service_area.png",
    ambience: "audio/ambient.mp3",
    tags: ["TRUST"],
    pages: [
      "交易完成后，红袖章男人盯着你的房车看了很久。",
      "他说有些车队已经开始抢人，沿着 17 号高速往北走，不只要防感染者，还要防活人。",
      {
        when: { saved_child: true },
        text: "小满把刚换来的面包掰成两半，悄悄把大的那块推给别人。",
      },
      "离开前，你听到有人在背后议论：昨晚有车队食物丢了，他们正在找偷东西的人。",
    ],
    choices: [
      {
        text: "私下询问失窃的事",
        risk: "medium",
        effects: { trust: 3, broadcast_truth: 1, flags: { asked_about_service_theft: true } },
        next: "day4_investigation",
      },
      {
        text: "别惹麻烦，立刻离开",
        risk: "low",
        effects: { fuel: -1, cold: 1 },
        next: "day4_night",
      },
    ],
  },

  day4_missing_food: {
    id: "day4_missing_food",
    type: "crisis-screen",
    title: "Day 4｜丢失的食物",
    day: 4,
    location: "服务区后场",
    background: "images/scenes/service_area.png",
    ambience: "audio/ambient.mp3",
    tags: ["DANGER", "THEFT"],
    pages: [
      "你把偷来的食物塞进车厢，刚关上门，服务区里就响起吵闹声。",
      "有人发现了少掉的罐头。红袖章男人带着两个人朝停车场走来。",
      "阿森握紧扳手，陈医生把小满往车里推，你必须决定怎么脱身。",
    ],
    choices: [
      {
        text: "承认偷拿并交回一。",
        risk: "medium",
        effects: { food: -2, trust: 4, cold: -1 },
        next: "day4_investigation",
      },
      {
        text: "撞开路障逃走",
        risk: "high",
        effects: { vehicle: -10, fuel: -1, noise: 15, cold: 2 },
        next: "day4_night",
      },
      {
        text: "把责任推给别。",
        risk: "high",
        effects: { cold: 4, trust: -10, hope: -4 },
        next: "day4_night",
      },
    ],
  },

  day4_investigation: {
    id: "day4_investigation",
    type: "character-screen",
    title: "Day 4｜偷粮的账",
    day: 4,
    location: "服务区仓库",
    background: "images/scenes/service_area.png",
    ambience: "audio/ambient.mp3",
    tags: ["TRUTH", "MORALE"],
    pages: [
      "你发现失窃的不止是一箱罐头，还有一台小型发报机。",
      "仓库角落的墙上写着一串频率：71.3。旁边有人用炭笔画了一个向北的箭头。",
      {
        when: { saved_broadcaster: false },
        text: "你不懂这串数字意味着什么，只能把它记在地图边缘。",
      },
      "服务区的人没有再拦你，但你知道，净区广播背后可能还有另一层东西。",
    ],
    choices: [
      {
        text: "带着频率离开",
        risk: "low",
        effects: { broadcast_truth: 1, battery: -1, flags: { found_frequency_713: true } },
        next: "day4_night",
      },
    ],
  },

  day4_night: {
    id: "day4_night",
    type: "night-screen",
    title: "Day 4｜夜晚结算",
    day: 4,
    location: "服务区北侧",
    background: "images/scenes/rv_interior_night.png",
    ambience: "audio/rain.mp3",
    tags: ["NIGHT SETTLEMENT"],
    onEnter: { nightSettlement: true },
    pages: [
      "夜里，服务区的火光在后视镜里越来越小。",
      "车里没有人马上睡。今天你们见到了还在交易的人，也见到了规矩是怎么被撕开的。",
      "你把 71.3 这个频率写进日志。广播里那句“北方净区仍在接收幸存者。突然显得没那么简单。",
    ],
    choices: [
      {
        text: "进入第 5 天",
        risk: "medium",
        effects: { flags: { entered_day5: true } },
        next: "day5_morning",
      },
    ],
  },

  day5_morning: {
    id: "day5_morning",
    type: "road-screen",
    title: "Day 5｜广播站",
    day: 5,
    location: "山区公路",
    background: "images/scenes/grey_highway.png",
    ambience: "audio/engine.mp3",
    tags: ["MORNING", "RADIO"],
    onEnter: { set: { day: 5 } },
    pages: [
      "第五天，广播声变得更清楚了。",
      "除了净区的循环播报，你听见另一个被压在底下的声音：“不要走 17 号主线，重复，不要走主线。。",
      "路边出现一座废弃广播站。天线折了一半，但控制室里仍有微弱的绿色指示灯。",
    ],
    choices: [
      {
        text: "进入广播。",
        risk: "medium",
        effects: { fuel: -1, battery: -1, flags: { day5_destination: "broadcast_station" } },
        next: "day5_broadcast_station",
      },
    ],
  },

  day5_broadcast_station: {
    id: "day5_broadcast_station",
    type: "scavenge-screen",
    title: "Day 5｜旧广播站",
    day: 5,
    location: "废弃广播站",
    background: "images/scenes/grey_highway.png",
    ambience: "audio/radio.mp3",
    tags: ["RADIO", "TRUTH"],
    pages: [
      "广播站的门被人从里面堵住。控制台上铺着手写记录，频率，日期，车牌号密密麻麻。",
      "你找到一台还能亮的接收机。它正在监听 71.3。",
      "纸上写着：净区不是终点，是筛选点。车队进入前会被分开。",
    ],
    choices: [
      {
        text: "修好接收。",
        risk: "medium",
        effects: { parts: -1, broadcast_truth: 2, battery: -1 },
        next: "day5_broadcaster",
      },
      {
        text: "拆走电池和线。",
        risk: "low",
        effects: { battery: 2, parts: 1, cold: 1 },
        next: "day5_broadcaster",
      },
      {
        text: "播放求救信号",
        risk: "high",
        effects: { hope: 4, noise: 15, broadcast_truth: 1 },
        next: "day5_broadcaster",
      },
    ],
  },

  day5_broadcaster: {
    id: "day5_broadcaster",
    type: "character-screen",
    title: "Day 5｜广播员老周",
    day: 5,
    location: "广播站控制室",
    background: "images/scenes/grey_highway.png",
    ambience: "audio/radio.mp3",
    tags: ["COMPANION", "老周"],
    pages: [
      "控制室后面的储物间里传来咳嗽声。",
      "一个头发花白的男人举着小收音机走出来，他说自己叫老周，灾难前就是这座站的广播员。",
      "他说净区广播被改过，真正的撤离路线藏在干扰信号里，没有接收设备，你们迟早会被引到主线封锁口。",
      "他想上车，条件是让他继续监听广播。",
    ],
    choices: [
      {
        text: "让老周上车",
        risk: "unknown",
        effects: {
          saved_broadcaster: true,
          food: -1,
          fuel: 1,
          noise: -3,
          broadcast_truth: 3,
          trust: 4,
          flags: { broadcaster_corrected_route: true },
        },
        next: "day5_car_lights",
      },
      {
        text: "只带走他的记录",
        risk: "medium",
        effects: { broadcast_truth: 1, cold: 1, flags: { took_broadcaster_notes: true } },
        next: "day5_car_lights",
      },
      {
        text: "不信他，立刻离开",
        risk: "low",
        effects: { trust: -3, hope: -2 },
        next: "day5_car_lights",
      },
    ],
  },

  day5_car_lights: {
    id: "day5_car_lights",
    type: "crisis-screen",
    title: "Day 5｜远处车灯",
    day: 5,
    location: "广播站外",
    background: "images/scenes/grey_highway.png",
    ambience: "audio/engine.mp3",
    tags: ["DANGER", "CHASE"],
    pages: [
      "你们离开广播站时，山下亮起两束车灯。",
      "那辆车没有开近光，也没有按喇叭，只是沿着你们的方向慢慢加速。",
      {
        when: { saved_broadcaster: true },
        text: "老周趴在收音机旁说：“他们在听公开频道。别回主路，走维修道。。",
      },
      "如果被跟上，夜里可能会出事。",
    ],
    choices: [
      {
        text: "关灯绕进维修道",
        risk: "medium",
        effects: { fuel: -1, noise: -5, vehicle: -3, broadcast_truth: 1 },
        next: "day5_night",
      },
      {
        text: "加速甩开他们",
        risk: "high",
        effects: { fuel: -2, vehicle: -8, noise: 8 },
        next: "day5_night",
      },
      {
        text: "停车谈判",
        risk: "unknown",
        effects: { trust: 3, broadcast_truth: 1, food: -1 },
        next: "day5_night",
      },
    ],
  },

  day5_night: {
    id: "day5_night",
    type: "night-screen",
    title: "Day 5｜夜晚结算",
    day: 5,
    location: "维修道尽头",
    background: "images/scenes/rv_interior_night.png",
    ambience: "audio/radio.mp3",
    tags: ["NIGHT SETTLEMENT"],
    onEnter: { nightSettlement: true },
    pages: [
      "夜里，收音机的绿灯在黑暗里一闪一闪。",
      "今天之后，净区不再只是一个方向，它变成了一个问题：如果广播在撒谎，你们还要不要继续往北？",
      {
        when: { saved_broadcaster: true },
        text: "老周把耳机递给你。杂音深处，有人反复念着几个地名，像是在给还没放弃的人留路标。",
      },
    ],
    choices: [
      {
        text: "进入第 6 天",
        risk: "medium",
        effects: { flags: { entered_day6: true } },
        next: "day6_morning",
      },
    ],
  },

  day6_morning: {
    id: "day6_morning",
    type: "road-screen",
    title: "Day 6｜断桥",
    day: 6,
    location: "17 号高速旧桥",
    background: "images/scenes/grey_highway.png",
    ambience: "audio/engine.mp3",
    tags: ["MORNING", "BLOCKADE"],
    onEnter: { set: { day: 6 } },
    pages: [
      "第六天，17 号高速在一座旧桥前断开。",
      "桥面被废车和水泥墩堵住，旁边的维修坡道几乎被泥水冲垮。",
      "绕路会消耗燃油，硬闯会伤车，等待只会让感染，和人群靠近。",
    ],
    choices: [
      {
        text: "靠近封锁。",
        risk: "medium",
        effects: { fuel: -1, flags: { day6_destination: "blocked_bridge" } },
        next: "day6_blocked_bridge",
      },
    ],
  },

  day6_blocked_bridge: {
    id: "day6_blocked_bridge",
    type: "crisis-screen",
    title: "Day 6｜封锁桥",
    day: 6,
    location: "旧桥封锁线",
    background: "images/scenes/grey_highway.png",
    ambience: "audio/engine.mp3",
    tags: ["CRISIS", "VEHICLE"],
    pages: [
      "桥头堆着几十辆废车，灰雾从桥面下方升上来，能见度很低。",
      {
        when: { saved_mechanic: true },
        text: "阿森看了看坡道，说：“能过，但悬挂会受伤。给我一点时间，我能让车轻一点。”",
      },
      {
        when: { saved_broadcaster: true },
        text: "老周说维修频道里提到过一条临时路线，但需要穿过桥下涵洞。",
      },
      "你必须决定什么过桥。",
    ],
    choices: [
      {
        text: "让阿森临时改车",
        risk: "medium",
        condition: { saved_mechanic: true },
        effects: { parts: -2, vehicle: 8, trust: 4, noise: 4 },
        next: "day6_arsen_conflict",
      },
      {
        text: "走桥下涵洞",
        risk: "high",
        effects: { fuel: -1, infection: 5, vehicle: -4, broadcast_truth: 1 },
        next: "day6_rain_leak",
      },
      {
        text: "直接冲过废车缝隙",
        risk: "high",
        effects: { vehicle: -15, noise: 12, fuel: -1 },
        next: "day6_rain_leak",
      },
    ],
  },

  day6_arsen_conflict: {
    id: "day6_arsen_conflict",
    type: "character-screen",
    title: "Day 6｜阿森的伤",
    day: 6,
    location: "桥头维修坡",
    background: "images/scenes/grey_highway.png",
    ambience: "audio/ambient.mp3",
    tags: ["COMPANION", "INFECTION"],
    pages: [
      "阿森钻进车底修悬挂时，纱布终于松开了。",
      "伤口比你想象得更糟，皮肤边缘发黑，像旧咬痕，又像被铁片划烂后感染。",
      {
        when: { saved_doctor: true },
        text: "陈医生蹲下检查，声音压得很低：“他一直在忍。现在不处理，今晚可能就会烧起来。”",
      },
      "阿森抬头看你：“我能把车修过去。别因为这点伤把我扔下。”",
    ],
    choices: [
      {
        text: "让陈医生处理伤口",
        risk: "medium",
        condition: { saved_doctor: true },
        effects: { medicine: -1, infection: -5, trust: 6 },
        next: "day6_rain_leak",
      },
      {
        text: "相信阿森，先过桥",
        risk: "high",
        effects: { infection: 7, vehicle: 5, trust: 2 },
        next: "day6_rain_leak",
      },
      {
        text: "要求阿森下车隔离",
        risk: "high",
        effects: { saved_mechanic: false, cold: 4, trust: -12, hope: -5 },
        next: "day6_rain_leak",
      },
    ],
  },

  day6_rain_leak: {
    id: "day6_rain_leak",
    type: "crisis-screen",
    title: "Day 6｜漏雨的车顶",
    day: 6,
    location: "桥后山路",
    background: "images/scenes/rv_interior_night.png",
    ambience: "audio/rain.mp3",
    tags: ["RAIN", "RESOURCE"],
    pages: [
      "过桥后，暴雨突然砸下来。",
      "房车车顶旧裂缝开始漏水，水顺着灯线滴进储物柜，罐头没事，但电池和药品都不能被泡。",
      "你们只能在雨里处理这个麻烦。",
    ],
    choices: [
      {
        text: "用零件和防水布修补",
        risk: "low",
        effects: { parts: -1, vehicle: 3, battery: 1 },
        next: "day6_night",
      },
      {
        text: "先保护药品",
        risk: "medium",
        effects: { medicine: 1, battery: -1, morale: -2 },
        next: "day6_night",
      },
      {
        text: "不停车，冲出雨区",
        risk: "high",
        effects: { fuel: -1, vehicle: -8, noise: 6 },
        next: "day6_night",
      },
    ],
  },

  day6_night: {
    id: "day6_night",
    type: "night-screen",
    title: "Day 6｜夜晚结算",
    day: 6,
    location: "桥后避风处",
    background: "images/scenes/rv_interior_night.png",
    ambience: "audio/rain.mp3",
    tags: ["NIGHT SETTLEMENT"],
    onEnter: { nightSettlement: true },
    pages: [
      "第六夜，房车停在桥后的避风处。",
      "明天就是主线封锁口，广播说那里通往净区，老周的记录却说那里只通往筛选线。",
      "你们已经没有太多路可以走了。",
    ],
    choices: [
      {
        text: "进入第 7 天",
        risk: "high",
        effects: { flags: { entered_day7: true } },
        next: "day7_morning",
      },
    ],
  },

  day7_morning: {
    id: "day7_morning",
    type: "road-screen",
    title: "Day 7｜最终封锁线",
    day: 7,
    location: "17 号高速主线",
    background: "images/scenes/grey_highway.png",
    ambience: "audio/engine.mp3",
    tags: ["FINAL DAY", "ROAD"],
    onEnter: { set: { day: 7 } },
    pages: [
      "第七天早上，天空像一张压低的灰色布。",
      "远处出现高墙、探照灯和横在高速上的钢制闸门，广播里的声音变得异常清楚：“幸存者请保持队列，接受净化检查。”",
      "车里没有人说话，每个人都知道，这不是普通检查。",
    ],
    choices: [
      {
        text: "驶向最终封锁线",
        risk: "high",
        effects: { fuel: -1, hope: 2 },
        next: "day7_final_blockade",
      },
    ],
  },

  day7_final_blockade: {
    id: "day7_final_blockade",
    type: "crisis-screen",
    title: "Day 7｜净区闸门",
    day: 7,
    location: "主线封锁口",
    background: "images/scenes/infected_raid.png",
    ambience: "audio/radio.mp3",
    tags: ["FINAL", "BLOCKADE"],
    pages: [
      "封锁口外停着上百辆车。有人排队，有人哭，有人试图掉头却被后面的车堵死。",
      "高墙上方的广播重复命令：“携带感染风险者将被分流，未登记人员不得进入。”",
      {
        when: { saved_broadcaster: true },
        text: "老周把耳机摘下：“他们在骗排队的人，主门不是入口，是筛选线。”",
      },
      {
        when: { broadcast_truth: { min: 5 } },
        text: "你已经掌握了足够多的频率、路标和记录。也许能避开主门。",
      },
      "你必须做最后的决定。",
    ],
    choices: [
      {
        text: "交出部分物资，排队进入",
        risk: "medium",
        effects: { food: -2, water: -2, fuel: -1, trust: -2 },
        next: "day7_pay_supplies",
      },
      {
        text: "撞开侧门硬闯",
        risk: "high",
        effects: { vehicle: -22, noise: 25, cold: 3 },
        next: "day7_hard_break",
      },
      {
        text: "用广播真相谈判",
        risk: "unknown",
        condition: { broadcast_truth: { min: 3 } },
        effects: { broadcast_truth: 1, trust: 4, hope: 3 },
        next: "day7_negotiate",
      },
      {
        text: "牺牲一部分人换通行",
        risk: "high",
        effects: { cold: 5, trust: -15, hope: -8 },
        next: "day7_sacrifice",
      },
    ],
  },

  day7_pay_supplies: {
    id: "day7_pay_supplies",
    type: "crisis-screen",
    title: "Day 7｜排队",
    day: 7,
    location: "净区外侧车队",
    background: "images/scenes/infected_raid.png",
    ambience: "audio/radio.mp3",
    tags: ["FINAL", "QUEUE"],
    pages: [
      "你交出一部分物资，换来一张临时通行纸。",
      "队伍移动得很慢。每隔一段时间，就有人被带离车辆。广播把这叫“复查。”",
      "你看着前方的探照灯，突然意识到，活到这里并不等于抵达。",
    ],
    choices: [
      {
        text: "接受检查，等待命运",
        risk: "unknown",
        effects: { infection: 5, morale: -5, flags: { final_route: "queue" } },
        next: "day7_ending_judge",
      },
    ],
  },

  day7_hard_break: {
    id: "day7_hard_break",
    type: "crisis-screen",
    title: "Day 7｜硬闯",
    day: 7,
    location: "封锁线侧门",
    background: "images/scenes/infected_raid.png",
    ambience: "audio/engine.mp3",
    tags: ["FINAL", "VEHICLE"],
    pages: [
      "你踩下油门，房车撞上侧门，金属声在灰雾里炸开。",
      "探照灯立刻转向你们，后方车队也被惊动。有人跟着冲，有人被挤翻。",
      "车身剧烈摇晃。现在只能看房车还能撑多久。",
    ],
    choices: [
      {
        text: "继续冲出封锁线",
        risk: "high",
        effects: { fuel: -1, vehicle: -10, trust: -3, flags: { final_route: "breakthrough" } },
        next: "day7_ending_judge",
      },
    ],
  },

  day7_negotiate: {
    id: "day7_negotiate",
    type: "character-screen",
    title: "Day 7｜公开广播",
    day: 7,
    location: "封锁线外",
    background: "images/scenes/grey_highway.png",
    ambience: "audio/radio.mp3",
    tags: ["FINAL", "TRUTH"],
    pages: [
      "你们。71.3 的记录，服务区频率和广播站留言串在一起。",
      {
        when: { saved_broadcaster: true },
        text: "老周把频道切到公开频段，声音发颤却清楚：“主门会分流幸存者，沿维修线北上，别进闸门。”",
      },
      {
        when: { saved_broadcaster: false },
        text: "你用旧接收机播放记录。声音断断续续，但足够让排队的人听见几个关键词。",
      },
      "人群开始骚动，封锁线短暂混乱，你们看见一条，往北侧维修线的空隙。",
    ],
    choices: [
      {
        text: "带队驶向维修线",
        risk: "medium",
        effects: { broadcast_truth: 2, hope: 6, trust: 5, flags: { final_route: "truth_route" } },
        next: "day7_ending_judge",
      },
    ],
  },

  day7_sacrifice: {
    id: "day7_sacrifice",
    type: "crisis-screen",
    title: "Day 7｜代价",
    day: 7,
    location: "封锁线检查棚",
    background: "images/scenes/infected_raid.png",
    ambience: "audio/radio.mp3",
    tags: ["FINAL", "SACRIFICE"],
    pages: [
      "检查棚里的人不关心你们从哪里来，只问车里有几个人，有没有发烧、有没有被咬。",
      "他们暗示，只要车上少几个“风险人员，，其余人就能快一点，过。",
      "这个世界已经给过你很多坏选择，但这一次，坏选择会留下名字。",
    ],
    choices: [
      {
        text: "拒绝他",
        risk: "high",
        effects: { fuel: -2, hope: -2, trust: 4, flags: { refused_sacrifice: true } },
        next: "day7_sacrifice_result",
      },
      {
        text: "接受交易",
        risk: "high",
        effects: { cold: 6, trust: -20, hope: -10, flags: { accepted_sacrifice: true } },
        next: "day7_sacrifice_result",
      },
    ],
  },

  day7_sacrifice_result: {
    id: "day7_sacrifice_result",
    type: "crisis-screen",
    title: "Day 7｜留下的座位",
    day: 7,
    location: "净区边缘",
    background: "images/scenes/infected_raid.png",
    ambience: "audio/radio.mp3",
    tags: ["FINAL", "CONSEQUENCE"],
    pages: [
      {
        when: { "flags.accepted_sacrifice": true },
        text: "房车里空出一个座位，没有人提那个名字，车轮碾过闸门后的白线时，你听见自己心里某个地方也被碾碎了。",
      },
      {
        when: { "flags.refused_sacrifice": true },
        text: "你们掉头离开主门。身后有人骂你愚蠢，也有人跟着你驶向灰雾，你不知道这是不是活路，但至少车上没有空出来的座位。",
      },
    ],
    choices: [
      {
        text: "面对结局",
        risk: "unknown",
        effects: { flags: { final_route: "sacrifice_branch" } },
        next: "day7_ending_judge",
      },
    ],
  },

  day7_ending_judge: {
    id: "day7_ending_judge",
    type: "ending-screen",
    title: "Day 7｜结局判定",
    day: 7,
    location: "净区边缘",
    background: "images/scenes/grey_highway.png",
    ambience: "audio/radio.mp3",
    tags: ["ENDING JUDGE"],
    onEnter: { endingJudge: true },
    pages: ["你的选择、资源，同伴和隐藏线索正在决定房车驶向哪里。"],
    choices: [],
  },

  ending_vehicle_failure: endingScene({
    id: "ending_vehicle_failure",
    title: "结局｜熄火在灰雾中",
    pages: [
      "房车没有撑到最后，引擎在封锁线外彻底熄火，车身像一块被世界遗忘的铁。",
      "你们还活着，但北方净区已经不再是今晚能抵达的地方。",
    ],
  }),

  ending_broadcast_truth: endingScene({
    id: "ending_broadcast_truth",
    title: "结局｜另一条频率",
    pages: [
      "你们没有进入主门。凭借收集到的频率和记录，房车沿维修线驶向北侧山谷。",
      "身后有人跟着你们离开队列。广播还在撒谎，但至少这一次，你们没有只听它的。",
      "老周说，真正的安全区也许还很远，你看着仪表盘上的绿色微光，第一次觉得远方不是空话。",
    ],
  }),

  ending_ruthless_survival: endingScene({
    id: "ending_ruthless_survival",
    title: "结局｜只剩生存",
    pages: [
      "你活过了第七天。",
      "车里很安静，不是因为安全，而是因为太多话已经没有人愿意说。",
      "你保存了资源，也丢掉了一些比资源更难补回来的东西。",
    ],
  }),

  ending_temporary_family: endingScene({
    id: "ending_temporary_family",
    title: "结局｜临时家人",
    pages: [
      "房车驶过封锁线外的灰雾时，车里每个人都还在。",
      "食物不多，油也不满，但有人会修车，有人会包扎，有人会监听广播，有人还会在夜里提醒大家不要忘记名字。",
      "这不是真正的终点，只是你们决定一起走下去的地方。",
    ],
  }),

  ending_lone_road: endingScene({
    id: "ending_lone_road",
    title: "结局｜孤路向北",
    pages: [
      "第七天结束时，房车仍在向北。",
      "你没有得到明确的答案，也没有完全失去希望。路标被灰尘盖住，广播还在远处闪烁。",
      "有些旅程不是抵达，，是不断选择还能相信什么。",
    ],
  }),

  game_over_water: gameOverScene("game_over_water", "失败｜水耗尽", "水箱空了。没有水，房车里的争执比外面的灰雾更快吞掉你们。"),
  game_over_food: gameOverScene("game_over_food", "失败｜食物耗尽", "最后一包压缩饼干被分完后，谁都没有力气再谈北方净区。"),
  game_over_fuel: gameOverScene("game_over_fuel", "失败｜燃油耗尽", "油表归零。你们停在 17 号高速旁，听着广播一遍遍说前方仍有希望。"),
  game_over_vehicle: gameOverScene("game_over_vehicle", "失败｜车毁", "房车彻底坏在路边。没有车，所有计划都变成了徒步穿过灰潮。"),
  game_over_infection: gameOverScene("game_over_infection", "失败｜感染失控", "发烧、咳血、昏迷。等你意识到感染已经压不住时，车里已经没有足够清醒的人继续开车。"),

  endless_start: {
    id: "endless_start",
    type: "road-screen",
    title: "第 8 天之后",
    day: 8,
    location: "17 号高速之后",
    background: "images/scenes/grey_highway.png",
    ambience: "audio/engine.mp3",
    tags: ["ENDLESS ROAD"],
    onEnter: {
      set: { day: 8, endless_day: 1 },
      ensureMin: { food: 5, water: 5, fuel: 4, parts: 2 },
      clampMax: { vehicle: 85 },
      flags: { endless_mode: true },
    },
    pages: [
      "你们穿过第七夜的封锁线后，在几辆废车里找到一点别人没带走的物资。",
      "这不是救援，只是让房车还能撑到下一个补给点。",
      "从这里开始，没有固定终点。每一天都是行动，夜晚，风险和下一段路。",
    ],
    choices: [
      {
        text: "继续驶入无尽公路",
        risk: "unknown",
        effects: { flags: { entered_endless_mode: true } },
        next: "endless_action_select",
      },
    ],
  },

  endless_action_select: {
    id: "endless_action_select",
    type: "endless-action-screen",
    title: "无尽公路｜今日行动",
    day: 8,
    location: "无尽高速",
    background: "images/scenes/grey_highway.png",
    ambience: "audio/engine.mp3",
    tags: ["ENDLESS", "ACTION POINT 1"],
    pages: [
      "你握着方向盘，看向前方的雾。",
      "无尽模式中，每天只能选择一项主要行动，行动之后会进入夜晚结算，并根据噪音、车况，感染和升级判定夜袭风险。",
      "长期压力不会立刻爆发，但每个小数字都会把明天推向不同方向。",
    ],
    choices: [
      {
        text: "沿高速前进",
        risk: "medium",
        effects: { fuel: -1, noise: 3, flags: { endless_last_action: "drive" } },
        next: "endless_highway",
      },
      {
        text: "寻找补给点",
        risk: "medium",
        effects: { fuel: -1, noise: 5, flags: { endless_last_action: "supply" } },
        next: "@endless_supply",
      },
      {
        text: "维修车辆",
        risk: "low",
        effects: { parts: -1, vehicle: 12, noise: 4, morale: 1, flags: { endless_last_action: "repair" } },
        next: "endless_repair",
      },
      {
        text: "休整",
        risk: "low",
        effects: { food: -1, water: -1, morale: 6, infection: -2, noise: -5, flags: { endless_last_action: "rest" } },
        next: "endless_rest",
      },
      {
        text: "监听广播",
        risk: "unknown",
        effects: { battery: -1, broadcast_truth: 1, hope: -1, noise: 2, flags: { endless_last_action: "radio" } },
        next: "endless_listen",
      },
      {
        text: "改装房车",
        risk: "low",
        effects: { flags: { endless_last_action: "upgrade" } },
        next: "endless_upgrade",
      },
    ],
  },

  endless_highway: {
    id: "endless_highway",
    type: "road-screen",
    title: "无尽公路｜继续上路",
    day: 8,
    location: "灰色高速",
    background: "images/scenes/grey_highway.png",
    ambience: "audio/engine.mp3",
    tags: ["ENDLESS", "ROAD"],
    pages: [
      "你没有在今天冒险进入建筑，只沿着高速继续向前。",
      "这节省了白天的麻烦，却让夜晚的停靠点变得更随机，远处的广告牌被风吹得咯吱作响。",
    ],
    choices: [
      {
        text: "进入夜晚",
        risk: "medium",
        effects: { flags: { endless_event: "highway" } },
        next: "endless_night",
      },
    ],
  },

  endless_repair: {
    id: "endless_repair",
    type: "endless-action-screen",
    title: "无尽公路｜维修车辆",
    day: 8,
    location: "路边临时维修点",
    background: "images/scenes/grey_highway.png",
    ambience: "audio/ambient.mp3",
    tags: ["ENDLESS", "REPAIR"],
    pages: [
      "你把车停在护栏旁，打开引擎盖，热气从水箱旁冒出来。",
      {
        when: { saved_mechanic: true },
        text: "阿森把扳手叼在嘴里，动作比你快得多，他说车还能继续撑，但不能每晚都这样。",
      },
      "维修消耗了零件，也制造了噪音。夜里最好别停在太开阔的地方。",
    ],
    choices: [
      {
        text: "进入夜晚",
        risk: "medium",
        effects: { flags: { endless_event: "repair" } },
        next: "endless_night",
      },
    ],
  },

  endless_rest: {
    id: "endless_rest",
    type: "endless-action-screen",
    title: "无尽公路｜短暂休整",
    day: 8,
    location: "桥洞阴影里",
    background: "images/scenes/rv_interior_night.png",
    ambience: "audio/rain.mp3",
    tags: ["ENDLESS", "REST"],
    pages: [
      "你们把房车停进桥洞阴影里，尽量不点灯。",
      "休整没有带来新物资，却让车里的人终于有机会闭上眼睛，疲惫会杢人，恐慌也会。",
    ],
    choices: [
      {
        text: "进入夜晚",
        risk: "low",
        effects: { flags: { endless_event: "rest" } },
        next: "endless_night",
      },
    ],
  },

  endless_listen: {
    id: "endless_listen",
    type: "endless-action-screen",
    title: "无尽公路｜监听广播",
    day: 8,
    location: "废弃收费站",
    background: "images/scenes/grey_highway.png",
    ambience: "audio/radio.mp3",
    tags: ["ENDLESS", "RADIO"],
    pages: [
      "你们把天线架在收费站顶棚上，接收机发出细小的电流声。",
      {
        when: { saved_broadcaster: true },
        text: "老周用铅笔在地图上标出几个新的避难频率，他说，有些假广播会在夜里诱导车队靠近陷阱。",
      },
      "每一点真相都会消耗电池，也可能让你们更难假装什么都不知道。",
    ],
    choices: [
      {
        text: "进入夜晚",
        risk: "medium",
        effects: { flags: { endless_event: "radio" } },
        next: "endless_night",
      },
    ],
  },

  endless_station_gas: supplyScene({
    id: "endless_station_gas",
    title: "无尽补给｜废弃加油站",
    location: "废弃加油站",
    background: "images/scenes/abandoned_gas_station.png",
    pages: [
      "你找到一座半塌的加油站，油泵早坏了，但地下罐还没完全空。",
      "抽油的声音会传很远，你们必须快。",
    ],
    effects: { fuel: 3, noise: 10 },
  }),

  endless_station_service: supplyScene({
    id: "endless_station_service",
    title: "无尽补给｜服务区残柜",
    location: "高速服务区",
    background: "images/scenes/service_area.png",
    pages: [
      "服务区早被洗劫过，自动售货机倒在地上。",
      "你们从后厨和员工柜里翻出几包没受潮的食物。",
    ],
    effects: { food: 3, water: 1, noise: 6 },
  }),

  endless_station_crash: supplyScene({
    id: "endless_station_crash",
    title: "无尽补给｜翻覆货车",
    location: "事故路段",
    background: "images/scenes/grey_highway.png",
    pages: [
      "一辆货车翻在路边，车厢里散落着工具箱和破损的车载电池。",
      "附近有拖拽痕迹，但暂时没有人影。",
    ],
    effects: { parts: 3, battery: 1, noise: 8 },
  }),

  endless_station_farm: supplyScene({
    id: "endless_station_farm",
    title: "无尽补给｜荒废农场",
    location: "高速旁农场",
    background: "images/scenes/service_area.png",
    pages: [
      "一座小农场被灰尘盖住，水井旁还有手摇泵。",
      "仓库里有干玉米和一点罐头，你们必须在天黑前离开。",
    ],
    effects: { food: 2, water: 3, infection: 2 },
  }),

  endless_station_water: supplyScene({
    id: "endless_station_water",
    title: "无尽补给｜水塔",
    location: "旧水塔",
    background: "images/scenes/grey_highway.png",
    pages: [
      "旧水塔还剩一点沉淢水，陈医生说需要煮开，阿森说先装走再说。",
      "风从水塔支架间穿过，发出像哨子一样的声音。",
    ],
    effects: { water: 4, infection: 3, noise: 4 },
  }),

  endless_station_garage: supplyScene({
    id: "endless_station_garage",
    title: "无尽补给｜汽修棚",
    location: "路边汽修店",
    background: "images/scenes/abandoned_gas_station.png",
    pages: [
      "路边汽修棚里还有千斤顶和旧轮胎。",
      "墙上贴着褪色的维修价目表，像灾难前最后一张笑话。",
    ],
    effects: { parts: 2, vehicle: 6, noise: 5 },
  }),

  endless_station_pharmacy: supplyScene({
    id: "endless_station_pharmacy",
    title: "无尽补给｜小药房",
    location: "路边药房",
    background: "images/scenes/service_area.png",
    pages: [
      "药房的货架倒了一半，柜台后面的锁箱还没被完全撬开。",
      "你们找到一些，烧药和消毒用品，但空气里有腐烂味。",
    ],
    effects: { medicine: 2, infection: -2, noise: 7 },
  }),

  endless_station_camp: supplyScene({
    id: "endless_station_camp",
    title: "无尽补给｜空营地",
    location: "高速旁空营地",
    background: "images/scenes/rv_interior_night.png",
    pages: [
      "营地里只剩冷掉的火堆和几只空罐头。",
      "有人走得很，，连一张写到一半的地图都没带走。",
    ],
    effects: { food: 1, water: 1, broadcast_truth: 1, hope: -1 },
  }),

  endless_night: {
    id: "endless_night",
    type: "night-screen",
    title: "无尽公路｜夜晚判定",
    day: 8,
    location: "临时停靠点",
    background: "images/scenes/rv_interior_night.png",
    ambience: "audio/rain.mp3",
    tags: ["ENDLESS", "NIGHT"],
    onEnter: { nightSettlement: true, raidCheck: true },
    pages: ["夜晚降下。系统正在结算消耗，并根据噪音，车况，感染，同伴和升级判定夜袭风险。"],
    choices: [],
  },

  endless_safe_night: {
    id: "endless_safe_night",
    type: "night-screen",
    title: "无尽公路｜安全夜",
    day: 8,
    location: "临时停靠点",
    background: "images/scenes/rv_interior_night.png",
    ambience: "audio/rain.mp3",
    tags: ["ENDLESS", "SAFE"],
    pages: [
      "这一夜没有袭击。",
      "你们轮流守夜，直到雾气被清晨的灰光稀释，下一天仍然不会更容易，但至少车还在，人也还在。",
    ],
    choices: [
      {
        text: "进入下一。",
        risk: "medium",
        effects: { day: 1, endless_day: 1, noise: -100, morale: 1, flags: { survived_last_night: true } },
        next: "endless_action_select",
      },
    ],
  },

  endless_raid: {
    id: "endless_raid",
    type: "crisis-screen",
    title: "无尽公路｜夜袭",
    day: 8,
    location: "临时停靠点",
    background: "images/scenes/infected_raid.png",
    ambience: "audio/rain.mp3",
    tags: ["ENDLESS", "RAID"],
    pages: [
      "半夜，车外响起拖拽金属的声音。",
      "不是风，有人，或，某些东西，正在靠近房车。",
      {
        when: { upgrade_watchtower: true },
        text: "车顶观察位让你提前看见了移动的影子，你们还有几秒钟准备。",
      },
      {
        when: { upgrade_door: true },
        text: "加固车门被撞得发闷，但没有立刻变形",
      },
      "你必须选择应对方式。",
    ],
    choices: [
      {
        text: "保持安静，熄灯等待",
        risk: "medium",
        effects: { morale: -2, noise: -10, infection: 2 },
        next: "endless_after_raid",
      },
      {
        text: "守住车门",
        risk: "high",
        effects: { vehicle: -4, infection: 4, trust: 2, noise: 8 },
        next: "endless_after_raid",
      },
      {
        text: "立刻发动冲出。",
        risk: "high",
        effects: { fuel: -2, vehicle: -8, noise: 12 },
        next: "endless_after_raid",
      },
      {
        text: "用火焰和噪音吓，它们",
        risk: "high",
        effects: { fuel: -1, parts: -1, noise: 20, morale: 3 },
        next: "endless_after_raid",
      },
    ],
  },

  endless_after_raid: {
    id: "endless_after_raid",
    type: "night-screen",
    title: "无尽公路｜夜袭之后",
    day: 8,
    location: "临时停靠点",
    background: "images/scenes/rv_interior_night.png",
    ambience: "audio/rain.mp3",
    tags: ["ENDLESS", "AFTERMATH"],
    pages: [
      "天快亮时，车外终于安静下来。",
      "你清点损失，把车门上的刮痕用布盖住，没人想问下一次会不会更近。",
    ],
    choices: [
      {
        text: "进入下一。",
        risk: "medium",
        effects: { day: 1, endless_day: 1, noise: -100, flags: { survived_last_raid: true } },
        next: "endless_action_select",
      },
    ],
  },

  endless_upgrade: {
    id: "endless_upgrade",
    type: "endless-action-screen",
    title: "无尽公路｜改装房车",
    day: 8,
    location: "路边维修点",
    background: "images/scenes/grey_highway.png",
    ambience: "audio/ambient.mp3",
    tags: ["ENDLESS", "UPGRADE"],
    pages: [
      "你把能用的零件摊在车厢地板上。每一次升级都会消耗零件，但能降低长期风险。",
      "升级不是胜利，只是把明天的坏消息往后推一点。",
    ],
    choices: [
      {
        text: "安装加固车门",
        risk: "low",
        condition: { parts: { min: 4 }, upgrade_door: false },
        effects: { parts: -4, upgrade_door: true, trust: 2 },
        next: "endless_upgrade",
      },
      {
        text: "调校静音引擎",
        risk: "low",
        condition: { parts: { min: 5 }, upgrade_engine: false },
        effects: { parts: -5, upgrade_engine: true, noise: -8, fuel: 1 },
        next: "endless_upgrade",
      },
      {
        text: "搭建简易医疗区",
        risk: "low",
        condition: { parts: { min: 4 }, upgrade_medbay: false },
        effects: { parts: -4, upgrade_medbay: true, infection: -5, trust: 2 },
        next: "endless_upgrade",
      },
      {
        text: "安装扩容储物柜",
        risk: "low",
        condition: { parts: { min: 3 }, upgrade_storage: false },
        effects: { parts: -3, upgrade_storage: true, food: 1, water: 1 },
        next: "endless_upgrade",
      },
      {
        text: "搭建车顶观察哨",
        risk: "low",
        condition: { parts: { min: 4 }, upgrade_watchtower: false },
        effects: { parts: -4, upgrade_watchtower: true, trust: 1, broadcast_truth: 1 },
        next: "endless_upgrade",
      },
      {
        text: "结束改装，进入夜。",
        risk: "medium",
        effects: { flags: { upgraded_today: true } },
        next: "endless_night",
      },
      {
        text: "返回行动选择",
        risk: "low",
        effects: { flags: { skipped_upgrade: true } },
        next: "endless_action_select",
      },
    ],
  },
};

export function getScene(id) {
  return SCENES[id] || SCENES.start_menu;
}

export function selectEndlessSupplyScene(state = {}) {
  if (state.water <= 3) return "endless_station_water";
  if (state.food <= 3) return "endless_station_farm";
  if (state.fuel <= 2) return "endless_station_gas";
  if (state.vehicle <= 45) return "endless_station_garage";
  if (state.infection >= 55 || state.medicine <= 1) return "endless_station_pharmacy";
  if (state.parts <= 2) return "endless_station_crash";

  const cycle = [
    "endless_station_service",
    "endless_station_camp",
    "endless_station_gas",
    "endless_station_garage",
    "endless_station_water",
    "endless_station_farm",
    "endless_station_pharmacy",
    "endless_station_crash",
  ];
  const index = Math.abs(Number(state.endless_day || state.day || 1)) % cycle.length;
  return cycle[index];
}

function endingScene({ id, title, pages }) {
  return {
    id,
    type: "ending-screen",
    title,
    day: 7,
    location: "灰色公路",
    background: "images/scenes/grey_highway.png",
    ambience: "audio/radio.mp3",
    tags: ["ENDING"],
    pages,
    choices: [
      {
        text: "继续进入无尽公路",
        risk: "unknown",
        effects: { flags: { continued_after_ending: true } },
        next: "endless_start",
      },
      {
        text: "返回主菜。",
        risk: "low",
        action: "menu",
        effects: { flags: { returned_to_menu_from_ending: true } },
        next: "start_menu",
      },
      {
        text: "重新开。",
        risk: "low",
        action: "restart",
        effects: { flags: { restarted_from_ending: true } },
        next: "day1_morning",
      },
    ],
  };
}

function gameOverScene(id, title, text) {
  return {
    id,
    type: "ending-screen",
    title,
    day: 0,
    location: "旅程终止",
    background: "images/scenes/rv_interior_night.png",
    ambience: "audio/rain.mp3",
    tags: ["GAME OVER"],
    pages: [text],
    choices: [
      {
        text: "重新开。",
        risk: "low",
        action: "restart",
        effects: { flags: { restarted_after_game_over: true } },
        next: "day1_morning",
      },
      {
        text: "返回主菜。",
        risk: "low",
        action: "menu",
        effects: { flags: { returned_to_menu_after_game_over: true } },
        next: "start_menu",
      },
    ],
  };
}

function supplyScene({ id, title, location, background, pages, effects }) {
  return {
    id,
    type: "scavenge-screen",
    title,
    day: 8,
    location,
    background,
    ambience: "audio/ambient.mp3",
    tags: ["ENDLESS", "SUPPLY"],
    pages,
    choices: [
      {
        text: "搜刮后进入夜。",
        risk: "medium",
        effects: { ...effects, flags: { endless_event: id } },
        next: "endless_night",
      },
      {
        text: "放弃补给，继续上。",
        risk: "low",
        effects: { fuel: -1, cold: 1, flags: { endless_event: `${id}_skipped` } },
        next: "endless_night",
      },
    ],
  };
}
