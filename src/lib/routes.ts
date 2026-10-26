import { categories, groups, categoryPath } from '../data/categories';
import { offers } from '../data/offers';
import { offerPath } from '../data/types';
export const publicRoutes = ['/', ...groups.map(g => `/${g.slug}/`), ...categories.map(categoryPath), ...offers.map(offerPath), '/about/', '/about/research/', '/about/submit/', '/about/contact/'];
