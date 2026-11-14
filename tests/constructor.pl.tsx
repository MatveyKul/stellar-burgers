import path from 'path';
import { test, expect, BrowserContext, Page, Locator } from '@playwright/test';

const HAR_DIR = path.join(__dirname, 'hars');

const bun = {
  name: 'Краторная булка N-200i',
  calories: 420,
  proteins: 80,
  fat: 24,
  carbohydrates: 53
};

const mainIngredient = {
  name: 'Биокотлета из марсианской Магнолии',
  calories: 4242,
  proteins: 420,
  fat: 142,
  carbohydrates: 242
};

const sauce = {
  name: 'Соус с шипами Антарианского плоскоходца',
  calories: 100,
  proteins: 101,
  fat: 99,
  carbohydrates: 100
};

const orderNumber = 12345;

const setupBackend = async (
  page: Page,
  { authorized = false }: { authorized?: boolean } = {}
) => {
  await page.routeFromHAR(path.join(HAR_DIR, 'ingredients.har'), {
    url: '**/ingredients'
  });
  await page.routeFromHAR(
    path.join(
      HAR_DIR,
      authorized ? 'auth-authorized.har' : 'auth-unauthorized.har'
    ),
    { url: '**/auth/user' }
  );
  await page.routeFromHAR(path.join(HAR_DIR, 'create-order.har'), {
    url: '**/orders'
  });
};

const setFakeTokens = async (page: Page, context: BrowserContext) => {
  await page.addInitScript(() => {
    localStorage.setItem('refreshToken', 'test-refresh-token');
  });
  await context.addCookies([
    {
      name: 'accessToken',
      value: 'test-access-token',
      domain: 'localhost',
      path: '/'
    }
  ]);
};

const openConstructorPage = async (
  page: Page,
  { authorized = false }: { authorized?: boolean } = {}
) => {
  await setupBackend(page, { authorized });
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Соберите бургер' })
  ).toBeVisible();
};

const getIngredientCard = (page: Page, name: string | RegExp) =>
  page
    .locator('li')
    .filter({ hasText: name })
    .filter({ has: page.getByRole('button', { name: 'Добавить' }) });

const addIngredient = async (page: Page, name: string | RegExp) => {
  await getIngredientCard(page, name)
    .getByRole('button', { name: 'Добавить' })
    .click();
};

const getNutritionValue = (modal: Locator, label: string) =>
  modal.locator('li').filter({ hasText: label }).locator('p').last();

test.describe('Страница «Конструктор»: модальное окно ингредиента', () => {
  test('открывает модальное окно с описанием выбранного ингредиента', async ({
    page
  }) => {
    await openConstructorPage(page);

    await page.getByRole('link', { name: /Краторная булка/ }).click();

    const modal = page.locator('#modals');
    await expect(
      modal.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();
    await expect(modal).toContainText(bun.name);
  });

  test('отображает данные именно того ингредиента, по которому кликнули', async ({
    page
  }) => {
    await openConstructorPage(page);

    await page.getByRole('link', { name: /Соус с шипами/ }).click();

    const modal = page.locator('#modals');
    await expect(modal).toContainText(sauce.name);
    await expect(getNutritionValue(modal, 'Калории, ккал')).toHaveText(
      String(sauce.calories)
    );
    await expect(getNutritionValue(modal, 'Белки, г')).toHaveText(
      String(sauce.proteins)
    );
    await expect(getNutritionValue(modal, 'Жиры, г')).toHaveText(
      String(sauce.fat)
    );
    await expect(getNutritionValue(modal, 'Углеводы, г')).toHaveText(
      String(sauce.carbohydrates)
    );
    await expect(modal).not.toContainText(bun.name);
  });

  test('закрывает модальное окно по клику на крестик', async ({ page }) => {
    await openConstructorPage(page);

    await page.getByRole('link', { name: /Краторная булка/ }).click();
    await expect(page.locator('#modals')).toContainText('Детали ингредиента');

    await page.locator('#modals button').click();

    await expect(page.locator('#modals')).toBeEmpty();
  });

  test('закрывает модальное окно по клику на оверлей', async ({ page }) => {
    await openConstructorPage(page);

    await page.getByRole('link', { name: /Краторная булка/ }).click();
    await expect(page.locator('#modals')).toContainText('Детали ингредиента');

    const overlay = page.locator('#modals > div').last();
    await overlay.click({ position: { x: 10, y: 10 } });

    await expect(page.locator('#modals')).toBeEmpty();
  });
});

test.describe('Страница «Конструктор»: сборка бургера', () => {
  test('добавляет булку из списка ингредиентов в конструктор', async ({
    page
  }) => {
    await openConstructorPage(page);

    await addIngredient(page, /Краторная булка/);

    await expect(
      page.getByText(`${bun.name} (верх)`, { exact: true })
    ).toBeVisible();
    await expect(
      page.getByText(`${bun.name} (низ)`, { exact: true })
    ).toBeVisible();

    const bunCard = page.getByRole('link', { name: /Краторная булка/ });
    await expect(bunCard.locator('.counter__num')).toHaveText('2');
  });

  test('добавляет ингредиент из списка ингредиентов в конструктор', async ({
    page
  }) => {
    await openConstructorPage(page);

    await addIngredient(page, /Биокотлета/);
    await addIngredient(page, /Биокотлета/);

    const mainCard = page.getByRole('link', { name: /Биокотлета/ });
    await expect(mainCard.locator('.counter__num')).toHaveText('2');

    const constructorSection = page.locator('section').filter({
      has: page.getByRole('button', { name: 'Оформить заказ' })
    });
    await expect(
      constructorSection.getByText(mainIngredient.name, { exact: true })
    ).toHaveCount(2);
  });
});

test.describe('Страница «Конструктор»: оформление заказа', () => {
  test('создаёт заказ, показывает его номер и очищает конструктор', async ({
    page,
    context
  }) => {
    await setFakeTokens(page, context);
    await openConstructorPage(page, { authorized: true });

    await addIngredient(page, /Краторная булка/);
    await addIngredient(page, /Биокотлета/);

    const constructorSection = page.locator('section').filter({
      has: page.getByRole('button', { name: 'Оформить заказ' })
    });
    await expect(
      constructorSection.getByText(mainIngredient.name, { exact: true })
    ).toHaveCount(1);

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.locator('#modals');
    await expect(modal).toContainText('идентификатор заказа');
    await expect(modal).toContainText(String(orderNumber));

    await page.locator('#modals button').click();
    await expect(page.locator('#modals')).toBeEmpty();

    await expect(page.getByText('Выберите булки').first()).toBeVisible();
    await expect(page.getByText('Выберите начинку')).toBeVisible();
    await expect(page.locator('.counter__num')).toHaveCount(0);
  });

  test('перенаправляет на страницу входа при оформлении заказа без авторизации', async ({
    page
  }) => {
    await openConstructorPage(page);

    await addIngredient(page, /Краторная булка/);
    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page).toHaveURL(/\/login$/);
  });
});
