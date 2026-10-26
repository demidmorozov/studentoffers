import type { APIRoute } from 'astro';
import { publicRoutes } from '../lib/routes';
const escapeXML = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
export const GET: APIRoute = ({ site }) => {
  const entries = site ? publicRoutes.map(route => `<url><loc>${escapeXML(new URL(route, site).href)}</loc></url>`).join('') : '';
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
