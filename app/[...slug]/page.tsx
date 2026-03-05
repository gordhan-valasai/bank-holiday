import Link from "next/link";
import usa from "@/data/usa-holidays.json";
import uk from "@/data/uk-holidays.json";
import canada from "@/data/canada-holidays.json";
import australia from "@/data/australia-holidays.json";

interface Params {
  slug: string[];
}

const countries: Record<string, { 
  name: string; 
  flag: string;
  description: string;
  holidays: any[] 
}> = {
  usa: { 
    name: "United States", 
    flag: "🇺🇸",
    description: "Federal bank holidays in the United States",
    holidays: usa 
  },
  uk: { 
    name: "United Kingdom", 
    flag: "🇬🇧",
    description: "Bank holidays observed in England, Wales, Scotland and Northern Ireland",
    holidays: uk 
  },
  canada: { 
    name: "Canada", 
    flag: "🇨🇦",
    description: "Federal statutory holidays in Canada",
    holidays: canada 
  },
  australia: { 
    name: "Australia", 
    flag: "🇦🇺",
    description: "National public holidays in Australia",
    holidays: australia 
  },
};

export const generateStaticParams = async () => {
  return Object.keys(countries).map(slug => ({
    slug: [slug]
  }));
};

export default function CountryPage({ params }: { params: Params }) {
  const slug = params?.slug?.[0];
  const country = slug ? countries[slug] : undefined;

  if (!country || !slug) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            The page you are looking for does not exist.
          </p>
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline text-lg">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const holidays = country.holidays;
  const sortedHolidays = [...holidays].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Header */}
      <header className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{country.flag}</span>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
                {country.name}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
                {country.description}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Statistics Cards */}
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <p className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {holidays.length}
              </p>
              <p className="text-slate-700 dark:text-slate-300 font-semibold">
                Bank Holidays in 2026
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
              <p className="text-5xl font-bold text-red-600 dark:text-red-400 mb-2">
                {holidays.filter((h: any) => !h.banks_open).length}
              </p>
              <p className="text-slate-700 dark:text-slate-300 font-semibold">
                Banks Closed
              </p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6 border border-orange-200 dark:border-orange-800">
              <p className="text-5xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                {holidays.filter((h: any) => !h.schools_open).length}
              </p>
              <p className="text-slate-700 dark:text-slate-300 font-semibold">
                Schools Closed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Holiday Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
          2026 Holiday Calendar
        </h2>
        
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <th className="px-6 py-4 text-left font-semibold text-slate-900 dark:text-white">
                    Holiday Name
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900 dark:text-white">
                    Date
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-slate-900 dark:text-white">
                    Banks Open
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-slate-900 dark:text-white">
                    Schools Open
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900 dark:text-white">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedHolidays.map((holiday: any, index) => (
                  <tr
                    key={holiday.id}
                    className={`border-b border-slate-200 dark:border-slate-800 transition ${
                      index % 2 === 0
                        ? "bg-white dark:bg-slate-950"
                        : "bg-slate-50 dark:bg-slate-900/50"
                    } hover:bg-slate-100 dark:hover:bg-slate-800`}
                  >
                    <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">
                      {holiday.holiday}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {new Date(holiday.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold ${
                        holiday.banks_open
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                      }`}>
                        {holiday.banks_open ? "✓" : "✕"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold ${
                        holiday.schools_open
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                      }`}>
                        {holiday.schools_open ? "✓" : "✕"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">
                        {holiday.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              © 2026 BankHoliday.io • Updated for {country.name}
            </p>
            <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold mt-4 sm:mt-0">
              Browse Other Countries →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}


