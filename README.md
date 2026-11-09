# Проектная работа 11-го спринта

[Макет](<https://www.figma.com/file/vIywAvqfkOIRWGOkfOnReY/React-Fullstack_-Проектные-задачи-(3-месяца)_external_link?type=design&node-id=0-1&mode=design>)

[Чеклист](https://www.notion.so/praktikum/0527c10b723d4873aa75686bad54b32e?pvs=4)

## Этапы работы:

1. Разверните проект и ознакомьтесь с кодом. Все необходимые вам компоненты уже созданы и лежат в папке `src/components`

2. Настройте роутинг.

3. Напишите функционал запросов данных с сервера, используя `Redux` и глобальный `store`. Сами "ручки" уже прописаны и лежат в `utils/burger-api.ts`

4. Настройте авторизацию и создайте защищённые роуты.

## Важно:

Для корректной работы запросов к серверу необходимо добавить переменную BURGER_API_URL в окружение. Сама ссылка находится в файле `.env.example`.

## Тесты

Проект покрыт юнит-тестами Jest и e2e-тестами Playwright.

```bash
# Юнит-тесты Jest
npm test

# Юнит-тесты Jest с отчётом о покрытии (папка coverage)
npm run test:coverage

# E2E-тесты Playwright (перед первым запуском: npx playwright install chromium)
npm run test:playwright
```

Jest-тесты слайсов, редьюсеров и селекторов лежат в `src/services/__tests__`.
E2E-тесты страницы «Конструктор» — в `tests/constructor.pl.tsx`.
Ответы бэкенда для e2e-тестов лежат в `tests/hars` и подключаются через `page.routeFromHAR`.
Playwright сам запускает dev-сервер на `http://localhost:4000`.

