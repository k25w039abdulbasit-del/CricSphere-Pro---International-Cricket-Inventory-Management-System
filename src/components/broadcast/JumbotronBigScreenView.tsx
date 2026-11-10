/**
 * CricSphere Pro - Stadium LCD Jumbotron Big Screen Broadcast
 * Giant LED display mode for match scores, animated alerts (OUT, SIX, FOUR),
 * speed radar gun, and stadium crowd immersion
 */

import React, { useState } from 'react';
import { useCricket } from '../../context/CricketContext';
import { 
  Tv, 
  Maximize2, 
  Zap, 
  Radio, 
  Gauge, 
  Flame, 
  Sparkles, 
  ShieldAlert, 
  Volume2,
  Minimize2
} from 'lucide-react';
import { JumbotronMode } from '../../types/cricket';
import { soundEngine } from '../../utils/audio';

export const JumbotronBigScreenView: React.FC = () => {
  const { 
    activeMatch, 
    jumbotronMode, 
    setJumbotronMode, 
    soundEnabled 
  } = useCricket();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [simulatedSpeed, setSimulatedSpeed] = useState<number>(146.8);

  if (!activeMatch) {
    return <div className="p-12 text-center text-slate-500">No match selected for stadium screen.</div>;
  }

  const innings = activeMatch.innings[activeMatch.currentInningsIndex];
  const striker = innings?.batters.find((b) => b.isOnStrike) || innings?.batters[0];
  const nonStriker = innings?.batters.find((b) => b.playerId === innings?.currentNonStrikerId) || innings?.batters[1];
  const currentBowler = innings?.bowlers.find((b) => b.isBowlingNow) || innings?.bowlers[0];

  const triggerAnimation = (mode: JumbotronMode) => {
    setJumbotronMode(mode);
    if (soundEnabled) {
      if (mode === 'OUT' || mode === 'DECISION_OUT') soundEngine.playWicket();
      else if (mode === 'SIX' || mode === 'FOUR') soundEngine.playBoundary();
    }
    setTimeout(() => {
      setJumbotronMode('STANDARD');
    }, 4500);
  };

  const generateSpeed = () => {
    const sp = Number((138 + Math.random() * 14).toFixed(1));
    setSimulatedSpeed(sp);
  };

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-black p-6 overflow-y-auto' : ''}`}>
      {/* Top Controls */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Tv className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Stadium Big Screen / LCD Jumbotron Broadcast Mode
          </h2>
          <span className="text-xs text-red-500 font-mono font-bold animate-pulse ml-2 flex items-center gap-1">
            <Radio className="w-3.5 h-3.5" />
            LIVE STADIUM FEED
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Broadcast Triggers */}
          <button
            onClick={() => triggerAnimation('SIX')}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-purple-600 text-white hover:bg-purple-500 shadow"
          >
            Trigger SIX
          </button>
          <button
            onClick={() => triggerAnimation('FOUR')}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-500 shadow"
          >
            Trigger FOUR
          </button>
          <button
            onClick={() => triggerAnimation('OUT')}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-red-600 text-white hover:bg-red-500 shadow"
          >
            Trigger OUT
          </button>
          <button
            onClick={() => triggerAnimation('DRS_PENDING')}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500 text-black hover:bg-amber-400 shadow"
          >
            DRS Pending
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 ml-2"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen Stadium View'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* GIANT JUMBOTRON LED DISPLAY CONTAINER */}
      <div className="relative rounded-3xl overflow-hidden border-4 border-slate-800 dark:border-slate-700 bg-slate-950 text-white shadow-2xl min-h-[480px] flex flex-col justify-between p-6 md:p-10 select-none">
        {/* Background stadium image with low opacity */}
        <img
          src="/src/assets/images/icc_jumbotron_screen_1793768694451.jpg"
          alt="Stadium Jumbotron"
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/90 pointer-events-none" />

        {/* Dynamic Stadium Alert Overlay Banner (OUT, SIX, FOUR, DRS) */}
        {jumbotronMode !== 'STANDARD' && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in zoom-in-95 duration-200">
            {jumbotronMode === 'OUT' && (
              <div className="text-center space-y-3">
                <div className="text-6xl md:text-8xl font-black text-red-500 tracking-widest animate-pulse drop-shadow-[0_0_35px_rgba(239,68,68,0.8)]">
                  OUT!
                </div>
                <div className="text-xl md:text-2xl font-bold text-white tracking-wide uppercase">
                  WICKET DOWN · CELEBRATION IN STANDS
                </div>
              </div>
            )}

            {jumbotronMode === 'SIX' && (
              <div className="text-center space-y-3">
                <div className="text-6xl md:text-8xl font-black text-purple-400 tracking-widest animate-bounce drop-shadow-[0_0_40px_rgba(168,85,247,0.9)]">
                  MAXIMUM 6!
                </div>
                <div className="text-xl md:text-2xl font-bold text-white tracking-wide uppercase">
                  INTO THE SECOND TIER · 98 METERS
                </div>
              </div>
            )}

            {jumbotronMode === 'FOUR' && (
              <div className="text-center space-y-3">
                <div className="text-6xl md:text-8xl font-black text-cyan-400 tracking-widest drop-shadow-[0_0_35px_rgba(6,182,212,0.8)]">
                  BOUNDARY 4!
                </div>
                <div className="text-xl md:text-2xl font-bold text-white tracking-wide uppercase">
                  RACES AWAY TO THE FENCE
                </div>
              </div>
            )}

            {jumbotronMode === 'DRS_PENDING' && (
              <div className="text-center space-y-3">
                <div className="text-5xl md:text-7xl font-black text-amber-400 tracking-wider animate-pulse drop-shadow-[0_0_35px_rgba(245,158,11,0.8)]">
                  DECISION PENDING...
                </div>
                <div className="text-lg md:text-xl font-bold text-slate-300 uppercase">
                  THIRD UMPIRE REVIEW IN PROGRESS
                </div>
              </div>
            )}

            {jumbotronMode === 'DECISION_OUT' && (
              <div className="text-center space-y-3">
                <div className="text-7xl md:text-9xl font-black text-red-500 tracking-widest drop-shadow-[0_0_50px_rgba(239,68,68,1)]">
                  OUT
                </div>
                <div className="text-xl font-bold text-slate-200">
                  DECISION OVERTURNED / CONFIRMED
                </div>
              </div>
            )}

            {jumbotronMode === 'DECISION_NOT_OUT' && (
              <div className="text-center space-y-3">
                <div className="text-6xl md:text-8xl font-black text-emerald-400 tracking-widest drop-shadow-[0_0_50px_rgba(52,211,153,1)]">
                  NOT OUT
                </div>
                <div className="text-xl font-bold text-slate-200">
                  ON-FIELD DECISION STANDS · BATTER SAFE
                </div>
              </div>
            )}
          </div>
        )}

        {/* JUMBOTRON HEADER */}
        <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{activeMatch.teamALogo}</span>
            <div>
              <div className="text-lg md:text-xl font-extrabold text-white tracking-wide">
                {activeMatch.teamAName.toUpperCase()} vs {activeMatch.teamBName.toUpperCase()}
              </div>
              <div className="text-xs text-slate-400">
                {activeMatch.tournamentName} · {activeMatch.venue}
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest">
              BROADCAST FEED · MCG BIG SCREEN
            </span>
            <div className="text-xs text-slate-300">
              Innings 1 · {activeMatch.format} International
            </div>
          </div>
        </div>

        {/* GIANT SCOREBOARD DIGITS (Centerpiece) */}
        <div className="relative z-10 py-8 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          {/* Huge Runs & Wickets */}
          <div>
            <div className="text-7xl md:text-9xl font-black tracking-tight tabular-nums text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]">
              {innings?.totalRuns || 148}
              <span className="text-red-500">/{innings?.wickets || 4}</span>
            </div>
            <div className="text-lg md:text-2xl font-bold text-emerald-400 font-mono tracking-wider mt-1">
              {Math.floor((innings?.legalBallsBowled || 110) / 6)}.{(innings?.legalBallsBowled || 110) % 6} OVERS
              <span className="text-sm font-normal text-slate-400 ml-2">/ {innings?.maxOvers || 20} ov</span>
            </div>
          </div>

          {/* Current Run Rate & Projected Score */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
                Current Run Rate
              </div>
              <div className="text-3xl md:text-4xl font-black text-amber-400 font-mono tabular-nums mt-1">
                {(((innings?.totalRuns || 148) / (innings?.legalBallsBowled || 110)) * 6).toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Runs per Over</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
                Projected Score
              </div>
              <div className="text-3xl md:text-4xl font-black text-blue-400 font-mono tabular-nums mt-1">
                {Math.round((((innings?.totalRuns || 148) / (innings?.legalBallsBowled || 110)) * 6) * 20)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">At current rate</div>
            </div>
          </div>
        </div>

        {/* BOTTOM METRICS STRIP: BATTERS, BOWLER & SPEED RADAR */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-3 pt-4 border-t border-slate-800 text-xs">
          {/* Striker */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/40">
            <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center justify-between">
              <span>Striker (Facing)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <div className="font-extrabold text-sm text-white mt-0.5">
              {striker?.playerName || 'Babar Azam'}*
            </div>
            <div className="text-sm font-mono font-bold text-emerald-300 mt-0.5">
              {striker?.runs || 45} <span className="text-xs font-normal text-slate-400">({striker?.balls || 28}b · {striker?.fours || 5}x4, {striker?.sixes || 1}x6)</span>
            </div>
          </div>

          {/* Non-Striker */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Non-Striker
            </div>
            <div className="font-extrabold text-sm text-white mt-0.5">
              {nonStriker?.playerName || 'Mohammad Rizwan'}
            </div>
            <div className="text-sm font-mono font-bold text-slate-200 mt-0.5">
              {nonStriker?.runs || 21} <span className="text-xs font-normal text-slate-400">({nonStriker?.balls || 12}b)</span>
            </div>
          </div>

          {/* Bowler */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Bowler Spell
            </div>
            <div className="font-extrabold text-sm text-white mt-0.5 truncate">
              {currentBowler?.playerName || 'Mitchell Starc'}
            </div>
            <div className="text-xs font-mono text-slate-300 mt-0.5">
              {currentBowler?.oversFormatted || '3.2'} ov · {currentBowler?.runsConceded || 28}r · <span className="text-red-400 font-bold">{currentBowler?.wickets || 1}w</span>
            </div>
          </div>

          {/* Ball Speed Radar Gun */}
          <div 
            onClick={generateSpeed}
            className="p-3 rounded-xl bg-gradient-to-r from-red-950/70 to-slate-900/90 border border-red-800/60 cursor-pointer hover:border-red-500 transition-colors"
            title="Click to simulate new speed reading"
          >
            <div className="text-[10px] text-red-400 font-bold uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5" />
                <span>Speed Radar Gun</span>
              </span>
              <span className="text-[9px] text-slate-400">STALKER V2</span>
            </div>
            <div className="text-xl font-black font-mono text-white mt-0.5">
              {simulatedSpeed} <span className="text-xs font-normal text-red-400">km/h</span>
            </div>
            <div className="text-[10px] text-slate-400">
              Release Velocity {(simulatedSpeed * 0.621371).toFixed(1)} mph
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
