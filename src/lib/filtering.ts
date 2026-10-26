export interface CardSelection { card: string; only: boolean; }
export function matchesBankCard(offerCard: string, selection: CardSelection): boolean {
  if (!selection.card) return true;
  if (selection.card === 'none') return !offerCard;
  return offerCard === selection.card || (!selection.only && !offerCard);
}
export const cardStorageKey = 'studentoffers.bank-card';
