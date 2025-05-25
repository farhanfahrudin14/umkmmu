/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://pengunjung-umkmmu.vercel.app',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  outDir: './public',
  sourceDir: '.next', // <--- ini wajib kalau pake app router
};
