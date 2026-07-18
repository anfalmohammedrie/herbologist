"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function SpicesBoardLivePricesPage() {
  const { t } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSpice, setSelectedSpice] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('');

  useEffect(() => {
    fetchLivePrices();
  }, []);

  const fetchLivePrices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/spices-board-prices');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error fetching live Spices Board data:', err);
    } finally {
      setLoading(false);
    }
  };

  const prices = data?.prices || [];

  const spiceList = Array.from(new Set(prices.map((p: any) => p.spice))).sort();
  const marketList = Array.from(new Set(prices.map((p: any) => p.marketCentre))).sort();

  const filteredPrices = prices.filter((p: any) => {
    if (selectedSpice && p.spice.toLowerCase() !== selectedSpice.toLowerCase()) return false;
    if (selectedMarket && p.marketCentre.toLowerCase() !== selectedMarket.toLowerCase()) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchSpice = p.spice?.toLowerCase().includes(q);
      const matchMarket = p.marketCentre?.toLowerCase().includes(q);
      const matchGrade = p.grade?.toLowerCase().includes(q);
      const matchState = p.state?.toLowerCase().includes(q);
      if (!matchSpice && !matchMarket && !matchGrade && !matchState) return false;
    }
    return true;
  });

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      {/* Header & Source Accreditation */}
      <div className="bg-[#142215] border border-green-900 rounded-2xl p-6 mb-8 shadow-2xl relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-950 border border-emerald-500/80 text-emerald-300 text-[11px] font-mono px-3 py-1 rounded-full uppercase tracking-widest font-bold mb-2">
              <span>🌐</span> OFFICIAL GOVERNMENT LIVE MARKET FEED
            </div>
            <h1 className="text-3xl font-extrabold text-white">{t('livePricesTitle')}</h1>
            <p className="text-gray-400 text-xs mt-1">
              {t('livePricesSubtitle')}
            </p>
          </div>

          <a
            href="https://www.indianspices.com/marketing/price/domestic/current-market-price.html"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg border border-emerald-500 flex items-center gap-2 transition-all shadow active:scale-95 self-start md:self-auto"
          >
            <span>↗️</span> {t('officialPortalBtn')}
          </a>
        </div>

        {/* Live Feed Bar */}
        <div className="bg-[#0f170f] p-3.5 rounded-xl border border-green-950 flex flex-wrap items-center justify-between text-xs text-gray-300 gap-2">
          <div className="flex items-center gap-2 font-mono">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-bold">
              {data?.isLive ? 'LIVE SERVER SYNCHRONIZED' : 'BENCHMARK BULLETIN ACTIVE'}
            </span>
            <span className="text-gray-500">• Last Synced: {data?.lastFetched ? new Date(data.lastFetched).toLocaleTimeString() : 'Just now'}</span>
          </div>

          <button
            onClick={fetchLivePrices}
            disabled={loading}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold underline flex items-center gap-1"
          >
            <span>🔄</span> {t('refreshBtn')}
          </button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-[#1a261a] border border-green-900 rounded-xl p-4 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase mb-1 block">{t('filterSpiceType')}</label>
          <select
            value={selectedSpice}
            onChange={(e) => setSelectedSpice(e.target.value)}
            className="w-full bg-[#0f170f] border border-green-800 rounded p-2 text-sm text-white focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="">All Spices Board Categories...</option>
            {spiceList.map((s: any) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase mb-1 block">{t('filterMarketCentre')}</label>
          <select
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value)}
            className="w-full bg-[#0f170f] border border-green-800 rounded p-2 text-sm text-white focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="">All Market Centres (Cochin, Bodinayakanur...)</option>
            {marketList.map((m: any) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase mb-1 block">{t('searchGradeState')}</label>
          <input
            type="text"
            placeholder="Search e.g. Garbled, Kerala, Cochin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0f170f] border border-green-800 rounded p-2 text-sm text-white focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
      </div>

      {/* Daily Price Table */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Syncing domestic market prices from Spices Board of India...</div>
      ) : filteredPrices.length === 0 ? (
        <div className="text-center py-16 bg-[#1a261a] rounded-xl border border-green-900 text-gray-400">
          No spice entries found matching your filter selections.
        </div>
      ) : (
        <div className="bg-[#162217] border border-green-900 rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0f170f] border-b border-green-900 text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
                  <th className="p-4">{t('colDate')}</th>
                  <th className="p-4">{t('colCategory')}</th>
                  <th className="p-4">{t('colMarket')}</th>
                  <th className="p-4">{t('colState')}</th>
                  <th className="p-4">{t('colGrade')}</th>
                  <th className="p-4">{t('colSource')}</th>
                  <th className="p-4 text-right">{t('colMin')}</th>
                  <th className="p-4 text-right">{t('colMax')}</th>
                  <th className="p-4 text-right text-emerald-400">{t('colAvg')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-950 text-xs">
                {filteredPrices.map((row: any, idx: number) => (
                  <tr key={idx} className="hover:bg-green-950/40 transition-colors">
                    <td className="p-4 font-mono text-gray-300 font-medium">{row.date}</td>
                    <td className="p-4 font-bold text-white text-sm">{row.spice}</td>
                    <td className="p-4 text-emerald-300 font-medium">{row.marketCentre}</td>
                    <td className="p-4 text-gray-400">{row.state}</td>
                    <td className="p-4 text-gray-200 font-medium">{row.grade}</td>
                    <td className="p-4 text-gray-400 italic text-[11px]">{row.source}</td>
                    <td className="p-4 text-right font-mono text-gray-400">{row.minPrice ? `₹${row.minPrice}` : '-'}</td>
                    <td className="p-4 text-right font-mono text-gray-400">{row.maxPrice ? `₹${row.maxPrice}` : '-'}</td>
                    <td className="p-4 text-right font-mono text-base font-black text-emerald-400 bg-emerald-950/20">
                      ₹{row.avgPrice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-[#0d160e] border-t border-green-950 flex flex-wrap justify-between items-center text-xs text-gray-400">
            <div>Displaying {filteredPrices.length} official spice market entries</div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-emerald-400 hover:underline font-bold">
                Run Botanical Integrity Audit →
              </Link>
              <Link href="/marketplace" className="text-emerald-400 hover:underline font-bold">
                View Seller Marketplace →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
