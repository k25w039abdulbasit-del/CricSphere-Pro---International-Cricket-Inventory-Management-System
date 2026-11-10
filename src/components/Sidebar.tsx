/**
 * CricSphere Pro - Sidebar Navigation
 * High-density workspace navigation with unboxed indicators
 */

import React from 'react';
import { useCricket, ActiveView } from '../context/CricketContext';
import { 
  LayoutDashboard, 
  Radio, 
  Layers, 
  Users, 
  GitCompare, 
  Shield, 
  Trophy, 
  FileCode2,
  Tv,
  Compass,
  BookOpen,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface SidebarItem {
  id: ActiveView;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, activeRole, inventorySize, setIsLabReportOpen, openAiModal } = useCricket();

  const navigationItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'scoring',
      label: 'Live Scoring',
      icon: Radio,
      badge: 'LIVE',
      badgeColor: 'text-red-500 font-bold'
    },
    {
      id: 'jumbotron',
      label: 'Stadium LCD Screen',
      icon: Tv,
      badge: 'BIG LED',
      badgeColor: 'text-blue-500 font-mono'
    },
    {
      id: 'umpire-drs',
      label: 'DRS & Umpire Panel',
      icon: ShieldAlert,
      badge: '3D Hawk-Eye',
      badgeColor: 'text-amber-500'
    },
    {
      id: 'pitch-ground',
      label: 'Pitch & Ground Report',
      icon: Compass
    },
    {
      id: 'rules',
      label: 'ICC Cricket Rules',
      icon: BookOpen
    },
    {
      id: 'tournaments',
      label: 'World Cups Hub',
      icon: Trophy,
      badge: 'ODI & T20',
      badgeColor: 'text-amber-500 font-semibold'
    },
    {
      id: 'inventory',
      label: 'Equipment Stack',
      icon: Layers,
      badge: `${inventorySize} items`,
      badgeColor: 'text-emerald-500 font-mono'
    },
    {
      id: 'players',
      label: 'Player Directory',
      icon: Users
    },
    {
      id: 'comparison',
      label: 'Head-to-Head Compare',
      icon: GitCompare
    },
    {
      id: 'teams',
      label: '11 Teams & Squads',
      icon: Shield
    },
    {
      id: 'lab-report',
      label: 'DSA Lab Report',
      icon: FileCode2,
      badge: 'SW 212',
      badgeColor: 'text-blue-500 font-bold'
    }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 p-4 shrink-0 transition-colors">
      <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">
        Cricket Operations
      </div>

      <nav className="space-y-1 flex-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'lab-report') {
                  setIsLabReportOpen(true);
                } else {
                  setCurrentView(item.id);
                }
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold dark:bg-emerald-600'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span className="whitespace-nowrap">{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[11px] ${isActive ? 'text-emerald-100 font-bold' : item.badgeColor || 'text-slate-500 dark:text-slate-400'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick AI & Academic Callout Box */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <button
          onClick={() => openAiModal('predict')}
          className="w-full text-left p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/60 dark:bg-emerald-950/30 hover:border-emerald-400 transition-colors"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>AI Scout &amp; Win Odds</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
            Predict outcomes and scout playing XI combinations using Gemini API.
          </p>
        </button>

        {/* User Role Card */}
        <div className="p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Current Session</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="font-semibold text-slate-900 dark:text-white mt-1">
            {activeRole}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {activeRole === 'Scorer' || activeRole === 'Super Admin' 
              ? 'Authorized for live ball scoring'
              : activeRole === 'Club Admin'
              ? 'Authorized for equipment stack'
              : 'Viewer mode active'}
          </div>
        </div>
      </div>
    </aside>
  );
};
