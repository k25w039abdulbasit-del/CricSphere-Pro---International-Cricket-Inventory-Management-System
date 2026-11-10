/**
 * CricSphere Pro - Global Command Palette (Ctrl+K / Cmd+K)
 * Fast spotlight search across players, teams, matches, inventory, and actions
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useCricket, ActiveView } from '../context/CricketContext';
import { 
  Search, 
  X, 
  Radio, 
  Users, 
  Layers, 
  Trophy, 
  Sparkles, 
  FileCode2, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { RoleType } from '../types/cricket';

export const CommandPalette: React.FC = () => {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen,
    setCurrentView,
    players,
    teams,
    matches,
    inventoryItems,
    openAiModal,
    setIsLabReportOpen,
    setActiveRole
  } = useCricket();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  // Search filter
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      return [
        { type: 'Action', label: 'Go to Live Scoring Console', icon: Radio, action: () => setCurrentView('scoring') },
        { type: 'Action', label: 'Inspect Equipment Stack (DSA LIFO)', icon: Layers, action: () => setCurrentView('inventory') },
        { type: 'Action', label: 'Run AI Win Prediction', icon: Sparkles, action: () => openAiModal('predict') },
        { type: 'Action', label: 'Generate MUET SW 212 Lab Report', icon: FileCode2, action: () => setIsLabReportOpen(true) },
        { type: 'Action', label: 'Switch to Scorer Role', icon: ShieldCheck, action: () => setActiveRole('Scorer') }
      ];
    }

    const items: { type: string; label: string; sub?: string; icon: any; action: () => void }[] = [];

    // Players
    players
      .filter((p) => p.name.toLowerCase().includes(q) || p.country.toLowerCase().includes(q) || p.role.toLowerCase().includes(q))
      .slice(0, 4)
      .forEach((p) => {
        items.push({
          type: 'Player',
          label: `${p.name} (#${p.jerseyNo})`,
          sub: `${p.country} · ${p.role} · Avg: ${p.battingAverage}`,
          icon: Users,
          action: () => {
            setCurrentView('players');
          }
        });
      });

    // Teams
    teams
      .filter((t) => t.name.toLowerCase().includes(q) || t.shortName.toLowerCase().includes(q))
      .slice(0, 3)
      .forEach((t) => {
        items.push({
          type: 'Team',
          label: `${t.name} (${t.shortName})`,
          sub: `${t.homeGround} · T20 Rank: #${t.rankingT20}`,
          icon: Trophy,
          action: () => setCurrentView('teams')
        });
      });

    // Matches
    matches
      .filter((m) => m.teamAName.toLowerCase().includes(q) || m.teamBName.toLowerCase().includes(q) || m.venue.toLowerCase().includes(q))
      .slice(0, 2)
      .forEach((m) => {
        items.push({
          type: 'Match',
          label: `${m.teamAShort} vs ${m.teamBShort} (${m.format})`,
          sub: `${m.status} at ${m.venue}`,
          icon: Radio,
          action: () => setCurrentView('scoring')
        });
      });

    // Inventory
    inventoryItems
      .filter((i) => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q))
      .slice(0, 3)
      .forEach((i) => {
        items.push({
          type: 'Inventory Stack',
          label: i.name,
          sub: `SKU: ${i.sku} · Qty: ${i.quantity} · ${i.location}`,
          icon: Layers,
          action: () => setCurrentView('inventory')
        });
      });

    return items;
  }, [query, players, teams, matches, inventoryItems, setCurrentView, openAiModal, setIsLabReportOpen, setActiveRole]);

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search players, teams, matches, inventory, or commands..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {results.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
              No matching records found for "{query}".
            </div>
          ) : (
            results.map((res, idx) => {
              const Icon = res.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    res.action();
                    setIsCommandPaletteOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950/80 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {res.label}
                      </div>
                      {res.sub && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {res.sub}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      {res.type}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigation: <kbd className="font-mono">↑↓</kbd> to cycle</span>
          <span>Select: <kbd className="font-mono">Enter</kbd></span>
          <span>Close: <kbd className="font-mono">Esc</kbd></span>
        </div>
      </div>
    </div>
  );
};
