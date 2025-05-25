const fetch = require("node-fetch");

async function getDynamicPaths() {
  const res = await fetch('https://pengunjung-umkmmu.vercel.app/api/umkms');
  const data = await res.json();

  return data.map((umkm) => `/umkm/${umkm.id}`);
}

module.exports = {
  siteUrl: 'https://pengunjung-umkmmu.vercel.app',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  outDir: './public',
  sourceDir: '.next', // wajib kalau pakai app router
  transform: async (config, path) => {
    return {
      loc: path, // path already includes `/umkm/id`
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    };
  },
  additionalPaths: async (config) => {
    const dynamicPaths = await getDynamicPaths();
    return dynamicPaths;
  },
};
