export interface Category { slug: string; title: string; description: string; group: string; icon: string; }
export const groups = [
  { slug: 'discounts', title: 'Discounts', description: 'Discover local and international offers available to students studying in Armenia.', icon: 'wallet' },
];
const entries: [string, string, string, string, string][] = [
  ['discounts','food-drinks','Food & Drinks','Cafés, meals, and everyday essentials.','coffee'],
  ['discounts','banking','Banking & Finance','Student cards, cashback, and banking benefits.','wallet'],
  ['discounts','mobile-internet','Mobile & Internet','More data and student mobile plans.','smartphone'],
  ['discounts','electronics','Electronics & Technology','Technology for study and everyday life.','laptop'],
  ['discounts','entertainment','Entertainment','Cinema, culture, and time off.','ticket'],
  ['discounts','transport-travel','Transport & Travel','Student fares, travel, and accommodation.','train'],
  ['discounts','shopping','Shopping & Retail','Student offers at shops and retailers.','bag'],
  ['discounts','sports','Sports & Fitness','Stay active, on a student budget.','activity'],
  ['discounts','software','Software & Digital Services','Useful tools for your next project.','code'],
];
export const categories: Category[] = entries.map(([group, slug, title, description, icon]) => ({ group, slug, title, description, icon }));
export const categoryPath = (category: Category) => `/${category.group}/${category.slug}/`;
