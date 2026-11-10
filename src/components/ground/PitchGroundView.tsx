/**
 * CricSphere Pro - Pitch Assessment & Ground Features
 * In-depth pitch turf analytics, grass coverage, surface cracks,
 * boundary dimensions, and weather/dew factor impact
 */

import React, { useState } from 'react';
import { useCricket } from '../../context/CricketContext';
import { 
  MapPin, 
  Compass, 
  Wind, 
  Droplets, 
  Sun, 
  Activity, 
  TrendingUp, 
  Sparkles,
  Maximize2
} from 'lucide-react';
import { PitchAssessment } from '../../types/cricket';

export const PitchGroundView: React.FC = () => {
  const { pitchAssessments, groundFeatures, openAiModal } = useCricket();

  const [selectedPitchIndex, setSelectedPitchIndex] = useState<number>(0);
  const currentPitch: PitchAssessment = pitchAssessments[selectedPitchIndex] || pitchAssessments[0];

  // Interactive Grass Coverage simulation
  const [grassCoverage, setGrassCoverage] = useState(currentPitch.grassCoveragePercent);
  const [drynessIndex, setDrynessIndex] = useState(currentPitch.drynessIndexPercent);

  // Recalculate pace vs spin bias based on grass and dryness
  const simulatedPace = Math.min(10, Math.round((grassCoverage / 10) + 1));
  const simulatedSpin = Math.min(10, Math.round((drynessIndex / 10) + 1));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
            <Compass className="w-4 h-4" />
            <span>ICC Ground Operations &amp; Surface Meteorology</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Pitch Assessment &amp; Ground Features
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            22-yard turf inspection, boundary dimensions, dew factor probability, and par score forecasts.
          </p>
        </div>

        <button
          onClick={() => openAiModal('predict', { pitch: currentPitch.pitchType, venue: currentPitch.venue })}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Pitch &amp; Toss Strategy</span>
        </button>
      </div>

      {/* Venue Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {pitchAssessments.map((pitch, idx) => (
          <button
            key={pitch.venue}
            onClick={() => {
              setSelectedPitchIndex(idx);
              setGrassCoverage(pitch.grassCoveragePercent);
              setDrynessIndex(pitch.drynessIndexPercent);
            }}
            className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 whitespace-nowrap transition-all font-semibold ${
              selectedPitchIndex === idx
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
            <span>{pitch.venue}</span>
            <span className="text-[10px] text-slate-400 font-mono">({pitch.country})</span>
          </button>
        ))}
      </div>

      {/* Main Grid: Pitch Strip Photo + Inspection Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Turf Photo & Curator Assessment */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 md:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                {currentPitch.venue} · 22-Yard Turf Inspection
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Classified: <strong className="text-emerald-600 dark:text-emerald-400">{currentPitch.pitchType}</strong>
              </p>
            </div>

            <div className="text-right text-xs">
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                T20 Par: {currentPitch.expectedParScoreT20}
              </span>
              <span className="text-slate-400 text-[11px] ml-2">
                (ODI Par: {currentPitch.expectedParScoreODI})
              </span>
            </div>
          </div>

          {/* High-Res Pitch Image */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 h-64 bg-slate-950">
            <img
              src="/src/assets/images/cricket_pitch_assessment_1793768694512.jpg"
              alt="Cricket Pitch Strip Inspection"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md text-white text-xs font-bold border border-white/20">
              PITCH TYPE: {currentPitch.pitchType.toUpperCase()}
            </div>
            <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
              BOUNCE: {currentPitch.bounceAndCarry.toUpperCase()}
            </div>
          </div>

          {/* Interactive Inspection Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between font-bold">
                <span>Live Grass Coverage</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">{grassCoverage}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={grassCoverage}
                onChange={(e) => setGrassCoverage(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <div className="text-[10px] text-slate-400">
                Higher grass aids initial seam movement and fast bowler carry.
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between font-bold">
                <span>Soil Dryness &amp; Cracks Index</span>
                <span className="font-mono text-amber-500">{drynessIndex}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={drynessIndex}
                onChange={(e) => setDrynessIndex(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="text-[10px] text-slate-400">
                High dryness creates abrasive dust patches, aiding wrist and finger spin.
              </div>
            </div>
          </div>

          {/* Simulated Assistance Ratings */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl border border-blue-200 dark:border-blue-800/80 bg-blue-50/40 dark:bg-blue-950/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-300">Pace &amp; Seam Rating</span>
                <div className="text-xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
                  {simulatedPace} <span className="text-xs font-normal text-slate-400">/ 10</span>
                </div>
              </div>
              <Activity className="w-6 h-6 text-blue-500" />
            </div>

            <div className="p-3 rounded-xl border border-amber-200 dark:border-amber-800/80 bg-amber-50/40 dark:bg-amber-950/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300">Spin Assistance</span>
                <div className="text-xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
                  {simulatedSpin} <span className="text-xs font-normal text-slate-400">/ 10</span>
                </div>
              </div>
              <Activity className="w-6 h-6 text-amber-500" />
            </div>
          </div>

          {/* Curator Notes */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
            <strong className="text-slate-900 dark:text-white block mb-0.5">Official Head Curator's Report:</strong>
            {currentPitch.curatorNotes}
          </div>
        </div>

        {/* Right Column: Ground Dimensions & Stadium Features */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              Ground Dimensions &amp; Boundaries
            </h3>

            {/* Stadium Visual Oval */}
            <div className="relative rounded-2xl border-2 border-emerald-500/40 bg-emerald-950/20 p-6 flex flex-col items-center justify-center min-h-[190px] text-center">
              <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase mb-2">
                Straight Boundary: {groundFeatures.straightBoundaryMeters}m
              </div>

              {/* Pitch in center */}
              <div className="w-10 h-16 rounded bg-amber-700/60 border border-amber-500 flex items-center justify-center font-mono text-[9px] text-white font-bold shadow">
                22 YD
              </div>

              <div className="w-full flex items-center justify-between text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase mt-2">
                <span>Square: {groundFeatures.squareBoundaryMeters}m</span>
                <span>Square: {groundFeatures.squareBoundaryMeters}m</span>
              </div>

              <div className="text-[10px] font-mono text-slate-400 mt-2">
                Fine Leg / Third Man: {groundFeatures.fineLegBoundaryMeters}m
              </div>
            </div>

            {/* Outfield & Dew Factor */}
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Outfield Speed:</span>
                <span className="font-bold text-slate-900 dark:text-white">{groundFeatures.outfieldSpeed}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Evening Dew Factor:</span>
                <span className="font-bold text-blue-500">{groundFeatures.dewFactorEvening}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Stadium Capacity:</span>
                <span className="font-bold font-mono text-slate-900 dark:text-white">{groundFeatures.capacity.toLocaleString()}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Floodlights:</span>
                <div className="font-medium text-slate-700 dark:text-slate-200 mt-0.5">{groundFeatures.floodlights}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
