/**
 * CricSphere Pro - Cricket Management System Types
 * Core Domain Models & DSA Stack Specifications
 */

export type RoleType = 
  | 'Super Admin'
  | 'Club Admin'
  | 'Coach'
  | 'Scorer'
  | 'Umpire'
  | 'Player'
  | 'Tournament Organizer'
  | 'Viewer';

export type BattingStyle = 'Right-Hand Bat' | 'Left-Hand Bat';
export type BowlingStyle = 
  | 'Right-Arm Fast'
  | 'Right-Arm Fast-Medium'
  | 'Right-Arm Medium'
  | 'Left-Arm Fast'
  | 'Left-Arm Fast-Medium'
  | 'Left-Arm Medium'
  | 'Right-Arm Off-Break'
  | 'Right-Arm Leg-Break'
  | 'Left-Arm Orthodox'
  | 'Left-Arm Chinaman'
  | 'None';

export type PlayerRole = 
  | 'Top-Order Batter'
  | 'Middle-Order Batter'
  | 'Wicketkeeper Batter'
  | 'Batting All-Rounder'
  | 'Bowling All-Rounder'
  | 'Fast Bowler'
  | 'Spin Bowler';

export type AvailabilityStatus = 'Available' | 'Injured' | 'Rested' | 'In-Transit' | 'National Duty';

export interface Player {
  id: string;
  registrationNo: string;
  name: string;
  avatar: string;
  country: string;
  teamId: string;
  teamName: string;
  age: number;
  dob: string;
  jerseyNo: number;
  role: PlayerRole;
  battingStyle: BattingStyle;
  bowlingStyle: BowlingStyle;
  status: AvailabilityStatus;
  isCaptain?: boolean;
  isViceCaptain?: boolean;
  isWicketkeeper?: boolean;
  // Career Batting Stats
  matches: number;
  innings: number;
  runs: number;
  highestScore: number;
  highestScoreNotOut: boolean;
  battingAverage: number;
  strikeRate: number;
  centuries: number;
  fifties: number;
  fours: number;
  sixes: number;
  notOuts: number;
  // Career Bowling Stats
  wickets: number;
  bowlingAverage: number;
  economy: number;
  bowlingStrikeRate: number;
  bestBowlingInnings: string;
  maidens: number;
  dotBalls: number;
  catches: number;
  stumpings: number;
  recentScores: number[]; // Last 5 innings
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  country: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  homeGround: string;
  captainId: string;
  viceCaptainId: string;
  coach: string;
  squadPlayerIds: string[];
  playingXIIds: string[];
  rankingT20: number;
  rankingODI: number;
  rankingTest: number;
  trophiesCount: number;
}

export type MatchFormat = 'T20' | 'ODI' | 'Test';
export type MatchStatus = 'Upcoming' | 'Live' | 'Completed' | 'Abandoned';
export type TossDecision = 'Bat' | 'Bowl';
export type DismissalType = 
  | 'Bowled'
  | 'Caught'
  | 'LBW'
  | 'Run Out'
  | 'Stumped'
  | 'Hit Wicket'
  | 'Caught & Bowled'
  | 'Retired Hurt'
  | 'Retired Out';

export type ExtraType = 'None' | 'Wide' | 'No-Ball' | 'Bye' | 'Leg-Bye' | 'Penalty';

export interface BallEvent {
  id: string;
  ballNumber: number; // sequential within innings
  overNumber: number; // 0-indexed over (0 = 1st over)
  ballInOver: number; // 1 to 6 legal ball
  isLegalBall: boolean;
  batsmanId: string;
  batsmanName: string;
  nonStrikerId: string;
  nonStrikerName: string;
  bowlerId: string;
  bowlerName: string;
  batterRuns: number; // runs off the bat
  extraType: ExtraType;
  extraRuns: number;
  totalRunsOnBall: number;
  isWicket: boolean;
  dismissalType?: DismissalType;
  dismissedPlayerId?: string;
  dismissedPlayerName?: string;
  fielderId?: string;
  fielderName?: string;
  commentary: string;
  isBoundaryFour: boolean;
  isBoundarySix: boolean;
  timestamp: string;
}

export interface BatterScorecardEntry {
  playerId: string;
  playerName: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOut: boolean;
  dismissalText: string;
  isBatting: boolean;
  isOnStrike: boolean;
}

export interface BowlerScorecardEntry {
  playerId: string;
  playerName: string;
  legalBallsBowled: number;
  oversFormatted: string; // e.g. "3.4"
  maidens: number;
  runsConceded: number;
  wickets: number;
  economy: number;
  wides: number;
  noBalls: number;
  dotBalls: number;
  isBowlingNow: boolean;
}

export interface Innings {
  id: string;
  matchId: string;
  inningsNumber: 1 | 2;
  battingTeamId: string;
  bowlingTeamId: string;
  totalRuns: number;
  wickets: number;
  legalBallsBowled: number; // e.g. 110 = 18.2 overs
  maxOvers: number; // 20 for T20, 50 for ODI
  extras: {
    wides: number;
    noBalls: number;
    byes: number;
    legByes: number;
    penalty: number;
    total: number;
  };
  batters: BatterScorecardEntry[];
  bowlers: BowlerScorecardEntry[];
  ballStack: BallEvent[]; // DSA Stack storage for ball events
  currentStrikerId: string;
  currentNonStrikerId: string;
  currentBowlerId: string;
  isCompleted: boolean;
  target?: number;
}

export interface Match {
  id: string;
  tournamentId?: string;
  tournamentName?: string;
  format: MatchFormat;
  teamAId: string;
  teamBId: string;
  teamAName: string;
  teamBName: string;
  teamAShort: string;
  teamBShort: string;
  teamALogo: string;
  teamBLogo: string;
  venue: string;
  pitchCondition: 'Batting Friendly' | 'Bowling Friendly / Green' | 'Balanced / Flat' | 'Dry / Spin Friendly';
  date: string;
  time: string;
  status: MatchStatus;
  tossWinnerId?: string;
  tossDecision?: TossDecision;
  innings: Innings[];
  currentInningsIndex: number;
  result?: string;
  manOfTheMatchPlayerId?: string;
  manOfTheMatchName?: string;
  superOver?: boolean;
  winProbabilityTeamA?: number;
  winProbabilityTeamB?: number;
  targetRuns?: number;
  requiredRunRate?: number;
}

export interface TournamentTeamStanding {
  teamId: string;
  teamName: string;
  teamShort: string;
  logo: string;
  group: 'Group A' | 'Group B' | 'Super 8' | 'Finals';
  played: number;
  won: number;
  lost: number;
  tied: number;
  noResult: number;
  points: number;
  runsScored: number;
  oversFacedBalls: number; // legal balls
  runsConceded: number;
  oversBowledBalls: number; // legal balls
  netRunRate: number;
}

export interface Tournament {
  id: string;
  name: string;
  edition: string;
  format: MatchFormat;
  logo: string;
  startDate: string;
  endDate: string;
  hostCountry: string;
  standings: TournamentTeamStanding[];
  currentStage: 'Group Stage' | 'Super 8' | 'Semi-Finals' | 'Final' | 'Completed';
  championTeamId?: string;
  championTeamName?: string;
  awards: {
    goldenBatPlayerId?: string;
    goldenBatPlayerName?: string;
    goldenBatRuns?: number;
    goldenBallPlayerId?: string;
    goldenBallPlayerName?: string;
    goldenBallWickets?: number;
    mvpPlayerId?: string;
    mvpPlayerName?: string;
  };
}

export interface PitchAssessment {
  venue: string;
  groundName: string;
  city: string;
  country: string;
  pitchType: 'Green Seamer' | 'Flat Highway' | 'Slow Dusty Turner' | 'Subcontinent Spin Track' | 'Drop-in Balanced';
  grassCoveragePercent: number;
  drynessIndexPercent: number;
  moisturePercent: number;
  cracksSeverity: 'Minimal' | 'Moderate' | 'Severe';
  bounceAndCarry: 'Low' | 'True / Consistent' | 'Variable / Steep';
  paceRating: number; // 1-10
  spinRating: number; // 1-10
  expectedParScoreT20: number;
  expectedParScoreODI: number;
  curatorNotes: string;
}

export interface GroundFeatures {
  straightBoundaryMeters: number;
  squareBoundaryMeters: number;
  fineLegBoundaryMeters: number;
  outfieldSpeed: 'Lightning Fast' | 'Fast & True' | 'Lush / Sluggish';
  dewFactorEvening: 'None' | 'Moderate' | 'Heavy Dew (Chasing Favored)';
  altitudeMeters: number;
  capacity: number;
  floodlights: string;
}

export interface DrsReview {
  id: string;
  matchId: string;
  overBall: string;
  reviewingTeam: string;
  batterName: string;
  bowlerName: string;
  originalDecision: 'Out' | 'Not Out';
  dismissalAppealed: 'LBW' | 'Caught Behind' | 'Bat-Pad Catch';
  frontFootNoBall: boolean;
  ultraEdgeSpike: boolean;
  hawkEyePitching: 'In-Line' | 'Outside Off' | 'Outside Leg';
  hawkEyeImpact: 'In-Line' | 'Outside Off' | 'Umpire Call';
  hawkEyeWickets: 'Hitting' | 'Umpire Call' | 'Missing';
  finalDecision: 'OUT' | 'NOT OUT';
  thirdUmpireComment: string;
  timestamp: string;
}

export type JumbotronMode = 'STANDARD' | 'OUT' | 'SIX' | 'FOUR' | 'DRS_PENDING' | 'DECISION_OUT' | 'DECISION_NOT_OUT' | 'FREE_HIT';

export interface CricketRule {
  id: string;
  lawNumber: string;
  title: string;
  category: 'Dismissal' | 'Fielding & Powerplay' | 'Over Limits & DRS' | 'Match Resolution & DLS';
  summary: string;
  fullRule: string;
  t20Application: string;
  odiApplication: string;
}

/**
 * DSA STACK SPECIFICATION:
 * Open Ended Lab: SW 212 Data Structures & Algorithms
 * Group B: Use a Stack to manage the inventory
 */
export type EquipmentCategory = 
  | 'Cricket Balls'
  | 'English Willow Bats'
  | 'Protective Gear'
  | 'Wicketkeeping'
  | 'Pitch & Ground'
  | 'Training & Technology';

export type QualityGrade = 'Grade 1 International' | 'Grade 2 Professional' | 'Training Grade';

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: EquipmentCategory;
  grade: QualityGrade;
  brand: string;
  batchNumber: string;
  quantity: number;
  unitCost: number;
  location: string; // e.g. "Pavilion Locker A1", "Match Referee Bay"
  assignedMatchId?: string;
  addedAt: string;
  condition: 'Brand New' | 'Match Ready' | 'Practice Only' | 'Under Inspection';
  notes: string;
}

export interface StackOperationLog {
  id: string;
  operation: 'PUSH' | 'POP' | 'PEEK' | 'UPDATE' | 'SEARCH' | 'CLEAR';
  targetSku?: string;
  itemSnapshot?: InventoryItem;
  description: string;
  timestamp: string;
  stackSizeAfter: number;
  timeComplexity: string;
}
