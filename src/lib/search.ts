import { cardStorageKey, matchesBankCard } from './filtering';
export const normalize = (value: string) => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
export function setupOfferBrowsers() {
  document.querySelectorAll<HTMLElement>('[data-offer-browser]').forEach(root => {
    const query = root.querySelector<HTMLInputElement>('[data-query]')!;
    const chips = [...root.querySelectorAll<HTMLInputElement>('[data-filter]')];
    const status = root.querySelector<HTMLSelectElement>('[data-status-filter]');
    const kind = root.querySelector<HTMLSelectElement>('[data-kind-filter]');
    const bankCard = root.querySelector<HTMLSelectElement>('[data-bank-card]');
    const only = root.querySelector<HTMLInputElement>('[data-card-only]');
    const onlyControl = root.querySelector<HTMLElement>('[data-card-only-control]');
    const cardReset = root.querySelector<HTMLButtonElement>('[data-card-reset]');
    const activeCard = root.querySelector<HTMLElement>('[data-active-card]');
    const cards = [...root.querySelectorAll<HTMLElement>('[data-offer]')];
    const count = root.querySelector<HTMLElement>('[data-count]')!;
    const reset = root.querySelector<HTMLButtonElement>('[data-reset]')!;
    const empty = root.querySelector<HTMLElement>('[data-empty]')!;
    const panel = root.querySelector<HTMLElement>('[data-search-panel]')!;
    const params = new URLSearchParams(location.search);
    query.value = params.get('q') ?? '';
    chips.forEach(chip => { chip.checked = params.getAll('filter').includes(chip.value); });
    if (status && [...status.options].some(o => o.value === params.get('status'))) status.value = params.get('status')!;
    if (kind && [...kind.options].some(o => o.value === params.get('type'))) kind.value = params.get('type')!;
    if (bankCard && only) {
      let saved: { card?: string; only?: boolean } = {};
      try { saved = JSON.parse(localStorage.getItem(cardStorageKey) ?? '{}') ?? {}; } catch { /* Storage is optional. */ }
      const card = params.has('card') ? params.get('card') : saved.card;
      if ([...bankCard.options].some(option => option.value === card)) bankCard.value = card ?? '';
      only.checked = bankCard.value !== '' && bankCard.value !== 'none' && (params.has('card') ? params.get('only') === '1' : saved.only === true);
    }
    panel.hidden = false;
    function update(persistCard = false) {
      const terms = normalize(query.value).split(/\s+/).filter(Boolean);
      const tags = chips.filter(c => c.checked).map(c => c.value);
      const selection = { card: bankCard?.value ?? '', only: only?.checked ?? false };
      if (bankCard && only && onlyControl && cardReset && activeCard) {
        const specific = !!selection.card && selection.card !== 'none';
        onlyControl.hidden = !specific;
        only.disabled = !specific;
        if (!specific) only.checked = selection.only = false;
        cardReset.hidden = !selection.card;
        activeCard.textContent = selection.card ? `Bank card: ${bankCard.selectedOptions[0].textContent}${selection.only ? ' · only this card' : specific ? ' · includes offers without a specific card' : ''}` : 'Bank card: All offers';
        if (persistCard) {
          try {
            if (selection.card) localStorage.setItem(cardStorageKey, JSON.stringify(selection));
            else localStorage.removeItem(cardStorageKey);
          } catch { /* URL state continues to work when storage is unavailable. */ }
        }
      }
      let matches = 0;
      cards.forEach(card => {
        const text = normalize(card.dataset.search ?? '');
        const cardTags = JSON.parse(card.dataset.tags ?? '[]') as string[];
        const visible = terms.every(term => text.includes(term)) && tags.every(tag => cardTags.includes(tag))
          && (!status?.value || card.dataset.status === status.value) && (!kind?.value || card.dataset.kind === kind.value)
          && matchesBankCard(card.dataset.requiredCard ?? '', selection);
        card.hidden = !visible;
        if (visible) matches++;
      });
      count.textContent = `${matches} ${matches === 1 ? 'offer' : 'offers'}${matches !== cards.length ? ` of ${cards.length}` : ''}`;
      empty.hidden = matches !== 0;
      reset.hidden = !query.value && !tags.length && !status?.value && !kind?.value && !selection.card;
      const next = new URLSearchParams();
      if (query.value.trim()) next.set('q', query.value.trim());
      tags.forEach(tag => next.append('filter', tag));
      if (status?.value) next.set('status', status.value);
      if (kind?.value) next.set('type', kind.value);
      if (selection.card) next.set('card', selection.card);
      if (selection.only) next.set('only', '1');
      const suffix = next.toString();
      history.replaceState(null, '', `${location.pathname}${suffix ? `?${suffix}` : ''}${location.hash}`);
    }
    function clearCard() { if (bankCard) bankCard.value = ''; if (only) only.checked = false; update(true); }
    function clear() { query.value = ''; chips.forEach(c => { c.checked = false; }); if (status) status.value = ''; if (kind) kind.value = ''; clearCard(); query.focus(); }
    query.addEventListener('input', () => update());
    chips.forEach(chip => chip.addEventListener('change', () => update()));
    status?.addEventListener('change', () => update());
    kind?.addEventListener('change', () => update());
    bankCard?.addEventListener('change', () => update(true));
    only?.addEventListener('change', () => update(true));
    cardReset?.addEventListener('click', clearCard);
    reset.addEventListener('click', clear);
    root.querySelector('[data-empty-reset]')?.addEventListener('click', clear);
    // A valid shared URL becomes the remembered product selection.
    update(params.has('card') && !!bankCard);
  });
}
