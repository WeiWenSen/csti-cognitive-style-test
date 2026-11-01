window.CSTI_DATA = (() => {
  const dimensions = [
    { id: "insight", name: "洞察", hint: "从细节里找隐藏线索" },
    { id: "reason", name: "推理", hint: "把线索接成因果链" },
    { id: "self", name: "自知", hint: "看见自己的动机和状态" },
    { id: "people", name: "读人", hint: "接住他人的情绪频道" },
    { id: "empathy", name: "换位", hint: "进入别人的处境看问题" },
    { id: "decision", name: "决断", hint: "信息不全也能往前选" },
    { id: "flex", name: "灵活", hint: "情况一变就换打法" },
    { id: "calibrate", name: "校准", hint: "让判断重新和证据对表" }
  ];

  const questions = [
    {
      id: "q01",
      shuffleOptions: true,
      text: "群里突然安静，你刚发了一句“要不就按这个来”。你会先：",
      options: [
        { id: "q01a", text: "看群里谁接着打圆场、谁一直没说话。", dim: "people" },
        { id: "q01b", text: "补一句“有异议现在说”，把话问实。", dim: "calibrate" },
        { id: "q01c", text: "撤回消息，换个更软的说法。", dim: "flex" }
      ]
    },
    {
      id: "q02",
      shuffleOptions: true,
      text: "周五18:20，你刚下班，老板发来：“有个小问题，十分钟？”你会先：",
      options: [
        { id: "q02a", text: "翻记录，看这个“小问题”到底多小。", dim: "insight" },
        { id: "q02b", text: "回“周一早处理”，先把周末保住。", dim: "decision" },
        { id: "q02c", text: "回“我先看下”，一边走一边判断。", dim: "flex" }
      ]
    },
    {
      id: "q03",
      shuffleOptions: true,
      text: "外卖差3元满减，你已经饿到不太想动。你会先：",
      options: [
        { id: "q03a", text: "看加购里哪个是商家凑单套路。", dim: "insight" },
        { id: "q03b", text: "随便加个能吃的，赶紧下单。", dim: "decision" },
        { id: "q03c", text: "换一家没有满减的，省得纠结。", dim: "flex" }
      ]
    },
    {
      id: "q04",
      shuffleOptions: true,
      text: "你给朋友发了消息，她一直没回，十分钟后却发了条朋友圈。你会先：",
      options: [
        { id: "q04a", text: "看朋友圈内容和评论，猜她忙不忙。", dim: "insight" },
        { id: "q04b", text: "想自己是不是问得太直接了。", dim: "self" },
        { id: "q04c", text: "再发一句“看到回我一下”。", dim: "decision" }
      ]
    },
    {
      id: "q05",
      shuffleOptions: true,
      text: "对象发来“行，你忙吧”，你刚加完班。你会先：",
      options: [
        { id: "q05a", text: "回“我十分钟后打给你”，接住情绪。", dim: "empathy" },
        { id: "q05b", text: "翻聊天记录，找哪句开始不对劲。", dim: "reason" },
        { id: "q05c", text: "先问自己现在还能不能好好说话。", dim: "self" }
      ]
    },
    {
      id: "q06",
      shuffleOptions: true,
      text: "明早要交的东西还没开始，现在已经十一点。你会先：",
      options: [
        { id: "q06a", text: "先想清楚自己到底在躲哪一步。", dim: "self" },
        { id: "q06b", text: "列个最小版本，今晚先交个能看的。", dim: "decision" },
        { id: "q06c", text: "估一下明早最多能挤出多少时间。", dim: "reason" }
      ]
    },
    {
      id: "q07",
      shuffleOptions: true,
      text: "购物车里两个颜色，你来回看了二十分钟。你会先：",
      options: [
        { id: "q07a", text: "看评论区哪种颜色更容易踩雷。", dim: "calibrate" },
        { id: "q07b", text: "问朋友哪件更适合我，省得瞎选。", dim: "empathy" },
        { id: "q07c", text: "两个都买，回家再退一个。", dim: "flex" }
      ]
    },
    {
      id: "q08",
      shuffleOptions: true,
      text: "你被拉进一个全是陌生人的群，群主说“大家都是朋友”。你会先：",
      options: [
        { id: "q08a", text: "看谁最先接群主的话、谁一直没吭声。", dim: "people" },
        { id: "q08b", text: "先潜水，等群里的规矩露出来。", dim: "calibrate" },
        { id: "q08c", text: "发个表情包，试探一下气氛。", dim: "flex" }
      ]
    },
    {
      id: "q09",
      shuffleOptions: true,
      text: "开会时老板说“这个方向再想想”，然后看着你。你会先：",
      options: [
        { id: "q09a", text: "从他语气判断，是嫌方案还是没想好。", dim: "people" },
        { id: "q09b", text: "马上给两个能现场选的方向。", dim: "flex" },
        { id: "q09c", text: "翻他前面的要求，找哪里对不上。", dim: "reason" }
      ]
    },
    {
      id: "q10",
      shuffleOptions: true,
      text: "朋友发来拼单链接：“就差你了，真的划算。”你并不需要。你会先：",
      options: [
        { id: "q10a", text: "想他是不是凑不够才来找我。", dim: "insight" },
        { id: "q10b", text: "按价格算一下，看是不是真划算。", dim: "reason" },
        { id: "q10c", text: "直接说“这次不买”，不绕弯子。", dim: "decision" }
      ]
    },
    {
      id: "q11",
      shuffleOptions: true,
      text: "群里突然发红包，你点开发现只有0.01元。你会先：",
      options: [
        { id: "q11a", text: "看手气最佳是谁，起哄让他接着发。", dim: "people" },
        { id: "q11b", text: "退出页面，假装自己根本没抢到。", dim: "self" },
        { id: "q11c", text: "点进详情，算算总数和人数对不对。", dim: "reason" }
      ]
    },
    {
      id: "q12",
      special: true,
      shuffleOptions: false,
      text: "本题没有题目。倒计时只剩三秒，你会先：",
      options: [
        { id: "q12a", text: "A，随便选一个，先过这一关。", dim: "decision" },
        { id: "q12b", text: "B，三个都点一下，看看啥反应。", dim: "flex" },
        { id: "q12c", text: "C，先猜这题想测什么，再选。", dim: "calibrate" }
      ]
    },
    {
      id: "q13",
      shuffleOptions: true,
      text: "外卖超时半小时，骑手说“马上到，别差评”。你会先：",
      options: [
        { id: "q13a", text: "看距离和路线，判断是不是真快到了。", dim: "insight" },
        { id: "q13b", text: "回“安全第一，我不会给差评”。", dim: "empathy" },
        { id: "q13c", text: "直接申请退款，今天不等了。", dim: "decision" }
      ]
    },
    {
      id: "q14",
      shuffleOptions: true,
      text: "你在群里开个玩笑，有人回“这话有点冒犯吧”。你会先：",
      options: [
        { id: "q14a", text: "看其他人怎么接，判断玩笑翻没翻车。", dim: "people" },
        { id: "q14b", text: "先把话收回，再解释自己没恶意。", dim: "empathy" },
        { id: "q14c", text: "先想自己是不是没拿准分寸。", dim: "self" }
      ]
    },
    {
      id: "q15",
      shuffleOptions: true,
      text: "你发帖吐槽某件东西，评论区来了个激烈反驳。你会先：",
      options: [
        { id: "q15a", text: "点他主页，看他是不是利益相关。", dim: "insight" },
        { id: "q15b", text: "回一句“你说得也有道理”，先降火。", dim: "flex" },
        { id: "q15c", text: "重新确认自己哪里说得不严谨。", dim: "calibrate" }
      ]
    },
    {
      id: "q16",
      shuffleOptions: true,
      text: "对象说“没事”，然后一整晚只回单字。你会先：",
      options: [
        { id: "q16a", text: "看回复速度和称呼，判断事情多大。", dim: "people" },
        { id: "q16b", text: "回想今天哪句话可能踩了雷。", dim: "reason" },
        { id: "q16c", text: "问“想聊会儿，还是先安静一下？”", dim: "empathy" }
      ]
    },
    {
      id: "q17",
      shuffleOptions: true,
      text: "方案还没开始写，朋友约你今晚出去吃饭。你会先：",
      options: [
        { id: "q17a", text: "算吃完回来还剩多少时间能写。", dim: "reason" },
        { id: "q17b", text: "先答应，回来再熬夜补上。", dim: "decision" },
        { id: "q17c", text: "约晚一点，带电脑边吃边写。", dim: "flex" }
      ]
    },
    {
      id: "q18",
      shuffleOptions: true,
      text: "买回来的东西不太满意，但退货要自己寄。你会先：",
      options: [
        { id: "q18a", text: "查清退货规则和邮费，再决定退不退。", dim: "calibrate" },
        { id: "q18b", text: "拍个照挂二手，亏一点也省得折腾。", dim: "flex" },
        { id: "q18c", text: "算了，能用就用，不想再为它耗脑子。", dim: "decision" }
      ]
    },
    {
      id: "q19",
      shuffleOptions: true,
      text: "你发的59秒语音，朋友只回了一个“嗯”。你会先：",
      options: [
        { id: "q19a", text: "看他最近是不是一直这么回。", dim: "people" },
        { id: "q19b", text: "回想自己是不是又说太长了。", dim: "self" },
        { id: "q19c", text: "换句话再问，确认他忙不忙。", dim: "calibrate" }
      ]
    },
    {
      id: "q20",
      shuffleOptions: true,
      text: "朋友发来“帮我助力一下，就差0.01%了”，你其实有点烦。你会先：",
      options: [
        { id: "q20a", text: "点进去看看，到底差在哪一步。", dim: "insight" },
        { id: "q20b", text: "直接回“不方便”，免得下次还来。", dim: "decision" },
        { id: "q20c", text: "先帮一次，再问以后能不能少发。", dim: "empathy" }
      ]
    }
  ];

  const types = [
    {
      id: "plot800",
      name: "颅内演绎家",
      code: "PLOT-800",
      high: ["insight", "reason"],
      low: "decision",
      tagline: "别人刚开口，我已经在脑内播到第八集。",
      description: [
        "饭桌上一句话，你会把语气、表情和旧事全剪进同一支预告片。",
        "你能把动机链、后续走向和可能的反转都推出来，连配乐都选好了。",
        "真要落地方案时，你还在等脑内第八集先播完。"
      ],
      blindSpot: "别把推演完整误当成可以行动，别人有时只需要一个能执行的当下版本。",
      shareText: "我不是磨叽，我在等脑内剧集过审。"
    },
    {
      id: "soloMode",
      name: "世界只剩我一人",
      code: "SOLO-MODE",
      high: ["insight", "self"],
      low: "people",
      tagline: "我很懂自己，你们先按我的设定运行。",
      description: [
        "你能很快说清自己为什么开心、为什么别扭，也熟悉自己会在哪里卡住。",
        "可一到别人的沉默、客气话和小动作，你容易拿自己的说明书去猜。",
        "你以为自己在读人，其实有时是在给自己的内心做投影。"
      ],
      blindSpot: "先问一句，可能比用自己的人生剧本解释对方更省电。",
      shareText: "我的世界很完整，别人请先申请入场。"
    },
    {
      id: "missShot",
      name: "马枪了兄弟",
      code: "MISS-SHOT",
      high: ["insight", "people"],
      low: "calibrate",
      tagline: "雷达确实响了，准星有自己的想法。",
      description: [
        "你进一个场合很快能感觉到谁在主导、谁在强撑、哪里气氛不对。",
        "你擅长把这些碎片拼成一个故事，而且经常真有点东西。",
        "问题是，一旦某个推断让你觉得舒服，你会忘了给它留一个脱靶的可能。"
      ],
      blindSpot: "猜中过不代表这次也准，尤其当你已经很想相信这个版本。",
      shareText: "信号全收了，马枪也是真的。"
    },
    {
      id: "empFull",
      name: "苦水饕餮",
      code: "EMP-FULL",
      high: ["insight", "empathy"],
      low: "flex",
      tagline: "别人的苦衷我都吃，事情一改稿我就消化不良。",
      description: [
        "你很容易进入不同人的位置，领导、朋友、对象、路人，每个人都能被你在脑内补出一段难处。",
        "你看得越深，越容易对自己的解释产生感情。",
        "等新信息出现时，你会先替旧版本找补，而不是立刻换台。"
      ],
      blindSpot: "共情不是把第一版故事写得更长，有时是允许它被推翻。",
      shareText: "苦水全收，改稿免谈。"
    },
    {
      id: "chopFirst",
      name: "斩！没证据我也斩！",
      code: "CHOP-FIRST",
      high: ["insight", "decision"],
      low: "self",
      tagline: "不是我心虚，是结论已经先动刀了。",
      description: [
        "你能从一个眼神、一个停顿里迅速嗅到不对劲，判断快得像已经开完庭。",
        "你不太会停下来检查这把刀是不是被第一印象握着。",
        "事后你又能补出一套听着很完整的推理。"
      ],
      blindSpot: "最快的判断也可能是最舒服的判断，偶尔给它一次被反驳的机会。",
      shareText: "先斩后奏，证据路上堵车。"
    },
    {
      id: "blackHole",
      name: "脑洞比黑洞还可怕",
      code: "BLACK-HOLE",
      high: ["insight", "flex"],
      low: "reason",
      tagline: "脑洞一开，逻辑当场失去信号。",
      description: [
        "你看到几块散装信息，就忍不住把它们接成一个新宇宙。",
        "别人还在讨论A，你已经在B的尾巴上接出了Q，还觉得中间那段不用翻译。",
        "想法有火花，但经常经不起顺藤摸瓜。"
      ],
      blindSpot: "新鲜连接不等于可靠解释，偶尔回头看看线头接没接反。",
      shareText: "我不是跑题，我在给宇宙接新线路。"
    },
    {
      id: "fishTheory",
      name: "吾安知鱼之乐？",
      code: "FISH-THEORY",
      high: ["reason", "self"],
      low: "empathy",
      tagline: "我懂我的逻辑，鱼懂不懂自己看着办。",
      description: [
        "你习惯把事情拆成步骤，也大概知道自己在哪一步最容易耗电。",
        "遇到新任务，你会先搭框架、找规则、确认边界。",
        "可别人不总是按同一套说明书出牌，你却容易先觉得是他们没看目录。"
      ],
      blindSpot: "别人不是不明白你的逻辑，可能只是站在你还没进入的位置。",
      shareText: "我能整理世界，整理不了别人的操作系统。"
    },
    {
      id: "readMuch",
      name: "已读乱想",
      code: "READ-MUCH",
      high: ["reason", "people"],
      low: "calibrate",
      tagline: "一句晚安，够我推完三集悬疑。",
      description: [
        "群聊里一个句号，你能从回复速度、表情包温度和上次见面的状态推出一整季。",
        "你并不是只靠脑补，很多时候确实能从细节里抓到变化。",
        "但推理速度经常跑在证据前面，真相出来时，脑内已经续订两季。"
      ],
      blindSpot: "给猜测留一个“尚未读完”的标记，别让脑内大结局替现实改稿。",
      shareText: "已读乱想，证据请评论区补齐。"
    },
    {
      id: "bothMid",
      name: "串两边，站中间",
      code: "BOTH-MID",
      high: ["reason", "empathy"],
      low: "decision",
      tagline: "两边的道理我都懂，轮到我选，原地开庭。",
      description: [
        "一有分歧，你能迅速整理出双方的论点和合理处，连没到场的人都能替他说两句。",
        "你享受把问题拆开的过程，也的确容易看得比很多人全。",
        "可轮到你拍板时，每个选项都像还可以再讨论五分钟。"
      ],
      blindSpot: "看得全是一种本事，迟迟不定有时只是把选择外包给时间。",
      shareText: "我串完两边，成功把自己站在了中间。"
    },
    {
      id: "schroBomb",
      name: "薛定谔的炸弹",
      code: "SCHRO-BOMB",
      high: ["reason", "decision"],
      low: "flex",
      tagline: "需求不改我是稳定系统，需求一改我是灾难现场。",
      description: [
        "你处理复杂事情喜欢先搭步骤，再按顺序推进，信息稳定时效率高得让人想给你配进度条。",
        "可现场突然换目标、改规则、冒变量，你容易先烦那个“为什么现在才说”。",
        "事情落地前仿佛一切可控，改需求时又像盒子里同时装着成功和爆炸。"
      ],
      blindSpot: "计划是工具，不是现实本体；临时改动不一定是在针对你。",
      shareText: "需求一改，盒子开了，炸弹还在。"
    },
    {
      id: "formulaV12",
      name: "套公式就是快啊！",
      code: "FORMULA-V12",
      high: ["reason", "flex"],
      low: "insight",
      tagline: "问题没看懂，但我已经把解法套完了。",
      description: [
        "你脑子转得快，遇到卡点会换方法、加模块、重开分支，方案能从V1一路迭代到V12。",
        "你很会提高局部效率，也愿意现场改路线。",
        "只是方案越滚越多时，你可能会错过真正需要处理的那句人话。"
      ],
      blindSpot: "多一个方案不等于更接近答案，先确认问题本身有没有跑偏。",
      shareText: "公式已经套完，问题正在努力匹配。"
    },
    {
      id: "dailyN",
      name: "吾日N省吾身",
      code: "DAILY-N",
      high: ["self", "people"],
      low: "decision",
      tagline: "聊天五分钟，复盘五小时，凌晨还在补字幕。",
      description: [
        "你很清楚地记得自己哪句话说得好、哪句话有点尴尬，也读得懂对方当时的反应。",
        "散场后，你会把每个停顿重新播放一遍，给昨晚的自己逐帧补字幕。",
        "第二天别人已经翻篇，你的复盘会还在继续。"
      ],
      blindSpot: "复盘能让你更懂关系，但一直重播不会替你发出下一条消息。",
      shareText: "当事人已睡，我的复盘会刚开始。"
    },
    {
      id: "waterMaster",
      name: "端水大师，漏了多少水你别管",
      code: "WATER-MASTER",
      high: ["self", "empathy"],
      low: "reason",
      tagline: "水是端平了，逻辑从桌角漏下去了。",
      description: [
        "你能觉察自己的别扭，也能看见别人的难处，所以总想找一个大家都能接受的版本。",
        "你会优先照顾气氛，让难听的话变得能继续聊。",
        "可真要追问事情哪里不成立时，你有时会选择先让这杯水看着平。"
      ],
      blindSpot: "和谐不是推理的替代品，温柔也可以带上一个清楚的结论。",
      shareText: "别看漏了多少水，就说平不平吧。"
    },
    {
      id: "skimOnly",
      name: "只看简介之人",
      code: "SKIM-ONLY",
      high: ["self", "decision"],
      low: "people",
      tagline: "详情还没读完，决定已经盖章。",
      description: [
        "你对自己的偏好和底线不算陌生，做决定时也愿意快一点往前推。",
        "你通常能用一套自洽的理由解释自己的选择，并且很快进入执行。",
        "只是你不太会停下来确认，别人是不是也收到了同一份说明书。"
      ],
      blindSpot: "自洽只能说明你说得通，不代表对方也听得懂。",
      shareText: "简介已读，正文等我做完再补。"
    },
    {
      id: "muteRight",
      name: "我有权保持沉默",
      code: "MUTE-RIGHT",
      high: ["people", "empathy"],
      low: "decision",
      tagline: "全场关系我都能翻译，轮到自己发言依法闭嘴。",
      description: [
        "别人话里有话，你通常能接到频道；两边各自的委屈，你也能听明白。",
        "群聊冷场时，你甚至知道该谁先递台阶。",
        "可当所有人都在等你表态，你容易先照顾每一种感受，最后把自己的那句话吞回去。"
      ],
      blindSpot: "理解所有人之后，你仍然需要选一个当下愿意承担的方向。",
      shareText: "我能给全场配字幕，轮到自己保持沉默。"
    },
    {
      id: "waitNo",
      name: "对对对，唉，不对不对不对",
      code: "WAIT-NO",
      high: ["people", "decision"],
      low: "calibrate",
      tagline: "第一秒对对对，第三秒哪里都不对。",
      description: [
        "你进一个场合很快能感觉到谁在主导、谁在观望、哪里气氛不对，也愿意凭这份感觉迅速反应。",
        "你通常能先接住场面，甚至抢到先机。",
        "只是第一反应太快时，第二眼才发现自己刚才可能已经上错车。"
      ],
      blindSpot: "第一印象是预览，不是成片；给第二眼留一点上场时间。",
      shareText: "对对对，唉，不对不对不对。"
    },
    {
      id: "wideNet",
      name: "我的人脉超级广",
      code: "WIDE-NET",
      high: ["people", "flex"],
      low: "self",
      tagline: "通讯录里全是人，独处时查无此人。",
      description: [
        "你能迅速读出不同场合的规则，聊天、开会、见长辈会自动切到合适的版本。",
        "你通常能让场面顺滑，也知道怎样让每个人觉得你会来事。",
        "切换太多次以后，你有时会分不清哪个反应才是自己真正想给的。"
      ],
      blindSpot: "人脉可以很广，但别忙着加所有人，先确认自己的位置还在。",
      shareText: "我的人脉超级广，我的主见暂不在服务区。"
    },
    {
      id: "goodPartner",
      name: "优秀的伴侣",
      code: "GOOD-PARTNER",
      high: ["empathy", "decision"],
      low: "insight",
      tagline: "吵架时我最会圆，圆完问题还在原地。",
      description: [
        "一看到僵局，你会先理解双方在急什么，再快速推一个能继续走的动作。",
        "你擅长把难听的话翻译成能下台的版本，也常被朋友当成关系客服。",
        "只是气氛恢复以后，真正引发冲突的那个原因，有时还坐在桌边没人理。"
      ],
      blindSpot: "先哄好很有用，但别把暂时不吵误当成问题已经解决。",
      shareText: "我负责和好，问题负责原地不动。"
    },
    {
      id: "cnOrNot",
      name: "这还是国内吗？",
      code: "CN-OR-NOT",
      high: ["decision", "flex"],
      low: "calibrate",
      tagline: "先冲，导航晚点再下载。",
      description: [
        "新机会一来，你倾向于先迈一步，再根据反馈修方向。",
        "你不怕边做边改，也能在半路换一套打法，常常比原地开会更快。",
        "只是有时候冲出去三百米，你才抬头发现这地方好像不在导航里。"
      ],
      blindSpot: "灵活很值钱，不过先踩一脚刹车，可能省掉一次全量返工。",
      shareText: "先出发，至于这还是不是国内，到了再看。"
    },
    {
      id: "norM",
      name: "无短板之人",
      code: "NOR-M",
      high: [],
      low: null,
      tagline: "八维平均分摊房租，谁都没想搬走。",
      description: [
        "你不太会在每道题里都固定用同一种方式：有时先看人，有时先讲理，有时立刻决定，有时再确认一下。",
        "你的八维图更圆，没有哪一维永远抢麦。",
        "这让你容易适应不同场面，但别人也很难用一句标签把你打包带走。"
      ],
      blindSpot: "样样都能配合，也可能让你少说一句“这件事我其实很在意”。",
      shareText: "我不是没有短板，我是短板也学会了团队协作。"
    }
  ];

  return {
    dimensions,
    questions,
    types,
    disclaimer: "本结果仅供娱乐，不是诊断，也不用于选拔。结果只反映你在本套情景题里的临时选择倾向，不代表固定人格或真实能力水平。",
    config: {
      mapVersion: "v1",
      flatRange: 0.14,
      autoAdvanceMs: 240,
      loadingMs: 1200,
      maxScore: 9,
      shareUrl: "https://csti-educational-gibbon-d8c5i3aee5a58.webapps.tcloudbase.com",
      shareQrDataUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6AQMAAACyIsh+AAAABlBMVEX///8AAABVwtN+AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAB4klEQVRoge2YMY6DMBREP6Kg9BF8kRVcawskkFLkWqBcxLmBSxcWf2ecrdbWdoALj0QA5RV2vv94HJGmpqampqYLNanqOuJhFD+Pgje9HPgSGR6HCcshZhXxIrZCwOqwTir9ITJ3zi/xHgCDHPgL9loxsHY+yOQ0ouS3AKzm7jFQ+0+5bwbYFwDCPFrz2F25cU4GfhUEQByL390PYBZYbl5jp5iFmufL3QHQwPjgMVCPe32AiEkm1u/OPDabz6IKwGqYMfIFfaGbTY1yNdCjEeJohtg5PgOqEJgctwE2r+g6OQ/qeuCNvjhgZOpoIBi1qxBQDbiFGWsvCvrib7kvAPCujw3hhgOcFOvf1QcwWCQDGS0TmR9eejmAJacpaG2SlvyQOW0FQP/mqA0MRGTZVb4zAzkfmJxBJZXLXvq9UM0qAEZVmgfKHXE9s3JXAHxZz5g4YCYGV17uKwC4LJYbQw4PQUajVAgw2+9MQc6syfJK4f9cgOo3flqPDIG+qBBIuXozymwfsW8uhbh4NsDzBU+L2JJkhqMtWTVrAFhuzEJxUoSBqOaNcw1w0B+E/mBCtnfXAuC0iLhqPvtmaRYnA+k/EGxHG2Oz6LNU7ruBz5GWJ9lkIIXNvQKgqampqanpZP0AE8YZzinibKAAAAAASUVORK5CYII="
    }
  };
})();
