"use client";

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function ConsumerProvenancePassport({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/verify/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Provenance record not found.');
        return res.json();
      })
      .then((d) => setData(d))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-20 px-4 text-center text-gray-400">
        Authenticating Botanical Provenance Certificate & Cryptographic Seal...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto py-20 px-4 max-w-xl text-center">
        <div className="bg-red-950/40 border border-red-500 rounded-2xl p-8 text-red-200">
          <div className="text-3xl mb-2">⚠️</div>
          <h1 className="text-xl font-bold mb-2">Unverified or Invalid Audit Record</h1>
          <p className="text-xs text-gray-400 mb-6">
            The requested QR provenance certificate could not be authenticated in the central registry.
          </p>
          <Link href="/" className="bg-red-800 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-lg text-xs">
            Return to Audit Portal
          </Link>
        </div>
      </div>
    );
  }

  const isGradeA = data.status?.includes('GRADE A');

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      {/* Top Header Banner */}
      <div className="bg-[#142415] border-2 border-emerald-500 rounded-2xl p-8 mb-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-green-800">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-900/60 border border-emerald-500 text-emerald-300 text-[10px] font-mono px-3 py-1 rounded-full uppercase tracking-widest font-bold mb-2">
              <span>🛡️</span> {t('passportHeader')}
            </div>
            <h1 className="text-3xl font-black text-white">{data.varietalName}</h1>
            <p className="text-xs text-gray-400 font-mono mt-1">
              Geographical Indication: <span className="text-amber-300 font-bold">{data.giTag}</span>
            </p>
          </div>

          <div className="bg-black/50 p-4 rounded-xl border border-emerald-800 text-center min-w-[120px]">
            <div className="text-3xl font-black font-mono text-emerald-400">{data.yqiScore}</div>
            <div className="text-[9px] font-bold uppercase text-gray-400 tracking-wider">Trust Index</div>
          </div>
        </div>

        {/* Dynamic Non-Repeating Official Cryptographic Seal (Only Issued if COA is Attached) */}
        {data.sealCode ? (
          <div className="my-6 bg-gradient-to-r from-emerald-950 via-[#0a200f] to-emerald-950 p-6 rounded-2xl border-2 border-emerald-500/80 shadow-2xl relative flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
            {/* Subtle Watermark BG */}
            <div className="absolute -right-6 -bottom-6 text-9xl opacity-5 pointer-events-none select-none text-emerald-400 font-serif">
              🌿
            </div>

            <div className="flex items-center gap-5">
              {/* Visual Seal Stamp Graphic */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 rounded-full border-4 border-amber-400 bg-gradient-to-br from-emerald-800 via-green-900 to-emerald-950 flex flex-col items-center justify-center text-center shadow-lg relative animate-pulse-green">
                  <span className="text-xl">🎖️</span>
                  <span className="text-[8px] font-black uppercase text-amber-300 tracking-tighter mt-0.5">SEAL OF</span>
                  <span className="text-[7px] font-extrabold text-white tracking-widest uppercase">AUTHENTICITY</span>
                  <span className="text-[6px] text-emerald-300 font-mono">100% VERIFIED</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-extrabold uppercase text-amber-400 tracking-widest flex items-center gap-1">
                  <span>🔐</span> UNIQUE CRYPTOGRAPHIC BOTANICAL SEAL
                </div>
                <div className="text-xl font-black font-mono text-white tracking-wider my-1 bg-black/60 px-3 py-1.5 rounded-lg border border-emerald-500/50 inline-block text-emerald-300">
                  {data.sealCode}
                </div>
                <div className="text-[11px] text-gray-300">
                  Guaranteed non-repeating single-batch verification code registered to Audit Pass #{data.id}.
                </div>
              </div>
            </div>

            <div className="text-right text-xs bg-black/40 p-3 rounded-xl border border-green-800/80 max-w-[200px] w-full md:w-auto">
              <div className="text-[9px] text-gray-400 font-semibold uppercase">Verification Status</div>
              <div className="text-emerald-400 font-extrabold font-mono mt-0.5">IMMUTABLE VALID</div>
              <div className="text-[9px] text-gray-400 mt-1">Registry Hash: OK</div>
            </div>
          </div>
        ) : (
          <div className="my-6 bg-gradient-to-r from-red-950/60 via-[#1f0a0a] to-red-950/60 p-5 rounded-2xl border-2 border-red-500/80 shadow-xl flex items-center gap-4 text-xs text-red-200">
            <div className="text-3xl p-3 bg-black/40 rounded-xl border border-red-800 flex-shrink-0">🚫</div>
            <div>
              <div className="font-extrabold text-sm uppercase text-red-400 tracking-wider">
                CRYPTOGRAPHIC SEAL WITHHELD
              </div>
              <div className="text-gray-300 mt-1 leading-relaxed">
                Laboratory Certificate of Analysis (COA) was <strong className="text-white">NOT ATTACHED</strong> for this batch. Cryptographic Seal codes are exclusively issued to lots with verified laboratory evidence.
              </div>
            </div>
          </div>
        )}

        {/* Grade Badge */}
        <div className={`p-4 rounded-xl border mb-6 ${
          isGradeA ? 'bg-emerald-900/40 border-emerald-500 text-emerald-200' : 'bg-amber-900/40 border-amber-500 text-amber-200'
        }`}>
          <div className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-1">Authenticity & Ethical Quality Grade</div>
          <div className="text-lg font-black">{data.status}</div>
          {data.isSpeculated && (
            <div className="text-xs text-red-400 font-bold mt-1">⚠️ {t('speculatedWarning')}</div>
          )}
        </div>

        {/* Provenance Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-[#0f170f] p-4 rounded-xl border border-green-900">
            <div className="text-gray-400 font-bold uppercase text-[10px] mb-1">🌱 {t('cultivationConditionsTitle')}</div>
            <div className="text-white font-semibold">{data.cultivationConditions}</div>
          </div>

          <div className="bg-[#0f170f] p-4 rounded-xl border border-green-900">
            <div className="text-gray-400 font-bold uppercase text-[10px] mb-1">🚚 {t('handlingJourneyTitle')}</div>
            <div className="text-white font-semibold">{data.handlingJourney}</div>
          </div>

          <div className="bg-[#0f170f] p-4 rounded-xl border border-green-900">
            <div className="text-gray-400 font-bold uppercase text-[10px] mb-1">🧪 {t('chemicalActiveTitle')}</div>
            <div className="text-emerald-300 font-mono font-bold text-sm">
              {data.compoundName}: {data.inputActiveValue}% <span className="text-[10px] text-gray-400 font-sans">(Baseline min: {data.compoundBaseline}%)</span>
            </div>
          </div>

          <div className="bg-[#0f170f] p-4 rounded-xl border border-green-900">
            <div className="text-gray-400 font-bold uppercase text-[10px] mb-1">📅 {t('harvestBatchTitle')}</div>
            <div className="text-white font-mono">{data.harvestDate} • Audit #{data.id}</div>
          </div>
        </div>

        {/* AI Inspection Findings */}
        <div className="mt-4 bg-black/40 p-4 rounded-xl border border-green-900 text-xs">
          <div className="text-gray-400 font-bold uppercase text-[10px] mb-1">🤖 {t('aiVisionTitle')}</div>
          <div className="text-gray-200 italic">"{data.llmReasoning}"</div>
        </div>

        {/* Price Valuation */}
        <div className="mt-4 bg-[#0d180e] p-4 rounded-xl border border-emerald-900 flex justify-between items-center text-xs">
          <div>
            <div className="text-gray-400 font-bold uppercase text-[10px]">{t('fairValuationTitle')}</div>
            <div className="text-gray-300">Kerala Govt Benchmark: ₹{data.govtRate}/kg</div>
          </div>
          <div className="text-right">
            <div className="text-xl font-black font-mono text-emerald-400">₹{data.estimatedPricePerKg} / kg</div>
            <div className="text-[10px] text-emerald-300 font-semibold">Verified Farmer Valuation</div>
          </div>
        </div>
      </div>

      {/* Action Links */}
      <div className="flex justify-between items-center">
        <Link href="/" className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
          ← Back to Main Portal
        </Link>
        <button 
          onClick={() => window.print()}
          className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-all shadow"
        >
          🖨️ {t('printCertificateBtn')}
        </button>
      </div>
    </div>
  );
}
