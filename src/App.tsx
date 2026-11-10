/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CricketProvider, useCricket } from './context/CricketContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { LiveScoringView } from './components/scoring/LiveScoringView';
import { InventoryStackView } from './components/inventory/InventoryStackView';
import { PlayerManagementView } from './components/players/PlayerManagementView';
import { PlayerComparisonView } from './components/players/PlayerComparisonView';
import { TeamManagementView } from './components/teams/TeamManagementView';
import { TournamentView } from './components/tournaments/TournamentView';
import { JumbotronBigScreenView } from './components/broadcast/JumbotronBigScreenView';
import { UmpireDrsView } from './components/umpire/UmpireDrsView';
import { PitchGroundView } from './components/ground/PitchGroundView';
import { CricketRulesView } from './components/rules/CricketRulesView';
import { CommandPalette } from './components/CommandPalette';
import { AIAssistantModal } from './components/ai/AIAssistantModal';
import { AcademicReportModal } from './components/lab/AcademicReportModal';
import { ToastContainer } from './components/ToastContainer';
import { 
  LayoutDashboard, 
  Radio, 
  Layers, 
  Users, 
  Trophy 
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, setCurrentView } = useCricket();

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0B1118] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors antialiased">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex max-w-[1700px] w-full mx-auto overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-20 md:pb-8">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'scoring' && <LiveScoringView />}
          {currentView === 'jumbotron' && <JumbotronBigScreenView />}
          {currentView === 'umpire-drs' && <UmpireDrsView />}
          {currentView === 'pitch-ground' && <PitchGroundView />}
          {currentView === 'rules' && <CricketRulesView />}
          {currentView === 'inventory' && <InventoryStackView />}
          {currentView === 'players' && <PlayerManagementView />}
          {currentView === 'comparison' && <PlayerComparisonView />}
          {currentView === 'teams' && <TeamManagementView />}
          {currentView === 'tournaments' && <TournamentView />}
        </main>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar (Thumb Zone) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 grid grid-cols-5 h-16 items-center px-1">
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`flex flex-col items-center justify-center py-1 ${
            currentView === 'dashboard' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        <button
          onClick={() => setCurrentView('scoring')}
          className={`flex flex-col items-center justify-center py-1 ${
            currentView === 'scoring' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500'
          }`}
        >
          <Radio className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Scoring</span>
        </button>

        <button
          onClick={() => setCurrentView('inventory')}
          className={`flex flex-col items-center justify-center py-1 ${
            currentView === 'inventory' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Stack</span>
        </button>

        <button
          onClick={() => setCurrentView('players')}
          className={`flex flex-col items-center justify-center py-1 ${
            currentView === 'players' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Players</span>
        </button>

        <button
          onClick={() => setCurrentView('tournaments')}
          className={`flex flex-col items-center justify-center py-1 ${
            currentView === 'tournaments' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500'
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Tables</span>
        </button>
      </div>

      {/* Global Modals & Notifications */}
      <CommandPalette />
      <AIAssistantModal />
      <AcademicReportModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <CricketProvider>
      <AppContent />
    </CricketProvider>
  );
}
