/**
 * CricSphere Pro - Top Navigation Bar
 * Strictly adheres to the 3-Zone Top Bar Contract:
 * [Wordmark] - [4-5 clean nav links] - [Primary Action + Role Switcher + Palette Trigger]
 */

import React, { useState } from 'react';
import { useCricket, ActiveView } from '../context/CricketContext';
import { RoleType } from '../types/cricket';
import { 
  Search, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  FileText, 
  ChevronDown,
  Sparkles
} from 'lucide-react';

const ROLES: RoleType[] = [
  'Super Admin',
  'Club Admin',
  'Coach',
  'Scorer',
  'Umpire',
  'Player',
  'Tournament Organizer',
  'Viewer'
];

export const Navbar: React.FC = () => {
  const {
    activeRole,
    setActiveRole,
    currentView,
    setCurrentView,
    theme,
    toggleTheme,
    soundEnabled,
    setSoundEnabled,
    setIsCommandPaletteOpen,
    setIsLabReportOpen,
    openAiModal,
    tournaments,
    selectedTournamentId,
    setSelectedTournamentId
  } = useCricket();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navLinks: { id: ActiveView; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'scoring', label: 'Live Scoring' },
    { id: 'inventory', label: 'Equipment Stack' },
    { id: 'tournaments', label: 'Tournaments' },
    { id: 'players', label: 'Players' }
  ];

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-8 transition-colors">
      {/* Zone 1: Single text wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a 
          href="#dashboard" 
          onClick={(e) => { e.preventDefault(); setCurrentView('dashboard'); }}
          className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 inline-block" />
          <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">CricSphere</span>
          <span className="text-slate-700 dark:text-slate-300 font-normal">Pro</span>
        </a>
        <span className="hidden lg:inline text-xs text-slate-500 dark:text-slate-400 border-l border-slate-200 dark:border-slate-800 pl-3">
          ICC World-Caliber &amp; Stack DSA
        </span>
      </div>

      {/* Zone 2: 4–5 single-line clean nav links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
        {navLinks.map((link) => {
          const isActive = currentView === link.id;
          return (
            <button
              key={link.id}
              onClick={() => setCurrentView(link.id)}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-emerald-600 dark:hover:text-emerald-400 ${
                isActive 
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold' 
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: 1 primary action + role selector + tools */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Command Palette Trigger */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 text-xs"
          title="Search anything (Ctrl+K)"
        >
          <Search className="w-4 h-4" />
          <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] font-mono bg-slate-200 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* AI Cricket Assistant */}
        <button
          onClick={() => openAiModal('predict')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>AI Predictor</span>
        </button>

        {/* Academic Lab Report Trigger (MUET SW 212) */}
        <button
          onClick={() => setIsLabReportOpen(true)}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors whitespace-nowrap"
          title="MUET SW 212 DSA Open Ended Lab Report"
        >
          <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>DSA Lab Report</span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title={soundEnabled ? 'Mute Audio Effects' : 'Enable Audio Effects'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>

        {/* Tournament Switcher */}
        <select
          value={selectedTournamentId}
          onChange={(e) => setSelectedTournamentId(e.target.value)}
          className="hidden sm:inline-block px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
        >
          {tournaments.map((t) => (
            <option key={t.id} value={t.id}>
              {t.logo} {t.name}
            </option>
          ))}
        </select>

        {/* Theme Toggle (Dark vs Blue-White vs Light) */}
        <button
          onClick={toggleTheme}
          className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
          title="Cycle Theme: Blue & White / Dark Charcoal / Light"
        >
          {theme === 'blue-white' ? (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
              <span className="hidden sm:inline">Blue &amp; White</span>
            </>
          ) : theme === 'dark' ? (
            <>
              <Moon className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Dark Charcoal</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Crisp Light</span>
            </>
          )}
        </button>

        {/* Role Switcher Menu (RBAC Requirement) */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-colors whitespace-nowrap"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline text-slate-500 dark:text-slate-400">Role:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{activeRole}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Select Active User Role (RBAC)
              </div>
              {ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setActiveRole(role);
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                    activeRole === role
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{role}</span>
                  {activeRole === role && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
