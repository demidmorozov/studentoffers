import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { offers, drafts, offersInCategory } from '../src/data/offers';
import { categories, categoryPath } from '../src/data/categories';
import { offerPath } from '../src/data/types';
import { requiredCardId } from '../src/lib/offer-data';
import { GET as sitemap } from '../src/pages/sitemap.xml';
import { publicRoutes } from '../src/lib/routes';
import { readFileSync } from 'node:fs';

const aeb = 'armeconombank-visa-student';
const visibleOffers = '[data-offer]:visible';
const cardless = offers.filter(offer => !requiredCardId(offer, offers));
const aebBenefits = offers.filter(offer => requiredCardId(offer, offers) === aeb);

// Counts come from the same published dataset used by routes and category pages.
test('homepage exposes nine categories, published counts and unified navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Student discountsin Armenia');
  await expect(page.locator('.hero-copy')).toHaveText('Discover local and international offers available to students studying in Armenia.');
  await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link')).toHaveText(['Discounts', 'About', 'Contact']);
  await expect(page.locator('.home-categories .category-card')).toHaveCount(categories.length);
  for (const category of categories) {
    const card = page.locator(`.home-categories a[href="${categoryPath(category)}"]`);
    const count = offersInCategory(category.slug).length;
    await expect(card).toContainText(category.title);
    await expect(card.locator('.category-top')).toContainText(`${count} ${count === 1 ? 'offer' : 'offers'}`);
  }
  await expect(page.locator('.home-categories')).not.toContainText('researched offers');
  await expect(page.locator('.footer-inner > *')).toHaveText(['Studentoffers.am', '© 2026 StudentOffers', 'Independent information. Always check with the provider.']);
});

test('homepage and header searches reach current results', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Search student offers', exact: true }).fill('Ucom');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.locator(visibleOffers)).toHaveCount(offers.filter(offer => offer.provider === 'Ucom').length);
  await page.getByRole('searchbox', { name: 'Search all offers', exact: true }).fill('Spotify');
  await page.getByRole('button', { name: 'Search all offers', exact: true }).click();
  await expect(page.locator(visibleOffers)).toHaveCount(1);
  await page.locator(visibleOffers).getByRole('link', { name: /View details/ }).click();
  await expect(page.locator('h1')).toHaveText('Premium Student');
});

test('bank card filtering includes unrestricted offers, supports strict mode and resets', async ({ page }) => {
  await page.goto('/search/');
  const card = page.getByRole('combobox', { name: 'Bank card', exact: true });
  await expect(card).toHaveValue('');
  await card.selectOption(aeb);
  await expect(page.locator(visibleOffers)).toHaveCount(cardless.length + aebBenefits.length);
  await expect(page.locator('[data-active-card]')).toContainText('includes offers without a specific card');
  await page.getByLabel('Only offers for this card').check();
  await expect(page.locator(visibleOffers)).toHaveCount(aebBenefits.length);
  for (const benefit of aebBenefits) await expect(page.locator(`[data-offer="${benefit.id}"]`)).toBeVisible();
  await expect(page).toHaveURL(/card=armeconombank-visa-student&only=1/);
  await expect(page.locator('[data-count]')).toContainText(`${aebBenefits.length} offers`);
  await page.getByRole('button', { name: 'Reset bank card', exact: true }).click();
  await expect(card).toHaveValue('');
  await expect(page.locator(visibleOffers)).toHaveCount(offers.length);
  await expect(page.getByLabel('Only offers for this card')).toBeHidden();
  await card.selectOption('none');
  await expect(page.locator(visibleOffers)).toHaveCount(cardless.length);
  await expect(page.locator('[data-offer="spotify-premium-student"]')).toContainText('SheerID');
});

test('selected card survives category navigation and reload; cardless categories hide it', async ({ page }) => {
  await page.goto('/discounts/food-drinks/?card=armeconombank-visa-student&only=1');
  await expect(page.getByLabel('Only offers for this card')).toBeChecked();
  await page.getByRole('navigation', { name: 'Discount categories', exact: true }).getByRole('link', { name: 'Transport & Travel', exact: true }).click();
  await expect(page.getByRole('combobox', { name: 'Bank card', exact: true })).toHaveValue(aeb);
  await expect(page.getByLabel('Only offers for this card')).toBeChecked();
  await expect(page.locator(visibleOffers)).toHaveCount(offersInCategory('transport-travel').filter(offer => requiredCardId(offer, offers) === aeb).length);
  await page.reload();
  await expect(page.getByLabel('Only offers for this card')).toBeChecked();
  await page.getByRole('navigation', { name: 'Discount categories', exact: true }).getByRole('link', { name: 'Software & Digital Services', exact: true }).click();
  await expect(page.getByRole('combobox', { name: 'Bank card', exact: true })).toHaveCount(0);
  await expect(page.locator('[data-offer="spotify-premium-student"]')).toBeVisible();
  await page.getByRole('navigation', { name: 'Discount categories', exact: true }).getByRole('link', { name: 'Food & Drinks', exact: true }).click();
  await expect(page.getByRole('combobox', { name: 'Bank card', exact: true })).toHaveValue(aeb);
  await page.getByRole('button', { name: 'Reset bank card', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('combobox', { name: 'Bank card', exact: true })).toHaveValue('');
});

test('filters combine with search and restore a shared URL', async ({ page }) => {
  await page.goto('/search/?card=armeconombank-visa-student&only=1&filter=Cashback&q=sports');
  await expect(page.locator(visibleOffers)).toHaveCount(1);
  await expect(page.locator(visibleOffers)).toContainText('Student sports-club cashback');
  await page.reload();
  await expect(page.getByLabel('Cashback', { exact: true })).toBeChecked();
  await expect(page.locator(visibleOffers)).toHaveCount(1);
  await page.getByRole('searchbox', { name: 'Search by provider, offer, category, or benefit' }).fill('no-such-provider');
  await expect(page.locator('[data-empty]')).toBeVisible();
  await page.locator('[data-empty-reset]').click();
  await expect(page.locator(visibleOffers)).toHaveCount(offers.length);
  await expect(page.getByRole('searchbox', { name: 'Search by provider, offer, category, or benefit' })).toBeFocused();
});

test('cross-category subscriptions link to one canonical offer and search result', async ({ page }) => {
  const offer = offers.find(offer => offer.id === 'spotify-premium-student')!;
  for (const category of offer.categories) {
    await page.goto(`/discounts/${category}/`);
    await expect(page.locator(`[data-offer="${offer.id}"]`)).toHaveCount(1);
    await expect(page.locator(`[data-offer="${offer.id}"] h3 a`)).toHaveAttribute('href', offerPath(offer));
  }
  await page.goto('/search/?q=Spotify');
  await expect(page.locator(visibleOffers)).toHaveCount(1);
});

test('published details show separate source checks, requirements and exclusions', async ({ page }) => {
  for (const offer of offers) {
    await page.goto(offerPath(offer));
    await expect(page.locator('h1')).toHaveText(offer.name);
    await expect(page.getByRole('heading', { name: 'Who is eligible?' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Verification requirements', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Source verification', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: /Visit official provider/ })).toHaveAttribute('href', offer.sources[0].url);
    await expect(page.getByText('A checked source does not mean every student qualifies.', { exact: false })).toBeVisible();
  }
  await page.goto('/discounts/food-drinks/aeb-student-fast-food-cashback/');
  await expect(page.locator('.requirement-callout')).toContainText('Requires Armeconombank Visa Student');
  await expect(page.locator('.detail-list')).toContainText(['5,000 AMD monthly cap before tax']);
});

test('drafts are excluded from pages, search, comparisons and sitemap', async ({ page, request }) => {
  const xml = await (await sitemap({ site: new URL('https://studentoffers.example') } as Parameters<typeof sitemap>[0])).text();
  await page.goto('/search/');
  await expect(page.locator('[data-offer]')).toHaveCount(offers.length);
  for (const draft of drafts) {
    expect(publicRoutes).not.toContain(offerPath(draft));
    expect(xml).not.toContain(offerPath(draft));
    await expect(page.locator(`[data-offer="${draft.id}"]`)).toHaveCount(0);
    expect((await request.get(offerPath(draft))).status()).toBe(404);
  }
  expect(xml).not.toContain('/global-discounts/');
  expect(xml).not.toContain('/discounts/transportation/');
  for (const path of ['/careers/', '/education/', '/opportunities/']) expect((await request.get(path)).status()).toBe(404);
  await page.goto('/discounts/banking/');
  await expect(page.locator('.comparison-table tbody tr')).toHaveCount(offers.filter(offer => offer.kind === 'card').length);
});

test('deployment redirects point replaced directories to published pages', async () => {
  const redirects = readFileSync('public/_redirects', 'utf8').trim().split('\n').map(line => line.split(/\s+/));
  expect(redirects.some(([from, to]) => from === '/global-discounts/' && to === '/discounts/')).toBe(true);
  expect(redirects.some(([from, to]) => from === '/discounts/transportation/' && to === '/discounts/transport-travel/')).toBe(true);
  for (const [, to, status] of redirects) { expect(publicRoutes).toContain(to); expect(status).toBe('301'); }
});

for (const width of [320, 375, 600, 768, 900, 1024, 1025, 1440]) {
  test(`responsive layout and search work at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const boxes = await page.locator('.header-inner').evaluate(header => [...header.querySelectorAll('.brand, .desktop-nav, .header-search, .mobile-nav')].map(el => el.getBoundingClientRect()).filter(box => box.width && box.height).map(({ left, right, top, bottom }) => ({ left, right, top, bottom })));
    expect(boxes.some((box, i) => boxes.slice(i + 1).some(other => box.left < other.right && box.right > other.left && box.top < other.bottom && box.bottom > other.top))).toBe(false);
    const hero = await page.locator('.home-hero').boundingBox();
    const search = await page.locator('.home-search').boundingBox();
    expect(search!.width).toBeCloseTo(hero!.width, 0);
    const columns = await page.locator('.home-categories').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length);
    expect(columns).toBe(width <= 600 ? 1 : width <= 900 ? 2 : 3);
    await page.getByRole('searchbox', { name: 'Search all offers', exact: true }).fill('Ucom');
    await page.getByRole('button', { name: 'Search all offers', exact: true }).click();
    await expect(page.locator(visibleOffers)).toHaveCount(3);
    for (const path of ['/', '/discounts/', '/discounts/food-drinks/', '/discounts/transport-travel/', '/discounts/banking/', '/discounts/software/spotify-premium-student/', '/about/', '/about/contact/']) {
      await page.goto(path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `${path} overflows at ${width}`).toBe(false);
    }
  });
}

test('mobile navigation preserves About and Contact pages', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.getByLabel('Open navigation').click();
  const nav = page.getByRole('navigation', { name: 'Mobile navigation', exact: true });
  await expect(nav.getByRole('link')).toHaveText(['Discounts', 'About', 'Contact']);
  await nav.getByRole('link', { name: 'About', exact: true }).click();
  await expect(page.locator('h1')).toContainText('More clarity.');
  await page.getByLabel('Open navigation').click();
  await nav.getByRole('link', { name: 'Contact', exact: true }).click();
  await expect(page).toHaveURL(/\/about\/contact\/$/);
  await expect(page.getByRole('link', { name: /Open the issue tracker/ })).toHaveAttribute('href', 'https://github.com/demidmorozov/studentoffers/issues');
});

test('directory and navigation remain usable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  await page.goto('/discounts/banking/');
  await expect(page.locator(visibleOffers)).toHaveCount(offersInCategory('banking').length);
  await expect(page.locator('[data-search-panel]')).toBeHidden();
  await page.getByLabel('Open navigation').click();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
  await context.close();
});

test('blocked local storage does not break card filtering', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage blocked'); } }); });
  await page.goto('/search/?card=armeconombank-visa-student&only=1');
  await expect(page.locator(visibleOffers)).toHaveCount(aebBenefits.length);
  await page.getByRole('button', { name: 'Reset bank card', exact: true }).click();
  await expect(page.locator(visibleOffers)).toHaveCount(offers.length);
});

test('Cloudflare content security policy permits search and local assets', async ({ page }) => {
  const policy = readFileSync('public/_headers', 'utf8').split('\n').find(line => line.trim().startsWith('Content-Security-Policy:'))!.trim().replace('Content-Security-Policy: ', '');
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', async route => {
    if (route.request().resourceType() !== 'document') return route.continue();
    const response = await route.fetch();
    await route.fulfill({ response, headers: { ...response.headers(), 'content-security-policy': policy } });
  });
  await page.goto('/search/?card=armeconombank-visa-student&only=1');
  await expect(page.locator(visibleOffers)).toHaveCount(aebBenefits.length);
  expect(errors).toEqual([]);
});

test('representative desktop and mobile pages pass WCAG AA checks', async ({ page }) => {
  for (const width of [1440, 375]) {
    await page.setViewportSize({ width, height: 950 });
    for (const path of ['/', '/search/', '/discounts/food-drinks/', '/discounts/software/spotify-premium-student/', '/about/contact/']) {
      await page.goto(path);
      const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(result.violations, `${path} at ${width}: ${JSON.stringify(result.violations)}`).toEqual([]);
    }
  }
});

test('capture final desktop and mobile layouts', async ({ page }) => {
  for (const [size, width] of [['desktop', 1440], ['mobile', 375]] as const) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await page.screenshot({ path: `test-results/home-${size}.png`, fullPage: true });
    await page.goto('/discounts/food-drinks/?card=armeconombank-visa-student&only=1');
    await page.screenshot({ path: `test-results/card-filter-${size}.png`, fullPage: true });
    await page.goto('/discounts/food-drinks/aeb-student-fast-food-cashback/');
    await page.screenshot({ path: `test-results/card-benefit-${size}.png`, fullPage: true });
  }
});
