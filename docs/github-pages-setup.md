# Деплой на GitHub Pages — пошагово

Всё уже подготовлено локально: сама папка `Resume_1.1` станет корнем репозитория, деплой полностью автоматический через `.github/workflows/deploy.yml`.

## 1. Создать репозиторий на GitHub
- На github.com → New repository.
- Имя: `resume-1.1` (или любое другое — код не завязан на конкретное имя, все пути относительные).
- **Публичный** репозиторий — на бесплатном плане GitHub Pages работает только для публичных репо (если у тебя GitHub Pro/Team, можно и приватный).
- Ничего не инициализировать (без README/.gitignore/license) — файлы уже есть локально.

## 2. Запушить локальную папку
Из папки `Resume_1.1`:
```
git init
git add .
git commit -m "Initial static resume app"
git branch -M main
git remote add origin https://github.com/<твой-логин>/resume-1.1.git
git push -u origin main
```

## 3. Включить Pages через GitHub Actions
- В репозитории: Settings → Pages.
- В блоке "Build and deployment" → Source: выбрать **GitHub Actions** (не "Deploy from a branch").
- Больше ничего настраивать не нужно — workflow `.github/workflows/deploy.yml` подхватится автоматически.

## 4. Проверить деплой
- Вкладка **Actions** в репозитории — там должен запуститься workflow "Deploy to GitHub Pages" (стартует сам после пуша в `main`).
- Дождаться зелёной галочки у обоих джобов (`build` и `deploy`).
- После этого в Settings → Pages появится ссылка вида `https://<твой-логин>.github.io/resume-1.1/` — это и есть готовый сайт.

## Дальнейшие обновления
После любого `git push` в `main` workflow пересобирает и передеплоивает сайт автоматически — вручную ничего включать заново не нужно.

Если меняешь данные резюме — правь `backend/resume.json`, коммить и пушь как обычно; синхронизацию в `frontend/webapp/model/resume.json` workflow делает сам на каждом деплое.
