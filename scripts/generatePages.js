const fs = require('fs');
const path = require('path');

// Load all data files
const usaHolidays = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/usa-holidays.json'), 'utf8'));
const ukHolidays = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/uk-holidays.json'), 'utf8'));
const canadaHolidays = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/canada-holidays.json'), 'utf8'));
const australiaHolidays = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/australia-holidays.json'), 'utf8'));
const banks = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/banks.json'), 'utf8'));

// Combine all holidays
const allHolidays = [...usaHolidays, ...ukHolidays, ...canadaHolidays, ...australiaHolidays];

// Sample cities for each country
const cities = {
  USA: ['new-york', 'los-angeles', 'Chicago', 'houston', 'phoenix', 'philadelphia', 'san-antonio', 'san-diego', 'dallas', 'san-jose'],
  UK: ['london', 'birmingham', 'leeds', 'glasgow', 'sheffield', 'manchester', 'edinburgh', 'liverpool', 'bristol', 'leicester'],
  Canada: ['toronto', 'vancouver', 'calgary', 'edmonton', 'ottawa', 'winnipeg', 'quebec-city', 'montreal', 'halifax', 'vancouver'],
  Australia: ['sydney', 'melbourne', 'brisbane', 'perth', 'adelaide', 'hobart', 'canberra', 'gold-coast', 'newcastle', 'wollongong']
};

// Helper functions
const slugify = (text) => {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
};

const generatePages = () => {
  const pages = [];
  const pageIds = new Set();

  // 1. Generate "Is [Bank] open on [Holiday]?" pages
  console.log('Generating bank + holiday pages...');
  banks.forEach(bank => {
    allHolidays.forEach(holiday => {
      if (bank.country === holiday.country) {
        const slug = `is-${slugify(bank.bank)}-open-on-${slugify(holiday.holiday)}`;
        
        if (!pageIds.has(slug)) {
          pageIds.add(slug);
          pages.push({
            slug,
            type: 'bank-holiday-question',
            template: 'bankHolidayQuestion',
            pageTitle: `Is ${bank.bank} Open on ${holiday.holiday}?`,
            metaDescription: `${bank.bank} hours on ${holiday.holiday}. See if ${bank.bank} is open, ATM availability, and ${bank.country} bank holiday schedule.`,
            h1: `Is ${bank.bank} Open on ${holiday.holiday}?`,
            bank: bank.bank,
            bankId: bank.id,
            holiday: holiday.holiday,
            holidayId: holiday.id,
            country: bank.country,
            date: holiday.date,
            answer: holiday.banks_open ? `Yes. ${bank.bank} may have limited hours on ${holiday.holiday}.` : `No. ${bank.bank} is closed on ${holiday.holiday}.`,
            keywords: [`${bank.bank} hours on ${holiday.holiday}`, `is ${bank.bank} open on ${holiday.holiday}`, `${bank.bank} ${holiday.holiday} hours`]
          });
        }
      }
    });
  });

  // 2. Generate "Is [Bank] open today?" pages
  console.log('Generating bank today pages...');
  banks.forEach(bank => {
    const slug = `is-${slugify(bank.bank)}-open-today`;
    
    if (!pageIds.has(slug)) {
      pageIds.add(slug);
      pages.push({
        slug,
        type: 'bank-today-question',
        template: 'bankTodayQuestion',
        pageTitle: `Is ${bank.bank} Open Today? - Current Hours`,
        metaDescription: `Check if ${bank.bank} is open today. See current hours, weekend hours, and holiday closures.`,
        h1: `Is ${bank.bank} Open Today?`,
        bank: bank.bank,
        bankId: bank.id,
        country: bank.country,
        keywords: [`${bank.bank} hours today`, `is ${bank.bank} open today`, `${bank.bank} open now`]
      });
    }
  });

  // 3. Generate Holiday detail pages
  console.log('Generating holiday detail pages...');
  allHolidays.forEach(holiday => {
    const slug = `holiday/${slugify(holiday.holiday)}`;
    
    if (!pageIds.has(slug)) {
      pageIds.add(slug);
      pages.push({
        slug,
        type: 'holiday-detail',
        template: 'holidayDetail',
        pageTitle: `${holiday.holiday} 2026 - ${holiday.country} Bank & School Holiday`,
        metaDescription: `${holiday.holiday} on ${holiday.date}. See if banks and schools are open, hours, and holiday schedules in ${holiday.country}.`,
        h1: `${holiday.holiday} - ${holiday.date}`,
        holiday: holiday.holiday,
        holidayId: holiday.id,
        country: holiday.country,
        date: holiday.date,
        description: holiday.description,
        region: holiday.region || 'All regions',
        keywords: [`${holiday.holiday} ${holiday.country}`, `${holiday.holiday} 2026`, `${holiday.holiday} banks closed`]
      });
    }
  });

  // 4. Generate City bank hours pages
  console.log('Generating city bank hours pages...');
  Object.keys(cities).forEach(country => {
    const countryBanks = banks.filter(b => b.country === country);
    cities[country].forEach(city => {
      countryBanks.forEach(bank => {
        const slug = `${slugify(country)}/${slugify(city)}-${slugify(bank.bank)}-hours`;
        
        if (!pageIds.has(slug)) {
          pageIds.add(slug);
          pages.push({
            slug,
            type: 'city-bank-hours',
            template: 'cityBankHours',
            pageTitle: `${bank.bank} Hours in ${city.replace('-', ' ')}, ${country}`,
            metaDescription: `${bank.bank} branch hours in ${city.replace('-', ' ')}, ${country}. Phone numbers, locations, and holiday schedules.`,
            h1: `${bank.bank} Hours in ${city.replace('-', ' ')}`,
            bank: bank.bank,
            bankId: bank.id,
            city: city.replace('-', ' '),
            country: country,
            keywords: [`${bank.bank} ${city} hours`, `${bank.bank} near me`]
          });
        }
      });
    });
  });

  // 5. Generate country holiday calendar pages
  console.log('Generating country holiday pages...');
  const countries = ['USA', 'UK', 'Canada', 'Australia'];
  countries.forEach(country => {
    const slug = `${slugify(country)}/holiday-calendar`;
    
    if (!pageIds.has(slug)) {
      pageIds.add(slug);
      pages.push({
        slug,
        type: 'country-holiday-calendar',
        template: 'countryHolidayCalendar',
        pageTitle: `${country} Public Holidays & Bank Holidays 2026 - Calendar`,
        metaDescription: `${country} public holidays and bank holidays 2026. See when banks and schools are closed.`,
        h1: `${country} Holidays 2026`,
        country: country,
        keywords: [`${country} public holidays 2026`, `${country} bank holidays`, `${country} holiday calendar`]
      });
    }
  });

  // 6. Generate common search intent pages
  console.log('Generating search intent pages...');
  const searchIntentPages = [
    {
      slug: 'is-bank-open-today',
      type: 'search-intent',
      template: 'bankOpenToday',
      pageTitle: 'Is Bank Open Today? - Check Bank Hours',
      metaDescription: 'Check if banks are open today. See current hours, weekend hours, and holiday schedules for major banks.',
      h1: 'Is Bank Open Today?',
      keywords: ['is bank open today', 'bank hours today', 'bank open today']
    },
    {
      slug: 'bank-hours-today',
      type: 'search-intent',
      template: 'bankHoursToday',
      pageTitle: 'Bank Hours Today - Current Operating Hours',
      metaDescription: 'Check bank hours today for major banks. Find opening times, closing times, and weekend hours.',
      h1: 'Bank Hours Today',
      keywords: ['bank hours today', 'banks open today', 'bank hours']
    },
    {
      slug: 'next-public-holiday',
      type: 'search-intent',
      template: 'nextPublicHoliday',
      pageTitle: 'Next Public Holiday - 2026 Holiday Calendar',
      metaDescription: 'Find the next public holiday. View 2026 holiday calendar with bank closures and school holidays.',
      h1: 'Next Public Holiday',
      keywords: ['next public holiday', 'public holidays 2026', 'upcoming holidays']
    },
    {
      slug: 'bank-holiday-calendar',
      type: 'search-intent',
      template: 'bankHolidayCalendar',
      pageTitle: 'Bank Holiday Calendar 2026 - USA, UK, Canada',
      metaDescription: 'Bank holiday calendar 2026 for USA, UK, Canada, and Australia. See when banks are closed.',
      h1: 'Bank Holiday Calendar 2026',
      keywords: ['bank holiday calendar', 'federal holidays 2026', 'bank closures']
    },
    {
      slug: 'are-banks-open-on-sunday',
      type: 'search-intent',
      template: 'banksOpenOnSunday',
      pageTitle: 'Are Banks Open on Sunday? - Weekend Banking Hours',
      metaDescription: 'Are banks open on Sunday? Check weekend hours for major banks and ATM availability.',
      h1: 'Are Banks Open on Sunday?',
      keywords: ['are banks open on sunday', 'sunday bank hours', 'banks open on weekend']
    }
  ];

  searchIntentPages.forEach(page => {
    if (!pageIds.has(page.slug)) {
      pageIds.add(page.slug);
      pages.push(page);
    }
  });

  return pages;
};

// Generate all pages
const pages = generatePages();

// Output statistics
console.log(`\n✅ Total pages generated: ${pages.length}`);
console.log(`📊 Page breakdown:`);
console.log(`   - Bank + Holiday questions: ${pages.filter(p => p.type === 'bank-holiday-question').length}`);
console.log(`   - Bank today questions: ${pages.filter(p => p.type === 'bank-today-question').length}`);
console.log(`   - Holiday detail pages: ${pages.filter(p => p.type === 'holiday-detail').length}`);
console.log(`   - City bank hours pages: ${pages.filter(p => p.type === 'city-bank-hours').length}`);
console.log(`   - Country calendar pages: ${pages.filter(p => p.type === 'country-holiday-calendar').length}`);
console.log(`   - Search intent pages: ${pages.filter(p => p.type === 'search-intent').length}`);

// Write to file
const outputPath = path.join(__dirname, '../generated-pages.json');
fs.writeFileSync(outputPath, JSON.stringify(pages, null, 2));
console.log(`\n📁 Pages written to: ${outputPath}`);
