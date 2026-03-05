import Link from "next/link";
import usa from "@/data/usa-holidays.json";
import uk from "@/data/uk-holidays.json";
import canada from "@/data/canada-holidays.json";
import australia from "@/data/australia-holidays.json";

// Bank holiday tracker for USA, UK, Canada, and Australia

export const metadata = {
  title: "Bank Holiday Hours | Find When Banks Are Closed",
  description: "Check bank holiday hours for USA, UK, Canada, and Australia. Find out when your bank is open or closed.",
};

export default function Home() {
  const countries = [
    { name: "USA", slug: "usa", holidays: usa, flag: "🇺🇸" },
    { name: "United Kingdom", slug: "uk", holidays: uk, flag: "🇬🇧" },
    { name: "Canada", slug: "canada", holidays: canada, flag: "🇨🇦" },
    { name: "Australia", slug: "australia", holidays: australia, flag: "🇦🇺" },
  ];

  const upcomingHolidays = () => {
    const today = new Date();
    const allHolidays = countries.flatMap(country =>
      country.holidays
        .filter((h: any) => new Date(h.date) >= today)
        .map(h => ({
          ...h,
          country: country.name,
          countrySlug: country.slug
        }))
    );
    return allHolidays
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            BankHoliday.io
          </h1>
          <div className="hidden md:flex gap-8">
            <Link href="#upcoming" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition">
              Upcoming
            </Link>
            <Link href="#countries" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition">
              Countries
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto text-center">
          <h2 className="text-5xl sm:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            Never Miss a <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Bank Holiday</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Check bank and school holiday schedules across 4 countries. Plan ahead and avoid surprises.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="#countries"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Explore Countries
            </Link>
            <Link 
              href="#upcoming"
              className="px-8 py-3 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition font-semibold"
            >
              View Upcoming
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Holidays */}
      <section id="upcoming" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Upcoming Bank Holidays
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Mark your calendar for these important dates
          </p>
        </div>
        
        <div className="grid gap-4">
          {upcomingHolidays().map((holiday: any, idx) => (
            <div
              key={`${holiday.countrySlug}-${holiday.id}`}
              className="group bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition hover:border-blue-300 dark:hover:border-blue-700"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">
                      {countries.find(c => c.slug === holiday.countrySlug)?.flag}
                    </span>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {holiday.country}
                    </p>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {holiday.holiday}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {new Date(holiday.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Banks</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      holiday.banks_open 
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" 
                        : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                    }`}>
                      {holiday.banks_open ? "Open" : "Closed"}
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Schools</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      holiday.schools_open 
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" 
                        : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                    }`}>
                      {holiday.schools_open ? "Open" : "Closed"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Countries Grid */}
      <section id="countries" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Browse by Country
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Select a country to view all bank holidays for 2026
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {countries.map(country => (
            <Link
              key={country.slug}
              href={`/${country.slug}`}
              className="group bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-8 text-center hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition">
                {country.flag}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                {country.name}
              </h3>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                {country.holidays.length}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                bank holidays in 2026
              </p>
              <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-3 transition">
                View Details <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 dark:bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">
            Why Use BankHoliday.io?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-8 border border-slate-200 dark:border-slate-700">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Updated Calendar
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Current and accurate holiday schedules for 2026
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-lg p-8 border border-slate-200 dark:border-slate-700">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Multiple Countries
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Compare holidays across USA, UK, Canada, and Australia
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-lg p-8 border border-slate-200 dark:border-slate-700">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Quick Reference
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                See at a glance which banks and schools are closed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">BankHoliday.io</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Your trusted source for bank holiday schedules
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">Countries</h4>
              <ul className="space-y-2 text-sm">
                {countries.map(c => (
                  <li key={c.slug}>
                    <Link href={`/${c.slug}`} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#upcoming" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">Upcoming Holidays</a></li>
                <li><a href="#countries" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">Browse</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">Info</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Updated for 2026 • All dates accurate
              </p>
            </div>
          </div>
          
          <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              © 2026 BankHoliday.io. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
