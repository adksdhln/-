/* 聚合脚本：把岗位级的 data/positions.js 按公司聚合成公司级
   字段：id / seed / updatedAt / company / companyType / industry / location / category / deadline / applyUrl / status
   输出仍写入 data/positions.js（app.js 会按公司级读取）
*/
const fs = require('fs');
const path = require('path');

const POS = path.join(__dirname, 'data', 'positions.js');

function hashId(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) { h = ((h << 5) + h + str.charCodeAt(i)) >>> 0; }
  return 'seed-' + h.toString(36);
}

const text = fs.readFileSync(POS, 'utf8');
const m = text.match(/window\.QIUZHAO_SEED\s*=\s*(\[[\s\S]*?\])\s*;?\s*$/);
if (!m) { console.error('无法解析 positions.js'); process.exit(1); }
const rows = JSON.parse(m[1]);
console.log('原始岗位级条目:', rows.length);

const orderCat = ['技术','产品','数据','运营','职能','设计','市场'];
const byCompany = {};
for (const r of rows) {
  const c = r.company;
  if (!byCompany[c]) byCompany[c] = [];
  byCompany[c].push(r);
}

const companies = [];
for (const [name, list] of Object.entries(byCompany)) {
  const cities = new Set();
  const cats = new Set();
  let deadline = '';
  let updatedAt = list[0].updatedAt || '2026-08-27';
  let applyUrl = '';
  let companyType = list[0].companyType || '民企';
  let industry = list[0].industry || '';
  for (const r of list) {
    if (r.location) r.location.split(/\/|、/).forEach(x => { const t = x.trim(); if (t) cities.add(t); });
    if (r.category) r.category.split(/\/|、/).forEach(x => { const t = x.trim(); if (t) cats.add(t); });
    if (r.deadline && (!deadline || r.deadline < deadline)) deadline = r.deadline;
    if (r.updatedAt && r.updatedAt > updatedAt) updatedAt = r.updatedAt;
    if (r.applyUrl && !applyUrl) applyUrl = r.applyUrl;
  }
  const catSorted = orderCat.filter(c => cats.has(c));
  companies.push({
    id: hashId(name),
    seed: true,
    updatedAt,
    company: name,
    companyType,
    industry,
    location: [...cities].join('/'),
    category: catSorted.join('/'),
    deadline,
    applyUrl,
    status: '未浏览'
  });
}

const header = `/* ============================================================
   2027 届秋招 · 公司级岗位数据（官方公开来源汇总）
   数据截至：2026-08-27（每日自动更新 · 头部大厂已全量替换真实岗位）
   来源：各公司官方校招官网 / 公众号 + 各校就业网 / 公开媒体报道
   字段（一行 = 一家公司）：
     id(稳定,去重用) / seed / updatedAt(信息更新时间) / company(公司名称) /
     companyType(公司类型:民企/外企/央国企) / industry(公司行业) /
     location(工作地点) / category(岗位类别) / deadline(截止时间) /
     applyUrl(投递链接) / status(投递状态:已投递/未浏览/不投递)
   说明：本文件由"每日更新"任务维护；具体岗位名/截止时间以各公司官方招聘官网为准。
   ============================================================ */
`;
const out = header + 'window.QIUZHAO_SEED = ' + JSON.stringify(companies, null, 2) + ';\n';
fs.writeFileSync(POS, out, 'utf8');
console.log('聚合后公司数:', companies.length);
console.log('示例 - 腾讯:', JSON.stringify(companies.find(c => c.company === '腾讯'), null, 2));
