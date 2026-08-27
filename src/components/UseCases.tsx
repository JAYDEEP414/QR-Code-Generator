import React from 'react';
import {
  Globe,
  Star,
  Share2,
  CreditCard,
  Package,
  Utensils,
  Megaphone,
  CalendarCheck,
} from 'lucide-react';

const USE_CASES = [
  {
    title: 'Websites & Portfolios',
    description: 'Direct customers straight to your homepage, landing page, or online portfolio with a quick camera scan.',
    icon: Globe,
  },
  {
    title: 'Google Reviews',
    description: 'Boost 5-star customer ratings by linking directly to your Google Maps review submission prompt.',
    icon: Star,
  },
  {
    title: 'Social Media Profiles',
    description: 'Grow your Instagram, YouTube, TikTok, LinkedIn, or X followers effortlessly on physical prints.',
    icon: Share2,
  },
  {
    title: 'Business Cards',
    description: 'Print on personal contact cards to share your vCard, portfolio, or scheduling calendar in seconds.',
    icon: CreditCard,
  },
  {
    title: 'Product Packaging',
    description: 'Provide quick digital user manuals, warranty registrations, or ingredient origin certifications.',
    icon: Package,
  },
  {
    title: 'Restaurant Menus',
    description: 'Offer touchless, updated food & drink menus on table tents, bar coasters, or takeaway flyers.',
    icon: Utensils,
  },
  {
    title: 'Marketing Materials',
    description: 'Place on posters, brochures, billboards, and direct mailers with trackable campaign UTM parameters.',
    icon: Megaphone,
  },
  {
    title: 'Events & Ticketing',
    description: 'Distribute event registration links, WiFi passwords, venue directions, or speaker agendas.',
    icon: CalendarCheck,
  },
];

export const UseCases: React.FC = () => {
  return (
    <section id="use-cases" className="py-12 sm:py-16 px-4 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1.5">
          Real-World Applications
        </h2>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Where Can You Use QR Codes?
        </h3>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
          From business cards to promotional billboards, high-resolution QR codes bridge physical and digital worlds.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {USE_CASES.map((uc) => {
          const Icon = uc.icon;
          return (
            <div
              key={uc.title}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                  {uc.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {uc.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
