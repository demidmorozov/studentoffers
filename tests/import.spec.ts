import { test, expect } from '@playwright/test';
import { researchOffers, skippedExistingIds, tuitionAssistance } from '../src/data/research-import';
import { allOffers, offers } from '../src/data/offers';
import { offerPath } from '../src/data/types';
import { assertOfferData, bankCardRequirement, publishedOffers } from '../src/lib/offer-data';
import { matchesBankCard } from '../src/lib/filtering';
import { publicRoutes } from '../src/lib/routes';

test('research import has distinct records, preserved duplicates and honest source dates', () => {
  expect(researchOffers).toHaveLength(37);
  expect(skippedExistingIds).toHaveLength(16);
  for (const id of skippedExistingIds) {
    expect(allOffers.filter(offer => offer.id === id)).toHaveLength(1);
    expect(researchOffers.some(offer => offer.id === id)).toBe(false);
  }
  for (const offer of researchOffers) {
    expect(offer.status).toBe('Verification Required');
    expect(offer.researchDate).toBe('2026-10-26');
    expect(offer.sourceVerification).toMatchObject({ state: 'unverified', lastAttempted: null, lastChecked: null });
    expect(offer.verifiedDate).toBeNull();
    expect(publicRoutes).toContain(offerPath(offer));
    expect(offer.sources.length > 0 || !!offer.sourceNote).toBe(true);
  }
  expect(() => assertOfferData(allOffers)).not.toThrow();
  const unapproved = structuredClone(researchOffers[0]);
  delete unapproved.publicationBasis;
  expect(publishedOffers([unapproved], '2026-10-26')).toEqual([]);
  expect(() => assertOfferData([unapproved])).toThrow('Unverified publication');
});

test('price variations, evidence requirements and expiry are represented accurately', () => {
  const byId = (id: string) => researchOffers.find(offer => offer.id === id)!;
  const cinema = byId('cinema-star-student-tickets');
  expect(cinema.facts).toEqual(expect.arrayContaining([['2D student ticket', '1,000 AMD'], ['3D student ticket', '1,500 AMD'], ['Time window', 'Monday–Friday, 10:00–17:00']]));
  expect(cinema.restrictions.join(' ')).toMatch(/Online purchases are excluded/);
  expect(byId('matenadaran-student-admission').price?.amount).toBe(300);
  const illusions = byId('museum-of-illusions-student-admission');
  expect(illusions.price?.amount).toBe(5000);
  expect(illusions.sections?.[0].items).toEqual(['Groups of 4–12 students: 4,500 AMD per person.', 'Groups of 13 or more students: 4,000 AMD per person.']);
  for (const offer of researchOffers.filter(offer => offer.name === 'Student museum admission')) {
    expect(offer.restrictions.join(' ')).toContain('Foreign citizenship');
  }
  expect(researchOffers.filter(offer => offer.provider === 'Reebok Sports Club').map(offer => offer.price?.amount)).toEqual([35000, 35000, 49000]);
  expect(byId('yerevan-quest-student-discount').steps).toContain('Enter STUDENT in the booking description field.');
  expect(byId('notion-education-plus').requirements.university).toBe('Eligible academic/university email');
  expect(byId('libananyan-student-discount').expiresAt).toBeNull();
  expect(researchOffers.filter(offer => offer.expiresAt).map(offer => offer.id)).toEqual(['visa-booking-wallet-cashback', 'visa-cinema-star-card-discount']);
  expect(publishedOffers(researchOffers, '2027-01-01').map(offer => offer.id)).not.toContain('visa-booking-wallet-cashback');
});

test('ESNcard discounts share records across categories and Visa never implies student-card eligibility', () => {
  const yell = researchOffers.filter(offer => offer.provider === 'Yell Extreme Park');
  expect(yell).toHaveLength(1);
  expect(yell[0].categories).toEqual(expect.arrayContaining(['sports', 'entertainment']));
  expect(yell[0].requirements.membership).toBe('ESNcard');
  expect(yell[0].eligibility.join(' ')).toContain('ordinary student ID is not a substitute');
  expect(researchOffers.filter(offer => offer.requirements.membership === 'ESNcard')).toHaveLength(8);
  for (const visa of researchOffers.filter(offer => offer.requirements.bankCardNetwork)) {
    const requirement = bankCardRequirement(visa, allOffers)!;
    expect(visa.parentId).toBeUndefined();
    expect(matchesBankCard(requirement, { card: 'none', only: false })).toBe(false);
    expect(matchesBankCard(requirement, { card: 'armeconombank-visa-student', only: false })).toBe(false);
    expect(matchesBankCard(requirement, { card: '', only: false })).toBe(true);
  }
  expect(researchOffers.some(offer => /edX|Skillshare|British Council/.test(offer.provider))).toBe(false);
  expect(allOffers.some(offer => offer.id === tuitionAssistance.id)).toBe(false);
});

test('credential filters preserve ESNcard and separate general Visa offers', async ({ page }) => {
  await page.goto('/search/');
  await page.getByLabel('ESNcard', { exact: true }).check();
  await expect(page.locator('[data-offer]:visible')).toHaveCount(8);
  await expect(page.locator('[data-offer="yell-extreme-park-esncard-discount"]')).toContainText('Requires ESNcard');
  await page.getByRole('combobox', { name: 'Bank card', exact: true }).selectOption('none');
  await expect(page.locator('[data-offer]:visible')).toHaveCount(8);
  await page.locator('[data-reset]').click();
  await page.getByLabel('Bank Card', { exact: true }).check();
  await expect(page.locator('[data-offer]:visible')).toHaveCount(2);
  await expect(page.locator('[data-offer="visa-booking-wallet-cashback"]')).toContainText('Eligible Visa bank card required');
  await page.getByRole('combobox', { name: 'Bank card', exact: true }).selectOption('armeconombank-visa-student');
  await expect(page.locator('[data-offer]:visible')).toHaveCount(0);
});

test('unknown sources stay unlinked and informational assistance is not a fabricated discount', async ({ page }) => {
  for (const offer of researchOffers.filter(offer => !offer.sources.length)) {
    await page.goto(offerPath(offer));
    await expect(page.locator('h1')).toHaveText(offer.name);
    await expect(page.getByText(offer.sourceNote!, { exact: true })).toBeVisible();
    await expect(page.locator('.source-links a')).toHaveCount(0);
    await expect(page.getByRole('link', { name: /Visit official provider/ })).toHaveCount(0);
    await expect(page.getByText('Not independently checked', { exact: true })).toBeVisible();
  }
  await page.goto('/discounts/banking/');
  const information = page.getByRole('complementary', { name: 'Education assistance information' });
  await expect(information).toContainText('not a universal student discount');
  await expect(information.getByRole('link')).toHaveAttribute('href', 'https://escs.am/');
  await expect(page.locator('[data-offer]')).toHaveCount(offers.filter(offer => offer.categories.includes('banking')).length);
});
