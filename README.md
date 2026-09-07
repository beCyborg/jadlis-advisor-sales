Русский · [English](README.en.md)

# Разбор звонка, застрявшая сделка, скрипт

Плагин `advisor-sales` для Claude Code. Команда — `/advisor-sales`.

## Было → стало

Раздел заполняется по контракту README 2026-09 (фаза 3 плана «GitHub beCyborg как витрина Jadlis»).

## Как это работает

Четыре режима: разбор транскрипта звонка (--call), диагноз застрявшей сделки (--deal), оценка sales-артефакта (--verdict) и конвейер написания (--write). Шестнадцать советников-слоёв сделки по 21 книге, подмножество по типу задачи.

## Установка и первый запуск

```bash
claude plugin marketplace add https://github.com/beCyborg/jadlis-start.git
claude plugin install advisor-sales@jadlis --config MEMORY_DIR=~/advisors-memory
```

## Границы, стоимость, обновление

Конспекты книг — производные работы, лицензии нет: см. [NOTICE.md](NOTICE.md). Правки принимаются только в источнике (`jadlis-advisors-source`), этот репо генерируется.

```bash
claude plugin marketplace update jadlis
claude plugin update advisor-sales@jadlis
```
