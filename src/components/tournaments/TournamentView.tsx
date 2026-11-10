/**
 * CricSphere Pro - Tournament Hub & Standings
 * Points table, precise Net Run Rate (NRR) calculator,
 * playoffs knockout bracket, and tournament awards
 */

import React, { useState } from 'react';
import { useCricket } from '../../context/CricketContext';
import { 
  Trophy, 
  Award, 
  Calculator, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  PartyPopper 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TournamentView: React.FC = () => {
  const { 
    tournaments, 
    selectedTournamentId, 
    setSelectedTournamentId, 
    activeTournament: tournament, 
    openAiModal 
  } = useCricket();

  const [activeTab, setActiveTab] = useState<'standings' | 'nrr-calc' | 'playoffs' | 'awards'>('standings');

  // NRR Calculator State
  const [calcRunsScored, setCalcRunsScored] = useState(890);
  const [calcOversFaced, setCalcOversFaced] = useState(96.4); // 96 overs and 4 balls
  const [calcRunsConceded, setCalcRunsConceded] = useState(785);
  const [calcOversBowled, setCalcOversBowled] = useState(100.0);

  // Helper to convert formatted overs e.g. 96.4 to mathematical decimal overs
  const oversToDecimal = (oversFormatted: number): number => {
    const whole = Math.floor(oversFormatted);
    const balls = Math.round((oversFormatted - whole) * 10);
    return whole + (balls / 6);
  };

  const calculatedNRR = (() => {
    const decFaced = oversToDecimal(calcOversFaced);
    const decBowled = oversToDecimal(calcOversBowled);
    if (decFaced === 0 || decBowled === 0) return 0;
    const battingRunRate = calcRunsScored / decFaced;
    const bowlingRunRate = calcRunsConceded / decBowled;
    return Number((battingRunRate - bowlingRunRate).toFixed(3));
  })();

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Tournament Format Switcher (ODI World Cup vs T20 World Cup) */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-200/60 dark:bg-slate-800/80 w-fit">
        {tournaments.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTournamentId(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              selectedTournamentId === t.id
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="text-base">{t.logo}</span>
            <span>{t.name}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
              {t.format}
            </span>
          </button>
        ))}
      </div>

      {/* Header Banner */}
      <div className="p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-500 mb-1">
            <Trophy className="w-4 h-4" />
            <span>ICC Official Championship · {tournament.format} International ({tournament.edition})</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {tournament.name}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Host: <strong>{tournament.hostCountry}</strong> · Stage: <strong className="text-emerald-500">{tournament.currentStage}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={triggerConfetti}
            className="px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800/80 text-amber-800 dark:text-amber-300 text-xs font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors flex items-center gap-1.5"
          >
            <PartyPopper className="w-4 h-4" />
            <span>Celebrate Trophy</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl w-fit text-xs font-semibold">
        <button
          onClick={() => setActiveTab('standings')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'standings'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Super 8 Points Table
        </button>
        <button
          onClick={() => setActiveTab('nrr-calc')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'nrr-calc'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          ICC NRR Calculator
        </button>
        <button
          onClick={() => setActiveTab('playoffs')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'playoffs'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Knockout Bracket (Finals)
        </button>
        <button
          onClick={() => setActiveTab('awards')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'awards'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Golden Awards &amp; MVP
        </button>
      </div>

      {/* TAB 1: POINTS TABLE */}
      {activeTab === 'standings' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Official ICC World Cup Super 8 Points Table
            </h3>
            <span className="text-xs text-slate-400">Top 2 Qualify for Grand Final</span>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[11px]">
                  <th className="text-left py-2 font-medium">Pos</th>
                  <th className="text-left py-2 font-medium">Team</th>
                  <th className="text-center py-2 font-medium">P</th>
                  <th className="text-center py-2 font-medium">W</th>
                  <th className="text-center py-2 font-medium">L</th>
                  <th className="text-center py-2 font-medium">Pts</th>
                  <th className="text-right py-2 font-medium">Runs For</th>
                  <th className="text-right py-2 font-medium">Runs Agst</th>
                  <th className="text-right py-2 font-medium">Net Run Rate (NRR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {tournament.standings.map((st, idx) => (
                  <tr
                    key={st.teamId}
                    className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 ${
                      idx < 2 ? 'bg-emerald-50/20 dark:bg-emerald-950/10' : ''
                    }`}
                  >
                    <td className="py-2.5 font-mono text-[11px] font-bold text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="text-base">{st.logo}</span>
                      <span>{st.teamName}</span>
                      {idx < 2 && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-normal">
                          Finalist
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 text-center tabular-nums text-slate-600 dark:text-slate-300">{st.played}</td>
                    <td className="py-2.5 text-center tabular-nums font-bold text-emerald-600 dark:text-emerald-400">{st.won}</td>
                    <td className="py-2.5 text-center tabular-nums text-slate-500">{st.lost}</td>
                    <td className="py-2.5 text-center tabular-nums font-black text-sm text-slate-900 dark:text-white">{st.points}</td>
                    <td className="py-2.5 text-right font-mono tabular-nums text-slate-600 dark:text-slate-300">
                      {st.runsScored} <span className="text-[10px] text-slate-400">({Math.floor(st.oversFacedBalls / 6)}.{st.oversFacedBalls % 6} ov)</span>
                    </td>
                    <td className="py-2.5 text-right font-mono tabular-nums text-slate-600 dark:text-slate-300">
                      {st.runsConceded} <span className="text-[10px] text-slate-400">({Math.floor(st.oversBowledBalls / 6)}.{st.oversBowledBalls % 6} ov)</span>
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold tabular-nums">
                      <span className={st.netRunRate >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}>
                        {st.netRunRate >= 0 ? `+${st.netRunRate.toFixed(3)}` : st.netRunRate.toFixed(3)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: NRR CALCULATOR */}
      {activeTab === 'nrr-calc' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 md:p-6 shadow-sm space-y-5">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-500" />
              <span>Official ICC Net Run Rate (NRR) Mathematical Engine</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Formula: <code>NRR = (Total Runs Scored / Total Overs Faced) - (Total Runs Conceded / Total Overs Bowled)</code>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Batting Input */}
            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3">
              <div className="font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider text-[11px]">
                Batting Performance (Team Runs &amp; Overs Faced)
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Total Runs Scored
                </label>
                <input
                  type="number"
                  value={calcRunsScored}
                  onChange={(e) => setCalcRunsScored(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Overs Faced (e.g. 96.4 = 96 overs &amp; 4 legal balls)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={calcOversFaced}
                  onChange={(e) => setCalcOversFaced(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            {/* Bowling Input */}
            <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-800/80 bg-blue-50/40 dark:bg-blue-950/20 space-y-3">
              <div className="font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider text-[11px]">
                Bowling Performance (Runs Conceded &amp; Overs Bowled)
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Total Runs Conceded
                </label>
                <input
                  type="number"
                  value={calcRunsConceded}
                  onChange={(e) => setCalcRunsConceded(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Overs Bowled (e.g. 100.0)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={calcOversBowled}
                  onChange={(e) => setCalcOversBowled(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Result Box */}
          <div className="p-5 rounded-xl bg-slate-950 text-white text-center">
            <div className="text-xs text-slate-400 uppercase tracking-widest font-mono">
              Calculated Net Run Rate
            </div>
            <div className={`text-3xl md:text-4xl font-black font-mono mt-1 ${
              calculatedNRR >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {calculatedNRR >= 0 ? `+${calculatedNRR.toFixed(3)}` : calculatedNRR.toFixed(3)}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              For Rate: {(calcRunsScored / oversToDecimal(calcOversFaced)).toFixed(3)} rpo · Against Rate: {(calcRunsConceded / oversToDecimal(calcOversBowled)).toFixed(3)} rpo
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PLAYOFFS BRACKET */}
      {activeTab === 'playoffs' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 md:p-6 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
            Tournament Knockout Bracket
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Semi-Final 1 */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Semi-Final 1 · Completed</span>
                <span>SCG, Sydney</span>
              </div>
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                <span className="flex items-center gap-1.5">🇿🇦 South Africa</span>
                <span className="font-mono">178/6 (20.0)</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">🇳🇿 New Zealand</span>
                <span className="font-mono">164/8 (20.0)</span>
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold pt-1 border-t border-slate-200 dark:border-slate-700">
                South Africa won by 14 runs
              </div>
            </div>

            {/* Grand Final */}
            <div className="p-4 rounded-xl border-2 border-amber-500/60 bg-amber-50/20 dark:bg-amber-950/20 space-y-2 text-xs shadow-sm">
              <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 font-bold text-[11px]">
                <span>GRAND FINAL · LIVE NOW</span>
                <span>MCG, Melbourne</span>
              </div>
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                <span className="flex items-center gap-1.5">🇵🇰 Pakistan</span>
                <span className="font-mono text-emerald-500 font-black">148/4 (18.2) *</span>
              </div>
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                <span className="flex items-center gap-1.5">🇦🇺 Australia</span>
                <span className="font-mono text-slate-400">Yet to bat</span>
              </div>
              <div className="text-[11px] text-slate-500 pt-1 border-t border-amber-200 dark:border-amber-800/80">
                Live transactional scoring in progress.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AWARDS & TROPHY PHOTO */}
      {activeTab === 'awards' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Trophy Showcase Photo */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg bg-slate-950 text-white relative">
            <img
              src="/src/assets/images/cricket_championship_trophy_1793767170531.jpg"
              alt="ICC World Championship Trophy"
              className="w-full h-72 object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="p-4">
              <div className="text-xs font-bold text-amber-400">Prestige World Championship Trophy</div>
              <div className="text-[11px] text-slate-300 mt-1">
                Polished gold and sterling silver presentation plinth for the World Cup Champion.
              </div>
            </div>
          </div>

          {/* Awards List */}
          <div className="md:col-span-2 space-y-3.5">
            <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800/80 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-amber-500" />
                <div>
                  <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                    Golden Bat (Leading Run Scorer)
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                    {tournament.awards.goldenBatPlayerName}
                  </div>
                </div>
              </div>
              <div className="text-lg font-black font-mono text-slate-900 dark:text-white">
                {tournament.awards.goldenBatRuns} <span className="text-xs font-normal text-slate-400">runs</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-blue-500" />
                <div>
                  <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                    Golden Ball (Leading Wicket Taker)
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                    {tournament.awards.goldenBallPlayerName}
                  </div>
                </div>
              </div>
              <div className="text-lg font-black font-mono text-slate-900 dark:text-white">
                {tournament.awards.goldenBallWickets} <span className="text-xs font-normal text-slate-400">wickets</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-emerald-500" />
                <div>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                    Player of the Tournament (MVP)
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                    {tournament.awards.mvpPlayerName}
                  </div>
                </div>
              </div>
              <div className="text-xs font-bold text-emerald-600 font-mono">
                Tournament MVP
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
