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
    background: "images/scenes/grey_highway.png",
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
    background: "images/scenes/survivor_encounter.png",
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
        text: "开车去加油",
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
      "这里可能有燃油，也可能有别人留下的陷阱，你要怎么搜？",
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
    background: "images/scenes/rv_breakdown.png",
    ambience: "audio/engine.mp3",
    tags: ["SYSTEM FAILURE", "WARNING"],
    pages: [
      "傍晚，你开车离开加油站。",
      "没过多久，房车突然剧烈抖动，仪表盘上的温度指针冲到红区。",
      "你把车停在路边，引擎盖下面冒出白烟。",
      {
        when: { saved_mechanic: true },
        text: "阿森皱着眉下车，打开引擎盖，他说：“水箱漏了，还能修，但要用零件。”他看起来很熟练，但他手臂上的纱布已经被汗浸湿。",
      },
      {
        when: { saved_mechanic: false },
        text: "你一个人站在车头前，你知道车坏了，但你不知道具体坏在哪里，风从高速路上吹过来，你突然觉得这辆房车比昨天更脆弱。",
      },
      "你要怎么处理？",
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
    background: "images/scenes/abandoned_house.png",
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
    background: "images/scenes/survivor_encounter.png",
    ambience: "audio/ambient.mp3",
    tags: ["COMPANION", "陈医生"],
    pages: [
      "女人自称陈医生，她说诊所已经撑不下去了，伤员有自己的家属会带走。",
      "她看了看你的房车，又看了看你手里的药箱：“你们要往北？那条路上会有人发烧，受伤，被咬。没有医生，车再好也没用。”",
      {
        when: { saved_child: true },
        text: "小满从车门后探出头，陈医生看到她，语气软了一点：“孩子不能再这样吃冷东西。”",
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
        text: "拒绝她",
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
        text: "小满缩在毯子里，小声问：“如果到了净区，他们会检查我们吗？”",
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
        text: "不用药，先熬过今晚",
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
        text: "陈医生在小桌边记录症状，她没有问你信不信她，只说：“明天尽量别进人多的地方。”",
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
    background: "images/scenes/service_area.png",
    ambience: "audio/engine.mp3",
    tags: ["MORNING", "SUPPLIES"],
    onEnter: { set: { day: 4 } },
    pages: [
      "第四天早上，水箱见底的声音比闹钟更早响起。",
      "前方有一处高速服务区。停车场里有火堆，有人影，还有临时搭起的路障。",
      "这不是空地方。里面有物资，也有规矩。",
      {
        when: { saved_child: true },
        text: "小满趴在窗边数那些火堆，数到一半停下来，问你是不是每一堆火旁边都有人在等别人回来。",
      },
      {
        when: { saved_doctor: true },
        text: "陈医生提醒你，越是有人聚集的地方，越要留意咳嗽、发热和不愿意露出手臂的人。",
      },
    ],
    choices: [
      {
        text: "进入服务区",
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
      "入口处有人检查车辆。一个戴红袖章的男人说：“不换就走，别在这里乱翻。”",
      {
        when: { saved_mechanic: true },
        text: "阿森压低帽檐，先看路障和出口，再看那些人的手。他说真正危险的不是枪，是他们已经把停车场当成了自己的地盘。",
      },
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
        text: "趁乱偷一批食物",
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
      {
        when: { saved_doctor: true },
        text: "陈医生没有碰那包药，她只检查封口和日期，然后把其中一盒放到最容易拿到的位置。",
      },
      {
        when: { saved_mechanic: true },
        text: "阿森换到一小卷绝缘胶带，嘴上说不值，手却一直攥着没放。",
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
      "脚步声越来越近，你必须决定怎么脱身。",
      {
        when: { saved_mechanic: true },
        text: "阿森握紧扳手，站到车门旁边，眼睛一直盯着最近的出口。",
      },
      {
        when: { saved_doctor: true },
        text: "陈医生把药箱塞进座椅下面，提醒你别让争执变成流血。",
      },
      {
        when: { saved_child: true },
        text: "小满缩到桌子下面，努力不发出声音，手里还攥着那半块面包。",
      },
    ],
    choices: [
      {
        text: "承认偷拿并交回一部分",
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
        text: "把责任推给别人",
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
    background: "images/scenes/supply_storage_room.png",
    ambience: "audio/ambient.mp3",
    tags: ["TRUTH", "MORALE"],
    pages: [
      "你发现失窃的不止是一箱罐头，还有一台小型发报机。",
      "仓库角落的墙上写着一串频率：71.3。旁边有人用炭笔画了一个向北的箭头。",
      {
        when: { saved_mechanic: true },
        text: "阿森拆开那台发报机看了一眼，说它不像临时拼出来的东西，倒像有人专门藏在这里等人发现。",
      },
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
      {
        when: { saved_child: true },
        text: "小满问，如果大家都饿，是不是偷东西就不算坏。没人立刻回答她。",
      },
      {
        when: { saved_doctor: true },
        text: "陈医生把白天换来的药重新分类，声音很轻：“规矩坏掉以后，最先坏掉的是人怎么称呼自己。”",
      },
      "你把 71.3 这个频率写进日志。广播里那句“北方净区仍在接收幸存者。”突然显得没那么简单。",
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
      "除了净区的循环播报，你听见另一个被压在底下的声音：“不要走 17 号主线，重复，不要走主线。”",
      {
        when: { saved_child: true },
        text: "小满把音量调小一点，她说那个声音不像广播，更像有人躲在很远的地方求你别走错路。",
      },
      {
        when: { saved_mechanic: true },
        text: "阿森盯着仪表盘，问你如果主线真是陷阱，油箱里的每一格是不是都该重新算。",
      },
      "路边出现一座废弃广播站。天线折了一半，但控制室里仍有微弱的绿色指示灯。",
    ],
    choices: [
      {
        text: "进入广播站",
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
      {
        when: { saved_doctor: true },
        text: "陈医生翻看那些车牌记录，脸色越来越差。她说这不像救援名单，更像分诊表。",
      },
      {
        when: { saved_child: true },
        text: "小满没有碰控制台，只把散落的纸按日期排好，像在替陌生人整理最后的证词。",
      },
      "纸上写着：净区不是终点，是筛选点。车队进入前会被分开。",
    ],
    choices: [
      {
        text: "修好接收机",
        risk: "medium",
        effects: { parts: -1, broadcast_truth: 2, battery: -1 },
        next: "day5_broadcaster",
      },
      {
        text: "拆走电池和线路",
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
        when: { saved_child: true },
        text: "小满把书包抱到胸前，一句话也不说，只用眼神问你那是不是来抓人的车。",
      },
      {
        when: { saved_broadcaster: true },
        text: "老周趴在收音机旁说：“他们在听公开频道。别回主路，走维修道。”",
      },
      {
        when: { saved_mechanic: true },
        text: "阿森已经把手搭在手刹旁边，低声报出两个能甩开追车的弯道。",
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
        when: { saved_child: true },
        text: "小满把旧地图摊开，在北方净区旁边画了一个小问号，又很快用手掌盖住。",
      },
      {
        when: { saved_broadcaster: true },
        text: "老周把耳机递给你。杂音深处，有人反复念着几个地名，像是在给还没放弃的人留路标。",
      },
      {
        when: { saved_doctor: true },
        text: "陈医生把那些地名抄到药盒背面。她说病人活下来以后，总要知道该往哪里走。",
      },
      {
        when: { saved_mechanic: true },
        text: "阿森把维修道标在地图边缘，算了三遍油耗，最后只说了一句：如果广播是真的，主路就是最贵的路。",
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
    background: "images/scenes/road_checkpoint.png",
    ambience: "audio/engine.mp3",
    tags: ["MORNING", "BLOCKADE"],
    onEnter: { set: { day: 6 } },
    pages: [
      "第六天，17 号高速在一座旧桥前断开。",
      "桥面被废车和水泥墩堵住，旁边的维修坡道几乎被泥水冲垮。",
      {
        when: { saved_mechanic: true },
        text: "阿森下车看了很久，回来说桥不是不能过，是车过完以后可能就不像车了。",
      },
      {
        when: { saved_doctor: true },
        text: "陈医生把每个人的体温又量了一遍，她比任何人都清楚，等待也在消耗你们。",
      },
      "绕路会消耗燃油，硬闯会伤车，等待只会让感染和人群靠近。",
    ],
    choices: [
      {
        text: "靠近封锁桥",
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
    background: "images/scenes/road_checkpoint.png",
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
      {
        when: { saved_child: true },
        text: "小满看着桥下的黑洞，问那里面会不会也有人住过。她问完就不再看那边。",
      },
      "你必须决定怎么过桥。",
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
    background: "images/scenes/rv_breakdown.png",
    ambience: "audio/ambient.mp3",
    tags: ["COMPANION", "INFECTION"],
    pages: [
      "阿森钻进车底修悬挂时，纱布终于松开了。",
      "伤口比你想象得更糟，皮肤边缘发黑，像旧咬痕，又像被铁片划烂后感染。",
      {
        when: { saved_doctor: true },
        text: "陈医生蹲下检查，声音压得很低：“他一直在忍。现在不处理，今晚可能就会烧起来。”",
      },
      {
        when: { saved_child: true },
        text: "小满站在车门边，想递水又不敢靠太近，只把瓶子放在阿森伸手能碰到的地方。",
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
    background: "images/scenes/storm_highway.png",
    ambience: "audio/rain.mp3",
    tags: ["RAIN", "RESOURCE"],
    pages: [
      "过桥后，暴雨突然砸下来。",
      "房车车顶旧裂缝开始漏水，水顺着灯线滴进储物柜，罐头没事，但电池和药品都不能被泡。",
      {
        when: { saved_mechanic: true },
        text: "阿森骂了一句，把工具箱挪到干处，第一反应还是去听发动机有没有进水。",
      },
      {
        when: { saved_doctor: true },
        text: "陈医生先护住药箱，她说药受潮之后，瓶子还在，能救人的东西就没了。",
      },
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
      {
        when: { saved_broadcaster: true },
        text: "老周反复校准 71.3，直到旋钮边缘磨得发亮。他说如果明天要赌，就至少别赌在假信号上。",
      },
      {
        when: { saved_child: true },
        text: "小满睡得很浅，每次广播响起都会睁眼，像怕错过某个能证明父母还活着的名字。",
      },
      {
        when: { saved_mechanic: true },
        text: "阿森没有睡，他把车底能拧紧的地方又拧了一遍。明天如果要冲，房车不能在最需要它的时候散架。",
      },
      {
        when: { saved_doctor: true },
        text: "陈医生把发热的人名写在纸角，又把纸角折进掌心。她没有宣布谁是风险，只提醒你明天别让别人替你们命名。",
      },
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
    background: "images/scenes/road_checkpoint.png",
    ambience: "audio/engine.mp3",
    tags: ["FINAL DAY", "ROAD"],
    onEnter: { set: { day: 7 } },
    pages: [
      "第七天早上，天空像一张压低的灰色布。",
      "远处出现高墙、探照灯和横在高速上的钢制闸门，广播里的声音变得异常清楚：“幸存者请保持队列，接受净化检查。”",
      {
        when: { saved_doctor: true },
        text: "陈医生听到“净化检查”几个字时合上药箱，她没有解释，但车里的人都明白那不只是体温计。",
      },
      {
        when: { saved_mechanic: true },
        text: "阿森把安全带勒紧，手指在方向盘上敲了两下。他已经开始计算侧门、坡道和车身还能承受的角度。",
      },
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
    background: "images/scenes/road_checkpoint.png",
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
        when: { saved_child: true },
        text: "小满看见队伍里也有孩子，她下意识攥住书包带，像怕自己下一秒也会被叫走。",
      },
      {
        when: { saved_doctor: true },
        text: "陈医生盯着“感染风险者分流”的牌子，低声说，真正的隔离不会这样用喇叭喊给所有人听。",
      },
      {
        when: { broadcast_truth: { min: 5 } },
        text: "你已经掌握了足够多的频率、路标和记录。也许能避开主门。",
      },
      {
        when: { saved_mechanic: true },
        text: "阿森盯住侧门后方的维修坡，告诉你那条路窄、颠、会刮坏车身，但不像主门那样等着把人分开。",
      },
      {
        when: { trust: { max: 25 } },
        text: "车里的人在等你决定，却没有人再主动劝你。信任被消耗到这里，连沉默都带着防备。",
      },
      {
        when: { hope: { min: 60 } },
        text: "也有人还在相信你。不是因为广播，不是因为净区，只是因为这七天里你们真的一起活到了这里。",
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
    background: "images/scenes/road_checkpoint.png",
    ambience: "audio/radio.mp3",
    tags: ["FINAL", "QUEUE"],
    pages: [
      "你交出一部分物资，换来一张临时通行纸。",
      "队伍移动得很慢。每隔一段时间，就有人被带离车辆。广播把这叫“复查”。",
      {
        when: { saved_child: true },
        text: "小满盯着那些被带走的人，问复查是不是还会回来。你没有马上回答。",
      },
      {
        when: { saved_broadcaster: true },
        text: "老周把收音机关到最小声，耳机里传出的不是登记编号，而是一串被重复删除的车牌。",
      },
      {
        when: { saved_doctor: true },
        text: "陈医生看见检查棚后面的白色塑料帘，脸色变得很平。她说真正的救援不会把帘子拉得那么严。",
      },
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
    background: "images/scenes/road_checkpoint.png",
    ambience: "audio/engine.mp3",
    tags: ["FINAL", "VEHICLE"],
    pages: [
      "你踩下油门，房车撞上侧门，金属声在灰雾里炸开。",
      "探照灯立刻转向你们，后方车队也被惊动。有人跟着冲，有人被挤翻。",
      {
        when: { saved_mechanic: true },
        text: "阿森没有喊停，他只盯着仪表盘，告诉你再给车三秒，别在门框中间松油。",
      },
      {
        when: { saved_child: true },
        text: "小满把脸埋进书包里，还是伸出一只手去抓住旁边人的袖子。",
      },
      {
        when: { saved_doctor: true },
        text: "陈医生在颠簸中护住药箱，也护住小满的头。她没有喊你慢点，只问还有没有人受伤。",
      },
      {
        when: { saved_broadcaster: true },
        text: "老周把公开频道推到最大，告诉后面的车不要跟得太近。硬闯不是胜利，只是把混乱撕出一道口子。",
      },
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
    background: "images/scenes/road_checkpoint.png",
    ambience: "audio/radio.mp3",
    tags: ["FINAL", "TRUTH"],
    pages: [
      "你们把 71.3 的记录，服务区频率和广播站留言串在一起。",
      {
        when: { saved_broadcaster: true },
        text: "老周把频道切到公开频段，声音发颤却清楚：“主门会分流幸存者，沿维修线北上，别进闸门。”",
      },
      {
        when: { saved_broadcaster: false },
        text: "你用旧接收机播放记录。声音断断续续，但足够让排队的人听见几个关键词。",
      },
      {
        when: { saved_doctor: true },
        text: "陈医生把自己的证件夹进广播记录里。她说如果他们要一个证明，就给他们一个还愿意作证的人。",
      },
      {
        when: { saved_child: true },
        text: "小满站在车门边，把那些车牌号一辆辆念出来。她声音不大，却让队伍里几个人抬起了头。",
      },
      {
        when: { saved_mechanic: true },
        text: "阿森把车头转向维修线，脚没有离开刹车。他在等你最后一个手势，也在等后面的车决定要不要跟上。",
      },
      "人群开始骚动，封锁线短暂混乱，你们看见一条通往北侧维修线的空隙。",
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
    background: "images/scenes/road_checkpoint.png",
    ambience: "audio/radio.mp3",
    tags: ["FINAL", "SACRIFICE"],
    pages: [
      "检查棚里的人不关心你们从哪里来，只问车里有几个人，有没有发烧、有没有被咬。",
      "他们暗示，只要车上少几个“风险人员”，其余人就能快一点过。",
      {
        when: { saved_child: true },
        text: "小满听懂了“少几个”的意思，脸色一下白下去，却仍然没有松开书包带。",
      },
      {
        when: { saved_doctor: true },
        text: "陈医生站到车门前，声音冷得像刀：“把人叫风险，不会让这件事变成医疗决定。”",
      },
      "这个世界已经给过你很多坏选择，但这一次，坏选择会留下名字。",
    ],
    choices: [
      {
        text: "拒绝这个提议",
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
    background: "images/scenes/road_checkpoint.png",
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
      {
        when: { saved_broadcaster: true },
        text: "老周把广播调到公开频道，没有说英雄，也没有说胜利，只重复北侧维修线的位置，直到有人回了一声收到。",
      },
      {
        when: { saved_doctor: true },
        text: "陈医生把还在发抖的人按回座位。她说先别问对错，先确认所有还能呼吸的人都在车上。",
      },
      {
        when: { saved_child: true },
        text: "小满没有哭。她只是把空座位旁边的毯子叠起来，叠得很慢，像害怕动作太大就会承认那里真的空了。",
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
    background: "images/scenes/road_checkpoint.png",
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
      "房车最终停在封锁线外侧的灰雾里。引擎盖下只剩断断续续的热气，冷却液沿着保险杠往下滴，在尘土上留下很快变黑的痕迹。",
      {
        when: { saved_mechanic: true },
        text: "阿森跪在车头前，手里还攥着扳手。他没有说修不好，只是很久都没有再把引擎盖撑起来。",
      },
      {
        when: { "flags.final_route": "breakthrough" },
        text: "侧门的铁屑还卡在车头缝里，刚才那一下硬闯把最后一点车况也留在了闸门旁。",
      },
      {
        when: { vehicle: { max: 25 } },
        text: "这一路上，你每一次让它多撑一段，都是向未来借账。现在账单终于追上来了。",
      },
      {
        when: { saved_doctor: true },
        text: "陈医生把药箱放到车门边，像这样就能把所有还没来得及救的人也带下车。",
      },
      {
        when: { saved_child: true },
        text: "小满问还能不能等天亮再修。没有人回答她，因为每个人都听见远处灰雾里传来的声音越来越近。",
      },
      {
        when: { saved_broadcaster: true },
        text: "老周没有关掉广播。他让那一点杂音继续亮着，仿佛只要频率还在，路就还没有完全断。",
      },
      "高墙上的广播仍在重复接收幸存者。你们还活着，但今晚，北方净区只是远处一排模糊的灯。",
    ],
  }),

  ending_broadcast_truth: endingScene({
    id: "ending_broadcast_truth",
    title: "结局｜另一条频率",
    pages: [
      "你们没有驶向主门。房车贴着封锁墙阴影转入北侧维修线，轮胎碾过碎石时，身后的探照灯还在照向排队的人群。",
      {
        when: { saved_broadcaster: true },
        text: "老周把 71.3 调到公开频段，声音从杂音里挤出来：“别进闸门，沿维修线北上。”他的手在抖，但每一个字都清楚。",
      },
      {
        when: { saved_broadcaster: false },
        text: "旧接收机反复播放你们收集到的记录，声音断续，足够让几辆车从队列里慢慢掉头。",
      },
      {
        when: { saved_child: true },
        text: "小满趴在后窗，看见有车灯跟上来，轻轻数着一、二、三，像在确认不是只有你们听见了真相。",
      },
      {
        when: { saved_doctor: true },
        text: "陈医生把车窗摇下一条缝，对跟上来的车喊如果有人发热就别去主门。她的声音被风撕开，却还是传了出去。",
      },
      {
        when: { saved_mechanic: true },
        text: "阿森没有问这条路会不会更安全，只问后面的车能不能跟得上。第一次，他修的不只是你们这辆房车。",
      },
      {
        when: { "flags.final_route": "truth_route" },
        text: "封锁线后的喇叭声越来越乱。你们不是逃走，而是把一部分人从同一个谎言里拉了出来。",
      },
      "广播还在撒谎，但这一次，谎言没能盖住所有频率。远处山谷没有承诺安全，却第一次像一条真的路。",
    ],
  }),

  ending_ruthless_survival: endingScene({
    id: "ending_ruthless_survival",
    title: "结局｜只剩生存",
    pages: [
      "你活过了第七天。房车越过封锁线外的灰雾时，后视镜里没有人挥手，也没有人喊你的名字。",
      {
        when: { "flags.accepted_sacrifice": true },
        text: "车里空出来的座位比任何警报都响。它不消耗食物，不占用水，却让每一次转头都变得更冷。",
      },
      {
        when: { cold: { min: 10 } },
        text: "你保存了资源，保存了燃油，保存了能让人继续前进的数字。只是有些东西从表格里消失以后，就再也没法补回。",
      },
      {
        when: { trust: { max: 20 } },
        text: "没有人质问你。沉默比质问更重，压在车顶，压在每个人的呼吸之间。",
      },
      {
        when: { saved_child: false },
        text: "那条儿童毯子从来没有被展开过。它被塞在储物格最深处，像一个你一直没有回头看的岔路。",
      },
      {
        when: { saved_doctor: false },
        text: "药箱里剩下的东西还能止痛，却没有人再提醒你有些疼痛不该被当成成本。",
      },
      "远处确实还有路。你把手放回方向盘，却第一次不确定，活下来是不是已经足够称作胜利。",
    ],
  }),

  ending_temporary_family: endingScene({
    id: "ending_temporary_family",
    title: "结局｜临时家人",
    pages: [
      "房车驶过封锁线外的灰雾时，车里每个人都还在。车窗上沾着雨痕，仪表盘忽明忽暗，但后座传来的呼吸声让这辆旧车像一个还没塌掉的房间。",
      {
        when: { saved_child: true },
        text: "小满把那条儿童毯子叠好，放在所有人都能碰到的地方。她说这样晚上谁冷了都不用开口。",
      },
      {
        when: { saved_mechanic: true },
        text: "阿森把工具箱卡在车尾，嘴上说别高兴太早，手却已经开始检查下一段路要用的零件。",
      },
      {
        when: { saved_doctor: true },
        text: "陈医生把药箱重新固定在小桌边，给每个人都留下一张写着剂量的小纸条。",
      },
      {
        when: { saved_broadcaster: true },
        text: "老周守着收音机，给新的频率做标记。他没有再说净区，只说下一处能停靠的地方。",
      },
      {
        when: { "flags.refused_sacrifice": true },
        text: "你们没有用任何一个名字去换通行。这个决定让路更远，也让车里的人终于敢重新看向彼此。",
      },
      {
        when: { "flags.final_route": "truth_route" },
        text: "后方还有几辆车跟着。你们没有成为谁的救援队，却在灰潮里临时组成了一支会互相等候的队伍。",
      },
      {
        when: { trust: { min: 60 } },
        text: "没有人宣布你是领袖。只是当路口再次分叉时，大家会先看你，也会说出自己的意见。",
      },
      "这不是真正的终点。只是你们在世界散掉以后，仍然决定把彼此算进明天。",
    ],
  }),

  ending_lone_road: endingScene({
    id: "ending_lone_road",
    title: "结局｜孤路向北",
    pages: [
      "第七天结束时，房车仍在向北。封锁线和高墙被灰雾吞到身后，只剩路灯一盏盏从挡风玻璃上滑过去。",
      {
        when: { saved_child: false },
        text: "副驾驶后方的位置一直空着。偶尔车身颠簸，你会想起第一夜窗外那个小小的影子。",
      },
      {
        when: { saved_broadcaster: false },
        text: "收音机里还在闪着杂音，你不知道哪一句是真，哪一句是陷阱，只能把音量调低一点继续开。",
      },
      {
        when: { hope: { min: 35 } },
        text: "你没有得到答案，但也没有彻底放弃。地图上北方那片空白仍然刺眼，像是在等你亲自把它填上。",
      },
      {
        when: { saved_mechanic: false },
        text: "每次发动机抖动，你都会想起那个曾经能听懂它的人。现在车况只是数字，不再有人骂它还没到报废的时候。",
      },
      {
        when: { saved_doctor: false },
        text: "体温计滚在抽屉里，没有人再每天确认谁还撑得住。你学会了自己看伤口，却学不会判断什么时候该停下。",
      },
      {
        when: { "flags.final_route": "queue" },
        text: "你曾经离净区主门很近，近到能看清墙上的字。现在那些字被甩在身后，反而比任何路标都更像警告。",
      },
      "有些旅程不是抵达，是不断选择还能相信什么。夜色压下来时，房车的前灯仍然把路切开一小段。",
    ],
  }),

  game_over_water: gameOverScene("game_over_water", "失败｜水耗尽", [
    "水箱空了。最后几滴水从阀门里抖出来，落进杯底，声音轻得像一个不愿承认的句号。",
    {
      when: { saved_child: true },
      text: "小满把自己的杯子往前推，说她不渴。没有人相信她，但也没有人立刻把杯子推回去。",
    },
    {
      when: { saved_doctor: true },
      text: "陈医生让大家少说话，少动，少呼吸。她知道这不是治疗，只是在把崩溃往后挪。",
    },
    "没有水，房车里的争执比外面的灰雾更快吞掉你们。广播仍在说北方有接收点，可你们已经没有力气再相信下一公里。",
  ]),
  game_over_food: gameOverScene("game_over_food", "失败｜食物耗尽", [
    "最后一包压缩饼干被分完后，车里安静得只剩胃部空响。地图还摊在桌上，但没有人再主动去看。",
    {
      when: { saved_child: true },
      text: "小满把碎屑扫到掌心，认真得像在收集什么贵重的东西。她问明天是不是还能找到早餐。",
    },
    {
      when: { saved_mechanic: true },
      text: "阿森说车还能走，可车能走不代表人也能。说完这句，他自己先沉默下来。",
    },
    "饥饿把所有计划磨成很薄的一层纸。北方净区还在广播里，却已经不在你们的脚步里。",
  ]),
  game_over_fuel: gameOverScene("game_over_fuel", "失败｜燃油耗尽", [
    "油表归零。房车在 17 号高速旁慢慢滑停，车头还朝着北方，像是不肯承认自己已经走不动。",
    {
      when: { saved_mechanic: true },
      text: "阿森敲了敲油箱，听见空响后没有骂人。他靠着车身坐下，手上全是油泥，却再也拧不出一公里。",
    },
    {
      when: { saved_broadcaster: true },
      text: "老周把广播调低。那句“前方仍有希望”还在循环，听起来第一次不像谎言，而像一种迟到的嘲弄。",
    },
    "你们停在高速旁，听着远处车队一点点离开。希望还在前方，只是不再属于这辆车。",
  ]),
  game_over_vehicle: gameOverScene("game_over_vehicle", "失败｜车毁", [
    "房车彻底坏在路边。车身最后一次震动后，所有灯一起暗下去，像这一路被迫维持的勇气也断了电。",
    {
      when: { saved_mechanic: true },
      text: "阿森把工具一件件摆开，又一件件收回去。他终于承认，不是每个坏掉的东西都能靠零件救回来。",
    },
    {
      when: { saved_child: true },
      text: "小满站在车门边，不知道该把这里当成家，还是当成一具已经不会动的外壳。",
    },
    "没有车，所有计划都变成了徒步穿过灰潮。你们还可以下车，但已经很难再称那叫继续旅程。",
  ]),
  game_over_infection: gameOverScene("game_over_infection", "失败｜感染失控", [
    "发烧、咳血、昏迷。等你意识到感染已经压不住时，车里已经没有足够清醒的人继续开车。",
    {
      when: { saved_doctor: true },
      text: "陈医生把最后一支药推进针管，停了很久才下手。她知道那只能争取时间，而时间已经不站在你们这边。",
    },
    {
      when: { saved_broadcaster: true },
      text: "老周关掉广播，车里第一次完全没有声音。没有命令，没有路线，也没有谁能把坏消息说得更好听。",
    },
    "灰潮没有立刻吞没你们。它只是坐在车窗外等待，等每一次呼吸都变成更沉的雾。",
  ]),

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
      {
        when: { saved_child: true },
        text: "小满在废车后座找到一只褪色的玩具车，她看了很久，最后还是把它留在原处。",
      },
      {
        when: { saved_mechanic: true },
        text: "阿森把找到的油管和螺丝分门别类装好，像是在给一段没有终点的路做最小的准备。",
      },
      {
        when: { saved_doctor: true },
        text: "陈医生清点药品时没有说够不够，只在本子上写下每个人最近一次发热的时间。",
      },
      {
        when: { saved_broadcaster: true },
        text: "老周把天线重新固定在车顶。他说过了第七天，假广播也不会自动消失。",
      },
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
      {
        when: { saved_broadcaster: true },
        text: "老周把今天能收到的频率排成三列：可信、可疑、太安静。最后一列反而最让人不安。",
      },
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
      {
        when: { saved_child: true },
        text: "小满把路边的出口牌念出来，像这样就能证明世界还按某种顺序排列。",
      },
      {
        when: { saved_doctor: true },
        text: "陈医生让车里的人轮流喝水，她说长时间沉默也会让人忘记自己已经脱水。",
      },
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
    background: "images/scenes/rv_breakdown.png",
    ambience: "audio/ambient.mp3",
    tags: ["ENDLESS", "REPAIR"],
    pages: [
      "你把车停在护栏旁，打开引擎盖，热气从水箱旁冒出来。",
      {
        when: { saved_mechanic: true },
        text: "阿森把扳手叼在嘴里，动作比你快得多，他说车还能继续撑，但不能每晚都这样。",
      },
      {
        when: { saved_doctor: true },
        text: "陈医生站在车尾观察四周，她不懂发动机，但她知道人在太专心修东西时最容易忽略背后的声音。",
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
    background: "images/scenes/roadside_camp_night.png",
    ambience: "audio/rain.mp3",
    tags: ["ENDLESS", "REST"],
    pages: [
      "你们把房车停进桥洞阴影里，尽量不点灯。",
      {
        when: { saved_child: true },
        text: "小满终于睡沉了一会儿，手还搭在书包上，像那里装着比食物更重要的东西。",
      },
      {
        when: { saved_mechanic: true },
        text: "阿森没有真正休息，他闭着眼听发动机冷却的声音，偶尔伸手摸一下工具箱。",
      },
      "休整没有带来新物资，却让车里的人终于有机会闭上眼睛，疲惫会拖垮人，恐慌也会。",
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
    background: "images/scenes/road_checkpoint.png",
    ambience: "audio/radio.mp3",
    tags: ["ENDLESS", "RADIO"],
    pages: [
      "你们把天线架在收费站顶棚上，接收机发出细小的电流声。",
      {
        when: { saved_broadcaster: true },
        text: "老周用铅笔在地图上标出几个新的避难频率，他说，有些假广播会在夜里诱导车队靠近陷阱。",
      },
      {
        when: { saved_child: true },
        text: "小满问那些没有人回应的频率，是不是代表他们已经到了安全的地方。老周没有马上回答。",
      },
      {
        when: { saved_doctor: true },
        text: "陈医生把电池消耗记进药品清单旁边，她说真相也需要预算。",
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
    background: "images/scenes/rv_breakdown.png",
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
    background: "images/scenes/abandoned_house.png",
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
      "旧水塔还剩一点浑水，水桶底部有灰色沉淀，你们必须在天黑前决定要不要带走。",
      {
        when: { saved_doctor: true },
        text: "陈医生检查水桶内壁，要求至少煮开一次再分装。",
      },
      {
        when: { saved_mechanic: true },
        text: "阿森把软管接到最低的阀门上，说先装走，干净不干净路上再想办法。",
      },
      "风从水塔支架间穿过，发出像哨子一样的声音。",
    ],
    effects: { water: 4, infection: 3, noise: 4 },
  }),

  endless_station_garage: supplyScene({
    id: "endless_station_garage",
    title: "无尽补给｜汽修棚",
    location: "路边汽修店",
    background: "images/scenes/rv_breakdown.png",
    pages: [
      "路边汽修棚里还有千斤顶和旧轮胎。",
      {
        when: { saved_mechanic: true },
        text: "阿森在一堆废件里翻出半盒还能用的火花塞，表情像别人找到了罐头。",
      },
      "墙上贴着褪色的维修价目表，像灾难前最后一张笑话。",
    ],
    effects: { parts: 2, vehicle: 6, noise: 5 },
  }),

  endless_station_pharmacy: supplyScene({
    id: "endless_station_pharmacy",
    title: "无尽补给｜小药房",
    location: "路边药房",
    background: "images/scenes/abandoned_house.png",
    pages: [
      "药房的货架倒了一半，柜台后面的锁箱还没被完全撬开。",
      {
        when: { saved_doctor: true },
        text: "陈医生只拿她认得出批号的药，把几个标签泡烂的瓶子留在原地。",
      },
      "你们找到一些退烧药和消毒用品，但空气里有腐烂味。",
    ],
    effects: { medicine: 2, infection: -2, noise: 7 },
  }),

  endless_station_camp: supplyScene({
    id: "endless_station_camp",
    title: "无尽补给｜空营地",
    location: "高速旁空营地",
    background: "images/scenes/roadside_camp_day.png",
    pages: [
      "营地里只剩冷掉的火堆和几只空罐头。",
      {
        when: { saved_child: true },
        text: "小满在灰里找到半截铅笔，把它放进口袋，说也许以后还用得上。",
      },
      {
        when: { saved_broadcaster: true },
        text: "老周认出一张写到一半的频率表，上面的编号和他昨夜听到的求救信号对得上。",
      },
      "有人走得很急，连一张写到一半的地图都没带走。",
    ],
    effects: { food: 1, water: 1, broadcast_truth: 1, hope: -1 },
  }),

  endless_night: {
    id: "endless_night",
    type: "night-screen",
    title: "无尽公路｜夜晚判定",
    day: 8,
    location: "临时停靠点",
    background: "images/scenes/roadside_camp_night.png",
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
    background: "images/scenes/roadside_camp_night.png",
    ambience: "audio/rain.mp3",
    tags: ["ENDLESS", "SAFE"],
    pages: [
      "这一夜没有袭击。",
      {
        when: { saved_child: true },
        text: "小满醒来时先摸了摸车窗，确认外面没有新的手印。",
      },
      {
        when: { saved_doctor: true },
        text: "陈医生把昨夜的体温记录划掉一行，终于允许自己靠着椅背闭了几分钟眼。",
      },
      "你们轮流守夜，直到雾气被清晨的灰光稀释，下一天仍然不会更容易，但至少车还在，人也还在。",
    ],
    choices: [
      {
        text: "进入下一天",
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
      {
        when: { saved_child: true },
        text: "小满躲在桌子下面，捂着嘴不让自己出声，眼睛却一直看着车门。",
      },
      {
        when: { saved_mechanic: true },
        text: "阿森抓起撬棍顶住门栓，肩膀抵上去时，你听见他的伤口让他倒吸了一口气。",
      },
      {
        when: { saved_doctor: true },
        text: "陈医生把药箱踢到座椅后面，先确认每个人离窗户够远。",
      },
      {
        when: { saved_broadcaster: true },
        text: "老周关掉收音机，车里突然只剩撞击声和所有人的呼吸。",
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
        text: "立刻发动冲出去",
        risk: "high",
        effects: { fuel: -2, vehicle: -8, noise: 12 },
        next: "endless_after_raid",
      },
      {
        text: "用火焰和噪音吓退它们",
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
    background: "images/scenes/roadside_camp_night.png",
    ambience: "audio/rain.mp3",
    tags: ["ENDLESS", "AFTERMATH"],
    pages: [
      "天快亮时，车外终于安静下来。",
      {
        when: { saved_doctor: true },
        text: "陈医生一言不发地检查划伤和咬痕，直到确认没有新的发热迹象才松开手。",
      },
      {
        when: { saved_mechanic: true },
        text: "阿森蹲在车门旁看变形的铰链，说还能撑，但下一次最好别让它再被撞到这个角度。",
      },
      "你清点损失，把车门上的刮痕用布盖住，没人想问下一次会不会更近。",
    ],
    choices: [
      {
        text: "进入下一天",
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
    background: "images/scenes/rv_breakdown.png",
    ambience: "audio/ambient.mp3",
    tags: ["ENDLESS", "UPGRADE"],
    pages: [
      "你把能用的零件摊在车厢地板上。每一次升级都会消耗零件，但能降低长期风险。",
      {
        when: { saved_mechanic: true },
        text: "阿森把升级清单分成两类：能让车多活一天的，能让车里的人多活一天的。",
      },
      {
        when: { saved_doctor: true },
        text: "陈医生坚持留出一块干净角落做处理区，她说不是所有伤都能等到安全的时候再包扎。",
      },
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
        text: "结束改装，进入夜晚",
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
        text: "返回主菜单",
        risk: "low",
        action: "menu",
        effects: { flags: { returned_to_menu_from_ending: true } },
        next: "start_menu",
      },
      {
        text: "重新开始",
        risk: "low",
        action: "restart",
        effects: { flags: { restarted_from_ending: true } },
        next: "day1_morning",
      },
    ],
  };
}

function gameOverScene(id, title, pages) {
  return {
    id,
    type: "ending-screen",
    title,
    day: 0,
    location: "旅程终止",
    background: "images/scenes/rv_interior_night.png",
    ambience: "audio/rain.mp3",
    tags: ["GAME OVER"],
    pages: Array.isArray(pages) ? pages : [pages],
    choices: [
      {
        text: "重新开始",
        risk: "low",
        action: "restart",
        effects: { flags: { restarted_after_game_over: true } },
        next: "day1_morning",
      },
      {
        text: "返回主菜单",
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
        text: "搜刮后进入夜晚",
        risk: "medium",
        effects: { ...effects, flags: { endless_event: id } },
        next: "endless_night",
      },
      {
        text: "放弃补给，继续上路",
        risk: "low",
        effects: { fuel: -1, cold: 1, flags: { endless_event: `${id}_skipped` } },
        next: "endless_night",
      },
    ],
  };
}
