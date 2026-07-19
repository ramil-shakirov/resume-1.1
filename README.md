# Resume 1.1 — Static Fiori Resume

Статический форк `Resume/frontend/Resume_freestyle`: тот же дизайн и Fiori-вёрстка, но без зависимости от SAP BTP — данные резюме лежат в локальном JSON, и всё приложение целиком деплоится на GitHub Pages.

## Структура
- `backend/resume.json` — данные резюме (источник правды, редактируется здесь)
- `frontend/` — freestyle UI5-приложение (`webapp/`), пакует и разрабатывается через `npm start`
- `docs/` — архитектура и инструкция по деплою

## Что сохранено
- Внешний вид и Fiori-дизайн — без изменений
- Погодный виджет (openweathermap.org)
- Кнопка "PDF speichern"

## Что изменилось
- Данные резюме — из `backend/resume.json`, а не из OData/BTP
- UI5-фреймворк грузится с CDN `sdk.openui5.org`, а не с BTP-инстанции
- Деплой — GitHub Actions → GitHub Pages

## Локальная разработка
```
cd frontend
npm install
npm start
```
Если менял `backend/resume.json`, перед этим выполни `npm run sync-data`, чтобы приложение видело актуальные данные.

## Подробнее
- [docs/architecture.md](docs/architecture.md)
- [docs/github-pages-setup.md](docs/github-pages-setup.md)
