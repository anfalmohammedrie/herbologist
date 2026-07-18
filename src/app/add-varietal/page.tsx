"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function AddVarietal() {
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    compoundBaseline: '',
    compoundName: '',
    giPrefix: '',
    govtMarketRate: '',
    description: '',
    allowedVisuals: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const visualsArray = formData.allowedVisuals.split('\n').filter(v => v.trim() !== '');
      const res = await fetch('/api/varietals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          allowedVisuals: visualsArray,
        }),
      });
      if (res.ok) {
        alert('Botanical strain added successfully!');
        router.push('/');
      } else {
        alert('Failed to add varietal.');
      }
    } catch (error) {
      alert('An error occurred while adding varietal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-2">{t('addVarietalTitle')}</h1>
        <p className="text-gray-400">{t('addVarietalSubtitle')}</p>
      </div>

      <div className="bg-[#1a261a] border border-green-900 rounded-xl p-8 shadow-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-300">{t('strainNameLabel')}</label>
            <input 
              type="text" 
              className="bg-[#0f170f] border border-green-800 rounded p-2 text-white focus:ring-2 focus:ring-green-500 outline-none"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
              placeholder="e.g. Malabar Green Cardamom"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-300">{t('compoundNameLabel')}</label>
              <input 
                type="text" 
                className="bg-[#0f170f] border border-green-800 rounded p-2 text-white focus:ring-2 focus:ring-green-500 outline-none"
                value={formData.compoundName}
                onChange={e => setFormData({...formData, compoundName: e.target.value})}
                required
                placeholder="e.g. Cineole / Piperine"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-300">{t('compoundBaselineLabel')}</label>
              <input 
                type="number" 
                step="0.1" 
                className="bg-[#0f170f] border border-green-800 rounded p-2 text-white focus:ring-2 focus:ring-green-500 outline-none"
                value={formData.compoundBaseline}
                onChange={e => setFormData({...formData, compoundBaseline: e.target.value})}
                required
                placeholder="e.g. 4.0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-300">{t('giPrefixInputLabel')}</label>
              <input 
                type="text" 
                className="bg-[#0f170f] border border-green-800 rounded p-2 text-white focus:ring-2 focus:ring-green-500 outline-none"
                value={formData.giPrefix}
                onChange={e => setFormData({...formData, giPrefix: e.target.value})}
                required
                placeholder="e.g. GI-IND-KER"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-300">{t('marketRateInputLabel')}</label>
              <input 
                type="number" 
                step="1" 
                className="bg-[#0f170f] border border-green-800 rounded p-2 text-white focus:ring-2 focus:ring-green-500 outline-none text-emerald-400 font-mono font-bold"
                value={formData.govtMarketRate}
                onChange={e => setFormData({...formData, govtMarketRate: e.target.value})}
                required
                placeholder="e.g. 680"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-300">{t('descriptionInputLabel')}</label>
            <input 
              type="text" 
              className="bg-[#0f170f] border border-green-800 rounded p-2 text-white focus:ring-2 focus:ring-green-500 outline-none"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Grown in Western Ghats high elevation tropical forest belts..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-300">{t('allowedVisualsLabel')}</label>
            <textarea 
              rows={4}
              className="bg-[#0f170f] border border-green-800 rounded p-2 text-white focus:ring-2 focus:ring-green-500 outline-none font-mono text-xs"
              value={formData.allowedVisuals}
              onChange={e => setFormData({...formData, allowedVisuals: e.target.value})}
              required
              placeholder="Deep dark black, highly wrinkled, dense surface geometry&#10;Dark brown, moderate wrinkling, uniform size profile&#10;Light brown, smooth surface, low wrinkling (Substandard)"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="bg-green-700 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-all transform active:scale-95 disabled:opacity-50 shadow-lg"
          >
            {loading ? 'Committing to Portal Database...' : t('submitVarietalBtn')}
          </button>
        </form>
      </div>
    </div>
  );
}
