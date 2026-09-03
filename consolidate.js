/* 合并脚本：把 data/scrape/*.json 的真实大厂岗位并入 data/positions.js
   1) 从现有 positions.js 中【移除】15 家头部大厂的旧抽样条目
   2) 保留其余公司的原 id（以保住用户在 localStorage 里已填的 status）
   3) 读取 data/scrape/*.json，规范化字段，生成稳定 id，追加
   仅用于生成种子库，不参与网站运行。运行：node consolidate.js
*/
const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, 'data');
const POS = path.join(DATA, 'positions.js');
const SCRAPE = path.join(DATA, 'scrape');

// 1) 解析现有 positions.js 中的 window.QIUZHAO_SEED 数组
const posText = fs.readFileSync(POS, 'utf8');
const m = posText.match(/window\.QIUZHAO_SEED\s*=\s*(\[[\s\S]*?\])\s*;?\s*$/);
if (!m) { console.error('无法解析 positions.js'); process.exit(1); }
const existing = JSON.parse(m[1]);
console.log('现有 positions.js 条目数:', existing.length);

// 2) 15 家头部大厂（用真实数据全量替换）
const BIG = new Set(['腾讯','字节跳动','阿里巴巴','蚂蚁集团','美团','百度','京东','拼多多','华为','小米','网易','快手','滴滴','携程','哔哩哔哩']);
const kept = existing.filter(e => !BIG.has(e.company));
console.log('保留（非大厂）条目数:', kept.length);

// 3) 读取抓取文件
const files = fs.readdirSync(SCRAPE).filter(f => f.endsWith('.json'));
const catMap = { '销售':'市场', '游戏策划':'产品' };
const enumC = ['技术','产品','数据','运营','职能','设计','市场'];
const reqFields = ['company','companyType','industry','batch','project','location','category','position','deadline','applyUrl'];
let raw = [];
for (const f of files) {
  const arr = JSON.parse(fs.readFileSync(path.join(SCRAPE, f), 'utf8'));
  raw = raw.concat(arr);
}
console.log('抓取原始条目数:', raw.length);

// 4) 规范化 + 生成稳定 id
function hashId(str){
  let h = 5381;
  for (let i=0;i<str.length;i++){ h = ((h<<5)+h + str.charCodeAt(i)) >>> 0; }
  return 'seed-' + h.toString(36);
}
const used = new Set(kept.map(e=>e.id));
const today = '2026-08-26';
const newBig = [];
let normCount = 0, missFix = 0;
for (const o of raw) {
  // 类别映射
  if (catMap[o.category]) { o.category = catMap[o.category]; normCount++; }
  // 缺失字段补空
  for (const k of reqFields){ if (!(k in o)) { o[k] = ''; missFix++; } }
  if (!enumC.includes(o.category)) o.category = '技术';
  // 稳定 id
  let id = hashId([o.company,o.position,o.location,o.project,o.category,o.batch].join('|'));
  let suffix = 1, base = id;
  while (used.has(id)) { suffix++; id = base + '-' + suffix; }
  used.add(id);
  newBig.push({
    id, seed: true, updatedAt: today,
    company: o.company, companyType: o.companyType, industry: o.industry,
    batch: o.batch, project: o.project, location: o.location,
    category: o.category, position: o.position, deadline: o.deadline || '',
    applyUrl: o.applyUrl, status: '未投递'
  });
}
console.log('规范化类别数:', normCount, ' 补全缺失字段数:', missFix);
console.log('新增大厂条目数:', newBig.length);

// 5) 合并写回
const final = kept.concat(newBig);
const header = `/* ============================================================
   2027 届秋招 · 岗位数据（官方公开来源汇总）
   数据截至：2026-08-26（每日自动更新 · 头部15家大厂已全量替换真实岗位）
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
const out = header + 'window.QIUZHAO_SEED = ' + JSON.stringify(final, null, 2) + ';\n';
fs.writeFileSync(POS, out, 'utf8');

// 6) 自检
const reParse = JSON.parse(out.match(/window\.QIUZHAO_SEED\s*=\s*(\[[\s\S]*?\])\s*;?\s*$/)[1]);
const ids = reParse.map(e=>e.id);
const dup = ids.length - new Set(ids).size;
const badStatus = reParse.filter(e=>!['未投递','已投递','笔试','约面','面试中','offer','拒绝'].includes(e.status)).length;
const badCat = reParse.filter(e=>!enumC.includes(e.category)).length;
console.log('--- 校验 ---');
console.log('总条目:', reParse.length, '| 唯一id:', new Set(ids).size, '| 重复id:', dup, '| 非法status:', badStatus, '| 非法category:', badCat);
console.log('大厂条目数:', reParse.filter(e=>BIG.has(e.company)).length, '| 非大厂条目数:', reParse.filter(e=>!BIG.has(e.company)).length);
