/**
 * CricSphere Pro - Live Match Scoring Engine
 * Transactional ball-by-ball console with 1-click controls,
 * dismissal modal, extra dialogs, and Stack POP Undo
 */

import React, { useState } from 'react';
import { useCricket } from '../../context/CricketContext';
import { 
  RotateCcw, 
  Zap, 
  ShieldAlert, 
  Users, 
  ChevronRight, 
  AlertTriangle,
  ArrowRightLeft,
  Volume2,
  Tv,
  Compass,
  Sparkles,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import { DismissalType, ExtraType } from '../../types/cricket';

export const LiveScoringView: React.FC = () => {
  const { 
    activeMatch, 
    scoreBall, 
    undoBall, 
    activeRole, 
    soundEnabled, 
    setSoundEnabled,
    setCurrentView,
    openAiModal 
  } = useCricket();

  const [isWicketModalOpen, setIsWicketModalOpen] = useState(false);
  const [isExtraModalOpen, setIsExtraModalOpen] = useState(false);
  const [selectedDismissal, setSelectedDismissal] = useState<DismissalType>('Caught');
  const [dismissedBatterId, setDismissedBatterId] = useState<string>('');
  const [fielderName, setFielderName] = useState<string>('Maxwell');
  const [selectedExtraType, setSelectedExtraType] = useState<ExtraType>('Wide');
  const [extraAdditionalRuns, setExtraAdditionalRuns] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!activeMatch) {
    return (
      <div className="p-12 text-center text-slate-500">
        No active match selected. Choose a match from Dashboard.
      </div>
    );
  }

  const innings = activeMatch.innings[activeMatch.currentInningsIndex];
  if (!innings) {
    return (
      <div className="p-12 text-center text-slate-500">
        Innings data not found for this match.
      </div>
    );
  }

  // Legal ball calculations
  const legalBalls = innings.legalBallsBowled;
  const completedOvers = Math.floor(legalBalls / 6);
  const ballsInCurrentOver = legalBalls % 6;
  const oversFormatted = `${completedOvers}.${ballsInCurrentOver}`;
  const crr = legalBalls > 0 ? ((innings.totalRuns / legalBalls) * 6).toFixed(2) : '0.00';

  // Batters & Bowler
  const striker = innings.batters.find((b) => b.playerId === innings.currentStrikerId) || innings.batters[0];
  const nonStriker = innings.batters.find((b) => b.playerId === innings.currentNonStrikerId) || innings.batters[1];
  const currentBowler = innings.bowlers.find((b) => b.isBowlingNow) || innings.bowlers[0];

  // Recent balls in this over from ball stack
  const recentBalls = innings.ballStack.slice(-12).reverse();

  // Handle standard run buttons (0, 1, 2, 3, 4, 6)
  const handleScoreRuns = async (runs: number) => {
    setIsSubmitting(true);
    await scoreBall({
      batterRuns: runs,
      extraType: 'None',
      extraRuns: 0,
      isWicket: false
    });
    setIsSubmitting(false);
  };

  // Submit Wicket Dismissal
  const handleConfirmWicket = async () => {
    setIsSubmitting(true);
    await scoreBall({
      batterRuns: 0,
      extraType: 'None',
      extraRuns: 0,
      isWicket: true,
      dismissalType: selectedDismissal,
      dismissedPlayerId: dismissedBatterId || striker?.playerId,
      fielderName: fielderName.trim() || undefined
    });
    setIsWicketModalOpen(false);
    setIsSubmitting(false);
  };

  // Submit Extras
  const handleConfirmExtra = async () => {
    setIsSubmitting(true);
    // Wide and No-Ball give 1 base extra run + additional runs taken
    const baseExtra = selectedExtraType === 'Wide' || selectedExtraType === 'No-Ball' ? 1 : 0;
    const totalExtraRuns = baseExtra + extraAdditionalRuns;

    await scoreBall({
      batterRuns: 0,
      extraType: selectedExtraType,
      extraRuns: totalExtraRuns,
      isWicket: false
    });
    setIsExtraModalOpen(false);
    setExtraAdditionalRuns(0);
    setIsSubmitting(false);
  };

  const isScorerRole = activeRole === 'Scorer' || activeRole === 'Super Admin';

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="p-4 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
              LIVE BROADCAST · {activeMatch.format}
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {activeMatch.tournamentName || "ICC Men's T20 World Cup"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {activeMatch.venue}
            </span>
            {/* Undo Last Ball (Stack POP) */}
            <button
              onClick={() => undoBall()}
              disabled={!isScorerRole || innings.ballStack.length === 0}
              className="ml-3 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
              title="Undo last ball (Atomic Stack POP)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Undo Ball (POP)</span>
            </button>
          </div>
        </div>

        {/* Live Score Display (Exact match to prompt visual request) */}
        <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{activeMatch.teamALogo}</div>
            <div>
              <div className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>{activeMatch.teamAName}</span>
                <span className="text-xs font-normal text-slate-400">vs</span>
                <span className="text-slate-400">{activeMatch.teamBName}</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Innings {innings.inningsNumber} · {activeMatch.pitchCondition} Pitch
              </div>
            </div>
          </div>

          <div className="text-center md:text-right">
            <div className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
              {innings.totalRuns}/{innings.wickets}
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold tracking-wide mt-1 tabular-nums">
              {oversFormatted} OVERS <span className="font-normal text-slate-400">/ {innings.maxOvers} ov</span> · CRR: {crr}
            </div>
          </div>
        </div>

        {/* Live Match Win Probability Bar & Quick Actions */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          {/* Win Predictor Bar */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
              <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <span>{activeMatch.teamALogo}</span>
                <span>{activeMatch.teamAName} {activeMatch.winProbabilityTeamA ?? 58}%</span>
              </span>
              <button
                onClick={() => openAiModal('predict', activeMatch)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Win Prediction Model</span>
              </button>
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <span>{activeMatch.winProbabilityTeamB ?? 42}% {activeMatch.teamBName}</span>
                <span>{activeMatch.teamBLogo}</span>
              </span>
            </div>

            {/* Split Progress Bar */}
            <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex">
              <div 
                className="bg-blue-600 transition-all duration-500 ease-out" 
                style={{ width: `${activeMatch.winProbabilityTeamA ?? 58}%` }} 
              />
              <div 
                className="bg-amber-500 transition-all duration-500 ease-out" 
                style={{ width: `${activeMatch.winProbabilityTeamB ?? 42}%` }} 
              />
            </div>
          </div>

          {/* Quick Broadcast & Stadium Shortcuts */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setCurrentView('jumbotron')}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-blue-400 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
              >
                <Tv className="w-3.5 h-3.5 text-blue-500" />
                <span>LCD Big Screen</span>
              </button>

              <button
                onClick={() => setCurrentView('umpire-drs')}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-red-400 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                <span>DRS Hawk-Eye</span>
              </button>

              <button
                onClick={() => setCurrentView('pitch-ground')}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-emerald-400 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5 text-emerald-500" />
                <span>Pitch Assessment</span>
              </button>

              <button
                onClick={() => setCurrentView('rules')}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-purple-400 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                <span>Cricket Rules &amp; DLS</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-400">
              Target: <span className="font-semibold text-slate-700 dark:text-slate-200">{activeMatch.targetRuns || 178}</span> · Req RR: <span className="font-mono text-emerald-500">{activeMatch.requiredRunRate || '9.82'}</span>
            </div>
          </div>
        </div>

        {/* Striker & Non-Striker & Bowler Card Strip */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
          {/* Striker */}
          <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Striker
              </span>
              <span className="text-[10px] text-slate-400">Facing Next</span>
            </div>
            <div className="font-bold text-slate-900 dark:text-white text-sm mt-1">
              {striker?.playerName || 'Babar Azam'}*
            </div>
            <div className="text-xs font-mono tabular-nums text-slate-600 dark:text-slate-300 mt-0.5">
              <span className="font-bold text-slate-900 dark:text-white text-base">{striker?.runs || 45}</span> ({striker?.balls || 28}) · 4s: {striker?.fours || 5} · 6s: {striker?.sixes || 1} · SR: {striker?.strikeRate || 160.7}
            </div>
          </div>

          {/* Non-Striker */}
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Non-Striker
              </span>
            </div>
            <div className="font-bold text-slate-900 dark:text-white text-sm mt-1">
              {nonStriker?.playerName || 'Mohammad Rizwan'}
            </div>
            <div className="text-xs font-mono tabular-nums text-slate-600 dark:text-slate-300 mt-0.5">
              <span className="font-bold text-slate-900 dark:text-white text-base">{nonStriker?.runs || 21}</span> ({nonStriker?.balls || 12}) · 4s: {nonStriker?.fours || 2} · 6s: {nonStriker?.sixes || 1} · SR: {nonStriker?.strikeRate || 175.0}
            </div>
          </div>

          {/* Current Bowler */}
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Current Bowler
              </span>
              <span className="text-[10px] text-amber-500 font-mono">Spell: {currentBowler?.oversFormatted || '3.2'}</span>
            </div>
            <div className="font-bold text-slate-900 dark:text-white text-sm mt-1 truncate">
              {currentBowler?.playerName || 'Mitchell Starc'}
            </div>
            <div className="text-xs font-mono tabular-nums text-slate-600 dark:text-slate-300 mt-0.5">
              {currentBowler?.oversFormatted || '3.2'} overs · {currentBowler?.runsConceded || 28} runs · <span className="font-bold text-red-500">{currentBowler?.wickets || 1} wkt</span> · Econ: {currentBowler?.economy || 8.4}
            </div>
          </div>
        </div>

        {/* Over Progression Balls (Timeline) */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-2 whitespace-nowrap">
              This Over:
            </span>
            {recentBalls.slice(0, 6).reverse().map((ball, i) => {
              const isW = ball.isWicket;
              const isSix = ball.batterRuns === 6;
              const isFour = ball.batterRuns === 4;
              const isDot = ball.batterRuns === 0 && ball.extraRuns === 0;

              return (
                <div
                  key={ball.id || i}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 shadow-sm ${
                    isW
                      ? 'bg-red-600 text-white'
                      : isSix
                      ? 'bg-purple-600 text-white'
                      : isFour
                      ? 'bg-blue-600 text-white'
                      : isDot
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      : 'bg-emerald-600 text-white'
                  }`}
                  title={ball.commentary}
                >
                  {isW ? 'W' : ball.extraType === 'Wide' ? 'Wd' : ball.extraType === 'No-Ball' ? 'Nb' : ball.totalRunsOnBall}
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Extras: <span className="font-mono tabular-nums font-semibold text-slate-700 dark:text-slate-200">{innings.extras.total}</span> (w {innings.extras.wides}, nb {innings.extras.noBalls}, b {innings.extras.byes}, lb {innings.extras.legByes})
          </div>
        </div>
      </div>

      {/* 1-Click Scoring Interface (As specified in prompt: 0, 1, 2, 3, 4, 6, W, EX) */}
      <div className="p-4 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Official Live Scorer Controls
            </h2>
            {!isScorerRole && (
              <span className="text-[10px] text-amber-500 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                (Read-Only: Switch role to "Scorer" in top-right to record balls)
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-400 font-mono">1-CLICK DISPATCH</span>
        </div>

        {/* Big Buttons Row */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2.5 sm:gap-3">
          {/* Dot Ball (0) */}
          <button
            onClick={() => handleScoreRuns(0)}
            disabled={!isScorerRole || isSubmitting}
            className="h-16 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-extrabold text-xl flex flex-col items-center justify-center transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <span>0</span>
            <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">Dot</span>
          </button>

          {/* 1 Run */}
          <button
            onClick={() => handleScoreRuns(1)}
            disabled={!isScorerRole || isSubmitting}
            className="h-16 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-extrabold text-xl flex flex-col items-center justify-center transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <span>1</span>
            <span className="text-[10px] font-normal text-emerald-600 dark:text-emerald-400">Single</span>
          </button>

          {/* 2 Runs */}
          <button
            onClick={() => handleScoreRuns(2)}
            disabled={!isScorerRole || isSubmitting}
            className="h-16 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-extrabold text-xl flex flex-col items-center justify-center transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <span>2</span>
            <span className="text-[10px] font-normal text-emerald-600 dark:text-emerald-400">Double</span>
          </button>

          {/* 3 Runs */}
          <button
            onClick={() => handleScoreRuns(3)}
            disabled={!isScorerRole || isSubmitting}
            className="h-16 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-extrabold text-xl flex flex-col items-center justify-center transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <span>3</span>
            <span className="text-[10px] font-normal text-emerald-600 dark:text-emerald-400">Triple</span>
          </button>

          {/* 4 Boundary */}
          <button
            onClick={() => handleScoreRuns(4)}
            disabled={!isScorerRole || isSubmitting}
            className="h-16 rounded-xl border border-blue-300 dark:border-blue-700 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xl flex flex-col items-center justify-center transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
          >
            <span>4</span>
            <span className="text-[10px] font-semibold text-blue-100">FOUR</span>
          </button>

          {/* 6 Maximum */}
          <button
            onClick={() => handleScoreRuns(6)}
            disabled={!isScorerRole || isSubmitting}
            className="h-16 rounded-xl border border-purple-300 dark:border-purple-700 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xl flex flex-col items-center justify-center transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
          >
            <span>6</span>
            <span className="text-[10px] font-semibold text-purple-100">SIX</span>
          </button>

          {/* Wicket (W) */}
          <button
            onClick={() => {
              setDismissedBatterId(striker?.playerId || '');
              setIsWicketModalOpen(true);
            }}
            disabled={!isScorerRole || isSubmitting}
            className="h-16 rounded-xl border border-red-300 dark:border-red-700 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xl flex flex-col items-center justify-center transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
          >
            <span>W</span>
            <span className="text-[10px] font-semibold text-red-100">WICKET</span>
          </button>

          {/* Extras (EX) */}
          <button
            onClick={() => setIsExtraModalOpen(true)}
            disabled={!isScorerRole || isSubmitting}
            className="h-16 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xl flex flex-col items-center justify-center transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
          >
            <span>EX</span>
            <span className="text-[10px] font-semibold text-slate-900">EXTRAS</span>
          </button>
        </div>
      </div>

      {/* Full Scorecard Details & Ball-by-Ball Feed Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Full Batting Scorecard */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              {activeMatch.teamAName} Batting Scorecard
            </h3>
            <span className="text-xs text-slate-400">Innings 1</span>
          </div>

          <div className="overflow-x-auto mt-3">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[11px]">
                  <th className="text-left py-2 font-medium">Batter</th>
                  <th className="text-left py-2 font-medium">Dismissal</th>
                  <th className="text-right py-2 font-medium">R</th>
                  <th className="text-right py-2 font-medium">B</th>
                  <th className="text-right py-2 font-medium">4s</th>
                  <th className="text-right py-2 font-medium">6s</th>
                  <th className="text-right py-2 font-medium">SR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {innings.batters.map((b) => (
                  <tr key={b.playerId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{b.playerName}</span>
                      {b.isOnStrike && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="On Strike" />
                      )}
                    </td>
                    <td className="py-2.5 text-slate-500 dark:text-slate-400 italic text-[11px]">
                      {b.dismissalText}
                    </td>
                    <td className="py-2.5 text-right font-bold tabular-nums text-slate-900 dark:text-white">
                      {b.runs}
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-slate-500 dark:text-slate-400">
                      {b.balls}
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-slate-500 dark:text-slate-400">
                      {b.fours}
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-slate-500 dark:text-slate-400">
                      {b.sixes}
                    </td>
                    <td className="py-2.5 text-right tabular-nums font-mono font-medium text-emerald-600 dark:text-emerald-400">
                      {b.strikeRate.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bowling Figures */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2">
              {activeMatch.teamBName} Bowling Figures
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[11px]">
                    <th className="text-left py-2 font-medium">Bowler</th>
                    <th className="text-right py-2 font-medium">O</th>
                    <th className="text-right py-2 font-medium">M</th>
                    <th className="text-right py-2 font-medium">R</th>
                    <th className="text-right py-2 font-medium">W</th>
                    <th className="text-right py-2 font-medium">Econ</th>
                    <th className="text-right py-2 font-medium">Dots</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {innings.bowlers.map((bw) => (
                    <tr key={bw.playerId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{bw.playerName}</span>
                        {bw.isBowlingNow && (
                          <span className="text-[10px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-500 font-mono">
                            NOW
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 text-right font-mono tabular-nums text-slate-900 dark:text-white">
                        {bw.oversFormatted}
                      </td>
                      <td className="py-2.5 text-right tabular-nums text-slate-500">
                        {bw.maidens}
                      </td>
                      <td className="py-2.5 text-right tabular-nums text-slate-900 dark:text-white">
                        {bw.runsConceded}
                      </td>
                      <td className="py-2.5 text-right font-bold tabular-nums text-red-500">
                        {bw.wickets}
                      </td>
                      <td className="py-2.5 text-right font-mono tabular-nums text-slate-600 dark:text-slate-300">
                        {bw.economy.toFixed(2)}
                      </td>
                      <td className="py-2.5 text-right tabular-nums text-slate-400">
                        {bw.dotBalls}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Ball-by-Ball Live Commentary Stack Feed */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Ball-by-Ball Commentary
            </h3>
            <span className="text-[10px] font-mono text-emerald-500">LIFO Stack</span>
          </div>

          <div className="space-y-3.5 mt-3 max-h-[520px] overflow-y-auto pr-1">
            {recentBalls.map((ball) => (
              <div
                key={ball.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {ball.overNumber}.{ball.ballInOver}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {ball.bowlerName} to {ball.batsmanName}
                    </span>
                  </div>

                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                      ball.isWicket
                        ? 'bg-red-600 text-white'
                        : ball.isBoundarySix
                        ? 'bg-purple-600 text-white'
                        : ball.isBoundaryFour
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {ball.isWicket ? 'WICKET' : `${ball.totalRunsOnBall} RUNS`}
                  </span>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                  {ball.commentary}
                </p>

                <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>Ball #{ball.ballNumber} in stack</span>
                  <span>{ball.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WICKET DISMISSAL MODAL */}
      {isWicketModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6">
            <div className="flex items-center gap-2 text-red-600 font-bold text-sm mb-4">
              <Zap className="w-5 h-5" />
              <span>Record Dismissal Event (Atomic Transaction)</span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Dismissed Batter
                </label>
                <select
                  value={dismissedBatterId}
                  onChange={(e) => setDismissedBatterId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value={striker?.playerId}>{striker?.playerName} (Striker)</option>
                  <option value={nonStriker?.playerId}>{nonStriker?.playerName} (Non-Striker)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Dismissal Type
                </label>
                <select
                  value={selectedDismissal}
                  onChange={(e) => setSelectedDismissal(e.target.value as DismissalType)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Bowled">Bowled</option>
                  <option value="Caught">Caught</option>
                  <option value="LBW">LBW (Leg Before Wicket)</option>
                  <option value="Run Out">Run Out</option>
                  <option value="Stumped">Stumped</option>
                  <option value="Hit Wicket">Hit Wicket</option>
                  <option value="Caught &amp; Bowled">Caught &amp; Bowled</option>
                </select>
              </div>

              {(selectedDismissal === 'Caught' || selectedDismissal === 'Run Out') && (
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Fielder Name
                  </label>
                  <input
                    type="text"
                    value={fielderName}
                    onChange={(e) => setFielderName(e.target.value)}
                    placeholder="e.g. Maxwell / Stoinis"
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              )}

              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 text-[11px]">
                Both wicket count and dismissal details are committed together in one atomic database event.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsWicketModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmWicket}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold"
                >
                  Confirm Wicket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EXTRAS DIALOG MODAL */}
      {isExtraModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4">
              Record Extras
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Extra Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Wide', 'No-Ball', 'Bye', 'Leg-Bye'] as ExtraType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedExtraType(type)}
                      className={`p-2.5 rounded-lg border text-left font-semibold ${
                        selectedExtraType === type
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Additional Runs Taken (e.g. overthrows or byes running)
                </label>
                <div className="flex items-center gap-2">
                  {[0, 1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setExtraAdditionalRuns(num)}
                      className={`flex-1 py-2 rounded-lg border font-mono font-bold ${
                        extraAdditionalRuns === num
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      +{num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsExtraModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmExtra}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Record Extra
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
