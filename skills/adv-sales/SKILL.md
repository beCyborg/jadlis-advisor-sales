---
name: adv-sales
user-invocable: true
argument-hint: "<транскрипт/сделка/артефакт/что написать> (--call / --deal / --verdict / --write)"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - AskUserQuestion
  - Workflow
model: opus
effort: high
description: |
  Совет по продажам «продажник» — 16 советников-слоёв сделки, ЧЕТЫРЕ режима.
  CALL: разбор транскрипта реального звонка (анкоры [Tnn], ≤3 хода на следующий звонок).
  DEAL: диагноз застрявшей сделки (диагноз → ход → сигнал → критерий дисквала).
  VERDICT: оценка sales-артефакта (скрипт дискавери, питч, outreach, КП, follow-up).
  WRITE: конвейер написания (бриф → 3 драфта → критика по типу → синтез финала).
  21 книга: SPIN Selling (Rackham), Gap Selling (Keenan), The JOLT Effect (Dixon/McKenna),
  Sales Pitch (Dunford), Never Split the Difference (Voss), Sell with a Story (Smith),
  What Great Salespeople Do (Bosworth/Zoldan), Let's Get Real or Let's Not Play (Khalsa),
  Objections (Blount), The Win Without Pitching Manifesto (Enns), The Four Conversations (Enns),
  Founding Sales (Kazanjy), The Mom Test (Fitzpatrick), Getting to Yes (Fisher/Ury),
  Start with No (Camp), Pitch Anything (Klaff), Flip the Script (Klaff),
  The Qualified Sales Leader (McMahon), Selling With (Nasralla), Value-Based Fees (Weiss),
  Resonate (Duarte).
  Invoke via /advisors:adv-sales.
  English triggers: review my sales call, call transcript review, deal review, stuck deal,
  deal is stalling, discovery call prep, sales pitch feedback, cold outreach message,
  follow-up email after demo, proposal review, objection handling, negotiate the price,
  champion enablement, qualify this deal, sales talk track.
  Russian triggers: разбери звонок, разбор звонка, транскрипт звонка, сделка застряла,
  сделка висит, клиент пропал после КП, подготовь дискавери, оцени питч, оцени КП,
  напиши аутрич, письмо после звонка, холодное письмо клиенту, скрипт звонка,
  возражение клиента, переговоры о цене, дожать сделку, квалифицировать сделку,
  совет по продажам, продажник.
  DO NOT TRIGGER when: маркетинговый копирайтинг — лендинг, email-рассылка, VSL,
  продающий пост (use /advisors:adv-copy); прайсинг продукта, "сколько должен стоить" (use
  /advisors:adv-product); генерация лидов, откуда брать клиентов, воронка (use /advisors:adv-influence);
  зарплатные и личные переговоры (use /advisors:adv-Decision); вебинары и продажа со сцены —
  контур отложен, вежливый отказ.
---

# Совет по продажам — 16 советников, 4 режима (Skill + Workflow)

Тяжёлую часть исполняют детерминированные workflow. Скилл делает интерактивный intake
(Phase A: deal-profile-gate), маршрутизирует режим и оформляет результат. Главная
ценность — петля разбора реального звонка/сделки, а не пересказ глав.

## Константы

```
PLUGIN_ROOT = ${CLAUDE_PLUGIN_ROOT}
MEMORY_DIR  = ${user_config.ADVISORS_MEMORY_DIR}
OUTPUT_DIR  = {MEMORY_DIR}/Продажи
CALLS_DIR   = {MEMORY_DIR}/Звонки
PROFILE     = {MEMORY_DIR}/Профили/adv-sales.md
RUN_LOG     = {MEMORY_DIR}/Журнал советов.md
WORK_DIR    = {MEMORY_DIR}/_runs/sales-{РЕЖИМ}-{QUERY_SLUG}
```

Внутри протоколов, линз и общих контрактов пути записаны плейсхолдерами `{PLUGIN_ROOT}` и
`{MEMORY_DIR}`: подстановка `${CLAUDE_PLUGIN_ROOT}` и `${user_config.*}` в читаемые файлы не
доходит. Подставляй значения сам; литеральный `{PLUGIN_ROOT}` в Read не отправляй.

## Phase A.0 — гейт памяти (первым, каждый запуск)

1. `MEMORY_DIR` пуст **или** в нём буквально видно `${user_config` → **остановиться**:
   > Не задана папка памяти советов. Открой `/plugin` → advisors → настройки и укажи
   > `ADVISORS_MEMORY_DIR` (например `~/advisors-memory`), либо переустанови плагин с
   > `--config ADVISORS_MEMORY_DIR=<путь>`. Разборы в текущую рабочую папку совет не пишет.
2. Путь начинается с `~/` → заменить `~` на `$HOME` **до любой записи**.
3. Развернуть скелет — идемпотентно, существующие файлы не трогает; если папка создана
   впервые, сказать об этом и перечислить, что в ней появилось:
   ```bash
   bash "${CLAUDE_PLUGIN_ROOT}/scripts/init-memory.sh" "{MEMORY_DIR}" "${CLAUDE_PLUGIN_ROOT}"
   ```
4. `mkdir -p "{OUTPUT_DIR}"` — подпапка вердиктов этого совета.
5. Ни один шаг скилла не пишет за пределы `{MEMORY_DIR}`.

## Дом результатов

`{OUTPUT_DIR}`. Транскрипты звонков → `{CALLS_DIR}` — копия туда ТОЛЬКО по явному
подтверждению пользователя и после редактирования имён/компаний; без подтверждения
WORK_DIR удаляется целиком (retention-политика: ничего из реальных звонков не хранится
молча).

## Ростер (16 советников)

Формат для движков — `{slug, book, author, prefix, skillPath}`; skillPath =
`${CLAUDE_PLUGIN_ROOT}/lenses/advisor-<slug>` (для мульти-книжных — общее имя линзы;
значение `PLUGIN_ROOT` подставляется до передачи в args).

| Slug | Слой | Prefix | Книги |
|---|---|---|---|
| gap | дискавери: диагностика | GAP | Gap Selling (Keenan) |
| spin | дискавери: вопросы | SPIN | SPIN Selling (Rackham) |
| qsl | квалификация/MEDDPICC | QSL | The Qualified Sales Leader (McMahon) |
| khalsa | услуги: честное дискавери | REAL | Let's Get Real or Let's Not Play (Khalsa) |
| enns | услуги: позиция эксперта | WWP | Win Without Pitching + The Four Conversations (Enns) |
| founding | свои продукты, founder-led | FOUND | Founding Sales (Kazanjy) + The Mom Test (Fitzpatrick) |
| jolt | нерешительность / no decision | JOLT | The JOLT Effect (Dixon/McKenna) |
| selling-with | чемпион / комитет | SWITH | Selling With (Nasralla) |
| negotiation | переговорный фундамент | NEGO | Getting to Yes (-GTY) ⊥ Start with No (-CAMP) |
| weiss | консалтинг: цена от ценности | VBF | Value-Based Fees (Weiss) |
| dunford-pitch | структура устного питча | PITCH | Sales Pitch (Dunford) |
| blount-objections | таксономия возражений | OBJ | Objections (Blount) |
| voss | языковой микрослой переговоров | VOSS | Never Split the Difference (Voss) |
| story | устный сторителлинг | STORY | Sell with a Story (Smith) + What Great Salespeople Do (Bosworth/Zoldan) |
| resonate | архитектура выступления | RESO | Resonate (Duarte) |
| klaff-frame | extraction-only: фрейм/статус | FRAME | Pitch Anything + Flip the Script (Klaff) |

Мульти-книжные советники различают источники суффиксами кодов (`[NEGO:X-GTY]` /
`[NEGO:X-CAMP]`); klaff-frame — extraction-only (нейромифология вычищена по banLexicon +
семантический аудит F3), в WRITE не участвует, в VERDICT·pitch — с капом веса.

## Phase A — intake (все режимы)

1. **Режим**: флаги `--call/--deal/--verdict/--write` приоритетны; иначе эвристика:
   транскрипт/«разбери звонок» → CALL; «сделка застряла/висит/пропал» → DEAL;
   «оцени/разбери <артефакт>» → VERDICT; «напиши/составь» → WRITE.
   Неоднозначно → AskUserQuestion.
2. **Память**: `{PROFILE}` → USER_CONTEXT (секция Profile целиком, НЕ переписывать;
   session log — только append).
3. **Профиль сделки**: `protocols/deal-profile-gate.md` (≤2 экрана AskUserQuestion; если
   Profile в памяти покрывает — пропустить, сказав вслух) → DEAL_PROFILE, EXCLUDED
   (жёсткие гейты), FIT (множители).
4. **Субсеттинг**: `protocols/routing-matrix.md` → режимное подмножество; минус EXCLUDED;
   preflight `ls -d "{skillPath}"` → N_built; `quorum = max(3, ceil(0.75 × N_built))`;
   N_built < 4 → совет не созывается, предложить standalone-советника.
   N_built < 5 → в вердикте запрещена метка STRONG; ростер неполный → warning
   «N/16, отсутствуют: …» в шапке.
5. **Смета**: перед запуском показать пользователю cap прогона: CALL/VERDICT ≈ 35–45
   вызовов модели (fan-out + curator + до 36 скептиков + validator), DEAL ≈ 20–30,
   WRITE ≈ 8–10. Это заметно для недельной квоты — частые прогоны бюджетировать.
6. **Микро-запрос** (один вопрос, одна формулировка, одно возражение) → прочитай одну линзу
   (`${CLAUDE_PLUGIN_ROOT}/lenses/advisor-blount-objections`, `…/advisor-voss`, …) и ответь
   сам, совет не созывай.

## CALL — разбор звонка

Phase A: нормализация транскрипта по `protocols/call-review-protocol.md` →
`{WORK_DIR}/transcript.md` с анкорами `[T01] ПРОДАВЕЦ: …`. Гейт разметки сторон:
не размечено и не восстановимо → вслух деградировать до VERDICT-по-саммари.

```
Workflow({ scriptPath: "${CLAUDE_PLUGIN_ROOT}/workflows/sales-council.js",
  args: { mode: 'call', transcriptPath: "{WORK_DIR}/transcript.md",
    query: "<цель звонка + какой по счёту + контекст>", dealProfile: "<DEAL_PROFILE строкой>",
    userContext: USER_CONTEXT, advisors: <CALL-подмножество: gap, spin, khalsa,
      blount-objections, jolt, story; +voss при живых переговорах цены; +qsl при mid/high+комитет>,
    quorum: <q>, workDir: WORK_DIR, pluginRoot: PLUGIN_ROOT } })
```

Дождись `<task-notification>`. Источник истины — файл reportPath (не verdictMeta).
Показ вердикта → предложить: (а) сохранить вердикт в `{OUTPUT_DIR}` (имя — русское,
3–7 слов, дедуп `ls "{OUTPUT_DIR}"`), (б) сохранить редактированный транскрипт
в `{CALLS_DIR}`, (в) занести ходы в Playbook памяти. Всё — только по подтверждению;
затем `rm -rf WORK_DIR`. Пост-write (ниже).

## DEAL — застрявшая сделка

Интейк по deal-profile-gate (оба экрана; «не знаю» = диагноз, идёт в вердикт) → бриф
сделки в `{WORK_DIR}/deal-brief.md` (симптом, сколько висит, кто в решении, против кого,
история касаний) → тот же `sales-council.js` с `mode:'deal', briefPath:...`;
ростер 3–6 по симптому — таблица в `protocols/deal-protocol.md`. Каждый диагноз вердикта
несёт четвёрку «диагноз → ход → сигнал → критерий дисквала» и дедлайн решения.

## VERDICT — оценка артефакта

Тип артефакта (discovery / pitch / outreach / proposal / followup) → подмножество из
`protocols/routing-matrix.md`. Артефакт кладётся в `{WORK_DIR}/_artifact.md`, в query
идёт путь (инлайн нельзя — движок размножит текст ~36 раз). Движок переиспользуемый:

```
Workflow({ scriptPath: "${CLAUDE_PLUGIN_ROOT}/workflows/council-influence.js",
  args: { query: "Оцени sales-артефакт: {WORK_DIR}/_artifact.md (тип: <тип>). <контекст 1-2 фразы>",
    userContext: USER_CONTEXT + "\nDEAL_PROFILE: <строка>\nFIT: <множители из гейта>",
    advisors: <VERDICT-подмножество>, quorum: <q>, workDir: WORK_DIR,
    pluginRoot: PLUGIN_ROOT,
    validatorProtocol: "${CLAUDE_PLUGIN_ROOT}/skills/adv-sales/protocols/validator-protocol.md" } })
```

Валидатор считает по формуле ФАЙЛА протокола (Score × FitMultiplier, кластеры) — в карте
консенсуса обязана быть колонка Fit×; нет её — вердикт принят с нарушением, отметить.
Результат: имя файла — русское 3–7 слов, `cp` в `{OUTPUT_DIR}`, показать вердикт + ledger,
`rm -rf WORK_DIR`, пост-write.

## WRITE — конвейер написания

Бриф-интервью по `protocols/brief-protocol.md` (типы: outreach / followup / proposal /
call-script / pitch-deck; dealProfile обязателен; дословные фразы клиента; пруфы только
реальные; история касаний):

```
Workflow({ scriptPath: "${CLAUDE_PLUGIN_ROOT}/workflows/sales-write-pipeline.js",
  args: { brief: <по контракту brief-protocol>, outputName: <имя без .md>,
    today: "<date +%F>", advisors: <существующие из ростера>,
    outDir: OUTPUT_DIR, workDir: WORK_DIR, pluginRoot: PLUGIN_ROOT } })
```

Результат — `{OUTPUT_DIR}/{outputName}.md` (финал + альтернативные крючки + приёмы с тегами +
сводка критики). Победивший крючок — кандидат в `{MEMORY_DIR}/Свайп-файл.md` только
по подтверждению.

## Пост-write (все режимы)

`${CLAUDE_PLUGIN_ROOT}/shared/memory-write-contract.md` (Read по требованию): допиши одну
строку в `{RUN_LOG}` — `- YYYY-MM-DD · adv-sales · {режим} · {имя файла} — {итог одной
строкой}`. Session log в `{PROFILE}` — append; Profile и Playbook не трогать без
подтверждения.

## Ключевые принципы

1. **Каждый агент = один слой сделки**; синтез — только в валидаторе/синтезаторе.
2. **Citation-теги обязательны** и должны существовать в references советника;
   выдуманный тег обнуляет рекомендацию.
3. **CALL**: находка без анкора `[Tnn]` недействительна; вывод ≤3 хода на следующий
   звонок — материал сверх лимита остаётся в хронологии.
4. **DEAL**: ход без критерия дисквала не выпускается — совет обязан уметь сказать «отпусти».
5. **Анти-псевдоконсенсус**: согласие внутри кластера традиций — эхо школы; бонус
   консенсуса только между кластерами (validator-protocol).
6. **Этика**: ход, который пользователь не готов показать покупателю, не идёт в вердикт;
   нейро-обоснования («рептильный мозг» и парафразы) = REFUTED by design; klaff+voss+
   «дожать» не собираются в манипулятивный скрипт — при конфликте с khalsa проигрывают.
7. **Конфиденциальность**: реальные транскрипты — хранение только по подтверждению,
   с редактированием имён; смоуки — только на синтетике.
8. **Deal-gate**: ход, чей гейт не совпадает с профилем сделки, — только с явной оговоркой.

## Инфраструктура

- Линзы: `${CLAUDE_PLUGIN_ROOT}/lenses/advisor-<slug>` — данные, а не скиллы; в контекст
  сами не попадают, их читают воркеры совета.
- Движки: `sales-council.js` (CALL/DEAL), `council-influence.js` (VERDICT, переиспользован),
  `sales-write-pipeline.js` (WRITE) — все в `${CLAUDE_PLUGIN_ROOT}/workflows/`.
- Память: `{PROFILE}` (Profile / Playbook / Session log).

## Response Language

Язык интерфейса/вердикта = язык запроса. Язык текста WRITE = `brief.language`.
Citation-теги и Deal-gate — на английском.
