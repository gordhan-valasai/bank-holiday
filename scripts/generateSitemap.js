const fs = require('fs');
const path = require('path');

// Load generated pages
const generatedPages = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../generated-pages.json'), 'utf8')
);

const DOMAIN = 'https://bankopentoday.com';

// Generate sitemap.xml
const generateSitemap = () => {
  const pages = generatedPages.map(page => {
    const lastmod = new Date().toISOString().split('T')[0];
    const priority = getPriority(page.type);
    const changefreq = getChangefreq(page.type);

    return `  <url>
    <loc>${DOMAIN}/${page.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.join('\n')}
</urlset>`;

  const publicPath = path.join(__dirname, '../public');
  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, { recursive: true });
  }

  fs.writeFileSync(path.join(publicPath, 'sitemap.xml'), sitemap);
  console.log(`✅ Sitemap generated: ${generatedPages.length} URLs`);
};

// Generate robots.txt
const generateRobots = () => {
  const robots = `User-agent: *
Allow: /

Sitemap: ${DOMAIN}/sitemap.xml
User-agent: GPTBot
Disallow:

User-agent: ChatGPT-User
Disallow:

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /`;

  const publicPath = path.join(__dirname, '../public');
  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, { recursive: true });
  }

  fs.writeFileSync(path.join(publicPath, 'robots.txt'), robots);
  console.log('✅ robots.txt generated');
};

// Generate RSS feed
const generateRSSFeed = () => {
  const items = generatedPages
    .filter(page => page.type === 'holiday-detail' || page.type === 'search-intent')
    .map(page => {
      const pubDate = new Date().toUTCString();
      return `  <item>
    <title>${escapeXml(page.pageTitle)}</title>
    <description>${escapeXml(page.metaDescription)}</description>
    <link>${DOMAIN}/${page.slug}</link>
    <guid>${DOMAIN}/${page.slug}</guid>
    <pubDate>${pubDate}</pubDate>
  </item>`;
    });

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Bank Holiday Hours - Latest Updates</title>
    <link>${DOMAIN}</link>
    <description>Stay updated with bank holidays and banking hours across USA, UK, Canada, and Australia</description>
    <language>en-us</language>
${items.join('\n')}
  </channel>
</rss>`;

  const publicPath = path.join(__dirname, '../public');
  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, { recursive: true });
  }

  fs.writeFileSync(path.join(publicPath, 'rss.xml'), rss);
  console.log(`✅ RSS feed generated: ${items.length} items`);
};

// Helper functions
const getPriority = (type) => {
  const priorities = {
    'search-intent': '0.9',
    'bank-holiday-question': '0.8',
    'holiday-detail': '0.8',
    'bank-today-question': '0.7',
    'city-bank-hours': '0.6',
    'country-holiday-calendar': '0.7'
  };
  return priorities[type] || '0.5';
};

const getChangefreq = (type) => {
  const frequencies = {
    'search-intent': 'daily',
    'bank-holiday-question': 'monthly',
    'holiday-detail': 'yearly',
    'bank-today-question': 'daily',
    'city-bank-hours': 'monthly',
    'country-holiday-calendar': 'monthly'
  };
  return frequencies[type] || 'monthly';
};

const escapeXml = (unsafe) => {
  return unsafe
    .replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '&':
          return '&amp;';
        case "'":
          return '&apos;';
        case '"':
          return '&quot;';
      }
    });
};

// Generate all files
console.log('\n🚀 Generating SEO files...\n');
generateSitemap();
generateRobots();
generateRSSFeed();
console.log('\n✨ Complete! All SEO files generated.\n');
