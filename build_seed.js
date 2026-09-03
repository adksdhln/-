/* 构建脚本：把四组真实调研数据合并为 data/positions.js
   运行：node build_seed.js  （仅用于生成种子库，不参与网站运行） */
const fs = require('fs');

const arrA = [
  {updatedAt:"2026-08-18",company:"腾讯",companyType:"民企",industry:"互联网",batch:"秋招正式批",project:"腾讯2027校园招聘",location:"深圳/北京/上海/成都/广州/杭州/香港",category:"技术",position:"AI全栈工程师",deadline:"",applyUrl:"https://join.qq.com",status:"未投递"},
  {updatedAt:"2026-08-18",company:"腾讯",companyType:"民企",industry:"互联网",batch:"秋招正式批",project:"腾讯2027校园招聘",location:"深圳/北京/上海/成都/广州/杭州/香港",category:"产品",position:"AI产品经理",deadline:"",applyUrl:"https://join.qq.com",status:"未投递"},
  {updatedAt:"2026-08-18",company:"腾讯",companyType:"民企",industry:"互联网",batch:"秋招正式批",project:"腾讯2027校园招聘",location:"深圳/北京/上海/成都/广州/杭州/香港",category:"技术",position:"Agent开发工程师",deadline:"",applyUrl:"https://join.qq.com",status:"未投递"},
  {updatedAt:"2026-08-18",company:"字节跳动",companyType:"民企",industry:"互联网",batch:"秋招正式批",project:"字节跳动2027校园招聘",location:"北京/上海/深圳/杭州/成都/广州",category:"技术",position:"AI全栈工程师",deadline:"",applyUrl:"https://jobs.bytedance.com/campus/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"字节跳动",companyType:"民企",industry:"互联网",batch:"秋招正式批",project:"字节跳动2027校园招聘",location:"北京/上海/深圳/杭州/成都/广州",category:"技术",position:"AI Agent开发",deadline:"",applyUrl:"https://jobs.bytedance.com/campus/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"字节跳动",companyType:"民企",industry:"互联网",batch:"秋招正式批",project:"字节跳动2027校园招聘",location:"北京/上海/深圳",category:"产品",position:"大模型产品",deadline:"",applyUrl:"https://jobs.bytedance.com/campus/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"阿里巴巴",companyType:"民企",industry:"互联网",batch:"秋招正式批",project:"阿里星顶尖人才计划",location:"杭州/北京/深圳/上海/成都/苏州/武汉/西安/南京",category:"技术",position:"算法工程师",deadline:"",applyUrl:"https://campus-talent.alibaba.com/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"阿里巴巴",companyType:"民企",industry:"互联网",batch:"秋招正式批",project:"阿里巴巴2027届应届生招聘",location:"杭州/北京/深圳/上海/成都",category:"技术",position:"研发工程师",deadline:"",applyUrl:"https://campus-talent.alibaba.com/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"阿里巴巴",companyType:"民企",industry:"互联网",batch:"秋招提前批",project:"阿里星顶尖人才计划",location:"杭州",category:"技术",position:"大模型算法工程师",deadline:"",applyUrl:"https://campus-talent.alibaba.com/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"百度",companyType:"民企",industry:"互联网",batch:"秋招提前批",project:"AIDU计划",location:"北京/上海/深圳",category:"技术",position:"大模型算法工程师",deadline:"",applyUrl:"https://talent.baidu.com/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"百度",companyType:"民企",industry:"互联网",batch:"秋招提前批",project:"AIDU计划",location:"北京/上海",category:"技术",position:"多模态算法工程师",deadline:"",applyUrl:"https://talent.baidu.com/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"百度",companyType:"民企",industry:"互联网",batch:"管培生项目",project:"百度管培生计划",location:"北京",category:"职能",position:"管培生",deadline:"",applyUrl:"https://talent.baidu.com/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"美团",companyType:"民企",industry:"本地生活",batch:"秋招正式批",project:"美团2027届校园招聘",location:"北京/上海/深圳/成都/广州/香港",category:"技术",position:"AI全栈工程师",deadline:"2026-10-31",applyUrl:"https://zhaopin.meituan.com/web/campus",status:"未投递"},
  {updatedAt:"2026-08-18",company:"美团",companyType:"民企",industry:"本地生活",batch:"秋招提前批",project:"北斗计划/LongCat顶尖人才校招",location:"北京",category:"技术",position:"大模型算法工程师",deadline:"",applyUrl:"https://zhaopin.meituan.com/web/campus",status:"未投递"},
  {updatedAt:"2026-08-18",company:"美团",companyType:"民企",industry:"本地生活",batch:"秋招正式批",project:"食杂零售管培生计划",location:"北京/上海/深圳",category:"运营",position:"食杂零售管培生",deadline:"2026-10-31",applyUrl:"https://zhaopin.meituan.com/web/campus",status:"未投递"},
  {updatedAt:"2026-08-18",company:"京东",companyType:"民企",industry:"电商",batch:"秋招正式批",project:"京东2027校园招聘",location:"北京/上海/广州/深圳/成都/武汉/杭州",category:"技术",position:"技术研发工程师",deadline:"2026-11-30",applyUrl:"https://campus.jd.com/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"京东",companyType:"民企",industry:"电商",batch:"秋招正式批",project:"京东2027校园招聘",location:"北京/上海/广州/深圳",category:"产品",position:"产品经理",deadline:"2026-11-30",applyUrl:"https://campus.jd.com/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"京东",companyType:"民企",industry:"电商",batch:"秋招正式批",project:"京东2027校园招聘",location:"北京/上海/广州/深圳",category:"运营",position:"采销管培生",deadline:"2026-11-30",applyUrl:"https://campus.jd.com/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"拼多多",companyType:"民企",industry:"电商",batch:"秋招提前批",project:"云弧计划",location:"上海",category:"技术",position:"大模型算法工程师",deadline:"2026-08-23",applyUrl:"https://careers.pddglobalhr.com/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"拼多多",companyType:"民企",industry:"电商",batch:"秋招提前批",project:"拼多多2027届校招",location:"上海",category:"技术",position:"服务端研发工程师",deadline:"2026-08-23",applyUrl:"https://careers.pddglobalhr.com/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"拼多多",companyType:"民企",industry:"电商",batch:"秋招正式批",project:"拼多多2027届校招",location:"上海",category:"产品",position:"产品管培生",deadline:"",applyUrl:"https://careers.pddglobalhr.com/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"快手",companyType:"民企",industry:"短视频",batch:"秋招提前批",project:"快Star顶尖技术人才计划",location:"北京/上海",category:"技术",position:"多模态大语言模型研究员",deadline:"2026-12-31",applyUrl:"https://campus.kuaishou.com/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"快手",companyType:"民企",industry:"短视频",batch:"秋招正式批",project:"快手2027全球校招",location:"北京/杭州/上海/深圳/广州",category:"技术",position:"后端开发工程师",deadline:"",applyUrl:"https://campus.kuaishou.com/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"快手",companyType:"民企",industry:"短视频",batch:"秋招正式批",project:"快手2027全球校招",location:"北京/杭州/上海/深圳/广州",category:"技术",position:"游戏开发工程师",deadline:"",applyUrl:"https://campus.kuaishou.com/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"网易",companyType:"民企",industry:"游戏",batch:"秋招正式批",project:"网易游戏互娱2027校招",location:"广州/上海/杭州",category:"技术",position:"游戏客户端开发工程师",deadline:"",applyUrl:"https://campus.game.163.com/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"网易",companyType:"民企",industry:"游戏",batch:"秋招正式批",project:"网易游戏雷火2027校招",location:"杭州",category:"技术",position:"大模型算法工程师（智能NPC方向）",deadline:"2026-10-15",applyUrl:"https://leihuo.163.com/campus",status:"未投递"},
  {updatedAt:"2026-08-18",company:"网易",companyType:"民企",industry:"游戏",batch:"秋招正式批",project:"网易游戏雷火2027校招",location:"杭州",category:"产品",position:"游戏策划（虚拟世界架构师）",deadline:"2026-10-15",applyUrl:"https://leihuo.163.com/campus",status:"未投递"},
  {updatedAt:"2026-08-18",company:"滴滴",companyType:"民企",industry:"出行",batch:"秋招正式批",project:"滴滴2027届校招",location:"北京/上海/广州/杭州/深圳/成都",category:"技术",position:"算法工程师",deadline:"",applyUrl:"https://campus.didiglobal.com/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"滴滴",companyType:"民企",industry:"出行",batch:"秋招正式批",project:"滴滴2027届校招",location:"北京",category:"产品",position:"产品经理",deadline:"",applyUrl:"https://campus.didiglobal.com/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"滴滴",companyType:"民企",industry:"出行",batch:"秋招正式批",project:"滴滴2027届校招",location:"北京",category:"数据",position:"数据分析师",deadline:"",applyUrl:"https://campus.didiglobal.com/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"小米",companyType:"民企",industry:"互联网",batch:"秋招正式批",project:"小米2027届全球校招",location:"北京/上海/深圳/南京/武汉/西安",category:"技术",position:"软件研发工程师",deadline:"2026-12-31",applyUrl:"",status:"未投递"},
  {updatedAt:"2026-08-18",company:"小米",companyType:"民企",industry:"互联网",batch:"秋招正式批",project:"小米2027届全球校招",location:"北京/上海/深圳",category:"技术",position:"算法工程师",deadline:"2026-12-31",applyUrl:"",status:"未投递"},
  {updatedAt:"2026-08-18",company:"小米",companyType:"民企",industry:"互联网",batch:"秋招正式批",project:"小米2027届全球校招",location:"北京/上海/深圳",category:"技术",position:"芯片研发工程师",deadline:"2026-12-31",applyUrl:"",status:"未投递"},
  {updatedAt:"2026-08-18",company:"哔哩哔哩",companyType:"民企",industry:"短视频",batch:"秋招提前批",project:"B-UP顶尖技术人才项目",location:"上海/北京",category:"技术",position:"模型工程开发工程师（搜推）",deadline:"2027-06-30",applyUrl:"https://campus.bilibili.com/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"哔哩哔哩",companyType:"民企",industry:"短视频",batch:"秋招正式批",project:"哔哩哔哩2027届校招",location:"上海/北京/深圳/新加坡",category:"技术",position:"算法工程师",deadline:"",applyUrl:"https://campus.bilibili.com/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"哔哩哔哩",companyType:"民企",industry:"短视频",batch:"秋招正式批",project:"哔哩哔哩2027届校招",location:"上海/北京/深圳",category:"技术",position:"游戏开发工程师",deadline:"",applyUrl:"https://campus.bilibili.com/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"蚂蚁集团",companyType:"民企",industry:"互联网",batch:"秋招提前批",project:"蚂蚁星/Plan A+顶尖人才专项",location:"杭州/上海/北京/深圳/香港",category:"技术",position:"大模型算法工程师",deadline:"",applyUrl:"https://talent.antgroup.com/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"蚂蚁集团",companyType:"民企",industry:"互联网",batch:"秋招正式批",project:"蚂蚁集团2027校招",location:"杭州/上海/北京/深圳/广州/成都",category:"技术",position:"数据科学家",deadline:"",applyUrl:"https://talent.antgroup.com/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"蚂蚁集团",companyType:"民企",industry:"互联网",batch:"秋招正式批",project:"蚂蚁集团2027校招",location:"杭州/上海/北京",category:"产品",position:"AI产品经理",deadline:"",applyUrl:"https://talent.antgroup.com/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"小红书",companyType:"民企",industry:"互联网",batch:"秋招正式批",project:"小红书2027校招",location:"北京/上海/杭州/深圳/武汉",category:"运营",position:"内容运营（马当路练习生-UGC活动运营）",deadline:"",applyUrl:"https://campus.xiaohongshu.com/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"小红书",companyType:"民企",industry:"互联网",batch:"暑期实习转正",project:"Product Engineer产品工程师",location:"上海/北京",category:"技术",position:"产品工程师（AI与全栈方向）",deadline:"",applyUrl:"https://campus.xiaohongshu.com/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"小红书",companyType:"民企",industry:"互联网",batch:"秋招正式批",project:"小红书2027校招",location:"北京/上海/杭州/深圳",category:"技术",position:"后端开发工程师",deadline:"",applyUrl:"https://campus.xiaohongshu.com/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"携程",companyType:"民企",industry:"在线旅游",batch:"暑期实习转正",project:"携程2027届留用实习",location:"上海/北京/广州/深圳/南通",category:"技术",position:"算法工程师（推荐算法）",deadline:"",applyUrl:"https://careers.ctrip.com",status:"未投递"},
  {updatedAt:"2026-08-18",company:"携程",companyType:"民企",industry:"在线旅游",batch:"暑期实习转正",project:"携程2027届留用实习",location:"上海",category:"产品",position:"服务产品经理",deadline:"",applyUrl:"https://careers.ctrip.com",status:"未投递"},
  {updatedAt:"2026-08-18",company:"携程",companyType:"民企",industry:"在线旅游",batch:"暑期实习转正",project:"Tiger Program人才项目",location:"上海",category:"职能",position:"管培生（Tiger Program）",deadline:"",applyUrl:"https://careers.ctrip.com",status:"未投递"}
];

const arrB = [
  {updatedAt:"2026-08-18",company:"宝洁",companyType:"外企",industry:"快消",batch:"管培生项目",project:"宝洁校园招聘（全职管理岗）",location:"广州,北京",category:"市场",position:"品牌管理培训生",deadline:"2026-09-26",applyUrl:"",status:"未投递"},
  {updatedAt:"2026-08-18",company:"宝洁",companyType:"外企",industry:"快消",batch:"管培生项目",project:"宝洁校园招聘（全职管理岗）",location:"广州,北京",category:"技术",position:"研发培训生",deadline:"2026-09-26",applyUrl:"",status:"未投递"},
  {updatedAt:"2026-08-18",company:"宝洁",companyType:"外企",industry:"快消",batch:"管培生项目",project:"宝洁校园招聘（全职管理岗）",location:"全国",category:"市场",position:"客户生意发展培训生",deadline:"2026-09-26",applyUrl:"",status:"未投递"},
  {updatedAt:"2026-08-18",company:"联合利华",companyType:"外企",industry:"快消",batch:"管培生项目",project:"UFLP未来领袖计划",location:"上海",category:"市场",position:"UFLP管培生-市场方向",deadline:"",applyUrl:"",status:"未投递"},
  {updatedAt:"2026-08-18",company:"联合利华",companyType:"外企",industry:"快消",batch:"管培生项目",project:"UFLP未来领袖计划",location:"上海",category:"运营",position:"UFLP管培生-供应链方向",deadline:"",applyUrl:"",status:"未投递"},
  {updatedAt:"2026-08-18",company:"联合利华",companyType:"外企",industry:"快消",batch:"管培生项目",project:"UFLP未来领袖计划",location:"上海",category:"技术",position:"UFLP管培生-研发方向",deadline:"",applyUrl:"",status:"未投递"},
  {updatedAt:"2026-08-18",company:"玛氏",companyType:"外企",industry:"快消",batch:"管培生项目",project:"Mars Leadership Experience Program",location:"上海,广州",category:"市场",position:"管理培训生-销售市场方向",deadline:"",applyUrl:"https://careers.mars.com/cn/zh/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"玛氏",companyType:"外企",industry:"快消",batch:"管培生项目",project:"Mars Leadership Experience Program",location:"上海,广州",category:"技术",position:"管理培训生-创研供应方向",deadline:"",applyUrl:"https://careers.mars.com/cn/zh/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"玛氏",companyType:"外企",industry:"快消",batch:"管培生项目",project:"Mars Leadership Experience Program",location:"上海,广州",category:"数据",position:"管理培训生-数智化方向",deadline:"",applyUrl:"https://careers.mars.com/cn/zh/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"欧莱雅",companyType:"外企",industry:"快消",batch:"管培生项目",project:"SeedZ管培生项目",location:"上海",category:"市场",position:"SeedZ管培生-市场与数字营销",deadline:"",applyUrl:"https://careers.loreal.com",status:"未投递"},
  {updatedAt:"2026-08-18",company:"欧莱雅",companyType:"外企",industry:"快消",batch:"管培生项目",project:"欧莱雅管理培训生（MT）",location:"上海,北京,广州,深圳,武汉",category:"市场",position:"零售管理培训生",deadline:"",applyUrl:"https://careers.loreal.com",status:"未投递"},
  {updatedAt:"2026-08-18",company:"欧莱雅",companyType:"外企",industry:"快消",batch:"管培生项目",project:"SeedZ管培生项目",location:"上海",category:"市场",position:"SeedZ管培生-电商方向",deadline:"",applyUrl:"https://careers.loreal.com",status:"未投递"},
  {updatedAt:"2026-08-18",company:"微软",companyType:"外企",industry:"科技",batch:"秋招正式批",project:"微软应届生校园招聘",location:"北京,上海,苏州,深圳",category:"技术",position:"软件开发工程师（应届）",deadline:"",applyUrl:"https://www.microsoft.com/zh-cn/aprd/recruitment",status:"未投递"},
  {updatedAt:"2026-08-18",company:"微软",companyType:"外企",industry:"科技",batch:"秋招正式批",project:"微软应届生校园招聘",location:"北京,上海",category:"技术",position:"软件工程师-人工智能",deadline:"",applyUrl:"https://www.microsoft.com/zh-cn/aprd/recruitment",status:"未投递"},
  {updatedAt:"2026-08-18",company:"亚马逊",companyType:"外企",industry:"科技",batch:"秋招正式批",project:"亚马逊校园招聘（University Talent）",location:"上海",category:"技术",position:"软件开发工程师（Early Career - 2027）",deadline:"",applyUrl:"https://www.amazon.jobs/zh/career-programs/university?country[]=CN",status:"未投递"},
  {updatedAt:"2026-08-18",company:"亚马逊",companyType:"外企",industry:"科技",batch:"管培生项目",project:"Amazon Pathways 运营领导力项目",location:"上海",category:"运营",position:"Pathways Operations Leadership Program",deadline:"",applyUrl:"https://www.amazon.jobs/zh/career-programs/university?country[]=CN",status:"未投递"},
  {updatedAt:"2026-08-18",company:"亚马逊",companyType:"外企",industry:"科技",batch:"秋招正式批",project:"亚马逊校园招聘（University Talent）",location:"上海",category:"数据",position:"Sales Ops Analyst（全球开店）",deadline:"",applyUrl:"https://www.amazon.jobs/zh/career-programs/university?country[]=CN",status:"未投递"},
  {updatedAt:"2026-08-18",company:"谷歌",companyType:"外企",industry:"科技",batch:"暑期实习转正",project:"Google 实习生计划",location:"上海,北京",category:"技术",position:"软件工程实习生（Software Engineering Intern）",deadline:"",applyUrl:"https://careers.google.com",status:"未投递"},
  {updatedAt:"2026-08-18",company:"谷歌",companyType:"外企",industry:"科技",batch:"暑期实习转正",project:"Google 实习生计划",location:"上海,北京",category:"技术",position:"技术解决方案顾问实习生（gTech）",deadline:"",applyUrl:"https://careers.google.com",status:"未投递"},
  {updatedAt:"2026-08-18",company:"苹果",companyType:"外企",industry:"科技",batch:"秋招正式批",project:"Apple 2027届秋季校园&实习生招聘",location:"上海,北京,深圳,苏州",category:"技术",position:"软件开发工程师（2027届）",deadline:"2027-02-02",applyUrl:"https://www.apple.com/careers/cn/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"苹果",companyType:"外企",industry:"科技",batch:"秋招正式批",project:"Apple 2027届秋季校园&实习生招聘",location:"上海,北京",category:"技术",position:"机器学习工程师",deadline:"2027-02-02",applyUrl:"https://www.apple.com/careers/cn/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"苹果",companyType:"外企",industry:"科技",batch:"秋招正式批",project:"Apple 2027届秋季校园&实习生招聘",location:"上海,深圳",category:"技术",position:"硬件工程师",deadline:"2027-02-02",applyUrl:"https://www.apple.com/careers/cn/",status:"未投递"},
  {updatedAt:"2026-08-18",company:"英特尔",companyType:"外企",industry:"半导体",batch:"秋招正式批",project:"英特尔中国校园招聘",location:"上海,北京,深圳",category:"技术",position:"AI软件工程师（AI Software Development Engineer）",deadline:"",applyUrl:"https://chinacampus.jobs.intel.cn",status:"未投递"},
  {updatedAt:"2026-08-18",company:"英特尔",companyType:"外企",industry:"半导体",batch:"秋招正式批",project:"英特尔中国校园招聘",location:"上海,北京,深圳",category:"技术",position:"软件工程师-分布式LLM推理系统",deadline:"",applyUrl:"https://chinacampus.jobs.intel.cn",status:"未投递"},
  {updatedAt:"2026-08-18",company:"西门子",companyType:"外企",industry:"科技",batch:"暑期实习转正",project:"西门子27届中国实习生招聘",location:"北京,上海,苏州,杭州,深圳,南京,成都",category:"技术",position:"软件开发工程师（实习/应届）",deadline:"",applyUrl:"",status:"未投递"},
  {updatedAt:"2026-08-18",company:"西门子",companyType:"外企",industry:"科技",batch:"暑期实习转正",project:"西门子27届中国实习生招聘",location:"北京,上海,苏州,杭州,深圳,南京,成都",category:"数据",position:"数据分析师（实习/应届）",deadline:"",applyUrl:"",status:"未投递"},
  {updatedAt:"2026-08-18",company:"特斯拉",companyType:"外企",industry:"汽车",batch:"秋招正式批",project:"特斯拉中国2027届校园招聘 / T-STAR",location:"上海,北京",category:"技术",position:"研发工程师",deadline:"",applyUrl:"https://intr.tesla.cn",status:"未投递"},
  {updatedAt:"2026-08-18",company:"特斯拉",companyType:"外企",industry:"汽车",batch:"秋招正式批",project:"特斯拉中国2027届校园招聘 / T-STAR",location:"上海,北京",category:"技术",position:"软件工程师",deadline:"",applyUrl:"https://intr.tesla.cn",status:"未投递"},
  {updatedAt:"2026-08-18",company:"特斯拉",companyType:"外企",industry:"汽车",batch:"暑期实习转正",project:"特斯拉2027届T-STAR实习生项目",location:"上海",category:"技术",position:"嵌入式开发工程师（高压系统）",deadline:"2026-08-27",applyUrl:"https://intr.tesla.cn",status:"未投递"},
  {updatedAt:"2026-08-18",company:"德勤",companyType:"外企",industry:"审计",batch:"秋招正式批",project:"德勤2027秋季校园招聘",location:"北京,上海,广州,深圳,香港等",category:"职能",position:"审计员",deadline:"2026-10-31",applyUrl:"https://www.deloitte.com/cn/zh/careers/students.html",status:"未投递"},
  {updatedAt:"2026-08-18",company:"德勤",companyType:"外企",industry:"审计",batch:"秋招正式批",project:"德勤2027秋季校园招聘",location:"北京,上海,广州,深圳,重庆,成都,西安",category:"职能",position:"税务与商务咨询顾问",deadline:"2026-10-31",applyUrl:"https://www.deloitte.com/cn/zh/careers/students.html",status:"未投递"},
  {updatedAt:"2026-08-18",company:"德勤",companyType:"外企",industry:"咨询",batch:"秋招正式批",project:"德勤2027秋季校园招聘",location:"北京,上海",category:"职能",position:"咨询顾问（SAP/数字化）",deadline:"2026-10-31",applyUrl:"https://www.deloitte.com/cn/zh/careers/students.html",status:"未投递"},
  {updatedAt:"2026-08-18",company:"普华永道",companyType:"外企",industry:"审计",batch:"秋招正式批",project:"普华永道2027校园招聘",location:"全国",category:"职能",position:"审计及鉴证",deadline:"",applyUrl:"https://www.pwc.com/cn/en/careers.html",status:"未投递"},
  {updatedAt:"2026-08-18",company:"普华永道",companyType:"外企",industry:"审计",batch:"秋招正式批",project:"普华永道2027校园招聘",location:"全国",category:"职能",position:"税务服务",deadline:"",applyUrl:"https://www.pwc.com/cn/en/careers.html",status:"未投递"},
  {updatedAt:"2026-08-18",company:"普华永道",companyType:"外企",industry:"咨询",batch:"秋招正式批",project:"普华永道2027校园招聘",location:"全国",category:"职能",position:"管理咨询",deadline:"",applyUrl:"https://www.pwc.com/cn/en/careers.html",status:"未投递"},
  {updatedAt:"2026-08-18",company:"毕马威",companyType:"外企",industry:"审计",batch:"秋招正式批",project:"毕马威2027校园招聘",location:"全国",category:"职能",position:"审计及鉴证应届生",deadline:"",applyUrl:"https://kpmg.com/cn/en/careers/campus",status:"未投递"},
  {updatedAt:"2026-08-18",company:"毕马威",companyType:"外企",industry:"审计",batch:"秋招正式批",project:"毕马威2027校园招聘",location:"全国",category:"职能",position:"税务应届生",deadline:"",applyUrl:"https://kpmg.com/cn/en/careers/campus",status:"未投递"},
  {updatedAt:"2026-08-18",company:"毕马威",companyType:"外企",industry:"咨询",batch:"秋招正式批",project:"毕马威2027校园招聘",location:"全国",category:"职能",position:"咨询应届生",deadline:"",applyUrl:"https://kpmg.com/cn/en/careers/campus",status:"未投递"},
  {updatedAt:"2026-08-18",company:"安永",companyType:"外企",industry:"审计",batch:"秋招正式批",project:"安永2026-2027秋季应届毕业生招聘",location:"全国",category:"职能",position:"审计及鉴证（应届毕业生）",deadline:"2026-10-16",applyUrl:"https://careers.ey.com.cn",status:"未投递"},
  {updatedAt:"2026-08-18",company:"安永",companyType:"外企",industry:"审计",batch:"暑期实习转正",project:"安永审计寒假实习生招聘 / 启明星管培生计划",location:"全国",category:"职能",position:"审计寒假实习生",deadline:"2026-10-16",applyUrl:"https://careers.ey.com.cn",status:"未投递"}
];

const arrC = [
  {updatedAt:"2026-08-18",company:"国家电网",companyType:"央国企",industry:"电力",batch:"秋招提前批",project:"国网校园招聘",location:"全国",category:"技术",position:"电气工程设计",deadline:"",applyUrl:"http://zhaopin.sgcc.com.cn",status:"未投递"},
  {updatedAt:"2026-08-18",company:"国家电网",companyType:"央国企",industry:"电力",batch:"秋招提前批",project:"国网校园招聘",location:"全国",category:"技术",position:"信息通信运维",deadline:"",applyUrl:"http://zhaopin.sgcc.com.cn",status:"未投递"},
  {updatedAt:"2026-08-18",company:"国家电网",companyType:"央国企",industry:"电力",batch:"秋招提前批",project:"国网校园招聘",location:"全国",category:"职能",position:"人力资源管理",deadline:"",applyUrl:"http://zhaopin.sgcc.com.cn",status:"未投递"},
  {updatedAt:"2026-08-18",company:"中国移动",companyType:"央国企",industry:"通信",batch:"秋招正式批",project:"金种子计划",location:"全国",category:"技术",position:"软件开发工程师",deadline:"",applyUrl:"https://job.10086.cn",status:"未投递"},
  {updatedAt:"2026-08-18",company:"中国移动",companyType:"央国企",industry:"通信",batch:"秋招正式批",project:"金种子计划",location:"全国",category:"技术",position:"网络安全工程师",deadline:"",applyUrl:"https://job.10086.cn",status:"未投递"},
  {updatedAt:"2026-08-18",company:"中国移动",companyType:"央国企",industry:"通信",batch:"秋招正式批",project:"金种子计划",location:"全国",category:"职能",position:"财务管理",deadline:"",applyUrl:"https://job.10086.cn",status:"未投递"},
  {updatedAt:"2026-08-18",company:"中国银行",companyType:"央国企",industry:"金融",batch:"秋招正式批",project:"中国银行校园招聘",location:"全国",category:"技术",position:"信息科技岗",deadline:"",applyUrl:"https://www.boc.cn",status:"未投递"},
  {updatedAt:"2026-08-18",company:"中国银行",companyType:"央国企",industry:"金融",batch:"秋招正式批",project:"中国银行校园招聘",location:"全国",category:"职能",position:"管理培训生",deadline:"",applyUrl:"https://www.boc.cn",status:"未投递"},
  {updatedAt:"2026-08-18",company:"中国银行",companyType:"央国企",industry:"金融",batch:"秋招正式批",project:"中国银行校园招聘",location:"全国",category:"市场",position:"营业网点业务岗（营销服务）",deadline:"",applyUrl:"https://www.boc.cn",status:"未投递"},
  {updatedAt:"2026-08-18",company:"工商银行",companyType:"央国企",industry:"金融",batch:"秋招正式批",project:"工行校园招聘",location:"全国",category:"技术",position:"科技菁英",deadline:"",applyUrl:"https://job.icbc.com.cn",status:"未投递"},
  {updatedAt:"2026-08-18",company:"工商银行",companyType:"央国企",industry:"金融",batch:"秋招正式批",project:"工行校园招聘",location:"全国",category:"职能",position:"星辰管培生",deadline:"",applyUrl:"https://job.icbc.com.cn",status:"未投递"},
  {updatedAt:"2026-08-18",company:"工商银行",companyType:"央国企",industry:"金融",batch:"秋招正式批",project:"工行校园招聘",location:"全国",category:"市场",position:"客户经理",deadline:"",applyUrl:"https://job.icbc.com.cn",status:"未投递"},
  {updatedAt:"2026-08-18",company:"中国电信",companyType:"央国企",industry:"通信",batch:"秋招提前批",project:"天翼云校招",location:"北京/上海/广州/深圳/成都/厦门",category:"技术",position:"后端开发工程师",deadline:"2026-10-03",applyUrl:"https://ctyun.hotjob.cn",status:"未投递"},
  {updatedAt:"2026-08-18",company:"中国电信",companyType:"央国企",industry:"通信",batch:"秋招提前批",project:"天翼云校招",location:"北京/上海/广州/深圳/成都/厦门",category:"技术",position:"算法工程师",deadline:"2026-10-03",applyUrl:"https://ctyun.hotjob.cn",status:"未投递"},
  {updatedAt:"2026-08-18",company:"中国电信",companyType:"央国企",industry:"通信",batch:"秋招提前批",project:"天翼云校招",location:"北京/上海/广州/深圳/成都/厦门",category:"职能",position:"云鹰管培生",deadline:"2026-10-03",applyUrl:"https://ctyun.hotjob.cn",status:"未投递"},
  {updatedAt:"2026-08-18",company:"中国石油",companyType:"央国企",industry:"能源",batch:"秋招正式批",project:"中石油校园招聘",location:"全国",category:"技术",position:"油气勘探开发岗",deadline:"2026-10-21",applyUrl:"https://zhaopin.cnpc.com.cn",status:"未投递"},
  {updatedAt:"2026-08-18",company:"中国石油",companyType:"央国企",industry:"能源",batch:"秋招正式批",project:"中石油校园招聘",location:"全国",category:"技术",position:"技术研发岗",deadline:"2026-10-21",applyUrl:"https://zhaopin.cnpc.com.cn",status:"未投递"},
  {updatedAt:"2026-08-18",company:"中国石油",companyType:"央国企",industry:"能源",batch:"秋招正式批",project:"中石油校园招聘",location:"全国",category:"职能",position:"经营企管岗",deadline:"2026-10-21",applyUrl:"https://zhaopin.cnpc.com.cn",status:"未投递"},
  {updatedAt:"2026-08-18",company:"中国石化",companyType:"央国企",industry:"能源",batch:"秋招正式批",project:"中石化校园招聘",location:"天津",category:"技术",position:"炼化装置技术研发岗",deadline:"",applyUrl:"http://job.sinopec.com",status:"未投递"},
  {updatedAt:"2026-08-18",company:"中国石化",companyType:"央国企",industry:"能源",batch:"秋招正式批",project:"中石化校园招聘",location:"天津",category:"技术",position:"计算机信息岗",deadline:"",applyUrl:"http://job.sinopec.com",status:"未投递"},
  {updatedAt:"2026-08-18",company:"中国石化",companyType:"央国企",industry:"能源",batch:"秋招正式批",project:"中石化校园招聘",location:"天津",category:"职能",position:"财经管理岗",deadline:"",applyUrl:"http://job.sinopec.com",status:"未投递"},
  {updatedAt:"2026-08-18",company:"中国中铁",companyType:"央国企",industry:"基建",batch:"秋招正式批",project:"中国中铁校园招聘",location:"全国",category:"技术",position:"工程技术岗",deadline:"2026-08-15",applyUrl:"https://rczp.china-railway.com.cn",status:"未投递"},
  {updatedAt:"2026-08-18",company:"中国中铁",companyType:"央国企",industry:"基建",batch:"秋招正式批",project:"中国中铁校园招聘",location:"全国",category:"技术",position:"机电与智能建造岗",deadline:"2026-08-15",applyUrl:"https://rczp.china-railway.com.cn",status:"未投递"},
  {updatedAt:"2026-08-18",company:"中国中铁",companyType:"央国企",industry:"基建",batch:"秋招正式批",project:"中国中铁校园招聘",location:"全国",category:"职能",position:"财务管理岗",deadline:"2026-08-15",applyUrl:"https://rczp.china-railway.com.cn",status:"未投递"},
  {updatedAt:"2026-08-18",company:"中国建筑",companyType:"央国企",industry:"基建",batch:"秋招提前批",project:"中国建筑校园招聘",location:"成都",category:"设计",position:"建筑设计师",deadline:"",applyUrl:"https://recruit.cscec.com",status:"未投递"},
  {updatedAt:"2026-08-18",company:"中国建筑",companyType:"央国企",industry:"基建",batch:"秋招正式批",project:"中国建筑校园招聘",location:"全国",category:"技术",position:"工程技术岗",deadline:"",applyUrl:"https://recruit.cscec.com",status:"未投递"},
  {updatedAt:"2026-08-18",company:"中国建筑",companyType:"央国企",industry:"基建",batch:"秋招正式批",project:"中国建筑校园招聘",location:"武汉",category:"职能",position:"法务管理岗",deadline:"2026-10-22",applyUrl:"https://recruit.cscec.com",status:"未投递"},
  {updatedAt:"2026-08-18",company:"中国航天科工",companyType:"央国企",industry:"航天",batch:"秋招提前批",project:"航天科工校园招聘",location:"北京",category:"技术",position:"智能飞行器设计与控制岗",deadline:"2026-12-31",applyUrl:"https://casicjob.iguopin.com",status:"未投递"},
  {updatedAt:"2026-08-18",company:"中国航天科工",companyType:"央国企",industry:"航天",batch:"秋招提前批",project:"航天科工校园招聘",location:"呼和浩特/宜昌/西安",category:"技术",position:"科学研究人员",deadline:"2026-12-31",applyUrl:"https://casicjob.iguopin.com",status:"未投递"},
  {updatedAt:"2026-08-18",company:"中国航天科工",companyType:"央国企",industry:"航天",batch:"秋招提前批",project:"航天科工校园招聘",location:"北京",category:"职能",position:"业务规划主管",deadline:"2026-12-31",applyUrl:"https://casicjob.iguopin.com",status:"未投递"}
];

const arrD = [
  {updatedAt:"2026-08-18",company:"比亚迪",companyType:"民企",industry:"新能源汽车",batch:"秋招正式批",project:"比亚迪2027届校园招聘",location:"深圳/上海/西安/长沙/北京",category:"技术",position:"智能驾驶算法工程师",deadline:"",applyUrl:"https://job.byd.com/portal/pc",status:"未投递"},
  {updatedAt:"2026-08-18",company:"比亚迪",companyType:"民企",industry:"新能源汽车",batch:"秋招正式批",project:"比亚迪2027届校园招聘",location:"深圳/上海/西安/长沙/北京",category:"技术",position:"软件开发工程师",deadline:"",applyUrl:"https://job.byd.com/portal/pc",status:"未投递"},
  {updatedAt:"2026-08-18",company:"比亚迪",companyType:"民企",industry:"新能源汽车",batch:"秋招正式批",project:"比亚迪2027届校园招聘",location:"深圳/惠州/西安/上海",category:"技术",position:"BMS工程师",deadline:"",applyUrl:"https://job.byd.com/portal/pc",status:"未投递"},
  {updatedAt:"2026-08-18",company:"蔚来",companyType:"民企",industry:"新能源汽车",batch:"秋招正式批",project:"Super Sparks",location:"北京/上海/南京/合肥",category:"技术",position:"智能辅助驾驶工程师",deadline:"",applyUrl:"https://campus.nio.com",status:"未投递"},
  {updatedAt:"2026-08-18",company:"蔚来",companyType:"民企",industry:"新能源汽车",batch:"秋招正式批",project:"蔚来2027届秋季校园招聘",location:"北京/上海/南京/合肥",category:"技术",position:"智能座舱工程师",deadline:"",applyUrl:"https://campus.nio.com",status:"未投递"},
  {updatedAt:"2026-08-18",company:"蔚来",companyType:"民企",industry:"新能源汽车",batch:"秋招正式批",project:"蔚来2027届秋季校园招聘",location:"上海/合肥/南京",category:"技术",position:"电动汽车驱动系统集成工程师",deadline:"",applyUrl:"https://campus.nio.com",status:"未投递"},
  {updatedAt:"2026-08-18",company:"理想汽车",companyType:"民企",industry:"新能源汽车",batch:"秋招正式批",project:"理想+计划",location:"北京/上海/常州/杭州/深圳",category:"技术",position:"自动驾驶算法工程师",deadline:"",applyUrl:"https://www.lixiang.com/employ/campus.html",status:"未投递"},
  {updatedAt:"2026-08-18",company:"理想汽车",companyType:"民企",industry:"新能源汽车",batch:"秋招正式批",project:"理想+计划",location:"北京/上海/杭州/深圳/香港",category:"技术",position:"AI芯片工程师",deadline:"",applyUrl:"https://www.lixiang.com/employ/campus.html",status:"未投递"},
  {updatedAt:"2026-08-18",company:"理想汽车",companyType:"民企",industry:"新能源汽车",batch:"秋招正式批",project:"理想汽车2027校园招聘",location:"北京/上海/常州/杭州/深圳/重庆/西安",category:"产品",position:"产品经理",deadline:"",applyUrl:"https://www.lixiang.com/employ/campus.html",status:"未投递"},
  {updatedAt:"2026-08-18",company:"小鹏汽车",companyType:"民企",industry:"新能源汽车",batch:"秋招提前批",project:"探索者计划",location:"广州/深圳/上海/北京",category:"技术",position:"自动驾驶算法工程师",deadline:"2026-08-31",applyUrl:"https://xiaopeng.jobs.feishu.cn/campus",status:"未投递"},
  {updatedAt:"2026-08-18",company:"小鹏汽车",companyType:"民企",industry:"新能源汽车",batch:"秋招正式批",project:"探索者计划",location:"广州/深圳/上海/北京/肇庆/武汉",category:"技术",position:"智能座舱工程师",deadline:"",applyUrl:"https://xiaopeng.jobs.feishu.cn/campus",status:"未投递"},
  {updatedAt:"2026-08-18",company:"小鹏汽车",companyType:"民企",industry:"新能源汽车",batch:"秋招正式批",project:"探索者计划",location:"广州/深圳/上海/北京",category:"技术",position:"三电工程师",deadline:"",applyUrl:"https://xiaopeng.jobs.feishu.cn/campus",status:"未投递"},
  {updatedAt:"2026-08-18",company:"华为",companyType:"民企",industry:"通信设备",batch:"天才少年计划",project:"天才少年计划",location:"深圳/北京/上海/杭州/南京/武汉/西安/成都/东莞/苏州",category:"技术",position:"软件开发工程师",deadline:"",applyUrl:"https://career.huawei.com",status:"未投递"},
  {updatedAt:"2026-08-18",company:"华为",companyType:"民企",industry:"通信设备",batch:"秋招正式批",project:"华为2027届应届生招聘",location:"深圳/上海/北京/西安/成都/东莞",category:"技术",position:"芯片设计工程师",deadline:"",applyUrl:"https://career.huawei.com",status:"未投递"},
  {updatedAt:"2026-08-18",company:"华为",companyType:"民企",industry:"通信设备",batch:"秋招正式批",project:"华为2027届应届生招聘",location:"深圳/北京/上海/杭州/南京/武汉/西安/成都/东莞/苏州",category:"市场",position:"客户经理",deadline:"",applyUrl:"https://career.huawei.com",status:"未投递"},
  {updatedAt:"2026-08-18",company:"大疆",companyType:"民企",industry:"智能硬件",batch:"秋招正式批",project:"拓疆者计划",location:"深圳/上海/北京",category:"技术",position:"计算机视觉算法工程师",deadline:"",applyUrl:"https://careers.dji.com/zh-CN/campus",status:"未投递"},
  {updatedAt:"2026-08-18",company:"大疆",companyType:"民企",industry:"智能硬件",batch:"秋招正式批",project:"拓疆者计划",location:"深圳/上海/北京",category:"技术",position:"嵌入式工程师",deadline:"",applyUrl:"https://careers.dji.com/zh-CN/campus",status:"未投递"},
  {updatedAt:"2026-08-18",company:"大疆",companyType:"民企",industry:"智能硬件",batch:"秋招正式批",project:"拓疆者计划",location:"深圳/上海/北京",category:"技术",position:"硬件工程师",deadline:"",applyUrl:"https://careers.dji.com/zh-CN/campus",status:"未投递"},
  {updatedAt:"2026-08-18",company:"联想",companyType:"民企",industry:"消费电子",batch:"管培生项目",project:"Future Leaders 全球管培生",location:"北京/上海/深圳/武汉/成都/合肥",category:"职能",position:"管培生",deadline:"2026-11-13",applyUrl:"https://talent.lenovo.com.cn/home",status:"未投递"},
  {updatedAt:"2026-08-18",company:"联想",companyType:"民企",industry:"消费电子",batch:"秋招正式批",project:"联想2027校园招聘(AI专项)",location:"北京/上海/深圳/武汉/成都",category:"技术",position:"AI算法工程师",deadline:"2026-11-13",applyUrl:"https://talent.lenovo.com.cn/home",status:"未投递"},
  {updatedAt:"2026-08-18",company:"联想",companyType:"民企",industry:"消费电子",batch:"秋招正式批",project:"联想2027校园招聘",location:"北京/上海/深圳/武汉/成都",category:"技术",position:"软件开发工程师",deadline:"2026-11-13",applyUrl:"https://talent.lenovo.com.cn/home",status:"未投递"},
  {updatedAt:"2026-08-18",company:"搜狐",companyType:"民企",industry:"互联网",batch:"秋招正式批",project:"搜狐集团2027秋季校园招聘",location:"北京/天津",category:"技术",position:"软件开发工程师",deadline:"",applyUrl:"https://hr.sohu.com",status:"未投递"},
  {updatedAt:"2026-08-18",company:"搜狐",companyType:"民企",industry:"互联网",batch:"秋招正式批",project:"搜狐集团2027秋季校园招聘(AI人才专项)",location:"北京/天津",category:"技术",position:"算法工程师",deadline:"",applyUrl:"https://hr.sohu.com",status:"未投递"},
  {updatedAt:"2026-08-18",company:"搜狐",companyType:"民企",industry:"互联网",batch:"秋招提前批",project:"搜狐畅游2027届秋招提前批",location:"北京/天津",category:"技术",position:"游戏开发工程师",deadline:"",applyUrl:"https://app.mokahr.com/m/campus_apply/cyou-inc/42233",status:"未投递"},
  {updatedAt:"2026-08-18",company:"360",companyType:"民企",industry:"互联网",batch:"暑期实习转正",project:"飞扬实习生",location:"北京/成都/广州/沈阳",category:"技术",position:"安全工程师",deadline:"",applyUrl:"https://360campus.zhiye.com",status:"未投递"},
  {updatedAt:"2026-08-18",company:"360",companyType:"民企",industry:"互联网",batch:"暑期实习转正",project:"飞扬实习生",location:"北京/成都/广州/沈阳",category:"技术",position:"算法工程师",deadline:"",applyUrl:"https://360campus.zhiye.com",status:"未投递"},
  {updatedAt:"2026-08-18",company:"360",companyType:"民企",industry:"互联网",batch:"暑期实习转正",project:"飞扬实习生",location:"北京/成都/广州/沈阳",category:"技术",position:"软件开发工程师",deadline:"",applyUrl:"https://360campus.zhiye.com",status:"未投递"},
  {updatedAt:"2026-08-18",company:"OPPO",companyType:"民企",industry:"消费电子",batch:"秋招正式批",project:"OPPO 2027届全球校园招聘",location:"成都/深圳/武汉/南京",category:"技术",position:"系统工程师(Android)",deadline:"",applyUrl:"https://careers.oppo.com/university/oppo/campus",status:"未投递"},
  {updatedAt:"2026-08-18",company:"OPPO",companyType:"民企",industry:"消费电子",batch:"秋招正式批",project:"OPPO 2027届全球校园招聘",location:"深圳",category:"设计",position:"影像效果设计师",deadline:"",applyUrl:"https://careers.oppo.com/university/oppo/campus",status:"未投递"},
  {updatedAt:"2026-08-18",company:"OPPO",companyType:"民企",industry:"消费电子",batch:"秋招正式批",project:"OPPO 2027届全球校园招聘",location:"深圳/东莞/上海/北京/成都/西安/南京/武汉",category:"技术",position:"算法工程师",deadline:"",applyUrl:"https://careers.oppo.com/university/oppo/campus",status:"未投递"},
  {updatedAt:"2026-08-18",company:"vivo",companyType:"民企",industry:"消费电子",batch:"秋招正式批",project:"vivo 2027届全球校园招聘",location:"东莞/深圳/南京/上海/杭州/北京/西安/重庆",category:"技术",position:"图像算法工程师",deadline:"2026-09-15",applyUrl:"https://hr.vivo.com",status:"未投递"},
  {updatedAt:"2026-08-18",company:"vivo",companyType:"民企",industry:"消费电子",batch:"秋招正式批",project:"蓝极星计划",location:"东莞/深圳/杭州",category:"技术",position:"Agent技术工程师",deadline:"",applyUrl:"https://hr.vivo.com",status:"未投递"},
  {updatedAt:"2026-08-18",company:"vivo",companyType:"民企",industry:"消费电子",batch:"秋招正式批",project:"vivo 2027届全球校园招聘",location:"东莞/深圳/南京/上海/杭州/北京/西安/重庆",category:"技术",position:"软件工程师",deadline:"2026-09-15",applyUrl:"https://hr.vivo.com",status:"未投递"}
];

const ALL = [...arrA, ...arrB, ...arrC, ...arrD];

function hash(s){ let h=5381; for(let i=0;i<s.length;i++){ h=((h<<5)+h+s.charCodeAt(i))>>>0; } return h.toString(36); }

const out = [];
const seen = {};
let dup = 0;
for (const r of ALL) {
  const key = [r.company, r.batch, r.project, r.category, r.position].join('|');
  const id = 'seed-' + hash(key);
  if (seen[id]) { dup++; console.error('DUP ID:', id, '->', r.company, r.position); }
  seen[id] = 1;
  out.push({
    id, seed: true,
    updatedAt: r.updatedAt,
    company: r.company,
    companyType: r.companyType,
    industry: r.industry,
    batch: r.batch,
    project: r.project,
    location: r.location,
    category: r.category,
    position: r.position,
    deadline: r.deadline || '',
    applyUrl: r.applyUrl || '',
    status: r.status || '未投递'
  });
}

const header = `/* ============================================================
   2027 届秋招 · 真实开放岗位数据（官方公开报道汇总）
   数据截至：2026-08-18
   来源：各公司官方校招官网 / 公众号 + 各校就业网 / 公开媒体报道
   字段（一行 = 一个具体岗位）：
     id(稳定,去重用) / seed / updatedAt(信息更新时间) / company(公司名称) /
     companyType(公司类型:民企/外企/央国企) / industry(公司行业) /
     batch(招聘批次) / project(项目名称) / location(工作地点) /
     category(岗位类别) / position(具体岗位) / deadline(截止时间) /
     applyUrl(投递链接) / status(投递状态,用户手动修改)
   说明：本文件由"每日更新"任务维护；具体岗位名/截止时间以各公司官方招聘官网为准。
   ============================================================ */
`;

fs.writeFileSync('data/positions.js', header + 'window.QIUZHAO_SEED = ' + JSON.stringify(out, null, 2) + ';\n');
console.log('总行数:', ALL.length, '| 生成条目:', out.length, '| 重复ID:', dup, '| 唯一ID:', Object.keys(seen).length);
