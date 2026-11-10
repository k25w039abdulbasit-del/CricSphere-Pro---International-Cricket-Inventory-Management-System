/**
 * CricSphere Pro - Full-Stack Express Server
 * Serves API routes, Gemini AI models, and mounts Vite middlewares
 */

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { CricketStack } from './src/dsa/CricketStack';
import { INITIAL_INVENTORY_ITEMS, INITIAL_MATCHES, INITIAL_PLAYERS, INITIAL_TEAMS, INITIAL_TOURNAMENTS } from './src/data/mockData';
import { BallEvent, InventoryItem, Match } from './src/types/cricket';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google GenAI Server Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

// Initialize In-Memory Data with Stack DSA
const inventoryStack = new CricketStack<InventoryItem>(50, INITIAL_INVENTORY_ITEMS);
let matches: Match[] = JSON.parse(JSON.stringify(INITIAL_MATCHES));
let players = JSON.parse(JSON.stringify(INITIAL_PLAYERS));
let teams = JSON.parse(JSON.stringify(INITIAL_TEAMS));
let tournaments = JSON.parse(JSON.stringify(INITIAL_TOURNAMENTS));

// -----------------------------------------------------------------------------
// 1. INVENTORY DSA STACK ENDPOINTS
// -----------------------------------------------------------------------------
app.get('/api/inventory', (req: Request, res: Response) => {
  res.json({
    items: inventoryStack.toArray(),
    rawStorage: inventoryStack.getRawStorage(),
    memoryFrames: inventoryStack.getMemoryFrames(),
    size: inventoryStack.size(),
    capacity: inventoryStack.getCapacity(),
    isEmpty: inventoryStack.isEmpty(),
    isFull: inventoryStack.isFull(),
    logs: inventoryStack.getOperationLogs(),
    peekItem: inventoryStack.peek()
  });
});

app.post('/api/inventory/push', (req: Request, res: Response) => {
  const item: InventoryItem = req.body;
  if (!item || !item.name) {
    return res.status(400).json({ error: 'Item details are required' });
  }

  const newItem: InventoryItem = {
    ...item,
    id: item.id || `inv-${Date.now()}`,
    sku: item.sku || `SKU-${Date.now().toString(36).toUpperCase()}`,
    addedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
  };

  const success = inventoryStack.push(newItem);
  if (!success) {
    return res.status(400).json({ error: 'Stack Overflow: Maximum capacity reached' });
  }

  res.json({
    success: true,
    item: newItem,
    size: inventoryStack.size(),
    logs: inventoryStack.getOperationLogs()
  });
});

app.post('/api/inventory/pop', (req: Request, res: Response) => {
  if (inventoryStack.isEmpty()) {
    return res.status(400).json({ error: 'Stack Underflow: Inventory stack is empty' });
  }

  const poppedItem = inventoryStack.pop();
  res.json({
    success: true,
    poppedItem,
    size: inventoryStack.size(),
    logs: inventoryStack.getOperationLogs()
  });
});

app.post('/api/inventory/update', (req: Request, res: Response) => {
  const { id, updates } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'Item ID is required' });
  }

  const success = inventoryStack.update(
    (item) => item.id === id,
    (item) => ({ ...item, ...updates })
  );

  res.json({
    success,
    size: inventoryStack.size(),
    logs: inventoryStack.getOperationLogs()
  });
});

app.post('/api/inventory/delete', (req: Request, res: Response) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'Item ID is required' });
  }

  const deleted = inventoryStack.deleteWhere((item) => item.id === id);
  res.json({
    success: !!deleted,
    deleted,
    size: inventoryStack.size(),
    logs: inventoryStack.getOperationLogs()
  });
});

// -----------------------------------------------------------------------------
// 2. TRANSACTIONAL LIVE SCORING ENDPOINTS
// -----------------------------------------------------------------------------
app.get('/api/matches', (req: Request, res: Response) => {
  res.json(matches);
});

app.get('/api/matches/:id', (req: Request, res: Response) => {
  const match = matches.find((m) => m.id === req.params.id);
  if (!match) return res.status(404).json({ error: 'Match not found' });
  res.json(match);
});

/**
 * Live scoring transactional ball recorder
 * Enforces atomic state update: Dismissal & Wicket increment succeed together or roll back
 */
app.post('/api/matches/:id/score-ball', (req: Request, res: Response) => {
  const matchId = req.params.id;
  const match = matches.find((m) => m.id === matchId);
  if (!match) return res.status(404).json({ error: 'Match not found' });

  const innings = match.innings[match.currentInningsIndex];
  if (!innings) return res.status(400).json({ error: 'No active innings' });

  const {
    batterRuns = 0,
    extraType = 'None',
    extraRuns = 0,
    isWicket = false,
    dismissalType,
    dismissedPlayerId,
    fielderName,
    customCommentary
  } = req.body;

  // Clone innings snapshot for rollback if validation or transaction fails
  const rollbackSnapshot = JSON.stringify(innings);

  try {
    const isLegalBall = extraType !== 'Wide' && extraType !== 'No-Ball';
    const totalRunsOnBall = batterRuns + extraRuns;

    // Legal ball overs math
    const currentBalls = innings.legalBallsBowled;
    const overNumber = Math.floor(currentBalls / 6);
    const ballInOver = (currentBalls % 6) + 1;

    // Striker and Bowler
    const striker = innings.batters.find((b) => b.playerId === innings.currentStrikerId);
    const bowler = innings.bowlers.find((b) => b.playerId === innings.currentBowlerId);

    if (!striker || !bowler) {
      throw new Error('Current striker or bowler is unassigned');
    }

    // 1. Update Extras
    if (extraType === 'Wide') {
      innings.extras.wides += extraRuns;
      bowler.wides += extraRuns;
      bowler.runsConceded += extraRuns;
    } else if (extraType === 'No-Ball') {
      innings.extras.noBalls += extraRuns;
      bowler.noBalls += extraRuns;
      bowler.runsConceded += extraRuns;
    } else if (extraType === 'Bye') {
      innings.extras.byes += extraRuns;
    } else if (extraType === 'Leg-Bye') {
      innings.extras.legByes += extraRuns;
    } else if (extraType === 'Penalty') {
      innings.extras.penalty += extraRuns;
    }
    innings.extras.total += extraRuns;

    // 2. Batter Stats (only on legal ball or legitimate bat runs)
    if (extraType !== 'Wide') {
      striker.balls += (isLegalBall ? 1 : 0);
      striker.runs += batterRuns;
      if (batterRuns === 4) striker.fours += 1;
      if (batterRuns === 6) striker.sixes += 1;
      striker.strikeRate = striker.balls > 0 ? Number(((striker.runs / striker.balls) * 100).toFixed(2)) : 0;
    }

    // 3. Bowler Stats
    if (isLegalBall) {
      bowler.legalBallsBowled += 1;
      const completedOvers = Math.floor(bowler.legalBallsBowled / 6);
      const remBalls = bowler.legalBallsBowled % 6;
      bowler.oversFormatted = `${completedOvers}.${remBalls}`;
      if (batterRuns === 0 && extraRuns === 0) {
        bowler.dotBalls += 1;
      }
    }

    // Bowler conceded runs (batter runs + wides + no-balls; byes and leg-byes are not conceded to bowler)
    if (extraType === 'None' || extraType === 'Wide' || extraType === 'No-Ball') {
      bowler.runsConceded += batterRuns;
    }
    bowler.economy = bowler.legalBallsBowled > 0 ? Number(((bowler.runsConceded / bowler.legalBallsBowled) * 6).toFixed(2)) : 0;

    // 4. Team Score & Legal Balls
    innings.totalRuns += totalRunsOnBall;
    if (isLegalBall) {
      innings.legalBallsBowled += 1;
    }

    // 5. Transactional Dismissal Check
    let dismissedPlayer = striker;
    if (isWicket) {
      innings.wickets += 1;
      if (dismissedPlayerId && dismissedPlayerId !== striker.playerId) {
        const nonStriker = innings.batters.find((b) => b.playerId === dismissedPlayerId);
        if (nonStriker) dismissedPlayer = nonStriker;
      }

      dismissedPlayer.isOut = true;
      dismissedPlayer.isBatting = false;

      let dismissalTxt = dismissalType || 'out';
      if (dismissalType === 'Bowled') dismissalTxt = `b ${bowler.playerName}`;
      else if (dismissalType === 'Caught') dismissalTxt = `c ${fielderName || 'fielder'} b ${bowler.playerName}`;
      else if (dismissalType === 'LBW') dismissalTxt = `lbw b ${bowler.playerName}`;
      else if (dismissalType === 'Stumped') dismissalTxt = `st keeper b ${bowler.playerName}`;
      else if (dismissalType === 'Run Out') dismissalTxt = `run out (${fielderName || 'direct hit'})`;

      dismissedPlayer.dismissalText = dismissalTxt;

      // Credit wicket to bowler if bowler dismissal
      if (['Bowled', 'Caught', 'LBW', 'Stumped', 'Hit Wicket', 'Caught & Bowled'].includes(dismissalType || '')) {
        bowler.wickets += 1;
      }
    }

    // 6. Generate Commentary
    let commentary = customCommentary;
    if (!commentary) {
      if (isWicket) {
        commentary = `OUT! ${dismissedPlayer.playerName} ${dismissedPlayer.dismissalText}. A crucial breakthrough for ${match.teamBName}!`;
      } else if (batterRuns === 6) {
        commentary = `SIX! High, handsome, and into the crowd! ${striker.playerName} dispatches ${bowler.playerName} over the ropes!`;
      } else if (batterRuns === 4) {
        commentary = `FOUR! Glorious shot! Pierces the infield and races away to the boundary fence!`;
      } else if (batterRuns === 0 && extraRuns === 0) {
        commentary = `${bowler.playerName} hits the deck hard, defended solidly back to the bowler. Dot ball.`;
      } else {
        commentary = `${striker.playerName} pushes it into the gap and scampers across for ${totalRunsOnBall} run${totalRunsOnBall > 1 ? 's' : ''}.`;
      }
    }

    // 7. Push to Innings Ball Stack
    const newBall: BallEvent = {
      id: `ball-${Date.now()}`,
      ballNumber: innings.ballStack.length + 1,
      overNumber,
      ballInOver,
      isLegalBall,
      batsmanId: striker.playerId,
      batsmanName: striker.playerName,
      nonStrikerId: innings.currentNonStrikerId,
      nonStrikerName: innings.batters.find((b) => b.playerId === innings.currentNonStrikerId)?.playerName || '',
      bowlerId: bowler.playerId,
      bowlerName: bowler.playerName,
      batterRuns,
      extraType,
      extraRuns,
      totalRunsOnBall,
      isWicket,
      dismissalType,
      dismissedPlayerId: isWicket ? dismissedPlayer.playerId : undefined,
      dismissedPlayerName: isWicket ? dismissedPlayer.playerName : undefined,
      fielderName,
      commentary,
      isBoundaryFour: batterRuns === 4,
      isBoundarySix: batterRuns === 6,
      timestamp: new Date().toLocaleTimeString()
    };

    innings.ballStack.push(newBall);

    // 8. Strike Rotation Logic
    // If odd runs scored (1 or 3), rotate strike
    if (batterRuns % 2 === 1) {
      const temp = innings.currentStrikerId;
      innings.currentStrikerId = innings.currentNonStrikerId;
      innings.currentNonStrikerId = temp;
    }

    // If over complete (6 legal balls), switch strike and change over
    if (isLegalBall && innings.legalBallsBowled % 6 === 0) {
      const temp = innings.currentStrikerId;
      innings.currentStrikerId = innings.currentNonStrikerId;
      innings.currentNonStrikerId = temp;
      bowler.isBowlingNow = false;
    }

    // Update batter status flags
    innings.batters.forEach((b) => {
      b.isOnStrike = b.playerId === innings.currentStrikerId;
    });

    // Dynamic Live Win Probability Engine
    const ballsRemaining = Math.max(0, (innings.maxOvers * 6) - innings.legalBallsBowled);
    const crr = innings.legalBallsBowled > 0 ? (innings.totalRuns / innings.legalBallsBowled) * 6 : 6.0;
    // Base probability starts around 50%
    let probTeamA = 50 + (crr - 7.5) * 4 - (innings.wickets * 5.5);
    if (batterRuns === 4) probTeamA += 2;
    if (batterRuns === 6) probTeamA += 4;
    if (isWicket) probTeamA -= 7;
    // Bound between 5% and 95%
    probTeamA = Math.min(94, Math.max(6, Math.round(probTeamA)));
    match.winProbabilityTeamA = probTeamA;
    match.winProbabilityTeamB = 100 - probTeamA;

    res.json({
      success: true,
      match,
      ball: newBall,
      totalBalls: innings.legalBallsBowled
    });
  } catch (err: any) {
    // Transactional Rollback
    match.innings[match.currentInningsIndex] = JSON.parse(rollbackSnapshot);
    res.status(500).json({ error: 'Transaction failed and state rolled back: ' + err.message });
  }
});

/**
 * Undo Last Ball (Stack POP Operation)
 * Pops the last ball from the match ball stack and restores all counts atomically!
 */
app.post('/api/matches/:id/undo-ball', (req: Request, res: Response) => {
  const matchId = req.params.id;
  const match = matches.find((m) => m.id === matchId);
  if (!match) return res.status(404).json({ error: 'Match not found' });

  const innings = match.innings[match.currentInningsIndex];
  if (!innings || innings.ballStack.length === 0) {
    return res.status(400).json({ error: 'No balls to undo' });
  }

  const lastBall = innings.ballStack.pop()!;

  // Reverse runs
  innings.totalRuns -= lastBall.totalRunsOnBall;
  if (lastBall.isLegalBall) {
    innings.legalBallsBowled = Math.max(0, innings.legalBallsBowled - 1);
  }

  // Reverse extras
  if (lastBall.extraType === 'Wide') innings.extras.wides -= lastBall.extraRuns;
  else if (lastBall.extraType === 'No-Ball') innings.extras.noBalls -= lastBall.extraRuns;
  else if (lastBall.extraType === 'Bye') innings.extras.byes -= lastBall.extraRuns;
  else if (lastBall.extraType === 'Leg-Bye') innings.extras.legByes -= lastBall.extraRuns;
  innings.extras.total -= lastBall.extraRuns;

  // Reverse batter stats
  const striker = innings.batters.find((b) => b.playerId === lastBall.batsmanId);
  if (striker && lastBall.extraType !== 'Wide') {
    striker.runs -= lastBall.batterRuns;
    if (lastBall.isLegalBall) striker.balls -= 1;
    if (lastBall.batterRuns === 4) striker.fours -= 1;
    if (lastBall.batterRuns === 6) striker.sixes -= 1;
    striker.strikeRate = striker.balls > 0 ? Number(((striker.runs / striker.balls) * 100).toFixed(2)) : 0;
  }

  // Reverse bowler stats
  const bowler = innings.bowlers.find((b) => b.playerId === lastBall.bowlerId);
  if (bowler) {
    if (lastBall.isLegalBall) bowler.legalBallsBowled -= 1;
    if (lastBall.extraType === 'None' || lastBall.extraType === 'Wide' || lastBall.extraType === 'No-Ball') {
      bowler.runsConceded -= (lastBall.batterRuns + lastBall.extraRuns);
    }
    const completedOvers = Math.floor(bowler.legalBallsBowled / 6);
    const remBalls = bowler.legalBallsBowled % 6;
    bowler.oversFormatted = `${completedOvers}.${remBalls}`;
    bowler.economy = bowler.legalBallsBowled > 0 ? Number(((bowler.runsConceded / bowler.legalBallsBowled) * 6).toFixed(2)) : 0;
  }

  // Reverse wicket
  if (lastBall.isWicket) {
    innings.wickets -= 1;
    if (bowler && ['Bowled', 'Caught', 'LBW', 'Stumped', 'Hit Wicket', 'Caught & Bowled'].includes(lastBall.dismissalType || '')) {
      bowler.wickets -= 1;
    }
    const dismissed = innings.batters.find((b) => b.playerId === lastBall.dismissedPlayerId);
    if (dismissed) {
      dismissed.isOut = false;
      dismissed.isBatting = true;
      dismissed.dismissalText = 'not out';
    }
  }

  res.json({
    success: true,
    poppedBall: lastBall,
    match
  });
});

// -----------------------------------------------------------------------------
// 3. PLAYERS & TEAMS & TOURNAMENTS
// -----------------------------------------------------------------------------
app.get('/api/players', (req: Request, res: Response) => {
  res.json(players);
});

app.post('/api/players', (req: Request, res: Response) => {
  const newPlayer = {
    ...req.body,
    id: `ply-${Date.now()}`
  };
  players.push(newPlayer);
  res.json({ success: true, player: newPlayer });
});

app.put('/api/players/:id', (req: Request, res: Response) => {
  const idx = players.findIndex((p: any) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Player not found' });
  players[idx] = { ...players[idx], ...req.body };
  res.json({ success: true, player: players[idx] });
});

app.get('/api/teams', (req: Request, res: Response) => {
  res.json(teams);
});

app.get('/api/tournaments', (req: Request, res: Response) => {
  res.json(tournaments);
});

// -----------------------------------------------------------------------------
// 4. GEMINI AI ASSISTANT ENDPOINTS
// -----------------------------------------------------------------------------

/**
 * AI Match Prediction
 * Analyzes pitch conditions, team strength, recent form and gives win probability
 */
app.post('/api/ai/predict', async (req: Request, res: Response) => {
  try {
    const { matchId, teamA, teamB, pitch, venue, format } = req.body;

    const prompt = `You are an elite ICC International Cricket Analyst and Data Scientist.
Analyze this upcoming ${format || 'T20'} match:
- Team 1: ${teamA || 'Pakistan'}
- Team 2: ${teamB || 'Australia'}
- Venue: ${venue || 'Melbourne Cricket Ground'}
- Pitch Condition: ${pitch || 'Balanced / Flat'}

Provide a rigorous match forecast including:
1. Win probability percentage for Team 1 and Team 2 (must sum to 100%).
2. Pitch and weather impact analysis.
3. Key player matchup (e.g. Babar Azam vs Pat Cummins / Starc).
4. Projected par score (1st innings score).
5. Tactical key to victory for both teams.

Return response in clear, concise markdown with bullet points.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are the ICC official chief cricket analytics model. Be insightful, authentic, and statistically grounded.'
      }
    });

    res.json({ analysis: response.text });
  } catch (err: any) {
    res.status(500).json({ error: 'AI analysis failed: ' + err.message });
  }
});

/**
 * AI Player Performance Scout
 */
app.post('/api/ai/player-summary', async (req: Request, res: Response) => {
  try {
    const { player } = req.body;
    if (!player) return res.status(400).json({ error: 'Player details required' });

    const prompt = `Generate a high-performance cricket scouting and form summary for:
- Player: ${player.name} (${player.country})
- Role: ${player.role}
- Batting Style: ${player.battingStyle}
- Bowling Style: ${player.bowlingStyle}
- Career Batting Avg: ${player.battingAverage}, Strike Rate: ${player.strikeRate}, Runs: ${player.runs}
- Career Wickets: ${player.wickets}, Economy: ${player.economy}
- Recent Innings Scores: ${player.recentScores ? player.recentScores.join(', ') : 'N/A'}

Provide:
1. Current Form Rating (e.g. Peak Form / Solid / Needs Reset)
2. Tactical Strength & Scoring Zones
3. Vulnerability / Weakness opposing captains target
4. Recommended Role for upcoming World Cup match`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt
    });

    res.json({ summary: response.text });
  } catch (err: any) {
    res.status(500).json({ error: 'Scout analysis failed: ' + err.message });
  }
});

/**
 * AI Smart Playing XI Recommendation
 */
app.post('/api/ai/recommend-xi', async (req: Request, res: Response) => {
  try {
    const { teamName, pitchCondition, opponent } = req.body;
    const prompt = `Recommend an optimal Playing XI balance for ${teamName || 'Pakistan'} playing against ${opponent || 'Australia'} on a ${pitchCondition || 'Balanced / Flat'} wicket in an ICC World Cup match.
Ensure proper team composition:
- At least 5 distinct bowling options (minimum 2 frontline pacers + 1 frontline spinner + all-rounder)
- 1 designated Wicketkeeper
- 3 Top-Order Batters, 3 Middle-Order Batters
- Tactical rationale for batting order numbers 1 to 11.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt
    });

    res.json({ recommendation: response.text });
  } catch (err: any) {
    res.status(500).json({ error: 'XI recommendation failed: ' + err.message });
  }
});

// -----------------------------------------------------------------------------
// 5. SERVER MOUNT (VITE OR STATIC)
// -----------------------------------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`CricSphere Pro server listening on port ${PORT}`);
  });
}

startServer();
