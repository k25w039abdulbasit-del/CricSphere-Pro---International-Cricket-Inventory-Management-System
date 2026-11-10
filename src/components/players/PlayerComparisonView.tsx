/**
 * CricSphere Pro - Player Comparison (Head-to-Head)
 * In-depth statistical breakdown: Player A vs Player B
 */

import React, { useState } from 'react';
import { useCricket } from '../../context/CricketContext';
import { GitCompare, Trophy, TrendingUp, Sparkles, ArrowRightLeft } from 'lucide-react';
import { Player } from '../../types/cricket';

export const PlayerComparisonView: React.FC = () => {
  const { players, openAiModal } = useCricket();

  const [playerAId, setPlayerAId] = useState<string>(players[0]?.id || 'ply-babar');
  const [playerBId, setPlayerBId] = useState<string>(players[5]?.id || 'ply-cummins');

  const playerA = players.find((p) => p.id === playerAId) || players[0];
  const playerB = players.find((p) => p.id === playerBId) || players[1];

  const metrics = [
    { label: 'Total Career Runs', a: playerA.runs, b: playerB.runs, higherIsBetter: true },
    { label: 'Batting Average', a: playerA.battingAverage, b: playerB.battingAverage, higherIsBetter: true },
    { label: 'Batting Strike Rate', a: playerA.strikeRate, b: playerB.strikeRate, higherIsBetter: true },
    { label: 'Centuries (100s)', a: playerA.centuries, b: playerB.centuries, higherIsBetter: true },
    { label: 'Half-Centuries (50s)', a: playerA.fifties, b: playerB.fifties, higherIsBetter: true },
    { label: 'Total Wickets', a: playerA.wickets, b: playerB.wickets, higherIsBetter: true },
    { label: 'Bowling Economy Rate', a: playerA.economy, b: playerB.economy, higherIsBetter: false },
    { label: 'Total Catches / Dismissals', a: playerA.catches, b: playerB.catches, higherIsBetter: true }
  ];

  const handleSwap = () => {
    const temp = playerAId;
    setPlayerAId(playerBId);
    setPlayerBId(temp);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
            <GitCompare className="w-4 h-4" />
            <span>ICC Advanced Analytics &amp; Scouting Engine</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Head-to-Head Player Comparison
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Compare international cricketers across batting impact, strike rate efficiency, bowling figures, and recent form.
          </p>
        </div>

        <button
          onClick={() => openAiModal('scout', { player: playerA, compareWith: playerB })}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Tactical Matchup</span>
        </button>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center">
        {/* Selector A */}
        <div className="md:col-span-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1.5">
            Select Player A
          </label>
          <select
            value={playerAId}
            onChange={(e) => setPlayerAId(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs"
          >
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.country}) - {p.role}
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="md:col-span-1 flex justify-center">
          <button
            onClick={handleSwap}
            className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors shadow-sm"
            title="Swap Players"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Selector B */}
        <div className="md:col-span-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1.5">
            Select Player B
          </label>
          <select
            value={playerBId}
            onChange={(e) => setPlayerBId(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs"
          >
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.country}) - {p.role}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Head to Head Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Player A Card */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4">
          <img
            src={playerA.avatar}
            alt={playerA.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 shadow-md"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{playerA.name}</span>
              <span className="text-xs font-mono font-normal text-slate-400">#{playerA.jerseyNo}</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {playerA.country} · {playerA.role}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {playerA.battingStyle} · {playerA.bowlingStyle}
            </div>
          </div>
        </div>

        {/* Player B Card */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4">
          <img
            src={playerB.avatar}
            alt={playerB.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow-md"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{playerB.name}</span>
              <span className="text-xs font-mono font-normal text-slate-400">#{playerB.jerseyNo}</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {playerB.country} · {playerB.role}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {playerB.battingStyle} · {playerB.bowlingStyle}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Metrics Bars */}
      <div className="p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
          Statistical Metric Edge Analysis
        </h3>

        <div className="space-y-4">
          {metrics.map((m, i) => {
            const isZero = m.a === 0 && m.b === 0;
            const maxVal = Math.max(m.a, m.b, 1);
            const aWins = m.higherIsBetter ? m.a > m.b : m.a < m.b && m.a > 0;
            const bWins = m.higherIsBetter ? m.b > m.a : m.b < m.a && m.b > 0;

            const aPercent = isZero ? 50 : Math.round((m.a / (m.a + m.b || 1)) * 100);
            const bPercent = 100 - aPercent;

            return (
              <div key={i} className="text-xs space-y-1.5">
                <div className="flex items-center justify-between font-medium">
                  <span className={`font-bold tabular-nums ${aWins ? 'text-emerald-600 dark:text-emerald-400 text-sm' : 'text-slate-600 dark:text-slate-400'}`}>
                    {m.a} {aWins && '★'}
                  </span>

                  <span className="text-slate-500 dark:text-slate-400 font-semibold text-[11px] uppercase tracking-wide">
                    {m.label}
                  </span>

                  <span className={`font-bold tabular-nums ${bWins ? 'text-blue-600 dark:text-blue-400 text-sm' : 'text-slate-600 dark:text-slate-400'}`}>
                    {bWins && '★'} {m.b}
                  </span>
                </div>

                {/* Comparative bar */}
                <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full flex overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      aWins ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                    style={{ width: `${aPercent}%` }}
                  />
                  <div
                    className={`h-full transition-all duration-500 ${
                      bWins ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                    style={{ width: `${bPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
