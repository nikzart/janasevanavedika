import { useState, useEffect, useMemo } from 'react';
import { Loader2, UserX, Search } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { Leader, LeaderCategory, LEADER_CATEGORIES } from '../types';
import { fetchLeaders } from '../lib/leadersApi';
import Header from '../components/Header';

const CATEGORY_ORDER: LeaderCategory[] = ['state', 'district', 'ward', 'area'];

export default function LeadersPage() {
  const { t, language } = useLanguage();
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<LeaderCategory | 'all'>('all');

  useEffect(() => {
    loadLeaders();
  }, []);

  const loadLeaders = async () => {
    setLoading(true);
    const data = await fetchLeaders();
    setLeaders(data);
    setLoading(false);
  };

  // Filter leaders by search and category
  const filteredLeaders = useMemo(() => {
    return leaders.filter(leader => {
      // Category filter
      if (selectedCategory !== 'all' && leader.category !== selectedCategory) {
        return false;
      }

      // Search filter (search in both languages)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName =
          leader.name_en.toLowerCase().includes(query) ||
          leader.name_kn.includes(query);
        const matchesPosition =
          leader.position_en.toLowerCase().includes(query) ||
          leader.position_kn.includes(query);
        return matchesName || matchesPosition;
      }

      return true;
    });
  }, [leaders, searchQuery, selectedCategory]);

  // Group filtered leaders by category
  const leadersByCategory = useMemo(() => {
    return CATEGORY_ORDER.reduce((acc, cat) => {
      acc[cat] = filteredLeaders.filter(l => l.category === cat);
      return acc;
    }, {} as Record<LeaderCategory, Leader[]>);
  }, [filteredLeaders]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />

      {/* Hero Section */}
      <section className="gradient-hero py-6 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">
            {t({
              en: 'Our Leaders',
              kn: 'ನಮ್ಮ ನಾಯಕರು',
            })}
          </h2>
          <p className="text-slate-600">
            {t({
              en: 'Leadership guiding our community',
              kn: 'ನಮ್ಮ ಸಮುದಾಯವನ್ನು ಮಾರ್ಗದರ್ಶನ ಮಾಡುವ ನಾಯಕತ್ವ',
            })}
          </p>
        </div>
        <div className="absolute top-4 left-4 w-20 h-20 bg-primary/5 rounded-full blur-2xl animate-float" />
        <div
          className="absolute bottom-4 right-4 w-32 h-32 bg-action/5 rounded-full blur-2xl animate-float"
          style={{ animationDelay: '1s' }}
        />
      </section>

      {/* Search & Filter Bar */}
      <div className="max-w-4xl mx-auto px-4 py-4 space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder={t({ en: 'Search leaders...', kn: 'ನಾಯಕರನ್ನು ಹುಡುಕಿ...' })}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white
                       focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t({ en: 'All', kn: 'ಎಲ್ಲಾ' })}
          </button>
          {CATEGORY_ORDER.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t(LEADER_CATEGORIES[cat])}
            </button>
          ))}
        </div>
      </div>

      {/* Leaders Content */}
      <main className="max-w-4xl mx-auto px-4 py-2">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : filteredLeaders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <UserX className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">
              {searchQuery
                ? t({ en: 'No leaders found', kn: 'ಯಾವುದೇ ನಾಯಕರು ಕಂಡುಬಂದಿಲ್ಲ' })
                : t({ en: 'No leaders yet', kn: 'ಇನ್ನೂ ನಾಯಕರಿಲ್ಲ' })}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-primary hover:underline text-sm"
              >
                {t({ en: 'Clear search', kn: 'ಹುಡುಕಾಟ ತೆರವುಗೊಳಿಸಿ' })}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {CATEGORY_ORDER.map(category => {
              const categoryLeaders = leadersByCategory[category];
              if (categoryLeaders.length === 0) return null;

              return (
                <section key={category}>
                  <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                    <span className={`w-1 h-6 rounded-full ${
                      category === 'state'
                        ? 'bg-purple-500'
                        : category === 'district'
                        ? 'bg-blue-500'
                        : category === 'ward'
                        ? 'bg-green-500'
                        : 'bg-orange-500'
                    }`} />
                    {t(LEADER_CATEGORIES[category])}
                    <span className="text-sm text-slate-400 font-normal">
                      ({categoryLeaders.length})
                    </span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categoryLeaders.map(leader => (
                      <LeaderCard key={leader.id} leader={leader} language={language} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

interface LeaderCardProps {
  leader: Leader;
  language: 'en' | 'kn';
}

function LeaderCard({ leader, language }: LeaderCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden
                    hover:shadow-md transition-shadow">
      <div className="aspect-square">
        <img
          src={leader.image_data}
          alt={language === 'en' ? leader.name_en : leader.name_kn}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3 text-center">
        <h3 className="font-semibold text-slate-800 line-clamp-1">
          {language === 'en' ? leader.name_en : leader.name_kn}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-1">
          {language === 'en' ? leader.position_en : leader.position_kn}
        </p>
      </div>
    </div>
  );
}
