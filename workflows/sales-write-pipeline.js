export const meta = {
  name: 'sales-write-pipeline',
  description: 'WRITE-конвейер adv-sales: бриф → 3 драфта (diagnostic / insight-frame / decision-safety) → критика советников по routing-matrix → синтез финального текста → файл в папке памяти',
  phases: [
    { title: 'Drafts', detail: '3 параллельных writer-агента: линзы diagnostic / insight-frame / decision-safety' },
    { title: 'Critique', detail: 'советники по routing-matrix критикуют все 3 драфта через Deal-gate профиля' },
    { title: 'Synthesize', detail: 'синтезатор собирает финал из лучшего в драфтах с учётом критики' },
    { title: 'Deliver', detail: 'пост-write по memory-write-contract: запись в журнал прогонов' },
  ],
}

// ── Параметры (adv-sales Phase A готовит бриф интерактивно и передаёт сюда готовым) ──
const A = (() => { try { return typeof args === 'string' ? JSON.parse(args) : (args || {}) } catch (e) { return {} } })()
// Корень плагина: ${CLAUDE_PLUGIN_ROOT} в JS не подставляется — скилл передаёт значением.
const PLUGIN_ROOT = A.pluginRoot || '.'

const brief = A.brief || {}
const outputName = A.outputName
const today = A.today
const outDir = A.outDir
if (!outDir) { return { status: 'error', reason: 'args.outDir обязателен: скилл adv-sales передаёт папку памяти значением' } }
const workDir = A.workDir || `${outDir}/.tmp-write-${outputName}`
const WORK_DIR = workDir

// Воркер совета: субагент плагина (Opus, effort high). Оркестратор может передать
// workerOpts: { model: 'opus' } как фоллбэк, если субагент недоступен.
const WORKER_OPTS = A.workerOpts || { agentType: 'advisor-sales:advisor-opus' }
const w = extra => Object.assign({}, WORKER_OPTS, extra)

// Ростер передаёт скилл (только фактически существующие советники, формат {slug,prefix,book,skillPath}).
const ADVISORS = A.advisors
if (!Array.isArray(ADVISORS) || !ADVISORS.length) {
  return { status: 'error', reason: 'args.advisors пуст: ростер критиков передаёт скилл adv-sales после preflight ls -d' }
}

// Критики по типу текста (routing-matrix.md — канон; здесь копия для детерминизма прогона).
const ROUTING = {
  'outreach':    ['spin', 'enns', 'voss', 'story'],
  'followup':    ['selling-with', 'jolt', 'blount-objections', 'dunford-pitch'],
  'proposal':    ['weiss', 'khalsa', 'qsl', 'negotiation', 'enns'],
  'call-script': ['gap', 'spin', 'blount-objections', 'voss', 'story'],
  'pitch-deck':  ['dunford-pitch', 'resonate', 'story', 'jolt'],
}

const SK = `${PLUGIN_ROOT}/lenses`
const LENSES = [
  { id: 'diagnostic', name: 'Диагностический каркас',
    refs: [`${SK}/advisor-gap/references/moves.md`, `${SK}/advisor-spin/references/moves.md`, `${SK}/advisor-khalsa/references/moves.md`],
    instruction: 'Строй текст вокруг проблемы клиента и цены бездействия: от симптома к оцифрованному разрыву. Ни одного утверждения о продукте раньше, чем читатель узнал свою ситуацию. Вопросы и факты клиента из брифа — несущая конструкция.' },
  { id: 'insight-frame', name: 'Инсайт и позиция эксперта',
    refs: [`${SK}/advisor-dunford-pitch/references/moves.md`, `${SK}/advisor-enns/references/moves.md`],
    instruction: 'Открой текст неожиданным для клиента взглядом на его ситуацию (инсайт), держи позицию эксперта, не просителя: никаких «умоляем уделить время», цена/условия называются уверенно, альтернативы клиента признаются явно.' },
  { id: 'decision-safety', name: 'Безопасность решения',
    refs: [`${SK}/advisor-jolt/references/moves.md`, `${SK}/advisor-selling-with/references/moves.md`],
    instruction: 'Снижай страх ошибки, а не нагнетай FOMO: derisk (пилот, гарантии, критерии выхода), социальное доказательство, ограничение выбора до одной явной рекомендации, простой следующий шаг с низкой ценой согласия.' },
]

// ── Схемы ──
const DRAFT_SCHEMA = { type: 'object', additionalProperties: false, properties: {
  lens: { type: 'string' }, path: { type: 'string' },
  hooks: { type: 'array', items: { type: 'string' } },
  approach: { type: 'string' },
}, required: ['lens', 'path', 'hooks', 'approach'] }

const CRITIQUE_SCHEMA = { type: 'object', additionalProperties: false, properties: {
  slug: { type: 'string' }, path: { type: 'string' },
  perDraft: { type: 'array', items: { type: 'object', additionalProperties: false, properties: {
    lens: { type: 'string' }, score: { type: 'integer' },
    strengths: { type: 'array', items: { type: 'string' } },
    fixes: { type: 'array', items: { type: 'object', additionalProperties: false, properties: {
      issue: { type: 'string' }, rewrite: { type: 'string' }, tag: { type: 'string' } },
      required: ['issue', 'rewrite', 'tag'] } },
  }, required: ['lens', 'score', 'strengths', 'fixes'] } },
  bestFragments: { type: 'object', additionalProperties: false, properties: {
    hook: { type: 'string' }, body: { type: 'string' }, proof: { type: 'string' }, cta: { type: 'string' } },
    required: ['hook', 'body', 'proof', 'cta'] },
  gateNote: { type: 'string', description: 'ходы драфтов, чей Deal-gate не совпадает с dealProfile брифа' },
}, required: ['slug', 'path', 'perDraft', 'bestFragments'] }

const FINAL_SCHEMA = { type: 'object', additionalProperties: false, properties: {
  reportPath: { type: 'string' }, finalHook: { type: 'string' },
  altHooks: { type: 'array', items: { type: 'string' } },
  techniques: { type: 'array', items: { type: 'string' } },
  status: { type: 'string' },
}, required: ['reportPath', 'finalHook', 'altHooks', 'techniques', 'status'] }

const DELIVER_SCHEMA = { type: 'object', additionalProperties: false, properties: {
  status: { type: 'string' }, notes: { type: 'string' } }, required: ['status'] }

// ── Промпты ──
function writerPrompt(l) {
  return `Ты — нейтральный автор sales-текстов. Линза этого драфта: **${l.name}**.
${l.instruction}

## Бриф (JSON — источник истины, ничего не выдумывай сверх него)
${JSON.stringify(brief, null, 2)}

## Инструкции
1. Прочитай reference-файлы линзы (tool Read, несуществующие молча пропусти):
${l.refs.map(r => `   - ${r}`).join('\n')}
2. Если \`brief.swipeFile\` задан и файл существует — прочитай, используй как образцы тона, НЕ копируй.
3. Напиши ПОЛНЫЙ драфт под \`brief.type\` (${brief.type}): outreach — письмо/сообщение; followup — письмо после касания (+ материалы для чемпиона, если уместно); proposal — структура КП с текстом ключевых секций; call-script — talk track со структурой и формулировками; pitch-deck — посекционный нарратив дека.
4. Язык = \`brief.language\` (${brief.language}); ДОСЛОВНЫЕ фразы клиента из brief.audience — использовать; пруфы/цифры — ТОЛЬКО из brief.offer; историю касаний из brief.context — учитывать (текст «с нуля» при живой истории = фальшь).
5. Этика: ни одного хода, который автор не готов показать самому клиенту; нейро-обоснования запрещены.
6. Сначала \`mkdir -p "${workDir}"\` (Bash), затем Write в \`${workDir}/draft-${l.id}.md\`; в конце файла — секция \`## Крючки-альтернативы\` (3–5).
7. Верни по схеме: lens="${l.id}", path, hooks (3–5), approach (2–3 фразы).

НЕ спавни саб-агентов, НЕ вызывай skills. Рассуждения — на языке брифа.`
}

function criticPrompt(c, ds) {
  return `Ты — советник-критик **${c.book}** совета adv-sales. Критикуешь ВСЕ драфты строго через призму СВОЕГО слоя сделки.

## Бриф (JSON)
${JSON.stringify(brief, null, 2)}

## Инструкции
1. Прочитай \`${c.skillPath}/SKILL.md\` (Read); по его Reference Navigation — до 2 reference-файлов под задачу.
2. Прочитай ВСЕ драфты (Read каждый):
${ds.map(d => `   - ${d.path}`).join('\n')}
3. Для КАЖДОГО драфта: score 1–10 через призму своего слоя; strengths; конкретные fixes (issue → готовый rewrite → citation-тег \`[${c.prefix}:CODE]\` из СВОИХ references — НЕ выдумывай теги).
4. Deal-gate: сверь предлагаемые драфтами ходы с brief.dealProfile; несовпадения — в gateNote.
5. bestFragments: лучший hook/body/proof/cta среди драфтов, с линзой-источником и почему.
6. Write полной критики в \`${workDir}/critique-${c.slug}.md\`, затем верни по схеме: slug="${c.slug}", path, perDraft[], bestFragments, gateNote.

Язык = язык брифа (${brief.language}). НЕ спавни саб-агентов, НЕ вызывай skills.`
}

function synthPrompt(ds, cs) {
  const finalPath = `${outDir}/${outputName}.md`
  return `Ты — синтезатор-финализатор sales-текста. Собери ФИНАЛЬНЫЙ текст из лучшего в драфтах с учётом критики.

## Бриф (JSON — источник истины)
${JSON.stringify(brief, null, 2)}

## Файлы драфтов (Read каждый)
${ds.map(d => `- ${d.path}`).join('\n')}

## Файлы критик (Read каждый)
${cs.length ? cs.map(c => `- ${c.path}`).join('\n') : '- (критик нет — синтез только из драфтов)'}

## Задача
- Собери финальный текст из лучшего (bestFragments критиков — сильный сигнал, арбитр — ты).
- Примени fixes, где они улучшают текст; отклонённые перечисли в сводке с причиной.
- Не изобретай факты/пруфы сверх брифа; язык = brief.language (${brief.language}); связность выше лоскутности.
- Этический контур: ход, который пользователь не готов показать клиенту, в финал не идёт.
- Сначала \`mkdir -p "${outDir}"\` (Bash), затем Write в \`${finalPath}\`:

---
type: ${brief.type}
language: ${brief.language}
date: ${today}
source: adv-sales/write
---
# ${outputName}

## Финальный текст
{готовый к использованию текст}

## Альтернативные крючки
{5–10, отранжированы}

## Использованные приёмы
{[PREFIX:CODE] — что применено и где}

## Сводка критики
{по драфтам: что взято/отклонено и почему; таблица score×критик; gateNote-замечания}

## В свайп-файл?
> Победивший крючок — кандидат в \`_Свайп-файл.md\` (секция ${brief.type}/${brief.language}). Занести после подтверждения пользователя — сам конвейер в свайп-файл не пишет.

После записи верни по схеме: reportPath="${finalPath}", finalHook, altHooks, techniques, status="ok".
НЕ спавни саб-агентов, НЕ вызывай skills.`
}

function deliverPrompt() {
  const finalPath = `${outDir}/${outputName}.md`
  return `Ты — лёгкий deliver-агент пост-write. Файл результата уже записан: \`${finalPath}\`.

1. Прочитай \`${PLUGIN_ROOT}/shared/memory-write-contract.md\` (Read).
2. Выполни post-write шаги для \`${finalPath}\`: в т.ч. строку в журнал прогонов \`${outDir}/../Журнал советов.md\` вида \`- ${today} · adv-sales · WRITE · ${outputName} — <итог одной строкой>\`.
3. Журнала нет — создай его с заголовком \`# Журнал советов\` и допиши строку.
4. Ничего не удаляй; драфты в \`${workDir}\` оставь.

Верни по схеме: status, notes. НЕ спавни саб-агентов, НЕ вызывай skills.`
}

// ── Валидация args ──
if (!A.brief || !brief.task || !brief.type || !brief.language || !outputName) {
  return { status: 'error', reason: 'brief/outputName incomplete — Phase A обязана собрать бриф по brief-protocol.md' }
}
if (!ROUTING[brief.type]) {
  return { status: 'error', reason: `неизвестный тип «${brief.type}» — нет routing-matrix (outreach|followup|proposal|call-script|pitch-deck)` }
}
if (!brief.dealProfile) {
  return { status: 'error', reason: 'brief.dealProfile обязателен (deal-profile-gate.md, экран 1)' }
}

// ═══ Phase 1 — Drafts ═══
phase('Drafts')
log(`Пишу драфты (линзы: ${LENSES.map(l => l.id).join(', ')})...`)
const drafts = (await parallel(LENSES.map(l => () =>
  agent(writerPrompt(l), w({ label: `draft:${l.id}`, phase: 'Drafts', schema: DRAFT_SCHEMA }))
))).filter(Boolean)
if (drafts.length < 2) {
  log(`Недостаточно драфтов (${drafts.length} < 2) — прекращаю.`)
  return { status: 'insufficient-drafts', drafts, workDir }
}

// ═══ Phase 2 — Critique ═══
phase('Critique')
const bySlug = Object.fromEntries(ADVISORS.map(a => [a.slug, a]))
const critics = ROUTING[brief.type].map(s => bySlug[s]).filter(Boolean)
log(`Критики по routing-matrix (${brief.type}): ${critics.map(c => c.slug).join(', ') || '—'}`)
const critiques = (await parallel(critics.map(c => () =>
  agent(criticPrompt(c, drafts), w({ label: `critique:${c.slug}`, phase: 'Critique', schema: CRITIQUE_SCHEMA }))
))).filter(Boolean)
const criticsWarning = critiques.length === 0
if (criticsWarning) log('Ни один критик не ответил — синтез только из драфтов (criticsWarning).')

// ═══ Phase 3 — Synthesize ═══
phase('Synthesize')
const FINAL_FIELDS = 'reportPath (строка), finalHook (строка), altHooks (массив строк), techniques (массив строк), status (строка)'
const synthText = synthPrompt(drafts, critiques)
const finalDefaultPath = `${outDir}/${outputName}.md`
const synthCall = agent(synthText, w({ label: 'synth', phase: 'Synthesize', schema: FINAL_SCHEMA }))
const final = (await synthCall.catch(e => {
  log(`synth structured-return не удался (${e && e.message ? e.message : e}) — читай файл из ${finalDefaultPath}`)
  return { reportPath: finalDefaultPath, status: 'written-no-meta' }
})) || { reportPath: finalDefaultPath, status: 'written-no-meta' }

// ═══ Phase 4 — Deliver ═══
phase('Deliver')
const delivered = await agent(deliverPrompt(), { label: 'deliver', phase: 'Deliver', schema: DELIVER_SCHEMA }).catch(() => null)

return {
  status: final.status === 'written-no-meta' ? 'written-no-meta' : 'ok',
  reportPath: final.reportPath || finalDefaultPath,
  finalHook: final.finalHook,
  altHooks: final.altHooks,
  techniques: final.techniques,
  drafts: drafts.map(d => ({ lens: d.lens, path: d.path })),
  critics: critiques.map(c => c.slug),
  criticsWarning,
  deliverStatus: delivered && delivered.status,
  workDir,
}
