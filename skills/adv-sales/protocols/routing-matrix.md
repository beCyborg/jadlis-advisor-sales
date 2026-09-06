# Routing Matrix — adv-sales: режимы, типы, подмножества ростера

Полный ростер 16 не запускается ни в одном режиме — это условие качества, не оптимизация:
8–10 нерелевантных книг производят правдоподобный шум, который куратор поднимает в claims.
Жёсткие гейты deal-profile-gate.md применяются ПОВЕРХ этих подмножеств.

Кворум везде: `quorum = max(3, ceil(0.75 × N_built))`, N_built — после субсеттинга и
preflight `ls -d`. N_built < 4 → совет не созывается (standalone-советник).
N_built < 5 → в вердикте запрещена метка STRONG.

## VERDICT — по типу артефакта

| Тип артефакта | Советники (5–6) |
|---|---|
| discovery (план/скрипт дискавери-звонка, список вопросов) | gap, spin, khalsa, founding, jolt |
| pitch (питч, дек, скрипт демо) | dunford-pitch, resonate, story, jolt, klaff-frame†, selling-with |
| outreach (холодное письмо/сообщение, follow-up последовательность) | spin, enns, founding, voss, story |
| proposal (КП, пропозал, прайсинг-страница) | weiss, enns, khalsa, qsl, negotiation |
| followup (письмо после звонка/демо, materials для чемпиона) | selling-with, jolt, blount-objections, voss, dunford-pitch |

† klaff-frame в VERDICT·pitch участвует с капом веса (FitMultiplier ≤0.5 вне
investor-контекста — см. deal-profile-gate).

Тип артефакта определяется из запроса; неоднозначно → AskUserQuestion.
Длинный артефакт кладётся в `{WORK_DIR}/_artifact.md`, в query движка идёт путь.

## CALL — разбор транскрипта

Ядро (6): gap, spin, khalsa, blount-objections, jolt, story.
Опции: +voss (в звонке живые переговоры цены/условий), +qsl (mid/high ACV и комитет).
Протокол: call-review-protocol.md.

## DEAL — застрявшая сделка

3–6 по симптому «где застряло» — таблица в deal-protocol.md. Гейты профиля обязательны.

## WRITE — конвейер написания

Драфт-линзы (3, фиксированные):

| id | Линза | Инструкция |
|---|---|---|
| diagnostic | Диагностический каркас | текст строится вокруг проблемы клиента и цены бездействия; структура ведёт от симптома к оцифрованному разрыву (gap/spin/khalsa) |
| insight-frame | Инсайт и позиция | текст открывается неожиданным для клиента взглядом на его ситуацию (инсайт по Данфорд), автор в позиции эксперта, не просителя (enns) |
| decision-safety | Безопасность решения | текст снижает страх ошибки: derisk, социальное доказательство, ограничение выбора, простой следующий шаг (jolt/selling-with) |

Критики по типу текста (4–5):

| Тип текста | Критики |
|---|---|
| outreach-письмо | spin, enns, voss, story |
| followup / чемпион-материалы | selling-with, jolt, blount-objections, dunford-pitch |
| КП / пропозал | weiss, khalsa, qsl, negotiation, enns |
| скрипт звонка / talk track | gap, spin, blount-objections, voss, story |
| питч-дек / нарратив демо | dunford-pitch, resonate, story, jolt |

`klaff-frame` в WRITE не участвует вообще (extraction-слой не пишет тексты пользователю).

## Микро-запросы

Один вопрос / одна формулировка / «как ответить на это возражение» → standalone-советник
(`/advisor-blount-objections`, `/advisor-voss`, …), не совет. Отдельного типа
`objection-kit` в v1 нет: возражения — сквозная забота критиков + standalone OBJ.

## Не-триггеры (маршрутизация в другие советы)

- Лендинг/email-копирайтинг → /adv-copy
- «Сколько должен стоить продукт» (прайсинг продукта) → /adv-product
- «Откуда брать лиды» (генерация спроса) → /adv-influence
- Зарплатные/личные переговоры → /adv-Decision
- Вебинары/продажа со сцены → отказ (контур отложен решением пользователя)
