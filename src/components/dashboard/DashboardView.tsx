/**
 * CricSphere Pro - Dashboard Overview
 * Professional international cricket control center
 */

import React from 'react';
import { useCricket } from '../../context/CricketContext';
import { 
  Users, 
  Shield, 
  Trophy, 
  Radio, 
  Layers, 
  ArrowUpRight, 
  PlusCircle, 
  Calendar,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    matches, 
    players, 
    teams, 
    tournaments, 
    inventorySize, 
    inventoryPeek, 
    setCurrentView,
    setActiveMatchId,
    openAiModal
  } = useCricket();

  // Find live match
  const liveMatch = matches.find((m) => m.status === 'Live') || matches[0];
  const liveInnings = liveMatch?.innings[liveMatch.currentInningsIndex];

  // Top run scorers
  const topRunScorers = [...players]
    .sort((a, b) => b.runs - a.runs)
    .slice(0, 4);

  // Top wicket takers
  const topWicketTakers = [...players]
    .sort((a, b) => b.wickets - a.wickets)
    .slice(0, 4);

  // Recent match results
  const completedMatches = matches.filter((m) => m.status === 'Completed');
  const upcomingMatches = matches.filter((m) => m.status === 'Upcoming');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Hero Banner with Stadium Backdrop */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg bg-slate-900 text-white min-h-[220px] flex flex-col justify-end p-6 md:p-8">
        <img
          src="/src/assets/images/icc_stadium_atmosphere_1793767169876.jpg"
          alt="ICC World Cup Stadium Atmosphere"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>ICC World Tournament Operations Hub</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-300">DSA Stack Management</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white text-balance">
              International Cricket Management &amp; Live Scoring Engine
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Real-time transactional ball-by-ball scoring, ICC tournament standings with Net Run Rate, and Open Ended Lab Stack (LIFO) inventory system.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                setActiveMatchId(liveMatch.id);
                setCurrentView('scoring');
              }}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-[0.98] whitespace-nowrap"
            >
              <Radio className="w-4 h-4 text-emerald-200" />
              <span>Open Live Match</span>
            </button>

            <button
              onClick={() => openAiModal('predict', { match: liveMatch })}
              className="px-3.5 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Win Prediction</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Roster Players</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums mt-1">
            248
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            <span>12 ICC full member nations</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Registered Teams</span>
            <Shield className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums mt-1">
            {teams.length}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            <span>Active World Cup squads</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Total Matches</span>
            <Radio className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums mt-1">
            126
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            <span>1 Live · 2 Scheduled</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Tournaments</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums mt-1">
            8
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            <span>T20 WC, ODI WC, CT</span>
          </div>
        </div>

        <div className="col-span-2 lg:col-span-1 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
            <span>Equipment Stack</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-emerald-900 dark:text-emerald-200 tabular-nums mt-1">
            {inventorySize} <span className="text-xs font-normal text-slate-500">/ 50 cap</span>
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1 truncate">
            TOP: {inventoryPeek?.name?.substring(0, 18) || 'Empty'}...
          </div>
        </div>
      </div>

      {/* Main Grid: Live Match Feature Card + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Match Featured Board */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 md:p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-red-500">
                LIVE MATCH · {liveMatch.format}
              </span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {liveMatch.tournamentName}
              </span>
            </div>

            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {liveMatch.venue}
            </span>
          </div>

          {/* Scoreboard Big Numbers */}
          <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{liveMatch.teamALogo}</span>
              <div>
                <div className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{liveMatch.teamAName}</span>
                  <span className="text-xs font-normal text-slate-400">vs</span>
                  <span>{liveMatch.teamBName}</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Toss: {liveMatch.teamBName} won toss &amp; elected to bowl first
                </div>
              </div>
            </div>

            {/* Score Pill Display */}
            {liveInnings && (
              <div className="text-right">
                <div className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
                  {liveInnings.totalRuns}/{liveInnings.wickets}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums mt-0.5">
                  {Math.floor(liveInnings.legalBallsBowled / 6)}.{liveInnings.legalBallsBowled % 6} / {liveInnings.maxOvers} Overs · CRR: {((liveInnings.totalRuns / (liveInnings.legalBallsBowled || 1)) * 6).toFixed(2)}
                </div>
              </div>
            )}
          </div>

          {/* Current Batters & Bowler Mini Bar */}
          {liveInnings && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 uppercase tracking-wide">Striker</span>
                {(() => {
                  const s = liveInnings.batters.find((b) => b.isOnStrike) || liveInnings.batters[0];
                  return (
                    <div className="font-semibold text-slate-900 dark:text-white mt-0.5">
                      {s?.playerName || 'Batter 1'} <span className="text-emerald-500 font-mono tabular-nums">{s?.runs || 45}* ({s?.balls || 28})</span>
                    </div>
                  );
                })()}
              </div>

              <div>
                <span className="text-[11px] text-slate-400 uppercase tracking-wide">Non-Striker</span>
                {(() => {
                  const ns = liveInnings.batters.find((b) => b.playerId === liveInnings.currentNonStrikerId) || liveInnings.batters[1];
                  return (
                    <div className="font-semibold text-slate-900 dark:text-white mt-0.5">
                      {ns?.playerName || 'Batter 2'} <span className="text-slate-500 dark:text-slate-400 font-mono tabular-nums">{ns?.runs || 21} ({ns?.balls || 12})</span>
                    </div>
                  );
                })()}
              </div>

              <div>
                <span className="text-[11px] text-slate-400 uppercase tracking-wide">Current Bowler</span>
                {(() => {
                  const b = liveInnings.bowlers.find((bw) => bw.isBowlingNow) || liveInnings.bowlers[0];
                  return (
                    <div className="font-semibold text-slate-900 dark:text-white mt-0.5 truncate">
                      {b?.playerName || 'Bowler'}: <span className="font-mono tabular-nums text-slate-600 dark:text-slate-300">{b?.oversFormatted || '3.2'} ov · {b?.runsConceded || 28}r · {b?.wickets || 1}w</span>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              Live scoring uses transactional stack validation with instant rollback.
            </span>
            <button
              onClick={() => {
                setActiveMatchId(liveMatch.id);
                setCurrentView('scoring');
              }}
              className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Score Match Now</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Operations & Inventory Stack Status */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Quick Actions
              </h2>
              <span className="text-[10px] font-mono text-slate-400">SHORTCUTS</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mt-3">
              <button
                onClick={() => setCurrentView('players')}
                className="p-3 text-left rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
              >
                <PlusCircle className="w-4 h-4 text-emerald-600 mb-1.5" />
                <div className="text-xs font-semibold text-slate-900 dark:text-white">Register Player</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Profile &amp; ICC Card</div>
              </button>

              <button
                onClick={() => setCurrentView('inventory')}
                className="p-3 text-left rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
              >
                <Layers className="w-4 h-4 text-emerald-600 mb-1.5" />
                <div className="text-xs font-semibold text-slate-900 dark:text-white">Push to Stack</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">LIFO Equipment</div>
              </button>

              <button
                onClick={() => setCurrentView('tournaments')}
                className="p-3 text-left rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
              >
                <Trophy className="w-4 h-4 text-amber-500 mb-1.5" />
                <div className="text-xs font-semibold text-slate-900 dark:text-white">Points &amp; NRR</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">World Cup Table</div>
              </button>

              <button
                onClick={() => setCurrentView('comparison')}
                className="p-3 text-left rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
              >
                <TrendingUp className="w-4 h-4 text-blue-500 mb-1.5" />
                <div className="text-xs font-semibold text-slate-900 dark:text-white">Compare Players</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Head-to-head A vs B</div>
              </button>
            </div>
          </div>

          {/* DSA Stack Equipment Preview Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-500" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Stack Top Item (PEEK)
                </h2>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                O(1) Access
              </span>
            </div>

            {inventoryPeek ? (
              <div className="mt-3 text-xs">
                <div className="font-semibold text-slate-900 dark:text-white">
                  {inventoryPeek.name}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  SKU: {inventoryPeek.sku} · Qty: {inventoryPeek.quantity} units
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Location: {inventoryPeek.location}
                </div>
                <button
                  onClick={() => setCurrentView('inventory')}
                  className="mt-3 w-full py-1.5 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Open DSA Stack Playground</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="mt-3 text-xs text-slate-400">
                Stack is currently empty.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Grid: Top Run Scorers & Upcoming Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Batting Performers */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Tournament Batting Leaders
              </h2>
            </div>
            <button
              onClick={() => setCurrentView('players')}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              View All Players
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 mt-2">
            {topRunScorers.map((player, idx) => (
              <div key={player.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-400 w-4 text-right">{idx + 1}</span>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {player.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {player.country} · {player.role}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-slate-900 dark:text-white tabular-nums">
                    {player.runs} <span className="font-normal text-slate-400 text-[10px]">runs</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                    Avg: {player.battingAverage} · SR: {player.strikeRate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Results & Upcoming Matches */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Match Schedule &amp; Results
              </h2>
            </div>
            <span className="text-xs text-slate-400">ICC Circuit</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 mt-2">
            {completedMatches.map((m) => (
              <div key={m.id} className="py-2.5 text-xs flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{m.teamALogo} {m.teamAShort} vs {m.teamBShort} {m.teamBLogo}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      Completed
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">
                    {m.result}
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-400">
                  <div>{m.venue.split(',')[0]}</div>
                  <div>PoTM: {m.manOfTheMatchName?.split('(')[0]}</div>
                </div>
              </div>
            ))}

            {upcomingMatches.map((m) => (
              <div key={m.id} className="py-2.5 text-xs flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{m.teamALogo} {m.teamAShort} vs {m.teamBShort} {m.teamBLogo}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                      Upcoming
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {m.format} · {m.date} at {m.time}
                  </div>
                </div>

                <button
                  onClick={() => openAiModal('predict', { match: m })}
                  className="px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>AI Preview</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
