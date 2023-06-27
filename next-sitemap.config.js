/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://memo.wass80.xyz",
  generateRobotsTxt: true,
  outDir: "./out",
};
