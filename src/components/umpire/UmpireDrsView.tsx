/**
 * CricSphere Pro - Umpire & DRS Review Command Center
 * Decision Review System (DRS), UltraEdge audio waveform,
 * Hawk-Eye 3D Ball Tracking, and Third Umpire communication
 */

import React, { useState } from 'react';
import { useCricket } from '../../context/CricketContext';
import { 
  ShieldAlert, 
  Activity, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Radio, 
  Sparkles,
  Users,
  Mic,
  Tv
} from 'lucide-react';
import { DrsReview } from '../../types/cricket';

export const UmpireDrsView: React.FC = () => {
  const { 
    drsReview, 
    setDrsReview, 
    executeDrsDecision, 
    activeMatch,
    setCurrentView 
  } = useCricket();

  const [hasUltraEdgeSpike, setHasUltraEdgeSpike] = useState(drsReview.ultraEdgeSpike);
  const [hawkEyeWicketsState, setHawkEyeWicketsState] = useState<'Hitting' | 'Umpire Call' | 'Missing'>(drsReview.hawkEyeWickets);
  const [currentStep, setCurrentStep] = useState<number>(1);

  const handleResolveOut = () => {
    executeDrsDecision(
      'OUT', 
      'UltraEdge shows no edge, Hawk-Eye ball tracking confirms impact in-line and hitting middle and off stump. Decision overturned to OUT.'
    );
  };

  const handleResolveNotOut = () => {
    executeDrsDecision(
      'NOT OUT', 
      'UltraEdge shows edge before pad OR Hawk-Eye returns Umpire\'s Call. On-field decision stands: NOT OUT. Review retained.'
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-red-500 mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>ICC Third Umpire &amp; Match Officials Command Center</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Decision Review System (DRS) &amp; Hawk-Eye
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Synchronized 3D ball tracking, UltraEdge snickometer acoustic inspection, and third umpire broadcast coordination.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('jumbotron')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <Tv className="w-3.5 h-3.5 text-blue-400" />
            <span>View on Stadium Screen</span>
          </button>
        </div>
      </div>

      {/* Main DRS Workflow Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Active Review Details & Workflow Steps */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 md:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Active DRS Challenge · Over {drsReview.overBall}
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400 font-bold">
              REVIEW BY: {drsReview.reviewingTeam.toUpperCase()}
            </span>
          </div>

          {/* Review Metadata Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Batter</span>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{drsReview.batterName}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Bowler</span>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{drsReview.bowlerName}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase">On-Field Ruling</span>
              <div className="font-bold text-emerald-500 mt-0.5">{drsReview.originalDecision}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Appealed Event</span>
              <div className="font-bold text-red-500 mt-0.5">{drsReview.dismissalAppealed}</div>
            </div>
          </div>

          {/* DRS Multi-Step Sequential Protocol */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Third Umpire Protocol Steps:</span>
            </div>

            {/* Step 1: Front Foot No-Ball Check */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold flex items-center justify-center text-xs">
                  1
                </span>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    Front-Foot No-Ball Camera Check
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Heel landed behind the white popping crease. Fair delivery confirmed.
                  </div>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] uppercase">
                Legal Ball
              </span>
            </div>

            {/* Step 2: UltraEdge / Snickometer */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold flex items-center justify-center text-xs">
                    2
                  </span>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      UltraEdge / Snickometer Acoustic Waveform
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      RTS directional microphone tracking ball passage past the inside edge.
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setHasUltraEdgeSpike(false)}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                      !hasUltraEdgeSpike
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Flat Line (No Bat)
                  </button>
                  <button
                    onClick={() => setHasUltraEdgeSpike(true)}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                      hasUltraEdgeSpike
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Spike Detected (Bat)
                  </button>
                </div>
              </div>

              {/* Simulated Audio Waveform Bar */}
              <div className="h-12 w-full bg-slate-950 rounded-lg flex items-center justify-center px-4 overflow-hidden border border-slate-800">
                {hasUltraEdgeSpike ? (
                  <div className="flex items-center gap-1 w-full justify-center">
                    {[10, 15, 25, 60, 95, 120, 80, 45, 20, 10, 5, 8, 12, 10].map((h, i) => (
                      <div
                        key={i}
                        className="w-1 bg-red-500 rounded-full animate-pulse"
                        style={{ height: `${h * 0.35}px` }}
                      />
                    ))}
                    <span className="ml-3 text-[10px] font-mono font-bold text-red-400 uppercase">
                      Edge Spike: 4.8 kHz
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 w-full justify-center">
                    {[4, 5, 6, 4, 5, 4, 6, 5, 4, 5, 4, 5, 4].map((h, i) => (
                      <div
                        key={i}
                        className="w-1 bg-cyan-400 rounded-full opacity-60"
                        style={{ height: `${h}px` }}
                      />
                    ))}
                    <span className="ml-3 text-[10px] font-mono text-cyan-400 uppercase">
                      Flat Line · Clear Gap between Bat &amp; Ball
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: Hawk-Eye 3D Ball Tracking */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-bold flex items-center justify-center text-xs">
                    3
                  </span>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      Hawk-Eye 3D Virtual Ball Tracking
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Predictive flight path from release, pitch impact point, and trajectory into stumps.
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphic visualizer */}
              <div className="relative rounded-xl overflow-hidden border border-slate-800 h-56 bg-slate-950">
                <img
                  src="/src/assets/images/cricket_drs_ball_tracking_1793768694280.jpg"
                  alt="Hawk-Eye 3D Ball Tracking"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/80 backdrop-blur-md text-[10px] font-mono text-emerald-400 border border-emerald-500/40">
                  HAWK-EYE 3D SENSORS: CALIBRATED
                </div>
              </div>

              {/* 3 Invariant Checks: Pitching, Impact, Wickets */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border">
                  <div className="text-[10px] text-slate-400 uppercase">Pitching</div>
                  <div className="font-bold text-emerald-500 text-xs mt-0.5">IN-LINE</div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border">
                  <div className="text-[10px] text-slate-400 uppercase">Impact (Pad)</div>
                  <div className="font-bold text-emerald-500 text-xs mt-0.5">IN-LINE</div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border">
                  <div className="text-[10px] text-slate-400 uppercase">Wickets (Stumps)</div>
                  <div className="font-bold text-amber-500 text-xs mt-0.5">
                    {hawkEyeWicketsState.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Simulate Wickets toggle */}
              <div className="flex items-center justify-end gap-2 text-[11px]">
                <span className="text-slate-400">Simulate Stumps Impact:</span>
                {(['Hitting', 'Umpire Call', 'Missing'] as ('Hitting' | 'Umpire Call' | 'Missing')[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => setHawkEyeWicketsState(st)}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      hawkEyeWicketsState === st
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Third Umpire Decision Dispatch */}
            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Mic className="w-4 h-4 text-emerald-500" />
                <span>Transmit Official Ruling to Stadium Big Screen &amp; On-Field Umpire:</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResolveNotOut}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
                >
                  Confirm NOT OUT
                </button>
                <button
                  onClick={handleResolveOut}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md"
                >
                  Overturn to OUT
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Match Officials Panel */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              Assigned Match Officials
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">On-Field Umpire 1</div>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">Marais Erasmus</div>
                <div className="text-[10px] text-slate-500">ICC Elite Panel · South Africa</div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">On-Field Umpire 2</div>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">Richard Illingworth</div>
                <div className="text-[10px] text-slate-500">ICC Elite Panel · England</div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Third / TV Umpire</div>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">Nitin Menon</div>
                <div className="text-[10px] text-slate-500">ICC Elite Panel · India</div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Match Referee</div>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">Chris Broad</div>
                <div className="text-[10px] text-slate-500">ICC Chief Referee Panel · England</div>
              </div>
            </div>
          </div>

          {/* DRS Quota Status */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm text-xs space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              DRS Reviews Remaining
            </h4>
            <div className="flex items-center justify-between pt-1">
              <span>🇵🇰 Pakistan:</span>
              <span className="font-mono font-bold text-emerald-500">2 / 2 reviews</span>
            </div>
            <div className="flex items-center justify-between">
              <span>🇦🇺 Australia:</span>
              <span className="font-mono font-bold text-emerald-500">2 / 2 reviews (retained)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
