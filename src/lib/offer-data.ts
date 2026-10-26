import type { Offer } from '../data/types';

export function cleanSourceUrl(value: string): string {
  const url = new URL(value);
  if (url.protocol !== 'https:') throw new Error(`Official source must use HTTPS: ${url.hostname}`);
  if (/favicon|googleusercontent/i.test(url.href)) throw new Error('A favicon is not an official source.');
  for (const key of [...url.searchParams.keys()]) {
    if (/^utm_|^(fbclid|gclid|ref_src)$/i.test(key)) url.searchParams.delete(key);
  }
  return url.href;
}

export function requiredCardId(offer: Offer, records: Offer[]): string | undefined {
  if (offer.requirements.bankCardId) return offer.requirements.bankCardId;
  const parent = records.find(record => record.id === offer.parentId);
  return parent?.kind === 'card' ? parent.id : parent ? requiredCardId(parent, records) : undefined;
}

export function cardFilterId(offer: Offer, records: Offer[]): string | undefined {
  return offer.kind === 'card' ? offer.id : requiredCardId(offer, records);
}

interface ResolvedRequirements { bankCardId?: string; membership?: string; university?: string; eligibility: string[]; verification: string[]; exclusions: string[]; }
export function resolvedRequirements(offer: Offer, records: Offer[]): ResolvedRequirements {
  const parent = records.find(record => record.id === offer.parentId);
  const inherited = parent ? resolvedRequirements(parent, records) : undefined;
  return {
    bankCardId: requiredCardId(offer, records),
    membership: offer.requirements.membership ?? inherited?.membership,
    university: offer.requirements.university ?? inherited?.university,
    eligibility: [...new Set([...(inherited?.eligibility ?? []), ...offer.eligibility])],
    verification: [...new Set([...(inherited?.verification ?? []), ...offer.requirements.verification])],
    exclusions: [...new Set([...(inherited?.exclusions ?? []), ...offer.restrictions])],
  };
}

export function publishedOffers(records: Offer[], today: string): Offer[] {
  const live = records.filter(offer => offer.publication === 'published' && offer.sourceVerification.state === 'verified'
    && offer.sourceVerification.lastChecked && (!offer.expiresAt || offer.expiresAt >= today));
  let published = live;
  while (true) {
    const next = published.filter(offer => !offer.parentId || published.some(parent => parent.id === offer.parentId));
    if (next.length === published.length) return next;
    published = next;
  }
}

export function assertOfferData(records: Offer[]) {
  const ids = new Set<string>();
  const paths = new Set<string>();
  for (const offer of records) {
    if (ids.has(offer.id) || paths.has(`${offer.category}/${offer.slug}`)) throw new Error(`Duplicate offer: ${offer.id}`);
    ids.add(offer.id); paths.add(`${offer.category}/${offer.slug}`);
    if (!offer.categories.length || !offer.categories.includes(offer.category)) throw new Error(`Missing primary category: ${offer.id}`);
    if (!offer.sources.length) throw new Error(`Missing source: ${offer.id}`);
    offer.sources.forEach(source => cleanSourceUrl(source.url));
    if (offer.publication === 'published' && (offer.sourceVerification.state !== 'verified' || !offer.sourceVerification.lastChecked)) throw new Error(`Unverified publication: ${offer.id}`);
    const visited = new Set([offer.id]);
    let parentId = offer.parentId;
    while (parentId) {
      if (visited.has(parentId)) throw new Error(`Cyclic parent: ${offer.id}`);
      visited.add(parentId);
      const parent = records.find(record => record.id === parentId);
      if (!parent) throw new Error(`Missing parent: ${offer.id}`);
      parentId = parent.parentId;
    }
    if (offer.requirements.bankCardId && !records.some(record => record.id === offer.requirements.bankCardId && record.kind === 'card')) throw new Error(`Unknown bank card: ${offer.id}`);
  }
}
