/**
 * CricSphere Pro - Team Management & Squad Selector
 * Squad management, Playing XI advisor, team rankings and balance check
 */

import React, { useState } from 'react';
import { useCricket } from '../../context/CricketContext';
import { 
  Shield, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Trophy, 
  Plus, 
  MapPin, 
  Award,
  ChevronRight
} from 'lucide-react';
import { Team, Player } from '../../types/cricket';

export const TeamManagementView: React.FC = () => {
  const { teams, players, activeRole, openAiModal, addToast } = useCricket();

  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0]?.id || 'team-pak');
  const selectedTeam = teams.find((t) => t.id === selectedTeamId) || teams[0];

  // Squad and Playing XI
  const squadPlayers = players.filter((p) => selectedTeam.squadPlayerIds.includes(p.id));
  const playingXIPlayers = players.filter((p) => selectedTeam.playingXIIds.includes(p.id));

  // Team Balance Analysis
  const bowlersCount = playingXIPlayers.filter((p) => 
    p.role === 'Fast Bowler' || p.role === 'Spin Bowler' || p.role === 'Bowling All-Rounder' || p.bowlingStyle !== 'None'
  ).length;

  const wicketkeepersCount = playingXIPlayers.filter((p) => 
    p.role === 'Wicketkeeper Batter' || p.isWicketkeeper
  ).length;

  const battersCount = playingXIPlayers.filter((p) => 
    p.role === 'Top-Order Batter' || p.role === 'Middle-Order Batter' || p.role === 'Batting All-Rounder'
  ).length;

  const isBalanced = bowlersCount >= 5 && wicketkeepersCount >= 1 && battersCount >= 5;

  const canEdit = activeRole === 'Coach' || activeRole === 'Club Admin' || activeRole === 'Super Admin';

  const togglePlayerInXI = (playerId: string) => {
    if (!canEdit) {
      addToast('error', 'Permission Denied', `Role "${activeRole}" cannot modify the Playing XI.`);
      return;
    }

    if (selectedTeam.playingXIIds.includes(playerId)) {
      if (selectedTeam.playingXIIds.length <= 7) {
        addToast('error', 'Minimum Players', 'Playing XI cannot have fewer than 7 selected players.');
        return;
      }
      selectedTeam.playingXIIds = selectedTeam.playingXIIds.filter((id) => id !== playerId);
      addToast('info', 'Player Deselected', 'Removed from Playing XI.');
    } else {
      if (selectedTeam.playingXIIds.length >= 11) {
        addToast('error', 'Limit Reached', 'Playing XI can only contain exactly 11 players.');
        return;
      }
      selectedTeam.playingXIIds.push(playerId);
      addToast('success', 'Player Selected', 'Added to Playing XI.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
            <Shield className="w-4 h-4" />
            <span>ICC Member Teams &amp; Squad Rosters</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Team Squads &amp; Playing XI Selector
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage squad registrations, select match Playing XI, and inspect team balance indicators.
          </p>
        </div>

        <button
          onClick={() => openAiModal('xi', { teamName: selectedTeam.name, pitchCondition: 'Balanced / Flat' })}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Smart XI Recommendation</span>
        </button>
      </div>

      {/* Team Tabs Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {teams.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTeamId(t.id)}
            className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 whitespace-nowrap transition-all font-semibold ${
              selectedTeam.id === t.id
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span className="text-lg">{t.logo}</span>
            <span>{t.name}</span>
            <span className="text-[10px] text-slate-400 font-mono">#{t.rankingT20}</span>
          </button>
        ))}
      </div>

      {/* Selected Team Profile Card */}
      <div className="p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{selectedTeam.logo}</span>
            <div>
              <div className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>{selectedTeam.name}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-slate-500">
                  {selectedTeam.shortName}
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Home: {selectedTeam.homeGround}</span>
                <span>·</span>
                <span>Head Coach: {selectedTeam.coach}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-center text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <div className="text-[10px] text-slate-400 uppercase">T20 Rank</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">#{selectedTeam.rankingT20}</div>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <div className="text-[10px] text-slate-400 uppercase">ODI Rank</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">#{selectedTeam.rankingODI}</div>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <div className="text-[10px] text-slate-400 uppercase">World Cups</div>
              <div className="text-sm font-bold text-amber-500 mt-0.5">{selectedTeam.trophiesCount} 🏆</div>
            </div>
          </div>
        </div>

        {/* Team Balance Checker Bar */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-900 dark:text-white">
              Playing XI Balance:
            </span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border text-slate-700 dark:text-slate-300">
                Selected: <strong className="text-emerald-500">{selectedTeam.playingXIIds.length}</strong> / 11
              </span>
              <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border text-slate-700 dark:text-slate-300">
                Bowlers: <strong className={bowlersCount >= 5 ? 'text-emerald-500' : 'text-amber-500'}>{bowlersCount}</strong> (min 5)
              </span>
              <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border text-slate-700 dark:text-slate-300">
                Keepers: <strong className={wicketkeepersCount >= 1 ? 'text-emerald-500' : 'text-rose-500'}>{wicketkeepersCount}</strong> (min 1)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 font-medium">
            {isBalanced ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Squad Balanced for Match Day</span>
              </span>
            ) : (
              <span className="text-amber-500 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                <span>Unbalanced: Ensure 5 bowling options &amp; 1 wicketkeeper</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Squad Grid: Active Playing XI vs Bench/Reserves */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Selected Playing XI */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Confirmed Playing XI ({playingXIPlayers.length} / 11)
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">STARTERS</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 mt-2">
            {playingXIPlayers.map((player, idx) => (
              <div key={player.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-400 w-4 text-right">{idx + 1}</span>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{player.name}</span>
                      {player.id === selectedTeam.captainId && (
                        <span className="text-[10px] font-bold text-amber-500">(C)</span>
                      )}
                      {player.isWicketkeeper && (
                        <span className="text-[10px] font-bold text-blue-500">(WK)</span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {player.role} · #{player.jerseyNo}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono tabular-nums text-slate-500">
                    Avg: {player.battingAverage}
                  </span>
                  {canEdit && (
                    <button
                      onClick={() => togglePlayerInXI(player.id)}
                      className="text-red-500 hover:text-red-600 text-xs font-semibold px-2 py-0.5 rounded hover:bg-red-50 dark:hover:bg-red-950/40"
                    >
                      Bench
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Squad Bench / Available Reserves */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Squad Reserves &amp; Substitutes
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">BENCH</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 mt-2">
            {squadPlayers
              .filter((p) => !selectedTeam.playingXIIds.includes(p.id))
              .map((player) => (
                <div key={player.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {player.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {player.role} · {player.battingStyle} · {player.bowlingStyle}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono tabular-nums text-slate-500">
                      Runs: {player.runs}
                    </span>
                    {canEdit && (
                      <button
                        onClick={() => togglePlayerInXI(player.id)}
                        disabled={selectedTeam.playingXIIds.length >= 11}
                        className="text-emerald-600 hover:text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 disabled:opacity-40"
                      >
                        Select in XI
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
