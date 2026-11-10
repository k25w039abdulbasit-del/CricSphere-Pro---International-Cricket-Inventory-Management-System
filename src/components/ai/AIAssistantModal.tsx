/**
 * CricSphere Pro - Gemini AI Assistant Modal
 * High-performance analysis: AI Win Prediction, Player Scout, and Smart Playing XI
 */

import React, { useState, useEffect } from 'react';
import { useCricket } from '../../context/CricketContext';
import { Sparkles, X, Brain, Check, RefreshCw, AlertCircle } from 'lucide-react';

export const AIAssistantModal: React.FC = () => {
  const { aiModalData, closeAiModal, matches, players } = useCricket();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const { isOpen, type, payload } = aiModalData;

  useEffect(() => {
    if (!isOpen) {
      setContent('');
      setError(null);
      return;
    }

    const runAnalysis = async () => {
      setLoading(true);
      setError(null);
      setContent('');

      try {
        if (type === 'predict') {
          const match = payload?.match || matches[0];
          const res = await fetch('/api/ai/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              matchId: match.id,
              teamA: match.teamAName,
              teamB: match.teamBName,
              pitch: match.pitchCondition,
              venue: match.venue,
              format: match.format
            })
          });

          if (!res.ok) throw new Error('Prediction service temporarily unavailable.');
          const data = await res.json();
          setContent(data.analysis || 'Analysis complete.');
        } else if (type === 'scout') {
          const player = payload?.player || players[0];
          const res = await fetch('/api/ai/player-summary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ player })
          });

          if (!res.ok) throw new Error('Scout service temporarily unavailable.');
          const data = await res.json();
          setContent(data.summary || 'Scouting report complete.');
        } else if (type === 'xi') {
          const res = await fetch('/api/ai/recommend-xi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              teamName: payload?.teamName || 'Pakistan',
              pitchCondition: payload?.pitchCondition || 'Balanced / Flat',
              opponent: payload?.opponent || 'Australia'
            })
          });

          if (!res.ok) throw new Error('Recommendation service temporarily unavailable.');
          const data = await res.json();
          setContent(data.recommendation || 'Recommendation complete.');
        }
      } catch (err: any) {
        setError(err.message || 'Error communicating with AI engine.');
      } finally {
        setLoading(false);
      }
    };

    runAnalysis();
  }, [isOpen, type, payload, matches, players]);

  if (!isOpen) return null;

  const titles = {
    predict: 'AI Match Forecaster & Win Probabilities',
    scout: 'AI Player Performance Scout & Form Summary',
    xi: 'Smart Playing XI & Tactical Balance Recommendation'
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <Sparkles className="w-5 h-5" />
            <span>{titles[type]}</span>
          </div>
          <button
            onClick={closeAiModal}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-4 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <Brain className="w-8 h-8 text-emerald-500 animate-pulse" />
              <div className="font-semibold text-slate-700 dark:text-slate-300">
                Synthesizing ICC Statistical Data with Gemini 3.8 Flash...
              </div>
              <div className="text-[11px] text-slate-400">
                Evaluating pitch telemetry, player strike rates, dismissal trends, and recent form.
              </div>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">AI Query Failed</div>
                <div className="mt-1 text-[11px]">{error}</div>
                <div className="mt-2 text-[10px] opacity-80">
                  Ensure the server has a valid GEMINI_API_KEY configured in Secrets.
                </div>
              </div>
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none text-xs space-y-2 whitespace-pre-wrap font-sans">
              {content}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Powered by Gemini 3.8 Flash via secure server-side proxy</span>
          <button
            onClick={closeAiModal}
            className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
