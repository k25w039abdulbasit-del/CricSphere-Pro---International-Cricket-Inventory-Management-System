/**
 * CricSphere Pro - Player Management System
 * Comprehensive profiles, career statistics, injury tracker,
 * digital shareable player cards, and Gemini Scout analysis
 */

import React, { useState } from 'react';
import { useCricket } from '../../context/CricketContext';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Sparkles, 
  Eye, 
  Edit3, 
  Award, 
  Activity, 
  Share2, 
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Player, PlayerRole, BattingStyle, BowlingStyle, AvailabilityStatus } from '../../types/cricket';

export const PlayerManagementView: React.FC = () => {
  const { players, teams, savePlayer, activeRole, openAiModal } = useCricket();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('All');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>('All');
  const [activePlayerCard, setActivePlayerCard] = useState<Player | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  // Filtered players
  const filteredPlayers = players.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.registrationNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.teamName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRoleFilter === 'All' || p.role === selectedRoleFilter;
    const matchesCountry = selectedCountryFilter === 'All' || p.country === selectedCountryFilter;
    return matchesSearch && matchesRole && matchesCountry;
  });

  const countries = ['All', ...Array.from(new Set(players.map((p) => p.country)))];
  const roles: ('All' | PlayerRole)[] = [
    'All',
    'Top-Order Batter',
    'Middle-Order Batter',
    'Wicketkeeper Batter',
    'Batting All-Rounder',
    'Bowling All-Rounder',
    'Fast Bowler',
    'Spin Bowler'
  ];

  const handleOpenAddPlayer = () => {
    const emptyPlayer: Player = {
      id: `ply-${Date.now()}`,
      registrationNo: `ICC-GEN-${Math.floor(10 + Math.random() * 90)}`,
      name: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      country: 'Pakistan',
      teamId: teams[0]?.id || 'team-pak',
      teamName: teams[0]?.name || 'Pakistan',
      age: 24,
      dob: '2000-01-01',
      jerseyNo: Math.floor(1 + Math.random() * 99),
      role: 'Top-Order Batter',
      battingStyle: 'Right-Hand Bat',
      bowlingStyle: 'Right-Arm Medium',
      status: 'Available',
      matches: 0,
      innings: 0,
      runs: 0,
      highestScore: 0,
      highestScoreNotOut: false,
      battingAverage: 0,
      strikeRate: 0,
      centuries: 0,
      fifties: 0,
      fours: 0,
      sixes: 0,
      notOuts: 0,
      wickets: 0,
      bowlingAverage: 0,
      economy: 0,
      bowlingStrikeRate: 0,
      bestBowlingInnings: '0/0',
      maidens: 0,
      dotBalls: 0,
      catches: 0,
      stumpings: 0,
      recentScores: [0, 0, 0, 0, 0]
    };
    setEditingPlayer(emptyPlayer);
    setIsEditModalOpen(true);
  };

  const handleSavePlayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlayer || !editingPlayer.name.trim()) return;
    savePlayer(editingPlayer);
    setIsEditModalOpen(false);
  };

  const canEdit = activeRole === 'Club Admin' || activeRole === 'Super Admin' || activeRole === 'Coach';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title & Actions Bar */}
      <div className="p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
            <Users className="w-4 h-4" />
            <span>ICC International Player Registry &amp; Scouting Database</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Player Roster &amp; Profiles
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Full career batting/bowling statistics, injury tracker, digital player cards, and Gemini scout summaries.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleOpenAddPlayer}
            disabled={!canEdit}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Player</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by player, team, or ICC ID..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-slate-400 text-[11px]">Filter:</span>

          {/* Role Filter */}
          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r === 'All' ? 'All Roles' : r}
              </option>
            ))}
          </select>

          {/* Country Filter */}
          <select
            value={selectedCountryFilter}
            onChange={(e) => setSelectedCountryFilter(e.target.value)}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            {countries.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'All Countries' : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Player Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlayers.map((player) => (
          <div
            key={player.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:border-emerald-500/50 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header row: avatar, country, status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={player.avatar}
                      alt={player.name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-slate-900 text-white font-mono text-[9px] font-bold border border-slate-700">
                      #{player.jerseyNo}
                    </span>
                  </div>

                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                      <span>{player.name}</span>
                      {player.isCaptain && (
                        <span className="text-[10px] font-bold text-amber-500">(C)</span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {player.country} · {player.teamName}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    player.status === 'Available'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                >
                  {player.status}
                </span>
              </div>

              {/* Badges / Roles */}
              <div className="mt-3.5 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">
                  {player.role}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  {player.battingStyle}
                </span>
                {player.bowlingStyle !== 'None' && (
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    {player.bowlingStyle}
                  </span>
                )}
              </div>

              {/* Career Stats Grid */}
              <div className="mt-4 grid grid-cols-4 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-medium">Matches</div>
                  <div className="font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
                    {player.matches}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-medium">Runs</div>
                  <div className="font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
                    {player.runs}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-medium">Bat Avg</div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums mt-0.5 font-mono">
                    {player.battingAverage}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-medium">Wickets</div>
                  <div className="font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
                    {player.wickets}
                  </div>
                </div>
              </div>

              {/* Form in last 5 matches */}
              <div className="mt-3 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Recent Form (Last 5):</span>
                <div className="flex items-center gap-1 font-mono">
                  {player.recentScores.map((score, sIdx) => (
                    <span
                      key={sIdx}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        score >= 50
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : score >= 25
                          ? 'bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {score}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={() => setActivePlayerCard(player)}
                className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Digital Card</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAiModal('scout', { player })}
                  className="px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors flex items-center gap-1"
                  title="Generate AI Performance Scout Summary"
                >
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  <span>AI Scout</span>
                </button>

                {canEdit && (
                  <button
                    onClick={() => {
                      setEditingPlayer(player);
                      setIsEditModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Edit player profile"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DIGITAL SHAREABLE PLAYER CARD MODAL */}
      {activePlayerCard && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 text-white shadow-2xl relative p-6">
            {/* Close button */}
            <button
              onClick={() => setActivePlayerCard(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Top brand */}
            <div className="flex items-center justify-between text-xs text-amber-400 font-bold uppercase tracking-wider mb-4">
              <span>ICC DIGITAL PLAYER CARD</span>
              <span>#{activePlayerCard.jerseyNo}</span>
            </div>

            {/* Player Avatar & Name */}
            <div className="text-center">
              <div className="relative inline-block mx-auto">
                <img
                  src={activePlayerCard.avatar}
                  alt={activePlayerCard.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-amber-400 shadow-xl"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-1 text-2xl">
                  {teams.find((t) => t.id === activePlayerCard.teamId)?.logo || '🏏'}
                </span>
              </div>

              <h3 className="text-lg font-black text-white mt-3">
                {activePlayerCard.name}
              </h3>
              <p className="text-xs text-slate-400">
                {activePlayerCard.country} · {activePlayerCard.role}
              </p>
              <div className="text-[10px] text-amber-400/80 font-mono mt-0.5">
                REG: {activePlayerCard.registrationNo}
              </div>
            </div>

            {/* Key Stats Grid */}
            <div className="mt-5 grid grid-cols-3 gap-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-3 text-center text-xs">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-medium">Runs</div>
                <div className="text-lg font-bold text-white tabular-nums mt-0.5">
                  {activePlayerCard.runs}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase font-medium">Bat Avg</div>
                <div className="text-lg font-bold text-emerald-400 tabular-nums mt-0.5 font-mono">
                  {activePlayerCard.battingAverage}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase font-medium">Strike Rate</div>
                <div className="text-lg font-bold text-amber-400 tabular-nums mt-0.5 font-mono">
                  {activePlayerCard.strikeRate}
                </div>
              </div>
            </div>

            {/* Secondary Stats */}
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-400 border-t border-slate-800 pt-3">
              <div>100s/50s: <span className="text-white font-bold">{activePlayerCard.centuries}/{activePlayerCard.fifties}</span></div>
              <div>Wickets: <span className="text-white font-bold">{activePlayerCard.wickets}</span></div>
              <div>Economy: <span className="text-white font-bold">{activePlayerCard.economy}</span></div>
            </div>

            {/* AI Scout preview button inside card */}
            <button
              onClick={() => {
                const p = activePlayerCard;
                setActivePlayerCard(null);
                openAiModal('scout', { player: p });
              }}
              className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate AI Scout Summary</span>
            </button>
          </div>
        </div>
      )}

      {/* REGISTER / EDIT PLAYER MODAL */}
      {isEditModalOpen && editingPlayer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4">
              {editingPlayer.name ? 'Edit Player Profile' : 'Register New International Player'}
            </h3>

            <form onSubmit={handleSavePlayerSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingPlayer.name}
                  onChange={(e) => setEditingPlayer({ ...editingPlayer, name: e.target.value })}
                  placeholder="e.g. Babar Azam"
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={editingPlayer.country}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, country: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Jersey Number
                  </label>
                  <input
                    type="number"
                    value={editingPlayer.jerseyNo}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, jerseyNo: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Role
                  </label>
                  <select
                    value={editingPlayer.role}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, role: e.target.value as PlayerRole })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Top-Order Batter">Top-Order Batter</option>
                    <option value="Middle-Order Batter">Middle-Order Batter</option>
                    <option value="Wicketkeeper Batter">Wicketkeeper Batter</option>
                    <option value="Batting All-Rounder">Batting All-Rounder</option>
                    <option value="Bowling All-Rounder">Bowling All-Rounder</option>
                    <option value="Fast Bowler">Fast Bowler</option>
                    <option value="Spin Bowler">Spin Bowler</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Playing Status
                  </label>
                  <select
                    value={editingPlayer.status}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, status: e.target.value as AvailabilityStatus })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Available">Available</option>
                    <option value="Injured">Injured</option>
                    <option value="Rested">Rested</option>
                    <option value="In-Transit">In-Transit</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Batting Style
                  </label>
                  <select
                    value={editingPlayer.battingStyle}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, battingStyle: e.target.value as BattingStyle })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Right-Hand Bat">Right-Hand Bat</option>
                    <option value="Left-Hand Bat">Left-Hand Bat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Bowling Style
                  </label>
                  <select
                    value={editingPlayer.bowlingStyle}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, bowlingStyle: e.target.value as BowlingStyle })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="None">None</option>
                    <option value="Right-Arm Fast">Right-Arm Fast</option>
                    <option value="Left-Arm Fast">Left-Arm Fast</option>
                    <option value="Right-Arm Off-Break">Right-Arm Off-Break</option>
                    <option value="Right-Arm Leg-Break">Right-Arm Leg-Break</option>
                    <option value="Left-Arm Orthodox">Left-Arm Orthodox</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Career Runs
                  </label>
                  <input
                    type="number"
                    value={editingPlayer.runs}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, runs: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Batting Avg
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingPlayer.battingAverage}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, battingAverage: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Strike Rate
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingPlayer.strikeRate}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, strikeRate: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
