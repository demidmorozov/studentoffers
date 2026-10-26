import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { offers } from '../src/data/offers';
import { offerPath } from '../src/data/types';
import { readFileSync } from 'node:fs';

test('homepage search carries its query into working results', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Student opportunitiesin Armenia.');
  await page.getByRole('searchbox').fill('Ucom');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.locator('[data-count]')).toHaveText('3 offers of 18');
  await expect(page.locator('[data-offer]:visible')).toHaveCount(3);
});

test('banking filters combine and reset without navigation', async ({ page }) => {
  await page.goto('/discounts/banking/');
  await expect(page.locator('[data-offer]:visible')).toHaveCount(14);
  await page.getByLabel('Cashback', { exact: true }).check();
  await expect(page.locator('[data-offer]:visible')).toHaveCount(2);
  await page.getByLabel('No Student ID Required', { exact: true }).check();
  await expect(page.locator('[data-offer]:visible')).toHaveCount(1);
  await expect(page.locator('[data-offer]:visible')).toContainText('Unibank');
  await page.getByRole('button', { name: 'Reset filters', exact: true }).first().click();
  await expect(page.locator('[data-offer]:visible')).toHaveCount(14);
  await page.getByRole('combobox', { name: 'Offer status' }).selectOption('Archived');
  await expect(page.locator('[data-offer]:visible')).toHaveCount(1);
  await expect(page.locator('[data-offer]:visible')).toContainText('VTB Armenia');
});

test('search matches provider, name, category and benefit; empty state resets', async ({ page }) => {
  await page.goto('/search/');
  const search = page.getByRole('searchbox');
  for (const [query, count] of [['ucom', 3], ['Level Up+ 3000', 1], ['transportation', 1], ['cashback', 2]] as const) {
    await search.fill(query);
    await expect(page.locator('[data-offer]:visible')).toHaveCount(count);
  }
  await search.fill('no-such-provider');
  await expect(page.locator('[data-empty]')).toBeVisible();
  await expect(page.locator('[data-count]')).toHaveText('0 offers of 18');
  await page.locator('[data-empty-reset]').click();
  await expect(page.locator('[data-offer]:visible')).toHaveCount(18);
  await expect(search).toBeFocused();
});

test('mobile filters and bookmarked search restore accurately', async ({ page }) => {
  await page.goto('/discounts/mobile-internet/?q=Ucom&filter=Prepaid&filter=Regional');
  await expect(page.locator('[data-offer]:visible')).toHaveCount(1);
  await expect(page.locator('[data-offer]:visible')).toContainText('2000 Regional');
  await page.reload();
  await expect(page.getByLabel('Regional', { exact: true })).toBeChecked();
  await expect(page.locator('[data-offer]:visible')).toHaveCount(1);
});

test('every offer detail renders complete provenance and official sources', async ({ page }) => {
  for (const offer of offers) {
    await page.goto(offerPath(offer));
    await expect(page.locator('h1')).toHaveText(offer.name);
    await expect(page.getByRole('heading', { name: 'Who is eligible?' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Documents you’ll need' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Research & verification' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Visit official provider/ })).toHaveAttribute('href', offer.sources[0].url);
    await expect(page.getByText('Not completed', { exact: true })).toBeVisible();
  }
});

test('archived products and completed promotions retain correct statuses', async ({ page }) => {
  await page.goto('/discounts/banking/amio-mastercard-student/');
  await expect(page.locator('.detail-hero .status')).toHaveText('Verification Required');
  await expect(page.getByRole('heading', { name: /Completed 2026 student promotion/ })).toContainText('Expired');
  await expect(page.locator('.detail-hero')).toContainText('five-year free-servicing promotion has ended');
  await page.goto('/discounts/banking/vtb-istudent/');
  await expect(page.locator('.detail-hero .status')).toHaveText('Archived');
});

test('bank comparison and transport prices preserve documented figures', async ({ page }) => {
  await page.goto('/discounts/banking/#compare');
  await expect(page.locator('.comparison-table tbody tr')).toHaveCount(9);
  await expect(page.locator('.comparison-table')).toContainText('4% AMD / 1% USD');
  await page.goto('/discounts/transportation/yerevan-student-transport/');
  await expect(page.locator('table')).toContainText('7,480 AMD');
  await expect(page.locator('table')).toContainText('20,400 AMD');
  await expect(page.locator('table')).toContainText('74,800 AMD');
  await expect(page.getByRole('heading', { name: 'How to claim the discount' })).toBeVisible();
});

test('empty categories show honest empty states', async ({ page }) => {
  for (const path of ['/discounts/food-drinks/', '/careers/internships/', '/education/scholarships/', '/opportunities/exchange/']) {
    await page.goto(path);
    await expect(page.getByRole('heading', { name: 'No verified offers yet.' })).toBeVisible();
  }
});

for (const width of [375, 768, 1440]) {
  test(`responsive layout stays within ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    for (const path of ['/', '/discounts/', '/discounts/banking/', '/discounts/banking/ameriabank-visa-student/', '/discounts/transportation/yerevan-student-transport/', '/about/research/']) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      expect(overflow, `${path} overflows at ${width}px`).toBe(false);
    }
    await page.goto('/discounts/mobile-internet/');
    const columns = await page.locator('.offer-grid').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length);
    expect(columns).toBe(width < 600 ? 1 : width < 900 ? 2 : 3);
  });
}

test('mobile navigation works using native disclosure', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.getByLabel('Open navigation').click();
  await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Education', exact: true }).click();
  await expect(page).toHaveURL(/\/education\/$/);
});

test('directory and navigation remain usable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  await page.goto('/discounts/banking/');
  await expect(page.locator('[data-offer]:visible')).toHaveCount(14);
  await expect(page.locator('[data-search-panel]')).toBeHidden();
  await page.getByLabel('Open navigation').click();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
  await context.close();
});

test('Cloudflare content security policy permits search and self-hosted assets', async ({ page }) => {
  const policy = readFileSync('public/_headers', 'utf8').split('\n').find(line => line.trim().startsWith('Content-Security-Policy:'))!.trim().replace('Content-Security-Policy: ', '');
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.route('**/*', async route => {
    if (route.request().resourceType() !== 'document') return route.continue();
    const response = await route.fetch();
    await route.fulfill({ response, headers: { ...response.headers(), 'content-security-policy': policy } });
  });
  await page.goto('/search/?q=Ucom');
  await expect(page.locator('[data-offer]:visible')).toHaveCount(3);
  await expect(page.locator('[data-search-panel]')).toBeVisible();
  expect(await page.evaluate(() => document.fonts.check('14px "Inter Variable"'))).toBe(true);
  expect(errors).toEqual([]);
});

test('representative pages pass automated WCAG AA accessibility checks', async ({ page }) => {
  for (const path of ['/', '/discounts/banking/', '/discounts/banking/ameriabank-visa-student/', '/about/submit/']) {
    await page.goto(path);
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(result.violations, `${path}: ${JSON.stringify(result.violations)}`).toEqual([]);
  }
});

test('visual review captures desktop, mobile and detail layouts', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.screenshot({ path: 'test-results/home-desktop.png', fullPage: true });
  await page.goto('/discounts/banking/');
  await page.screenshot({ path: 'test-results/banking-desktop.png', fullPage: true });
  await page.goto('/discounts/transportation/yerevan-student-transport/');
  await page.screenshot({ path: 'test-results/transport-detail.png', fullPage: true });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.screenshot({ path: 'test-results/home-mobile.png', fullPage: true });
});
