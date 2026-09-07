[Русский](README.md) · English

# advisor-sales — Claude Code plugin

Command: `/advisor-sales`.

## Было → стало

To be written (README contract 2026-09, phase 3).

## Как это работает

Четыре режима: разбор транскрипта звонка (--call), диагноз застрявшей сделки (--deal), оценка sales-артефакта (--verdict) и конвейер написания (--write). Шестнадцать советников-слоёв сделки по 21 книге, подмножество по типу задачи.

## Установка и первый запуск

```bash
claude plugin marketplace add https://github.com/beCyborg/jadlis-start.git
claude plugin install advisor-sales@jadlis --config MEMORY_DIR=~/advisors-memory
```

## Границы, стоимость, обновление

Book digests are derivative works, no licence: see [NOTICE.md](NOTICE.md). This repository is generated from a private source; open issues here, edits land in the source.

```bash
claude plugin marketplace update jadlis
claude plugin update advisor-sales@jadlis
```
