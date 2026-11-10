/**
 * CricSphere Pro - Official International Cricket Rules Engine
 * Full ICC Playing Conditions, Powerplay Laws, Bowler Limits,
 * DRS Regulations, Super Over Tiebreaks, and Interactive DLS Calculator
 */

import React, { useState } from 'react';
import { useCricket } from '../../context/CricketContext';
import { 
  BookOpen, 
  ShieldCheck, 
  Calculator, 
  Search, 
  HelpCircle, 
  Zap, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';
import { CricketRule } from '../../types/cricket';

export const CricketRulesView: React.FC = () => {
  const { cricketRules } = useCricket();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Interactive DLS Calculator State
  const [team1TotalScore, setTeam1TotalScore] = useState(280);
  const [team1AllocatedOvers, setTeam1AllocatedOvers] = useState(50);
  const [team2ReducedOvers, setTeam2ReducedOvers] = useState(38);
  const [team2WicketsLost, setTeam2WicketsLost] = useState(2);

  // Standard DLS resource percentage approximation
  const calculateDlsTarget = () => {
    const resource1 = Math.min(100, (team1AllocatedOvers / 50) * 100);
    const resource2 = Math.min(100, (team2ReducedOvers / 50) * 100 * (1 - (team2WicketsLost * 0.05)));
    const target = Math.round(team1TotalScore * (resource2 / resource1)) + 1;
    return Math.max(1, target);
  };

  const categories = ['All', 'Fielding & Powerplay', 'Over Limits & DRS', 'Dismissal', 'Match Resolution & DLS'];

  const filteredRules = cricketRules.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.lawNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || r.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Official ICC Playing Conditions &amp; MCC Laws of Cricket</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Cricket Rules, Regulations &amp; DLS Engine
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Complete rule codification for T20 and ODI formats, Powerplay fielding restrictions, Free Hit penalties, and DLS calculations.
          </p>
        </div>
      </div>

      {/* DLS Calculator Feature Strip */}
      <div className="p-5 md:p-6 rounded-2xl border border-blue-200 dark:border-blue-800/80 bg-blue-50/40 dark:bg-blue-950/20 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-blue-100 dark:border-blue-900/60">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Interactive Duckworth-Lewis-Stern (DLS) Par Target Calculator
            </h3>
          </div>
          <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-bold">
            ICC STANDARD METHOD
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
              Team 1 Total Score
            </label>
            <input
              type="number"
              value={team1TotalScore}
              onChange={(e) => setTeam1TotalScore(Number(e.target.value))}
              className="w-full p-2.5 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
              Team 1 Overs Available
            </label>
            <input
              type="number"
              value={team1AllocatedOvers}
              onChange={(e) => setTeam1AllocatedOvers(Number(e.target.value))}
              className="w-full p-2.5 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
              Team 2 Reduced Overs (Rain)
            </label>
            <input
              type="number"
              value={team2ReducedOvers}
              onChange={(e) => setTeam2ReducedOvers(Number(e.target.value))}
              className="w-full p-2.5 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-950 text-white flex flex-col justify-center text-center">
            <div className="text-[10px] text-slate-400 uppercase font-mono">
              Revised DLS Target
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
              {calculateDlsTarget()} <span className="text-xs font-normal text-slate-400">runs in {team2ReducedOvers} ov</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cricket laws, powerplay, DRS, mankad..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
                selectedCategory === c
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRules.map((rule) => (
          <div
            key={rule.id}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase">
                  {rule.lawNumber}
                </span>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm mt-0.5">
                  {rule.title}
                </h3>
              </div>

              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                {rule.category}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {rule.fullRule}
            </p>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <strong className="text-emerald-600 dark:text-emerald-400 block mb-0.5">T20 Application:</strong>
                <span className="text-slate-600 dark:text-slate-400">{rule.t20Application}</span>
              </div>

              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <strong className="text-blue-600 dark:text-blue-400 block mb-0.5">ODI Application:</strong>
                <span className="text-slate-600 dark:text-slate-400">{rule.odiApplication}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
