export interface SEOMeta {
  title: string;
  description: string;
  canonical: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  twitterCard?: string;
}

export const generateSEOMeta = (
  pageTitle: string,
  metaDescription: string,
  slug: string,
  pageType: string
): SEOMeta => {
  const domain = 'https://bankopentoday.com';
  const canonical = `${domain}/${slug}`;

  return {
    title: pageTitle,
    description: metaDescription,
    canonical,
    ogTitle: pageTitle,
    ogDescription: metaDescription,
    ogType: pageType === 'article' ? 'article' : 'website',
    twitterCard: 'summary_large_image'
  };
};

export const truncateDescription = (description: string, maxLength: number = 160): string => {
  if (description.length <= maxLength) {
    return description;
  }
  return description.substring(0, maxLength - 3) + '...';
};

export const formatKeywords = (keywords: string[]): string => {
  return keywords.slice(0, 5).join(', ');
};
