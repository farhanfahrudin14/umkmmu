/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://pengunjung-umkmmu.vercel.app',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  sourceDir: 'app', // ini penting kalau kamu pakai folder `app/`
}