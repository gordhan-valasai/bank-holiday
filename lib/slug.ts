export const deslugify = (slug: string): string => {
  return slug
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export interface ParsedSlug {
  type: string;
  bank?: string;
  holiday?: string;
  country?: string;
  city?: string;
}

export const parseSlug = (slug: string): ParsedSlug => {
  // Pattern: is-[bank]-open-on-[holiday]
  if (slug.startsWith('is-') && slug.includes('-open-on-')) {
    const parts = slug.replace('is-', '').split('-open-on-');
    return {
      type: 'bank-holiday',
      bank: deslugify(parts[0]),
      holiday: deslugify(parts[1])
    };
  }

  // Pattern: is-[bank]-open-today
  if (slug.startsWith('is-') && slug.endsWith('-open-today')) {
    const bank = slug.replace('is-', '').replace('-open-today', '');
    return {
      type: 'bank-today',
      bank: deslugify(bank)
    };
  }

  // Pattern: holiday/[holiday-name]
  if (slug.startsWith('holiday/')) {
    const holiday = slug.replace('holiday/', '');
    return {
      type: 'holiday',
      holiday: deslugify(holiday)
    };
  }

  // Pattern: [country]/[city]-[bank]-hours
  const countryPattern = /^([a-z-]+)\/([a-z-]+)-([a-z-]+)-hours$/;
  const match = slug.match(countryPattern);
  if (match) {
    return {
      type: 'city-bank-hours',
      country: deslugify(match[1]),
      city: deslugify(match[2]),
      bank: deslugify(match[3])
    };
  }

  return { type: 'unknown' };
};
