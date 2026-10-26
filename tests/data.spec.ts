import { test, expect } from '@playwright/test';
import { allOffers, offers, drafts, offersInCategory } from '../src/data/offers';
import { assertOfferData, cleanSourceUrl, publishedOffers, resolvedRequirements } from '../src/lib/offer-data';
import { matchesBankCard } from '../src/lib/filtering';
import { categories } from '../src/data/categories';
import type { Offer } from '../src/data/types';

test('publication requires successful verification, valid parents and non-expired terms', () => {
  expect(() => assertOfferData(allOffers)).not.toThrow();
  const fixture = structuredClone(offers[0]);
  fixture.publication = 'draft';
  expect(publishedOffers([fixture], '2026-10-26')).toEqual([]);
  fixture.publication = 'published'; fixture.sourceVerification.lastChecked = null;
  expect(publishedOffers([fixture], '2026-10-26')).toEqual([]);
  expect(() => assertOfferData([fixture])).toThrow('Unverified publication');
  fixture.sourceVerification.lastChecked = '2026-10-26'; fixture.expiresAt = '2026-10-25';
  expect(publishedOffers([fixture], '2026-10-26')).toEqual([]);
  fixture.expiresAt = '2026-10-26';
  expect(publishedOffers([fixture], '2026-10-26')).toHaveLength(1);
  const child: Offer = { ...fixture, id: 'child', slug: 'child', parentId: fixture.id };
  const grandchild: Offer = { ...fixture, id: 'grandchild', slug: 'grandchild', parentId: child.id };
  fixture.publication = 'draft';
  expect(publishedOffers([fixture, child, grandchild], '2026-10-26')).toEqual([]);
});

test('cross-category views refer to the same record and reflect a single update', () => {
  const spotify = offers.find(offer => offer.id === 'spotify-premium-student')!;
  expect(offersInCategory('software')).toContain(spotify);
  expect(offersInCategory('entertainment')).toContain(spotify);
  const records = structuredClone(offers);
  const single = records.find(offer => offer.id === spotify.id)!;
  single.benefit = 'Updated once';
  for (const slug of single.categories) expect(records.filter(offer => offer.categories.includes(slug)).find(offer => offer.id === single.id)?.benefit).toBe('Updated once');
  expect(records.filter(offer => offer.id === single.id)).toHaveLength(1);
});

test('linked benefits inherit shared card requirements and exclusions centrally', () => {
  const records = structuredClone(allOffers);
  const parent = records.find(offer => offer.id === 'armeconombank-visa-student')!;
  const benefits = records.filter(offer => offer.parentId === parent.id);
  expect(benefits).toHaveLength(3);
  parent.eligibility = ['Updated parent eligibility'];
  parent.restrictions = ['Updated shared cap'];
  parent.requirements.verification = ['Updated proof'];
  for (const benefit of benefits) {
    const result = resolvedRequirements(benefit, records);
    expect(result.bankCardId).toBe(parent.id);
    expect(result.eligibility).toContain('Updated parent eligibility');
    expect(result.exclusions).toContain('Updated shared cap');
    expect(result.verification).toContain('Updated proof');
  }
});

test('bank-card matching keeps unrelated eligibility independent', () => {
  expect(matchesBankCard('', { card: 'card-a', only: false })).toBe(true);
  expect(matchesBankCard('card-a', { card: 'card-a', only: false })).toBe(true);
  expect(matchesBankCard('card-b', { card: 'card-a', only: false })).toBe(false);
  expect(matchesBankCard('', { card: 'card-a', only: true })).toBe(false);
  expect(matchesBankCard('card-a', { card: 'card-a', only: true })).toBe(true);
  expect(matchesBankCard('card-a', { card: 'none', only: false })).toBe(false);
  expect(matchesBankCard('', { card: 'none', only: false })).toBe(true);
});

test('source cleaning strips tracking and rejects favicon and unsafe URLs', () => {
  expect(cleanSourceUrl('https://example.com/student?utm_source=chatgpt&utm_medium=referral&plan=student&gclid=test')).toBe('https://example.com/student?plan=student');
  expect(() => cleanSourceUrl('https://example.com/favicon.ico')).toThrow();
  expect(() => cleanSourceUrl('javascript:alert(1)')).toThrow();
  expect(() => assertOfferData([allOffers[0], allOffers[0]])).toThrow('Duplicate offer');
  const child = structuredClone(allOffers[0]); child.parentId = child.id;
  expect(() => assertOfferData([child])).toThrow('Cyclic parent');
});

test('published categories and draft state remain consistent', () => {
  expect(categories.map(category => category.title)).toEqual(['Food & Drinks', 'Banking & Finance', 'Mobile & Internet', 'Electronics & Technology', 'Entertainment', 'Transport & Travel', 'Shopping & Retail', 'Sports & Fitness', 'Software & Digital Services']);
  for (const offer of offers) {
    expect(offer.sourceVerification.state).toBe('verified');
    expect(offer.sourceVerification.lastChecked).toBeTruthy();
    expect(offer.categories.every(slug => categories.some(category => category.slug === slug))).toBe(true);
    for (const source of offer.sources) expect(source.url).not.toMatch(/utm_|favicon|fbclid/);
  }
  for (const draft of drafts) { expect(draft.draftReason).toBeTruthy(); expect(offers).not.toContain(draft); }
  expect(allOffers.some(offer => /booking/i.test(offer.name))).toBe(false);
});
