export interface FAQItem {
  question: string;
  answer: string;
}

export const generateFAQSchema = (faqs: FAQItem[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
};

export const generateBreadcrumbSchema = (breadcrumbs: Array<{ name: string; url: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url
    }))
  };
};

export const generateArticleSchema = (
  title: string,
  description: string,
  image: string,
  datePublished: string,
  author: string = 'Bank Holiday Hours'
) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image,
    datePublished,
    author: {
      '@type': 'Organization',
      name: author
    }
  };
};

export const generateWebPageSchema = (
  title: string,
  description: string,
  url: string
) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url
  };
};

export const generateOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Bank Holiday Hours',
    url: 'https://bankopentoday.com',
    logo: 'https://bankopentoday.com/logo.png',
    sameAs: [
      'https://www.facebook.com/bankopentoday',
      'https://www.twitter.com/bankopentoday'
    ]
  };
};
