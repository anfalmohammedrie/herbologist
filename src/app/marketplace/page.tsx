"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { useLanguage } from '@/context/LanguageContext';

export default function MarketplacePage() {
  const { t } = useLanguage();
  const [listings, setListings] = useState<any[]>([]);
  const [varietals, setVarietals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedVarietalFilter, setSelectedVarietalFilter] = useState('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Seller Contact Modal
  const [activeContactSeller, setActiveContactSeller] = useState<any>(null);

  // New Listing Form Modal
  const [showAddListingModal, setShowAddListingModal] = useState(false);
  const [newListing, setNewListing] = useState({
    sellerName: '',
    sellerType: 'Farmer Co-operative',
    contactPhone: '',
    contactEmail: '',
    location: '',
    varietalId: '',
    giTag: '',
    quantityKg: '',
    pricePerKg: '',
    yqiScore: '90.0',
    grade: 'VERIFIED PREMIUM GRADE A',
    coaAttached: true,
    notes: '',
  });
  const [submittingListing, setSubmittingListing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vRes, lRes] = await Promise.all([
        fetch('/api/varietals'),
        fetch('/api/listings'),
      ]);
      const vData = await vRes.json();
      const lData = await lRes.json();

      // If database is empty, seed it
      if (vData.length === 0 || lData.length === 0) {
        await fetch('/api/seed');
        const [vRes2, lRes2] = await Promise.all([
          fetch('/api/varietals'),
          fetch('/api/listings'),
        ]);
        setVarietals(await vRes2.json());
        setListings(await lRes2.json());
      } else {
        setVarietals(vData);
        setListings(lData);
      }
    } catch (err) {
      console.error('Error fetching marketplace data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingListing(true);
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newListing),
      });

      if (res.ok) {
        alert('Your batch listing has been successfully posted to the marketplace!');
        setShowAddListingModal(false);
        fetchData();
      } else {
        alert('Failed to submit listing. Please check required fields.');
      }
    } catch (error) {
      alert('Error connecting to market server.');
    } finally {
      setSubmittingListing(false);
    }
  };

  const filteredListings = listings.filter((item) => {
    if (selectedVarietalFilter && item.varietalId !== parseInt(selectedVarietalFilter)) {
      return false;
    }
    if (selectedGradeFilter && !item.grade.includes(selectedGradeFilter)) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = item.sellerName?.toLowerCase().includes(q);
      const matchLoc = item.location?.toLowerCase().includes(q);
      const matchGI = item.giTag?.toLowerCase().includes(q);
      const matchVarietal = item.varietalName?.toLowerCase().includes(q);
      if (!matchName && !matchLoc && !matchGI && !matchVarietal) return false;
    }
    return true;
  });

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-white">{t('marketplaceTitle')}</h1>
            <span className="bg-emerald-900/80 border border-emerald-500 text-emerald-300 text-xs px-2.5 py-1 rounded-full font-mono">
              Kerala Govt Rates Live
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Connect directly with verified GI growers, co-operatives, and exporters across Kerala.
          </p>
        </div>

        <button
          onClick={() => setShowAddListingModal(true)}
          className="bg-emerald-700 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg transition-all active:scale-95 self-start md:self-auto"
        >
          <span>📦</span> {t('listLotBtn')}
        </button>
      </div>

      {/* Govt Benchmark Price ticker bar */}
      <div className="bg-[#142215] border border-green-900 rounded-xl p-4 mb-8 shadow-xl">
        <div className="flex justify-between items-center mb-3">
          <div className="text-xs font-bold text-green-400 uppercase tracking-widest flex items-center gap-2">
            <span>🏛️</span> OFFICIAL KERALA GOVT & SPICES BOARD BENCHMARK RATES (₹ / KG)
          </div>
          <Link href="/live-prices" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
            <span>🌐</span> Spices Board Live Daily Feed →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {varietals.map((v) => (
            <div key={v.id} className="bg-[#0f170f] p-3 rounded-lg border border-green-950 text-center">
              <div className="text-xs text-gray-400 font-medium truncate">{v.name}</div>
              <div className="text-base font-black text-emerald-400 font-mono mt-0.5">
                ₹{v.govtMarketRate} <span className="text-[10px] text-gray-500 font-sans">/kg</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-[#1a261a] border border-green-900 rounded-xl p-4 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase mb-1 block">{t('filterBotanical')}</label>
          <select
            value={selectedVarietalFilter}
            onChange={(e) => setSelectedVarietalFilter(e.target.value)}
            className="w-full bg-[#0f170f] border border-green-800 rounded p-2 text-sm text-white focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="">All Botanical Strains...</option>
            {varietals.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} (Govt: ₹{v.govtMarketRate}/kg)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase mb-1 block">{t('qualityRatingGrade')}</label>
          <select
            value={selectedGradeFilter}
            onChange={(e) => setSelectedGradeFilter(e.target.value)}
            className="w-full bg-[#0f170f] border border-green-800 rounded p-2 text-sm text-white focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="">All Quality Grades...</option>
            <option value="GRADE A">Grade A (Premium Verified)</option>
            <option value="GRADE B">Grade B (Standard Market)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase mb-1 block">{t('searchGradeState')}</label>
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0f170f] border border-green-800 rounded p-2 text-sm text-white focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading verified marketplace data...</div>
      ) : filteredListings.length === 0 ? (
        <div className="text-center py-16 bg-[#1a261a] rounded-xl border border-green-900 text-gray-400">
          No seller listings found matching your search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredListings.map((item) => {
            const isGradeA = item.grade?.includes('GRADE A');
            const diffFromGovt = item.govtMarketRate
              ? Math.round(((item.pricePerKg - item.govtMarketRate) / item.govtMarketRate) * 100)
              : 0;

            return (
              <div
                key={item.id}
                className={`rounded-xl p-6 border-2 flex flex-col justify-between transition-all hover:scale-[1.01] ${
                  isGradeA
                    ? 'bg-[#122314] border-emerald-600/60 shadow-lg shadow-emerald-950/40'
                    : 'bg-[#1a241b] border-amber-600/50'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-green-950 text-green-300 border border-green-800">
                      {item.varietalName || 'Botanical Spice'}
                    </span>

                    <span
                      className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isGradeA
                          ? 'bg-emerald-900 text-emerald-200 border border-emerald-500'
                          : 'bg-amber-900 text-amber-200 border border-amber-500'
                      }`}
                    >
                      {item.grade}
                    </span>
                  </div>

                  {/* Seller Header */}
                  <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                    {item.sellerName}
                  </h3>
                  <div className="text-xs text-gray-400 flex flex-wrap items-center gap-3 mb-4">
                    <span className="flex items-center gap-1 text-green-300">
                      <span>📍</span> {item.location}
                    </span>
                    <span className="bg-black/30 px-2 py-0.5 rounded border border-gray-800">
                      🏷️ {item.giTag}
                    </span>
                  </div>

                  {/* Pricing & Metric Box */}
                  <div className="grid grid-cols-3 gap-2 bg-black/40 p-3 rounded-lg border border-green-950 mb-4 text-center">
                    <div>
                      <div className="text-[10px] text-gray-400 font-semibold uppercase">YQI Index</div>
                      <div className="text-lg font-black text-emerald-400">{item.yqiScore}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 font-semibold uppercase">Stock Volume</div>
                      <div className="text-base font-bold text-white mt-0.5">{item.quantityKg} kg</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 font-semibold uppercase">Asking Price</div>
                      <div className="text-base font-black text-emerald-300 font-mono">₹{item.pricePerKg}</div>
                      <div className="text-[9px] text-gray-400">
                        {diffFromGovt >= 0 ? `+${diffFromGovt}%` : `${diffFromGovt}%`} vs Govt Rate
                      </div>
                    </div>
                  </div>

                  {/* Notes / COA */}
                  {item.notes && <p className="text-xs text-gray-300 mb-4 line-clamp-2 italic">"{item.notes}"</p>}
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between border-t border-green-900/60 pt-4 mt-2">
                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                    {item.coaAttached ? '✅ Verified Lab COA Vault' : '⚠️ Speculated COA'}
                  </span>

                  <button
                    onClick={() => setActiveContactSeller(item)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow active:scale-95 flex items-center gap-1.5"
                  >
                    <span>📞</span> {t('connectSellerBtn')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Seller Contact Modal */}
      {activeContactSeller && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#162217] border-2 border-emerald-500 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative animate-slide-up">
            <button
              onClick={() => setActiveContactSeller(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🌱</span>
              <h2 className="text-xl font-bold text-white">Seller Contact & Direct Inquiry</h2>
            </div>
            <p className="text-xs text-gray-400 mb-6">
              Connect directly with verified Kerala producers for authenticated procurement.
            </p>

            <div className="bg-[#0f170f] p-4 rounded-xl border border-green-900 mb-6 flex flex-col gap-2">
              <div className="text-lg font-bold text-emerald-300">{activeContactSeller.sellerName}</div>
              <div className="text-xs text-gray-300">
                <span className="text-gray-500">Classification:</span> {activeContactSeller.sellerType}
              </div>
              <div className="text-xs text-gray-300">
                <span className="text-gray-500">Location:</span> {activeContactSeller.location}
              </div>
              <div className="text-xs text-gray-300">
                <span className="text-gray-500">GI Registration:</span> {activeContactSeller.giTag}
              </div>
              <div className="text-xs text-gray-300">
                <span className="text-gray-500">Available Stock:</span> {activeContactSeller.quantityKg} kg @ ₹
                {activeContactSeller.pricePerKg}/kg
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={`tel:${activeContactSeller.contactPhone}`}
                className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl text-center text-sm flex items-center justify-center gap-2 transition-all"
              >
                <span>📞</span> {t('directCall')}: {activeContactSeller.contactPhone}
              </a>

              <a
                href={`mailto:${activeContactSeller.contactEmail}?subject=Procurement Inquiry: ${activeContactSeller.varietalName}&body=Hello ${activeContactSeller.sellerName}, I am interested in purchasing your batch of ${activeContactSeller.varietalName} (GI: ${activeContactSeller.giTag}). Please send lot specifications and COA.`}
                className="bg-green-900 hover:bg-green-800 text-green-200 border border-green-700 font-bold py-3 rounded-xl text-center text-sm flex items-center justify-center gap-2 transition-all"
              >
                <span>✉️</span> {t('sendEmail')}
              </a>

              <a
                href={`https://wa.me/${activeContactSeller.contactPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hello ${activeContactSeller.sellerName}, I found your listing for ${activeContactSeller.varietalName} on The AI Herbologist Portal. I would like to inquire about procuring a batch.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-600 font-bold py-3 rounded-xl text-center text-sm flex items-center justify-center gap-2 transition-all"
              >
                <span>💬</span> {t('whatsAppMsg')}
              </a>
            </div>

            <div className="mt-6 text-center text-[11px] text-gray-500">
              Verified by The AI Herbologist Portal • Kerala State Agricultural Trust
            </div>
          </div>
        </div>
      )}

      {/* Modal to Post New Seller Listing */}
      {showAddListingModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#162217] border border-green-800 rounded-2xl p-6 max-w-xl w-full shadow-2xl my-8 relative">
            <button
              onClick={() => setShowAddListingModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-white mb-2">Post Batch Listing For Sale</h2>
            <p className="text-xs text-gray-400 mb-6">
              Register your authenticated Kerala agricultural strain lot for direct buyer inquiries.
            </p>

            <form onSubmit={handleCreateListing} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-300">Producer / Farm / Co-op Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wayanad Spices Collective"
                  className="w-full bg-[#0f170f] border border-green-800 rounded p-2 text-sm text-white outline-none focus:ring-2 focus:ring-green-500"
                  value={newListing.sellerName}
                  onChange={(e) => setNewListing({ ...newListing, sellerName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-300">Seller Type</label>
                  <select
                    className="w-full bg-[#0f170f] border border-green-800 rounded p-2 text-sm text-white outline-none focus:ring-2 focus:ring-green-500"
                    value={newListing.sellerType}
                    onChange={(e) => setNewListing({ ...newListing, sellerType: e.target.value })}
                  >
                    <option value="Farmer Co-operative">Farmer Co-operative</option>
                    <option value="GI Certified Estate">GI Certified Estate</option>
                    <option value="Tribal Agro Producer Society">Tribal Agro Producer Society</option>
                    <option value="Certified Exporter">Certified Exporter</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300">Botanical Varietal</label>
                  <select
                    required
                    className="w-full bg-[#0f170f] border border-green-800 rounded p-2 text-sm text-white outline-none focus:ring-2 focus:ring-green-500"
                    value={newListing.varietalId}
                    onChange={(e) => setNewListing({ ...newListing, varietalId: e.target.value })}
                  >
                    <option value="">Select Varietal...</option>
                    {varietals.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-300">Location (City, District, Kerala)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kalpetta, Wayanad, Kerala"
                    className="w-full bg-[#0f170f] border border-green-800 rounded p-2 text-sm text-white outline-none focus:ring-2 focus:ring-green-500"
                    value={newListing.location}
                    onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300">GI Tag Registration Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GI-IND-KER-WAY-901"
                    className="w-full bg-[#0f170f] border border-green-800 rounded p-2 text-sm text-white outline-none focus:ring-2 focus:ring-green-500"
                    value={newListing.giTag}
                    onChange={(e) => setNewListing({ ...newListing, giTag: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-300">Contact Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 94470 00000"
                    className="w-full bg-[#0f170f] border border-green-800 rounded p-2 text-sm text-white outline-none focus:ring-2 focus:ring-green-500"
                    value={newListing.contactPhone}
                    onChange={(e) => setNewListing({ ...newListing, contactPhone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300">Contact Email</label>
                  <input
                    type="email"
                    required
                    placeholder="sales@coop.in"
                    className="w-full bg-[#0f170f] border border-green-800 rounded p-2 text-sm text-white outline-none focus:ring-2 focus:ring-green-500"
                    value={newListing.contactEmail}
                    onChange={(e) => setNewListing({ ...newListing, contactEmail: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-300">Stock Available (kg)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 500"
                    className="w-full bg-[#0f170f] border border-green-800 rounded p-2 text-sm text-white outline-none focus:ring-2 focus:ring-green-500"
                    value={newListing.quantityKg}
                    onChange={(e) => setNewListing({ ...newListing, quantityKg: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300">Asking Price (₹ / kg)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 700"
                    className="w-full bg-[#0f170f] border border-green-800 rounded p-2 text-sm font-mono text-emerald-400 outline-none focus:ring-2 focus:ring-green-500"
                    value={newListing.pricePerKg}
                    onChange={(e) => setNewListing({ ...newListing, pricePerKg: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300">Batch Notes & Description</label>
                <textarea
                  rows={2}
                  placeholder="Sun-dried organically grown lot with high volatile aromatic oil..."
                  className="w-full bg-[#0f170f] border border-green-800 rounded p-2 text-xs text-white outline-none focus:ring-2 focus:ring-green-500"
                  value={newListing.notes}
                  onChange={(e) => setNewListing({ ...newListing, notes: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={submittingListing}
                className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 mt-2"
              >
                {submittingListing ? 'Publishing Listing...' : 'Publish Lot to Portal Marketplace'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
