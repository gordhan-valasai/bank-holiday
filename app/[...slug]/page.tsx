import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import { generateSEOMeta } from '@/lib/seo';
import { generateFAQSchema, generateBreadcrumbSchema } from '@/lib/schema';
import { formatDate } from '@/lib/dateUtils';

interface GeneratedPage {
  slug: string;
  type: string;
  template: string;
  pageTitle: string;
  metaDescription: string;
  h1: string;
  bank?: string;
  bankId?: string;
  holiday?: string;
  holidayId?: string;
  country?: string;
  city?: string;
  date?: string;
  answer?: string;
  description?: string;
  region?: string;
  keywords?: string[];
}

// Load generated pages at build time
const loadGeneratedPages = (): GeneratedPage[] => {
  try {
    const filePath = path.join(process.cwd(), 'generated-pages.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading generated pages:', error);
    return [];
  }
};

// Generate static params for all pages
export const generateStaticParams = async () => {
  const pages = loadGeneratedPages();
  return pages.map(page => ({
    slug: page.slug.split('/')
  }));
};

// Generate metadata
export const generateMetadata = ({ params }: { params: { slug: string | string[] } }): Metadata => {
  const pages = loadGeneratedPages();
  const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;
  const page = pages.find(p => p.slug === slug);

  if (!page) {
    return {
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist.'
    };
  }

  const seoMeta = generateSEOMeta(page.pageTitle, page.metaDescription, slug, page.type);

  return {
    title: seoMeta.title,
    description: seoMeta.description,
    icons: {
      icon: '/favicon.ico'
    },
    openGraph: {
      title: seoMeta.ogTitle,
      description: seoMeta.ogDescription,
      type: (seoMeta.ogType as 'article' | 'website') || 'website',
      url: seoMeta.canonical
    },
    twitter: {
      card: 'summary_large_image',
      title: seoMeta.ogTitle,
      description: seoMeta.ogDescription
    },
    keywords: page.keywords?.join(', ')
  };
};

// Main page component
export default function DynamicPage({ params }: { params: { slug: string | string[] } }) {
  const pages = loadGeneratedPages();
  const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;
  const page = pages.find(p => p.slug === slug);

  if (!page) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">The page you are looking for does not exist.</p>
        <a href="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </a>
      </div>
    );
  }

  // Render based on template type
  const renderPage = () => {
    switch (page.template) {
      case 'bankHolidayQuestion':
        return <BankHolidayQuestionPage page={page} />;
      case 'bankTodayQuestion':
        return <BankTodayQuestionPage page={page} />;
      case 'holidayDetail':
        return <HolidayDetailPage page={page} />;
      case 'cityBankHours':
        return <CityBankHoursPage page={page} />;
      case 'countryHolidayCalendar':
        return <CountryHolidayCalendarPage page={page} />;
      case 'bankOpenToday':
      case 'bankHoursToday':
      case 'nextPublicHoliday':
      case 'bankHolidayCalendar':
      case 'banksOpenOnSunday':
        return <SearchIntentPage page={page} />;
      default:
        return <DefaultPage page={page} />;
    }
  };

  const breadcrumbs = generateBreadcrumbs(page);
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        {renderPage()}
      </div>
    </>
  );
}

// Page template components
const BankHolidayQuestionPage = ({ page }: { page: GeneratedPage }) => {
  const faqs = [
    {
      question: `Is ${page.bank} open on ${page.holiday}?`,
      answer: page.answer || 'Check bank hours for this holiday.'
    },
    {
      question: `What are ${page.bank} hours on weekends?`,
      answer: `${page.bank} typically has limited weekend hours. Check their website for specific times.`
    },
    {
      question: `Is ${page.bank} ATM available on ${page.holiday}?`,
      answer: 'Yes, ATMs are typically available 24/7, even on holidays.'
    }
  ];

  const faqSchema = generateFAQSchema(faqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />
      <h1 className="text-4xl font-bold mb-6">{page.h1}</h1>

      {/* Answer Box */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
        <p className="text-lg font-semibold text-blue-900">{page.answer}</p>
      </div>

      <h2 className="text-2xl font-bold mb-4 mt-8">Bank Hours</h2>
      <table className="w-full border-collapse border border-gray-300 mb-8">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-3 text-left">Day</th>
            <th className="border border-gray-300 p-3 text-left">Hours</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 p-3">Monday - Friday</td>
            <td className="border border-gray-300 p-3">9:00 AM - 5:00 PM</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-3">Saturday</td>
            <td className="border border-gray-300 p-3">Limited hours</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-3">Sunday</td>
            <td className="border border-gray-300 p-3">Closed</td>
          </tr>
        </tbody>
      </table>

      <h2 className="text-2xl font-bold mb-4">Holiday Information</h2>
      <p className="text-gray-700 mb-4">
        <strong>{page.holiday}</strong> is {!page.answer?.includes('No') ? '' : 'NOT'} considered a banking holiday in most of {page.country}.
        {page.date && ` The holiday falls on ${formatDate(page.date)}.`}
      </p>

      <h2 className="text-2xl font-bold mb-4">FAQs</h2>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border border-gray-300 rounded p-4">
            <h3 className="font-semibold mb-2">{faq.question}</h3>
            <p className="text-gray-700">{faq.answer}</p>
          </div>
        ))}
      </div>
    </>
  );
};

const BankTodayQuestionPage = ({ page }: { page: GeneratedPage }) => {
  return (
    <>
      <h1 className="text-4xl font-bold mb-6">{page.h1}</h1>

      <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-8">
        <p className="text-lg font-semibold text-green-900">
          Check the day and holidays to see current status.
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4">Standard Banking Hours</h2>
      <table className="w-full border-collapse border border-gray-300 mb-8">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-3 text-left">Day</th>
            <th className="border border-gray-300 p-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 p-3">Monday - Friday</td>
            <td className="border border-gray-300 p-3">9:00 AM - 5:00 PM</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-3">Saturday</td>
            <td className="border border-gray-300 p-3">Limited or Closed</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-3">Sunday</td>
            <td className="border border-gray-300 p-3">Closed</td>
          </tr>
        </tbody>
      </table>

      <p className="text-gray-700">
        Most bank branches follow standard business hours Monday through Friday.
        Check with {page.bank} directly for weekend hours at your local branch.
      </p>
    </>
  );
};

const HolidayDetailPage = ({ page }: { page: GeneratedPage }) => {
  return (
    <>
      <h1 className="text-4xl font-bold mb-6">{page.h1}</h1>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
        <p className="text-lg font-semibold text-blue-900">
          {page.date && formatDate(page.date)}
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4">About this Holiday</h2>
      <p className="text-gray-700 mb-6">{page.description}</p>

      <h2 className="text-2xl font-bold mb-4">Bank & Business Status</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
        <li>Banks: Closed</li>
        <li>Schools: Closed</li>
        <li>Government offices: Closed</li>
        <li>ATMs: Available 24/7</li>
      </ul>

      {page.region && (
        <>
          <h2 className="text-2xl font-bold mb-4">Regions Affected</h2>
          <p className="text-gray-700 mb-6">{page.region}</p>
        </>
      )}
    </>
  );
};

const CityBankHoursPage = ({ page }: { page: GeneratedPage }) => {
  return (
    <>
      <h1 className="text-4xl font-bold mb-6">{page.h1}</h1>

      <p className="text-gray-700 mb-6">
        Find {page.bank} branch hours in {page.city}, {page.country}.
      </p>

      <h2 className="text-2xl font-bold mb-4">Standard Hours</h2>
      <table className="w-full border-collapse border border-gray-300 mb-8">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-3 text-left">Day</th>
            <th className="border border-gray-300 p-3 text-left">Hours</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 p-3">Monday - Friday</td>
            <td className="border border-gray-300 p-3">9:00 AM - 5:00 PM</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-3">Saturday</td>
            <td className="border border-gray-300 p-3">Limited hours</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-3">Sunday</td>
            <td className="border border-gray-300 p-3">Closed</td>
          </tr>
        </tbody>
      </table>

      <p className="text-gray-700">
        Please call ahead to confirm hours for your specific {page.bank} branch in {page.city}.
      </p>
    </>
  );
};

const CountryHolidayCalendarPage = ({ page }: { page: GeneratedPage }) => {
  return (
    <>
      <h1 className="text-4xl font-bold mb-6">{page.h1}</h1>

      <p className="text-gray-700 mb-6">
        View all public holidays and bank holidays in {page.country} for 2026.
        See when banks and schools are closed.
      </p>

      <h2 className="text-2xl font-bold mb-4">2026 Holiday Calendar</h2>
      <p className="text-gray-700">
        Detailed holiday calendar showing all public holidays, banking holidays, and school closures for {page.country}.
      </p>
    </>
  );
};

const SearchIntentPage = ({ page }: { page: GeneratedPage }) => {
  return (
    <>
      <h1 className="text-4xl font-bold mb-6">{page.h1}</h1>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
        <p className="text-lg font-semibold text-blue-900">
          {page.metaDescription}
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
      <ul className="list-disc list-inside text-blue-600 space-y-2">
        <li><a href="/usa/holiday-calendar" className="hover:underline">USA Bank Holidays</a></li>
        <li><a href="/uk/holiday-calendar" className="hover:underline">UK Bank Holidays</a></li>
        <li><a href="/canada/holiday-calendar" className="hover:underline">Canada Public Holidays</a></li>
        <li><a href="/australia/holiday-calendar" className="hover:underline">Australia Public Holidays</a></li>
      </ul>
    </>
  );
};

const DefaultPage = ({ page }: { page: GeneratedPage }) => {
  return (
    <>
      <h1 className="text-4xl font-bold mb-6">{page.h1}</h1>
      <p className="text-gray-700">{page.metaDescription}</p>
    </>
  );
};

// Helper function to generate breadcrumbs
const generateBreadcrumbs = (page: GeneratedPage) => {
  const breadcrumbs = [{ name: 'Home', url: 'https://bankopentoday.com' }];

  if (page.country && page.type !== 'search-intent') {
    breadcrumbs.push({
      name: page.country,
      url: `https://bankopentoday.com/${page.country.toLowerCase()}`
    });
  }

  if (page.bank) {
    breadcrumbs.push({
      name: page.bank,
      url: `https://bankopentoday.com/banks/${page.bank.toLowerCase().replace(/\s+/g, '-')}`
    });
  }

  if (page.holiday) {
    breadcrumbs.push({
      name: page.holiday,
      url: `https://bankopentoday.com/holiday/${page.holiday.toLowerCase().replace(/\s+/g, '-')}`
    });
  }

  breadcrumbs.push({
    name: page.h1,
    url: `https://bankopentoday.com/${page.slug}`
  });

  return breadcrumbs;
};
