/* ============================================================
   2027 秋招 · 公司级岗位追踪  前端逻辑（纯静态，localStorage 持久化）
   三界面：① 信息搜集  ② 求职意向  ③ 我的投递（看板）
   字段结构（一行 = 一家公司）：
     1 信息更新时间 / 2 公司名称 / 3 公司类型 / 4 公司行业 /
     5 工作地点 / 6 岗位类别 / 7 截止时间 / 8 投递链接 / 9 投递状态
   ============================================================ */

const STORE_KEY = 'qiuzhao_2027_companies_v3';
const APPS_KEY = 'qiuzhao_2027_apps_v3';
const SETTINGS_KEY = 'qiuzhao_2027_settings_v3';
const OLD_STORE_KEY = 'qiuzhao_2027_positions_v2';

const COMPANY_TYPES = ['民企', '外企', '央国企'];
const CATEGORIES = ['技术', '产品', '数据', '运营', '职能', '设计', '市场'];
const COMPANY_STATES = ['未浏览', '已投递', '不投递'];
const STATUS_COLORS = { '未浏览': '#8a94a3', '已投递': '#1f9d55', '不投递': '#d64545' };

const KANBAN_COLUMNS = ['投递简历', '测评', '笔试/AI面试', '面试', '拒绝', '获得offer'];
const STAGE_REJECT = 4;
const STAGE_OFFER = 5;
const STAGE_INTERVIEW = 3;

const SAMPLE = [
  { updatedAt: '2026-08-27', company: '示例科技', companyType: '民企', industry: '互联网', location: '北京/上海', category: '技术/产品', deadline: '', applyUrl: '', status: '未浏览' },
  { updatedAt: '2026-08-27', company: '示例快消', companyType: '外企', industry: '快消', location: '上海', category: '市场', deadline: '', applyUrl: '', status: '未浏览' }
];

/* ---------- 状态 ---------- */
let companies = [];
let apps = [];
let settings = { categories: [], cities: [], industries: [], skills: [], resumeText: '', keywords: [], updatedAt: null };
let currentView = 'collect';
let intentCats = [], intentCities = [], intentIndustries = [], intentSkills = [];
let pendingAppCompany = null;
let pendingAppOldStatus = null;

/* ---------- 工具 ---------- */
const $ = (id) => document.getElementById(id);
const uid = () => 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const todayDate = () => new Date().toISOString().slice(0, 10);
function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function companyId(name) {
  let h = 5381;
  for (let i = 0; i < name.length; i++) h = ((h << 5) + h + name.charCodeAt(i)) >>> 0;
  return 'seed-' + h.toString(36);
}
function statusClass(s) { return 'pill st-' + s; }
let toastTimer;
function toast(msg) {
  const t = $('toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => (t.hidden = true), 2200);
}

/* ---------- 旧数据迁移 ---------- */
function migrateOld() {
  const oldRaw = localStorage.getItem(OLD_STORE_KEY);
  if (!oldRaw) return false;
  try {
    const old = JSON.parse(oldRaw);
    if (!Array.isArray(old) || !old.length) { localStorage.removeItem(OLD_STORE_KEY); return false; }
    const byCompany = {};
    old.forEach((p) => {
      const c = p.company;
      if (!byCompany[c]) byCompany[c] = { rows: [], id: companyId(c) };
      byCompany[c].rows.push(p);
    });
    const newCompanies = [];
    const newApps = [];
    for (const [name, { id, rows }] of Object.entries(byCompany)) {
      const first = rows[0];
      const locations = new Set();
      const cats = new Set();
      let deadline = '', updatedAt = first.updatedAt || todayDate(), applyUrl = '';
      rows.forEach((r) => {
        if (r.location) r.location.split(/\/|、/).forEach((x) => { const t = x.trim(); if (t) locations.add(t); });
        if (r.category) r.category.split(/\/|、/).forEach((x) => { const t = x.trim(); if (t) cats.add(t); });
        if (r.deadline && (!deadline || r.deadline < deadline)) deadline = r.deadline;
        if (r.updatedAt && r.updatedAt > updatedAt) updatedAt = r.updatedAt;
        if (r.applyUrl && !applyUrl) applyUrl = r.applyUrl;
      });
      const catSorted = CATEGORIES.filter((c) => cats.has(c));
      const hadApp = rows.some((r) => r.status && r.status !== '未投递');
      newCompanies.push({
        id, seed: false, updatedAt, company: name, companyType: first.companyType || '民企',
        industry: first.industry || '', location: [...locations].join('/'), category: catSorted.join('/'),
        deadline, applyUrl, status: hadApp ? '已投递' : '未浏览'
      });
      rows.forEach((r) => {
        if (!r.status || r.status === '未投递') return;
        let stage = 0, round = 1;
        if (r.status === '已投递') stage = 0;
        else if (r.status === '笔试') stage = 2;
        else if (r.status === '约面' || r.status === '面试中') { stage = 3; round = 1; }
        else if (r.status === 'offer') stage = 5;
        else if (r.status === '拒绝') stage = 4;
        newApps.push({ id: uid(), companyId: id, company: name, position: r.position || '', stage, round, updatedAt: todayDate() });
      });
    }
    companies = newCompanies;
    apps = newApps;
    save();
    localStorage.removeItem(OLD_STORE_KEY);
    return true;
  } catch (e) {
    localStorage.removeItem(OLD_STORE_KEY);
    return false;
  }
}

/* ---------- 持久化 ---------- */
let seedAdded = 0;
function getSeed() { return Array.isArray(window.QIUZHAO_SEED) ? window.QIUZHAO_SEED : []; }
function cloneSeed(arr) {
  return arr.map((p) => ({ ...p, createdAt: new Date().toISOString(), updatedAt: p.updatedAt || todayDate() }));
}
function mergeSeed() {
  const seed = getSeed();
  if (!seed.length) return 0;
  let added = 0;
  const have = new Set(companies.map((c) => c.id));
  seed.forEach((p) => {
    if (!have.has(p.id)) { companies.push({ ...p, createdAt: new Date().toISOString(), updatedAt: p.updatedAt || todayDate() }); added++; }
  });
  return added;
}
function load() {
  const hasNew = localStorage.getItem(STORE_KEY);
  if (!hasNew) { if (migrateOld()) { seedAdded = mergeSeed(); if (seedAdded) save(); return; } }
  try { const d = JSON.parse(localStorage.getItem(STORE_KEY)); if (Array.isArray(d)) companies = d; } catch (e) {}
  try { const a = JSON.parse(localStorage.getItem(APPS_KEY)); if (Array.isArray(a)) apps = a; } catch (e) {}
  try { const s = JSON.parse(localStorage.getItem(SETTINGS_KEY)); if (s) settings = Object.assign(settings, s); } catch (e) {}
  if (!companies.length) seed();
  else { seedAdded = mergeSeed(); if (seedAdded) save(); }
}
function save() {
  localStorage.setItem(STORE_KEY, JSON.stringify(companies));
  localStorage.setItem(APPS_KEY, JSON.stringify(apps));
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
function seed() {
  const s = getSeed();
  companies = s.length ? cloneSeed(s) : SAMPLE.map((p) => ({ id: companyId(p.company), createdAt: new Date().toISOString(), updatedAt: p.updatedAt || todayDate(), ...p }));
  save();
}

/* ---------- 相似度匹配 ---------- */
function extractKeywords(text) {
  if (!text) return [];
  const stop = new Set(['熟悉', '掌握', '了解', '使用', '负责', '参与', '项目', '以及', '进行', '能够', '以上', '相关', '熟练', '具有', '一定', '较强', '良好', '沟通', '能力', '团队', '学习', '工作', '经验', '本科', '硕士', '等', '和', '与', '或', '对', '有', '在', '为', '的', '及']);
  const toks = text.split(/[\s,，。、；;：:()（）\n\r/]+/).map((t) => t.trim()).filter(Boolean);
  const out = [];
  for (const t of toks) {
    if (t.length >= 2 && t.length <= 8 && !stop.has(t) && !/^\d+$/.test(t)) out.push(t);
  }
  return [...new Set(out)].slice(0, 40);
}
function computeMatch(c, s) {
  let score = 0; const reasons = [];
  const compCats = (c.category || '').split('/').filter(Boolean);
  if (s.categories.length && s.categories.some((x) => compCats.includes(x))) { score += 30; reasons.push('方向匹配'); }
  if (s.cities.length) {
    const compCities = (c.location || '').split('/').filter(Boolean);
    const hit = s.cities.some((city) => compCities.includes(city));
    if (hit) { score += 25; reasons.push('城市匹配'); }
  }
  if (s.industries.length && s.industries.includes(c.industry)) { score += 20; reasons.push('行业匹配'); }
  const want = (s.skills || []).concat(s.keywords || []);
  const text = [c.company, c.category, c.industry, c.location].join(' ');
  const overlap = want.filter((w) => w && text.includes(w));
  if (overlap.length) { score += Math.min(25, overlap.length * 9); reasons.push('技能: ' + [...new Set(overlap)].slice(0, 3).join('/')); }
  return { score: Math.min(100, Math.round(score)), reasons };
}

/* ---------- 界面1：信息搜集 ---------- */
function refreshFilters() {
  const typeSel = $('filter-type'), catSel = $('filter-category'), stSel = $('filter-status');
  const tv = typeSel.value, cv = catSel.value, sv = stSel.value;
  typeSel.innerHTML = '<option value="">全部公司类型</option>' + COMPANY_TYPES.map((o) => `<option>${o}</option>`).join('');
  const cats = [...new Set(companies.flatMap((c) => (c.category || '').split('/').filter(Boolean)))].filter(Boolean);
  catSel.innerHTML = '<option value="">全部岗位类别</option>' + cats.map((c) => `<option>${escapeHtml(c)}</option>`).join('');
  stSel.innerHTML = '<option value="">全部投递状态</option>' + COMPANY_STATES.map((s) => `<option>${s}</option>`).join('');
  typeSel.value = tv; catSel.value = cv; stSel.value = sv;
}
function renderCollect() {
  const q = $('search-input').value.trim().toLowerCase();
  const ft = $('filter-type').value, fc = $('filter-category').value, fs = $('filter-status').value;
  const rows = companies.filter((c) => {
    if (ft && c.companyType !== ft) return false;
    if (fc && !(c.category || '').split('/').includes(fc)) return false;
    if (fs && c.status !== fs) return false;
    if (q) { const hay = (c.company + c.location + c.industry + c.category).toLowerCase(); if (!hay.includes(q)) return false; }
    return true;
  });
  const STATUS_SORT = { '未浏览': 0, '已投递': 1, '不投递': 2 };
  rows.sort((a, b) => (STATUS_SORT[a.status] - STATUS_SORT[b.status]) || (companies.indexOf(a) - companies.indexOf(b)));
  const tb = $('pos-tbody');
  tb.innerHTML = rows.map((c) => `
    <tr class="row-st-${c.status}">
      <td>${escapeHtml(c.updatedAt || '-')}</td>
      <td class="company-cell"><div class="cell-ellipsis" title="${escapeHtml(c.company)}">${escapeHtml(c.company)}</div></td>
      <td><span class="type-tag t-${c.companyType}">${escapeHtml(c.companyType)}</span></td>
      <td><div class="cell-ellipsis" title="${escapeHtml(c.industry || '-')}">${escapeHtml(c.industry || '-')}</div></td>
      <td><div class="cell-ellipsis" title="${escapeHtml(c.location || '-')}">${escapeHtml(c.location || '-')}</div></td>
      <td><div class="cell-ellipsis" title="${escapeHtml(c.category || '-')}">${escapeHtml(c.category || '-')}</div></td>
      <td>${escapeHtml(c.deadline || '-')}</td>
      <td>${c.applyUrl ? `<a href="${escapeHtml(c.applyUrl)}" target="_blank" rel="noopener">投递↗</a>` : '-'}</td>
      <td><select class="status-select st-${c.status}" data-id="${c.id}">${COMPANY_STATES.map((s) => `<option ${s === c.status ? 'selected' : ''}>${s}</option>`).join('')}</select></td>
      <td><div class="row-actions"><button class="btn sm" data-edit="${c.id}">编辑</button><button class="btn sm danger" data-del="${c.id}">删</button></div></td>
    </tr>`).join('');
  $('collect-empty').hidden = companies.length > 0;
  $('collect-count').textContent = `共 ${companies.length} 家公司，当前筛选 ${rows.length} 家`;
  tb.querySelectorAll('.status-select').forEach((sel) => {
    sel.onchange = () => {
      const c = companies.find((x) => x.id === sel.dataset.id);
      if (!c) return;
      const old = c.status;
      c.status = sel.value; c.updatedAt = todayDate(); save();
      if (c.status === '已投递' && old !== '已投递') {
        pendingAppCompany = c;
        pendingAppOldStatus = old;
        openAppModal();
      }
      renderCollect();
      if (currentView === 'dashboard') renderDashboard();
      if (currentView === 'apps') renderApps();
    };
  });
  tb.querySelectorAll('[data-edit]').forEach((b) => (b.onclick = () => openModal(b.dataset.edit)));
  tb.querySelectorAll('[data-del]').forEach((b) => (b.onclick = () => delCompany(b.dataset.del)));
}
function delCompany(id) {
  const c = companies.find((x) => x.id === id);
  if (!c) return;
  if (!confirm(`确认删除「${c.company}」？`)) return;
  companies = companies.filter((x) => x.id !== id);
  apps = apps.filter((a) => a.companyId !== id);
  save(); refreshFilters(); renderCollect();
  if (currentView === 'dashboard') renderDashboard();
  if (currentView === 'apps') renderApps();
  toast('已删除');
}

/* ---------- 弹窗：新增 / 编辑公司 ---------- */
function openModal(id) {
  const isEdit = !!id;
  $('modal-title').textContent = isEdit ? '编辑公司' : '新增公司';
  const c = isEdit ? companies.find((x) => x.id === id) : {};
  $('f-id').value = id || '';
  $('f-updated').value = c.updatedAt || todayDate();
  $('f-company').value = c.company || '';
  $('f-type').value = c.companyType || '民企';
  $('f-industry').value = c.industry || '';
  $('f-location').value = c.location || '';
  $('f-category').value = c.category || '';
  $('f-deadline').value = c.deadline || '';
  $('f-url').value = c.applyUrl || '';
  $('f-status').value = c.status || '未浏览';
  $('modal-mask').hidden = false;
  $('f-company').focus();
}
function closeModal() { $('modal-mask').hidden = true; }
function submitCompany(e) {
  e.preventDefault();
  const id = $('f-id').value;
  const name = $('f-company').value.trim();
  const data = {
    updatedAt: $('f-updated').value || todayDate(),
    company: name,
    companyType: $('f-type').value,
    industry: $('f-industry').value.trim(),
    location: $('f-location').value.trim(),
    category: $('f-category').value.trim(),
    deadline: $('f-deadline').value,
    applyUrl: $('f-url').value.trim(),
    status: $('f-status').value
  };
  if (!data.company) { toast('公司名称为必填'); return; }
  if (id) {
    const c = companies.find((x) => x.id === id);
    Object.assign(c, data);
  } else {
    companies.unshift({ id: companyId(name), createdAt: new Date().toISOString(), ...data });
  }
  save(); refreshFilters(); renderCollect(); closeModal();
  if (currentView === 'dashboard') renderDashboard();
  if (currentView === 'apps') renderApps();
  toast(id ? '已更新' : '已新增');
}
function resetStatuses() {
  if (!confirm('确认把所有公司状态重置为「未浏览」？\n（仅重置信息搜集里的投递状态，不影响你新增的公司；\n注意：重置后这些公司在「我的投递」看板里的卡片会暂时隐藏，重新标记为「已投递」即可恢复。）')) return;
  companies.forEach((c) => { c.status = '未浏览'; c.updatedAt = todayDate(); });
  save(); refreshFilters(); renderCollect();
  if (currentView === 'apps') renderApps();
  if (currentView === 'dashboard') renderDashboard();
  toast('已全部重置为未浏览');
}

/* ---------- 弹窗：添加已投递岗位 ---------- */
function openAppModal() {
  const c = pendingAppCompany;
  if (!c) return;
  $('app-modal-title').textContent = `添加已投递岗位 - ${c.company}`;
  $('app-position').value = '';
  $('app-modal-mask').hidden = false;
  $('app-position').focus();
}
/* 关闭“添加已投递岗位”弹窗：若本次未填写任何岗位，则把公司状态回退，
   避免出现“已投递却无任何投递卡片”的孤儿记录（即保证岗位非空、联动一致） */
function closeAppModal() {
  const c = pendingAppCompany;
  if (c && c.status === '已投递' && !apps.some((a) => a.companyId === c.id)) {
    c.status = pendingAppOldStatus || '未浏览';
    c.updatedAt = todayDate();
    save();
    if (currentView === 'collect') renderCollect();
    if (currentView === 'dashboard') renderDashboard();
  }
  pendingAppCompany = null;
  pendingAppOldStatus = null;
  $('app-modal-mask').hidden = true;
}
function cancelAppModal() {
  closeAppModal();
  toast('已取消');
}
function submitApp(e) {
  e.preventDefault();
  if (!pendingAppCompany) return;
  const name = $('app-position').value.trim();
  if (!name) { toast('岗位名称不能为空'); return; }
  addApplication(pendingAppCompany.id, pendingAppCompany.company, name);
  $('app-position').value = '';
  $('app-position').focus();
}
function finishAppModal() {
  // 若用户直接点「添加完成」而未先点「添加并继续」，此处补存当前输入框里的岗位
  if (pendingAppCompany) {
    const name = $('app-position').value.trim();
    if (name) addApplication(pendingAppCompany.id, pendingAppCompany.company, name);
  }
  const c = pendingAppCompany;
  const reverted = !!c && c.status === '已投递' && !apps.some((a) => a.companyId === c.id);
  closeAppModal();
  if (currentView === 'apps') renderApps();
  toast(reverted ? '未填写岗位，已退回原状态' : '已保存');
}
function addApplication(companyId, company, position) {
  apps.push({ id: uid(), companyId, company, position, stage: 0, round: 1, updatedAt: todayDate() });
  save();
}

/* ---------- 界面2：求职意向 & 匹配 ---------- */
function renderChips(container, items) {
  container.innerHTML = '';
  items.forEach((val, idx) => {
    const chip = document.createElement('span');
    chip.className = 'chip';
    chip.innerHTML = `${escapeHtml(val)} <button type="button" aria-label="删除">×</button>`;
    chip.querySelector('button').onclick = () => { items.splice(idx, 1); renderChips(container, items); };
    container.appendChild(chip);
  });
  const inp = document.createElement('input');
  inp.placeholder = '输入后回车添加…';
  inp.onkeydown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const v = inp.value.trim();
      if (v && !items.includes(v)) { items.push(v); renderChips(container, items); }
      inp.value = '';
    }
  };
  container.appendChild(inp);
}
function initIntent() {
  intentCats = settings.categories.slice();
  intentCities = settings.cities.slice();
  intentIndustries = settings.industries.slice();
  intentSkills = settings.skills.slice();
  $('resume-text').value = settings.resumeText || '';
  renderChips($('intent-categories'), intentCats);
  renderChips($('intent-cities'), intentCities);
  renderChips($('intent-industries'), intentIndustries);
  renderChips($('intent-skills'), intentSkills);
}
function saveIntent() {
  settings.categories = intentCats.slice();
  settings.cities = intentCities.slice();
  settings.industries = intentIndustries.slice();
  settings.skills = intentSkills.slice();
  settings.resumeText = $('resume-text').value;
  settings.keywords = extractKeywords(settings.resumeText);
  settings.updatedAt = new Date().toISOString();
  save();
  toast('意向已保存，匹配已更新');
  renderMatch();
}
function renderMatch() {
  const list = $('match-list');
  const emptyIntent = !settings.categories.length && !settings.cities.length && !settings.industries.length && !settings.skills.length && !settings.keywords.length;
  if (emptyIntent) { list.innerHTML = '<p class="hint">先在左侧填写求职意向并保存，系统会自动匹配全部在招公司。</p>'; return; }
  const scored = companies.map((c) => ({ c, ...computeMatch(c, settings) })).sort((a, b) => b.score - a.score);
  if (!scored.length) { list.innerHTML = '<p class="hint">暂无公司可匹配。</p>'; return; }
  list.innerHTML = scored.slice(0, 80).map(({ c, score, reasons }) => `
    <div class="match-item">
      <div class="match-score">${score}<small> 分</small></div>
      <div class="match-body">
        <div class="m-head">${escapeHtml(c.company)} · ${escapeHtml(c.category || '-')}</div>
        <div class="m-sub">${escapeHtml(c.location || '地点未知')} · ${escapeHtml(c.industry || '-')} · ${escapeHtml(c.deadline || '截止未知')}</div>
        <div class="match-reasons">${reasons.map((r) => `<span class="reason-tag">${escapeHtml(r)}</span>`).join('') || '<span class="reason-tag">基础匹配</span>'}</div>
        <div class="score-bar"><div style="width:${score}%"></div></div>
      </div>
    </div>`).join('');
}

/* ---------- 界面3：我的投递 看板 ---------- */
function visibleApps() {
  const appliedCompanyIds = new Set(companies.filter((c) => c.status === '已投递').map((c) => c.id));
  return apps.filter((a) => appliedCompanyIds.has(a.companyId));
}
function renderApps() {
  const list = visibleApps();
  const counts = KANBAN_COLUMNS.map((_, i) => list.filter((a) => a.stage === i).length);
  const container = $('kanban-board');
  container.innerHTML = KANBAN_COLUMNS.map((label, idx) => `
    <div class="kanban-col" data-stage="${idx}">
      <div class="kanban-header">
        <span class="kanban-title">${escapeHtml(label)}</span>
        <span class="kanban-count">${counts[idx]}</span>
      </div>
      <div class="kanban-cards">
        ${list.filter((a) => a.stage === idx).map((a) => appCardHTML(a)).join('')}
      </div>
    </div>`).join('');
  $('apps-empty').hidden = list.length > 0;
  container.querySelectorAll('[data-next]').forEach((b) => (b.onclick = () => moveApp(b.dataset.id, 'next')));
  container.querySelectorAll('[data-reject]').forEach((b) => (b.onclick = () => moveApp(b.dataset.id, 'reject')));
  container.querySelectorAll('[data-delete-app]').forEach((b) => (b.onclick = () => deleteApp(b.dataset.id)));
}
function appCardHTML(a) {
  const isInterview = a.stage === STAGE_INTERVIEW;
  const roundText = isInterview ? `<span class="round-badge">${a.round}面</span>` : '';
  const canNext = a.stage !== STAGE_OFFER && a.stage !== STAGE_REJECT;
  return `
    <div class="app-card" data-id="${a.id}">
      <div class="card-main">
        <div class="card-company">${escapeHtml(a.company)} ${roundText}</div>
        <div class="card-position">${escapeHtml(a.position || '未命名岗位')}</div>
      </div>
      <div class="card-actions">
        ${canNext ? `<button class="btn xs" data-id="${a.id}" data-next="${a.id}">下一流程</button>` : ''}
        ${a.stage !== STAGE_REJECT ? `<button class="btn xs danger" data-id="${a.id}" data-reject="${a.id}">被拒绝</button>` : ''}
        <button class="btn xs ghost" data-id="${a.id}" data-delete-app="${a.id}">删除</button>
      </div>
    </div>`;
}
function moveApp(id, action) {
  const a = apps.find((x) => x.id === id);
  if (!a) return;
  if (action === 'reject') {
    a.stage = STAGE_REJECT;
  } else if (action === 'next') {
    if (a.stage === STAGE_INTERVIEW) {
      if (a.round < 3) { a.round++; }
      else { a.stage = STAGE_OFFER; a.round = 1; }
    } else if (a.stage === 0) { a.stage = 1; }
    else if (a.stage === 1) { a.stage = 2; }
    else if (a.stage === 2) { a.stage = STAGE_INTERVIEW; a.round = 1; }
  }
  a.updatedAt = todayDate();
  save(); renderApps();
}
function deleteApp(id) {
  if (!confirm('确认删除这条投递记录？')) return;
  apps = apps.filter((a) => a.id !== id);
  save(); renderApps();
}

/* ---------- 页面3：秋招仪表盘 ---------- */
function barList(items, total) {
  if (!items.length) return '<p class="hint">暂无数据</p>';
  const denom = Math.max(1, total || 0);
  return items.map((it, i) => {
    const pct = denom ? Math.round((it.value / denom) * 100) : 0;
    return `<div class="bar-row">
      <span class="bar-label">${escapeHtml(it.label)}</span>
      <span class="bar-track"><span class="bar-fill stage-${i}" style="width:${pct}%;background:${it.color}"></span></span>
      <span class="bar-val">${it.value}${total ? ` · ${pct}%` : ''}</span>
    </div>`;
  }).join('');
}
function columnChart(items, total) {
  if (!items.length) return '<p class="hint">暂无数据</p>';
  const denom = Math.max(1, total || 0);
  return `<div class="column-chart-inner">${items.map((it) => {
    const pct = denom ? Math.round((it.value / denom) * 100) : 0;
    return `<div class="column-row">
      <div class="column-bar-wrap">
        <span class="column-pct">${pct}%</span>
        <span class="column-bar" style="height:${pct}%;background:${it.color}"></span>
      </div>
      <div class="column-meta">
        <span class="column-label">${escapeHtml(it.label)}</span>
        <span class="column-count">${it.value} 家</span>
      </div>
    </div>`;
  }).join('')}</div>`;
}
function pipelineColor(i) { return ['#2563eb', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ef4444', '#16a34a'][i] || '#9aa5b1'; }
function typeColor(t) { return ({ '民企': '#2f6fed', '外企': '#8b5cf6', '央国企': '#dc2626' })[t] || '#9aa5b1'; }
function renderDashboard() {
  const total = companies.length;
  const statusCount = { '未浏览': 0, '已投递': 0, '不投递': 0 };
  companies.forEach((c) => { statusCount[c.status] = (statusCount[c.status] || 0) + 1; });
  const stageCounts = [0, 0, 0, 0, 0, 0];
  apps.forEach((a) => { if (a.stage >= 0 && a.stage <= 5) stageCounts[a.stage]++; });
  const applied = statusCount['已投递'];
  const interviewing = stageCounts[3];
  const offers = stageCounts[5];
  const stats = [
    { label: '收录公司', value: total, cls: 'accent', icon: '🏢' },
    { label: '已投递', value: applied, cls: 'green', icon: '📨' },
    { label: '面试中', value: interviewing, cls: 'orange', icon: '🎯' },
    { label: '获得 Offer', value: offers, cls: 'red', icon: '🏆' },
    { label: '被拒绝', value: stageCounts[4], cls: 'muted', icon: '🌧' }
  ];
  const statsEl = $('dash-stats');
  statsEl.innerHTML = stats.map((s, i) => `
    <div class="kpi ${s.cls}" style="animation-delay:${i * 70}ms">
      <span class="k-icon">${s.icon}</span>
      <div class="k-num" data-count="${s.value}">0</div>
      <div class="k-label">${s.label}</div>
    </div>`).join('');
  statsEl.querySelectorAll('.k-num').forEach((el) => countUp(el, Number(el.dataset.count)));

  const offerRate = applied ? Math.round((offers / applied) * 100) : 0;
  $('dash-summary').innerHTML = `已收录 <b>${total}</b> 家公司 · 投递 <b>${applied}</b> 家 · 面试中 <b>${interviewing}</b> · 收获 <b>${offers}</b> 个 Offer（命中率 ${offerRate}%）`;
  const now = new Date();
  const wk = ['周日','周一','周二','周三','周四','周五','周六'][now.getDay()];
  $('dash-date').textContent = `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日 · ${wk}`;

  renderDonut($('dash-status'), $('dash-status-legend'), [
    { label: '未浏览', value: statusCount['未浏览'], color: STATUS_COLORS['未浏览'] },
    { label: '已投递', value: statusCount['已投递'], color: STATUS_COLORS['已投递'] },
    { label: '不投递', value: statusCount['不投递'], color: STATUS_COLORS['不投递'] }
  ], total);

  $('dash-pipeline').innerHTML = barList(KANBAN_COLUMNS.map((label, i) => ({
    label, value: stageCounts[i], color: pipelineColor(i)
  })), Math.max(1, apps.length));

  const typeCount = {};
  companies.forEach((c) => { typeCount[c.companyType] = (typeCount[c.companyType] || 0) + 1; });
  $('dash-types').innerHTML = columnChart(COMPANY_TYPES.map((t) => ({
    label: t, value: typeCount[t] || 0, color: typeColor(t)
  })), Math.max(1, total));
}
function countUp(el, target) {
  if (target <= 0) { el.textContent = '0'; return; }
  const dur = 700, start = performance.now();
  function step(now) {
    const p = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(eased * target).toString();
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function renderDonut(donutEl, legendEl, items, total) {
  if (!total) {
    donutEl.style.background = '#eef2f7';
    donutEl.innerHTML = `<div class="donut-hole"><span class="donut-total">0</span><span class="donut-cap">公司</span></div>`;
    legendEl.innerHTML = '<li class="donut-empty">暂无公司数据</li>';
    return;
  }
  let acc = 0; const segs = [];
  items.forEach((it) => {
    const frac = (it.value / total) * 100;
    segs.push(`${it.color} ${acc}% ${acc + frac}%`);
    acc += frac;
  });
  donutEl.style.background = `conic-gradient(${segs.join(',')})`;
  donutEl.innerHTML = `<div class="donut-hole"><span class="donut-total">${total}</span><span class="donut-cap">家公司</span></div>`;
  legendEl.innerHTML = items.map((it) => {
    const pct = total ? Math.round((it.value / total) * 100) : 0;
    return `<li><span class="dot" style="background:${it.color}"></span><span class="lg-label">${it.label}</span><span class="lg-val">${it.value}</span><span class="lg-pct">${pct}%</span></li>`;
  }).join('');
}

/* ---------- 导入 / 导出 ---------- */
function exportData() {
  const blob = new Blob([JSON.stringify({ companies, apps, settings }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `秋招数据_${todayDate()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  toast('已导出 JSON');
}
function importData(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const d = JSON.parse(reader.result);
      if (Array.isArray(d.companies)) companies = d.companies;
      if (Array.isArray(d.apps)) apps = d.apps;
      if (d.settings) settings = Object.assign(settings, d.settings);
      save(); refreshFilters(); if ($('resume-text')) initIntent(); renderCollect();
      if (currentView === 'dashboard') renderDashboard();
      if (currentView === 'apps') renderApps();
      toast('导入成功');
    } catch (e) { alert('导入失败：文件格式不正确'); }
  };
  reader.readAsText(file);
}

/* ---------- 页面切换 ---------- */
const VIEW_TITLES = { collect: '信息搜集', apps: '我的投递', dashboard: '秋招仪表盘', network: '网申填写', match: '岗位匹配' };
function switchView(view) {
  currentView = view;
  document.querySelectorAll('.nav-item').forEach((t) => t.classList.toggle('active', t.dataset.view === view));
  document.querySelectorAll('.view').forEach((v) => v.classList.toggle('active', v.id === 'view-' + view));
  const t = $('page-title'); if (t) t.textContent = VIEW_TITLES[view] || '';
  if (view === 'apps') renderApps();
  if (view === 'dashboard') renderDashboard();
}

/* ---------- 数据脚本动态加载 ---------- */
function loadSeedScript(cb) {
  const inject = (url, allowFallback) => {
    const s = document.createElement('script');
    s.src = url;
    s.onload = () => cb && cb(true);
    s.onerror = () => {
      if (allowFallback) { const s2 = document.createElement('script'); s2.src = 'data/positions.js'; s2.onload = () => cb && cb(true); s2.onerror = () => cb && cb(false); document.head.appendChild(s2); }
      else cb && cb(false);
    };
    document.head.appendChild(s);
  };
  inject('data/positions.js?_=' + Date.now(), true);
}
function updateSyncInfo() {
  const el = $('sync-info'); if (!el) return;
  const seed = getSeed();
  if (!seed.length) { el.textContent = '官方开放库未加载'; return; }
  const dates = seed.map((r) => r.updatedAt).filter(Boolean).sort();
  const max = dates[dates.length - 1] || '-';
  el.textContent = `官方库最近更新：${max} · 共 ${seed.length} 家公司`;
}
function startAutoSync() {
  setInterval(() => {
    loadSeedScript(() => {
      updateSyncInfo();
      const n = mergeSeed();
      if (n) { save(); refreshFilters(); renderCollect(); if (currentView === 'dashboard') renderDashboard(); toast(`已自动同步 ${n} 家新公司`); }
    });
  }, 10 * 60 * 1000);
}

/* ---------- 初始化 ---------- */
function init() {
  load();
  refreshFilters();
  renderCollect();
  if ($('resume-text')) initIntent();

  $('side-nav').addEventListener('click', (e) => { const b = e.target.closest('.nav-item'); if (b) switchView(b.dataset.view); });
  $('btn-add').onclick = () => openModal(null);
  $('btn-reset-status').onclick = resetStatuses;
  $('btn-cancel').onclick = closeModal;
  $('btn-close-x').onclick = closeModal;
  $('modal-mask').addEventListener('click', (e) => { if (e.target === $('modal-mask')) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('modal-mask').hidden) closeModal(); });
  $('pos-form').addEventListener('submit', submitCompany);

  $('app-btn-cancel').onclick = cancelAppModal;
  $('app-btn-close-x').onclick = closeAppModal;
  $('app-modal-mask').addEventListener('click', (e) => { if (e.target === $('app-modal-mask')) closeAppModal(); });
  $('app-form').addEventListener('submit', submitApp);
  $('app-btn-finish').onclick = finishAppModal;

  $('btn-sync').onclick = () => {
    loadSeedScript(() => {
      updateSyncInfo();
      const n = mergeSeed();
      if (n) { save(); refreshFilters(); renderCollect(); if (currentView === 'dashboard') renderDashboard(); }
      toast(n ? `已同步 ${n} 家新公司` : '已是最新，暂无新增');
    });
  };

  $('search-input').addEventListener('input', renderCollect);
  $('filter-type').addEventListener('change', renderCollect);
  $('filter-category').addEventListener('change', renderCollect);
  $('filter-status').addEventListener('change', renderCollect);

  if ($('btn-save-intent')) $('btn-save-intent').onclick = saveIntent;
  $('btn-export').onclick = exportData;
  $('btn-import').onclick = () => $('file-import').click();
  $('file-import').addEventListener('change', (e) => { if (e.target.files[0]) importData(e.target.files[0]); e.target.value = ''; });

  if (seedAdded) toast(`已自动同步 ${seedAdded} 家新公司`);
}

function boot() { updateSyncInfo(); init(); startAutoSync(); }
function startApp() { loadSeedScript(() => boot()); }
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
