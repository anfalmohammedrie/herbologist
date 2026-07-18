"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function AuditPortal() {
  const { t } = useLanguage();
  const [varietals, setVarietals] = useState<any[]>([]);
  const [selectedVarietal, setSelectedVarietal] = useState<any>(null);
  const [visualOptions, setVisualOptions] = useState<string[]>([]);
  const [matchingSellers, setMatchingSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [coaFile, setCoaFile] = useState<File | null>(null);

  // AI Photo Specification Scan States
  const [samplePhoto, setSamplePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [analyzingPhoto, setAnalyzingPhoto] = useState(false);
  const [photoAnalysisReason, setPhotoAnalysisReason] = useState<string | null>(null);

  // Seller Contact Modal
  const [activeContactSeller, setActiveContactSeller] = useState<any>(null);

  const [formData, setFormData] = useState({
    varietalId: '',
    inputActiveValue: '',
    coaAttached: 'false',
    giTag: '',
    visualObservation: '',
    cultivationConditions: 'Organic Rainfed High-Altitude Agroforestry',
    handlingJourney: 'Selective Hand Harvest -> Solar Dehydrated -> Certified Micro-pack',
    harvestDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetch('/api/varietals')
      .then(res => res.json())
      .then(data => {
        if (!data || data.length === 0) {
          fetch('/api/seed').then(() => {
            fetch('/api/varietals').then(r => r.json()).then(d => setVarietals(d));
          });
        } else {
          setVarietals(data);
        }
      });
  }, []);

  useEffect(() => {
    if (selectedVarietal) {
      setVisualOptions(JSON.parse(selectedVarietal.allowedVisuals || '[]'));
      fetch(`/api/listings?varietalId=${selectedVarietal.id}`)
        .then(res => res.json())
        .then(sellers => setMatchingSellers(sellers));
    } else {
      setVisualOptions([]);
      setMatchingSellers([]);
    }
  }, [selectedVarietal]);

  const handleVarietalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const varietal = varietals.find(v => v.id === parseInt(id));
    setSelectedVarietal(varietal || null);
    setPhotoPreview(null);
    setSamplePhoto(null);
    setPhotoAnalysisReason(null);
    setFormData({ 
      ...formData, 
      varietalId: id,
      giTag: varietal ? `${varietal.giPrefix}-` : '',
      visualObservation: '',
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setSamplePhoto(file);
    setPhotoPreview(URL.createObjectURL(file));

    setAnalyzingPhoto(true);
    setPhotoAnalysisReason(null);

    try {
      const payload = new FormData();
      payload.append('image', file);
      if (formData.varietalId) {
        payload.append('varietalId', formData.varietalId);
      }

      const res = await fetch('/api/detect-specifications', {
        method: 'POST',
        body: payload,
      });

      const json = await res.json();
      if (res.ok && json.detectedSpecification) {
        // Auto-select matched varietal if not selected yet
        if (json.varietalId) {
          const matched = varietals.find(v => v.id === json.varietalId);
          if (matched) {
            setSelectedVarietal(matched);
            setFormData(prev => ({
              ...prev,
              varietalId: String(json.varietalId),
              giTag: prev.giTag || `${matched.giPrefix}-`,
              visualObservation: json.detectedSpecification,
            }));
          } else {
            setFormData(prev => ({
              ...prev,
              visualObservation: json.detectedSpecification,
            }));
          }
        } else {
          setFormData(prev => ({
            ...prev,
            visualObservation: json.detectedSpecification,
          }));
        }

        setPhotoAnalysisReason(json.reasoning);
      } else {
        alert('Could not auto-detect specifications from photo. Please select observation manually.');
      }
    } catch (err) {
      console.error('Error auto-detecting image specs:', err);
    } finally {
      setAnalyzingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const formDataPayload = new FormData();
      formDataPayload.append('varietalId', formData.varietalId);
      formDataPayload.append('inputActiveValue', formData.inputActiveValue);
      formDataPayload.append('coaAttached', formData.coaAttached);
      formDataPayload.append('giTag', formData.giTag);
      formDataPayload.append('visualObservation', formData.visualObservation);
      formDataPayload.append('cultivationConditions', formData.cultivationConditions);
      formDataPayload.append('handlingJourney', formData.handlingJourney);
      formDataPayload.append('harvestDate', formData.harvestDate);
      if (coaFile) {
        formDataPayload.append('coaFile', coaFile);
      }

      const res = await fetch('/api/audit', {
        method: 'POST',
        body: formDataPayload,
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      alert('Audit processing failed. Please check field values.');
    } finally {
      setLoading(false);
    }
  };

  const getResultStyles = (status: string) => {
    if (status.includes('GRADE A')) {
      return 'bg-emerald-950/40 border-emerald-500 text-emerald-200 animate-pulse-green';
    } else if (status.includes('GRADE B')) {
      return 'bg-amber-950/40 border-amber-500 text-amber-200';
    } else {
      return 'bg-red-950/40 border-red-500 text-red-200';
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">{t('auditTitle')}</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm">
          {t('auditSubtitle')}
        </p>
      </div>

      {/* Live Spices Board India Integration Banner */}
      <div className="bg-[#142215] border border-green-900 rounded-xl p-4 mb-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl p-2 bg-[#0f170f] rounded-lg border border-green-900">🌐</div>
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
              <span>LIVE INTEGRATION</span>
              <span className="bg-emerald-950 border border-emerald-500 text-emerald-300 text-[9px] px-1.5 py-0.2 rounded font-mono">Spices Board India</span>
            </div>
            <div className="text-sm font-bold text-white mt-0.5">
              {t('liveBannerTitle')}
            </div>
            <div className="text-[11px] text-gray-400">
              {t('liveBannerSubtitle')}
            </div>
          </div>
        </div>

        <Link
          href="/live-prices"
          className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg whitespace-nowrap transition-all shadow border border-emerald-500/80 active:scale-95"
        >
          {t('liveBannerBtn')}
        </Link>
      </div>

      {/* Main Audit Form */}
      <div className="bg-[#1a261a] border border-green-900 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 botanical-gradient"></div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Varietal Selector */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-bold text-gray-200 flex justify-between items-center">
              <span>{t('labelVarietal')}</span>
              <span className="text-xs font-mono text-green-400">Database Loaded</span>
            </label>
            <select 
              className="bg-[#0f170f] border border-green-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-green-500 outline-none text-sm font-medium"
              value={formData.varietalId}
              onChange={handleVarietalChange}
              required
            >
              <option value="">{t('optionSelectVarietal')}</option>
              {varietals.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.compoundName} baseline: {v.compoundBaseline}%) — ₹{v.govtMarketRate}/kg
                </option>
              ))}
            </select>
          </div>

          {/* Selected Varietal Info Box */}
          {selectedVarietal && (
            <div className="md:col-span-2 bg-[#0d160e] p-4 rounded-xl border border-green-900/80 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-slide-up text-xs">
              <div>
                <div className="text-gray-400 font-medium">{t('targetCompound')}</div>
                <div className="text-white font-bold text-sm mt-0.5">{selectedVarietal.compoundName} ({selectedVarietal.compoundBaseline}% min)</div>
              </div>
              <div>
                <div className="text-gray-400 font-medium">{t('govtRateLabel')}</div>
                <div className="text-emerald-400 font-black text-sm font-mono mt-0.5">₹{selectedVarietal.govtMarketRate} / kg</div>
              </div>
              <div>
                <div className="text-gray-400 font-medium">{t('giPrefixLabel')}</div>
                <div className="text-amber-300 font-bold text-sm font-mono mt-0.5">{selectedVarietal.giPrefix}</div>
              </div>
            </div>
          )}

          {/* Active Compound Assay */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-300">
              {selectedVarietal ? `${selectedVarietal.compoundName} %` : t('activeCompoundLabel')}
            </label>
            <input 
              type="number" 
              step="0.1" 
              className="bg-[#0f170f] border border-green-800 rounded p-2.5 text-white focus:ring-2 focus:ring-green-500 outline-none text-sm font-mono"
              value={formData.inputActiveValue}
              onChange={e => setFormData({...formData, inputActiveValue: e.target.value})}
              placeholder={selectedVarietal ? `Target: ${selectedVarietal.compoundBaseline}%` : 'e.g. 4.2'}
              required
            />
          </div>

          {/* GI Tag String */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-300">{t('giStringLabel')}</label>
            <input 
              type="text" 
              className="bg-[#0f170f] border border-green-800 rounded p-2.5 text-white focus:ring-2 focus:ring-green-500 outline-none text-sm font-mono"
              value={formData.giTag}
              onChange={e => setFormData({...formData, giTag: e.target.value})}
              placeholder={selectedVarietal ? `e.g. ${selectedVarietal.giPrefix}-WAY-102` : 'e.g. GI-IND-KER-881'}
              required
            />
          </div>

          {/* Cultivation Conditions */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-300">{t('cultivationLabel')}</label>
            <select 
              className="bg-[#0f170f] border border-green-800 rounded p-2.5 text-white focus:ring-2 focus:ring-green-500 outline-none text-sm"
              value={formData.cultivationConditions}
              onChange={e => setFormData({...formData, cultivationConditions: e.target.value})}
            >
              <option value="Organic Rainfed High-Altitude Agroforestry">Organic Rainfed High-Altitude Agroforestry</option>
              <option value="Shade-grown Natural Rainforest Canopy">Shade-grown Natural Rainforest Canopy</option>
              <option value="Certified Tribal Forest Ecology Harvesting">Certified Tribal Forest Ecology Harvesting</option>
              <option value="Traditional Biodynamic Multi-Crop Farm">Traditional Biodynamic Multi-Crop Farm</option>
            </select>
          </div>

          {/* Post-Harvest Handling Journey */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-300">{t('handlingLabel')}</label>
            <input 
              type="text" 
              className="bg-[#0f170f] border border-green-800 rounded p-2.5 text-white focus:ring-2 focus:ring-green-500 outline-none text-sm"
              value={formData.handlingJourney}
              onChange={e => setFormData({...formData, handlingJourney: e.target.value})}
              placeholder="Selective Hand Harvest -> Solar Tray Dehydrated -> Certified Micro-pack"
              required
            />
          </div>

          {/* Field Visual Observations with AI Photo Scanner */}
          <div className="flex flex-col gap-3 md:col-span-2 p-5 bg-[#0f170f] rounded-xl border border-green-900">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <label className="text-sm font-bold text-gray-200 flex items-center gap-2">
                <span>🔬</span> {t('visualLabel')}
              </label>

              <span className="text-xs text-emerald-400 font-medium bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800 font-mono">
                AI Vision Auto-Detection Active
              </span>
            </div>

            {/* AI Photo Scanner Upload Box */}
            <div className="p-4 bg-black/40 border-2 border-dashed border-green-800/80 rounded-xl hover:border-emerald-500 transition-colors">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {photoPreview ? (
                    <div className="relative group flex-shrink-0">
                      <img 
                        src={photoPreview} 
                        alt="Botanical sample preview" 
                        className="w-16 h-16 object-cover rounded-lg border-2 border-emerald-500 shadow-md"
                      />
                      {analyzingPhoto && (
                        <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                          <span className="animate-spin text-lg">🌀</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-green-950 border border-green-800 flex items-center justify-center text-xl text-emerald-400 flex-shrink-0">
                      📷
                    </div>
                  )}

                  <div>
                    <div className="text-xs font-bold text-gray-200">
                      {t('uploadPhotoLabel')}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      Upload physical crop sample image (.jpg, .png) to automatically scan color, texture, surface geometry & husk fracture.
                    </div>
                  </div>
                </div>

                <label className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg cursor-pointer transition-all shadow active:scale-95 flex-shrink-0">
                  <span>{analyzingPhoto ? 'Scanning...' : 'Upload Photo'}</span>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={analyzingPhoto}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Scanning status indicator */}
              {analyzingPhoto && (
                <div className="mt-3 p-2.5 bg-emerald-950/60 border border-emerald-500/50 rounded-lg text-xs text-emerald-300 font-medium flex items-center gap-2 animate-pulse">
                  <span>🌀</span> {t('analyzingImage')}
                </div>
              )}

              {/* Detected specification findings box */}
              {photoAnalysisReason && !analyzingPhoto && (
                <div className="mt-3 p-3 bg-emerald-900/30 border border-emerald-500/80 rounded-lg text-xs text-emerald-200 animate-slide-up flex flex-col gap-1">
                  <div className="font-bold flex items-center gap-1 text-emerald-400">
                    <span>✅</span> {t('detectedSuccess')}
                  </div>
                  <div className="italic text-gray-300 text-[11px]">
                    "{photoAnalysisReason}"
                  </div>
                </div>
              )}
            </div>

            {/* Manual / Auto-Populated Dropdown Option */}
            <div className="flex flex-col gap-1 mt-1">
              <label className="text-xs font-semibold text-gray-400">Matched Specification Option</label>
              <select 
                className="bg-[#142215] border border-green-800 rounded p-2.5 text-white focus:ring-2 focus:ring-green-500 outline-none text-sm disabled:opacity-50 font-medium"
                value={formData.visualObservation}
                onChange={e => setFormData({...formData, visualObservation: e.target.value})}
                disabled={!selectedVarietal}
                required
              >
                <option value="">
                  {selectedVarietal ? t('selectVisualPlaceholder') : t('selectVarietalFirst')}
                </option>
                {visualOptions.map((opt, idx) => (
                  <option key={idx} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* COA Section */}
          <div className="flex flex-col gap-4 md:col-span-2 p-5 bg-[#0f170f] rounded-xl border border-green-900">
            <label className="text-sm font-bold text-gray-200 flex items-center gap-2">
              <span>📄</span> {t('coaSectionTitle')}
            </label>

            <div className="flex gap-8 items-center flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-sm">
                <input 
                  type="radio" 
                  name="coa" 
                  value="true" 
                  checked={formData.coaAttached === 'true'}
                  onChange={e => setFormData({...formData, coaAttached: e.target.value})}
                  className="accent-emerald-500 h-4 w-4"
                />
                <span className="text-emerald-300">{t('coaAttachedRadio')}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-sm">
                <input 
                  type="radio" 
                  name="coa" 
                  value="false" 
                  checked={formData.coaAttached === 'false'}
                  onChange={e => {
                    setFormData({...formData, coaAttached: e.target.value});
                    setCoaFile(null);
                  }}
                  className="accent-emerald-500 h-4 w-4"
                />
                <span className="text-amber-400">{t('coaMissingRadio')}</span>
              </label>
            </div>

            {formData.coaAttached === 'true' && (
              <div className="mt-2 p-4 bg-black/40 border border-green-800 rounded-lg animate-slide-up">
                <label className="text-xs font-semibold text-gray-300 block mb-2">
                  {t('uploadCoaLabel')}
                </label>
                <input 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="text-xs text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-800 file:text-white hover:file:bg-emerald-700 cursor-pointer"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setCoaFile(e.target.files[0]);
                    }
                  }}
                  required={formData.coaAttached === 'true'}
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="md:col-span-2 bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-lg transform active:scale-[0.98] disabled:opacity-50 text-base tracking-wide"
          >
            {loading ? t('executingAuditBtn') : t('executeAuditBtn')}
          </button>
        </form>
      </div>

      {/* Audit Report Result Box */}
      {result && (
        <div className={`mt-10 p-8 rounded-2xl border-2 slide-up-fade-in shadow-2xl ${getResultStyles(result.status)}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 pb-6 border-b border-white/10">
            <div>
              <div className="text-xs uppercase font-bold tracking-widest text-emerald-400 mb-1">{t('auditReportHeader')}</div>
              <h2 className="text-2xl font-black text-white">{result.varietalName || selectedVarietal?.name}</h2>
              <p className="text-xs opacity-75 font-mono mt-1">GI Reg: {result.giTag} • Audit Pass #{result.id}</p>
              {result.sealCode ? (
                <div className="mt-2 text-xs font-mono font-bold text-amber-300 bg-black/50 px-2.5 py-1 rounded border border-amber-500/60 inline-flex items-center gap-1.5 shadow">
                  <span>🎖️</span> Authentic Seal: {result.sealCode}
                </div>
              ) : (
                <div className="mt-2 text-xs font-mono font-bold text-red-400 bg-black/50 px-2.5 py-1 rounded border border-red-500/60 inline-flex items-center gap-1.5">
                  <span>🚫</span> Seal Withheld: Upload Lab COA File to Earn Cryptographic Seal
                </div>
              )}
            </div>
            
            <div className="text-right bg-black/40 p-4 rounded-xl border border-white/10 min-w-[140px]">
              <div className="text-4xl font-black font-mono text-white">{result.yqiScore}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-300">{t('yqiIndexLabel')}</div>
            </div>
          </div>

          {/* Price Valuation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-black/40 p-4 rounded-xl border border-white/10 flex flex-col justify-between">
              <div>
                <div className="text-[11px] uppercase font-bold text-gray-400 mb-1">{t('govtStandardRate')}</div>
                <div className="text-2xl font-black font-mono text-white">₹{result.govtRate} <span className="text-xs font-normal opacity-70">/ kg</span></div>
              </div>
              <div className="text-[11px] opacity-75 mt-2">Source: Spices Board Baseline</div>
            </div>

            <div className={`p-4 rounded-xl border flex flex-col justify-between ${
              result.isSpeculated ? 'bg-red-950/40 border-red-500/80' : 'bg-emerald-950/40 border-emerald-500/80'
            }`}>
              <div>
                <div className="text-[11px] uppercase font-bold text-gray-300 mb-1">
                  {t('validatedValue')}
                </div>
                <div className="text-2xl font-black font-mono text-emerald-300">
                  ₹{result.estimatedPricePerKg} <span className="text-xs font-normal opacity-70">/ kg</span>
                </div>
              </div>

              {result.isSpeculated ? (
                <div className="mt-2 text-xs font-bold text-red-300 uppercase tracking-wider flex items-center gap-1">
                  <span>⚠️</span> {t('speculatedWarning')}
                </div>
              ) : (
                <div className="mt-2 text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                  <span>✅</span> {t('premiumEarned')}
                </div>
              )}
            </div>
          </div>

          {/* Cultivation & Journey Logs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-xs">
            <div className="bg-black/30 p-4 rounded-xl border border-white/10">
              <div className="text-xs uppercase font-bold opacity-70 mb-1">🌱 {t('cultivationConditionsTitle')}</div>
              <div className="font-semibold text-white">{result.cultivationConditions}</div>
            </div>

            <div className="bg-black/30 p-4 rounded-xl border border-white/10">
              <div className="text-xs uppercase font-bold opacity-70 mb-1">🚚 {t('handlingJourneyTitle')}</div>
              <div className="font-semibold text-white">{result.handlingJourney}</div>
            </div>
          </div>

          {/* Reasoning & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-black/30 p-4 rounded-xl border border-white/10">
              <div className="text-xs uppercase font-bold opacity-70 mb-1">{t('trustStatusLabel')}</div>
              <div className="font-extrabold text-sm tracking-wide">{result.status}</div>
            </div>

            <div className="bg-black/30 p-4 rounded-xl border border-white/10">
              <div className="text-xs uppercase font-bold opacity-70 mb-1">{t('aiAnalysisLabel')}</div>
              <div className="text-xs italic opacity-90 leading-relaxed">"{result.llmReasoning}"</div>
            </div>
          </div>

          {/* Shareable Consumer QR Code & Digital Provenance Link */}
          <div className="p-4 bg-black/50 rounded-xl border border-emerald-500/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                📲 {t('provenancePassportTitle')}
              </div>
              <div className="text-xs text-gray-300 mt-1">
                {t('provenancePassportDesc')}
              </div>
            </div>

            <Link
              href={`/verify/${result.id}`}
              target="_blank"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-lg whitespace-nowrap shadow-lg flex items-center gap-2"
            >
              <span>🔍</span> {t('viewPassportBtn')}
            </Link>
          </div>

          {/* Matching Sellers */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>🏬</span> {t('matchingSellersTitle')}
              </h3>
              <Link href="/marketplace" className="text-xs font-bold text-emerald-400 hover:underline">
                {t('viewFullMarketplace')}
              </Link>
            </div>

            {matchingSellers.length === 0 ? (
              <div className="text-xs opacity-70 bg-black/20 p-4 rounded-lg text-center">
                No active seller listings registered for this specific strain yet. Visit the Marketplace to list a batch.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchingSellers.map((seller) => (
                  <div key={seller.id} className="bg-black/40 border border-green-900/60 p-3.5 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-white text-sm">{seller.sellerName}</div>
                      <div className="text-gray-400 font-mono mt-0.5">
                        📍 {seller.location} • Stock: {seller.quantityKg} kg
                      </div>
                      <div className="text-emerald-400 font-bold font-mono mt-0.5">
                        Asking: ₹{seller.pricePerKg} / kg
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveContactSeller(seller)}
                      className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-3 py-2 rounded-lg text-xs transition-all active:scale-95 shadow"
                    >
                      {t('connectSellerBtn')}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
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
              <span className="text-2xl">🌿</span>
              <h2 className="text-xl font-bold text-white">{t('connectSellerBtn')}</h2>
            </div>

            <div className="bg-[#0f170f] p-4 rounded-xl border border-green-900 mb-6 flex flex-col gap-2">
              <div className="text-lg font-bold text-emerald-300">{activeContactSeller.sellerName}</div>
              <div className="text-xs text-gray-300">
                <span className="text-gray-500">Location:</span> {activeContactSeller.location}
              </div>
              <div className="text-xs text-gray-300">
                <span className="text-gray-500">GI Reg Number:</span> {activeContactSeller.giTag}
              </div>
              <div className="text-xs text-gray-300">
                <span className="text-gray-500">Available Batch:</span> {activeContactSeller.quantityKg} kg @ ₹{activeContactSeller.pricePerKg}/kg
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
                href={`mailto:${activeContactSeller.contactEmail}?subject=Procurement Inquiry: ${selectedVarietal?.name || 'Botanical Spice'}&body=Hello ${activeContactSeller.sellerName}, I am inquiring about procuring a batch of ${selectedVarietal?.name || 'your botanical spice'} (GI Tag: ${activeContactSeller.giTag}).`}
                className="bg-green-900 hover:bg-green-800 text-green-200 border border-green-700 font-bold py-3 rounded-xl text-center text-sm flex items-center justify-center gap-2 transition-all"
              >
                <span>✉️</span> {t('sendEmail')}
              </a>

              <a
                href={`https://wa.me/${activeContactSeller.contactPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hello ${activeContactSeller.sellerName}, I am reaching out regarding your ${selectedVarietal?.name || 'spice'} listing on The AI Herbologist Portal.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-600 font-bold py-3 rounded-xl text-center text-sm flex items-center justify-center gap-2 transition-all"
              >
                <span>💬</span> {t('whatsAppMsg')}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
