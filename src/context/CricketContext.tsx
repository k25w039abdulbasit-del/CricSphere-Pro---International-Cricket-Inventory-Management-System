/**
 * CricSphere Pro - Global React Context
 * State management for RBAC, 11 International Teams, ODI & T20 World Cups,
 * Transactional Live Scoring, Jumbotron LCD Big Screen, DRS Umpire Panel,
 * Pitch & Ground Assessment, and Blue-White Theme.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Match, 
  Player, 
  Team, 
  Tournament, 
  InventoryItem, 
  RoleType, 
  StackOperationLog, 
  PitchAssessment, 
  GroundFeatures, 
  DrsReview, 
  JumbotronMode, 
  CricketRule 
} from '../types/cricket';
import { 
  INITIAL_MATCHES, 
  INITIAL_PLAYERS, 
  INITIAL_TEAMS, 
  INITIAL_TOURNAMENTS, 
  INITIAL_INVENTORY_ITEMS, 
  INITIAL_PITCH_ASSESSMENTS, 
  INITIAL_GROUND_FEATURES, 
  INITIAL_DRS_REVIEW, 
  CRICKET_RULES_DATABASE 
} from '../data/mockData';
import { CricketStack } from '../dsa/CricketStack';
import { soundEngine } from '../utils/audio';

export type ActiveView = 
  | 'dashboard'
  | 'scoring'
  | 'jumbotron'
  | 'umpire-drs'
  | 'pitch-ground'
  | 'rules'
  | 'inventory'
  | 'players'
  | 'teams'
  | 'tournaments'
  | 'comparison'
  | 'lab-report';

export type AppTheme = 'dark' | 'blue-white' | 'light';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'wicket';
  title: string;
  message: string;
}

interface CricketContextType {
  activeRole: RoleType;
  setActiveRole: (role: RoleType) => void;
  currentView: ActiveView;
  setCurrentView: (view: ActiveView) => void;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
  // Tournaments
  tournaments: Tournament[];
  selectedTournamentId: string;
  setSelectedTournamentId: (id: string) => void;
  activeTournament: Tournament;
  // Matches & Scoring
  matches: Match[];
  activeMatchId: string;
  setActiveMatchId: (id: string) => void;
  activeMatch: Match | undefined;
  players: Player[];
  teams: Team[];
  // DRS & Umpire
  drsReview: DrsReview;
  setDrsReview: React.Dispatch<React.SetStateAction<DrsReview>>;
  executeDrsDecision: (decision: 'OUT' | 'NOT OUT', rationale: string) => void;
  // LCD Jumbotron Big Screen
  jumbotronMode: JumbotronMode;
  setJumbotronMode: (mode: JumbotronMode) => void;
  // Pitch & Grounds
  pitchAssessments: PitchAssessment[];
  groundFeatures: GroundFeatures;
  // Cricket Rules
  cricketRules: CricketRule[];
  // Inventory Stack
  inventoryItems: InventoryItem[];
  inventoryLogs: StackOperationLog[];
  inventorySize: number;
  inventoryCapacity: number;
  inventoryPeek: InventoryItem | undefined;
  // Audio & Toasts
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'error' | 'info' | 'wicket', title: string, message: string) => void;
  removeToast: (id: string) => void;
  // Scoring Transactions
  scoreBall: (params: {
    batterRuns: number;
    extraType?: string;
    extraRuns?: number;
    isWicket?: boolean;
    dismissalType?: string;
    dismissedPlayerId?: string;
    fielderName?: string;
    customCommentary?: string;
  }) => Promise<boolean>;
  undoBall: () => Promise<boolean>;
  // Inventory Stack CRUD
  pushInventory: (item: Partial<InventoryItem>) => Promise<boolean>;
  popInventory: () => Promise<InventoryItem | undefined>;
  updateInventory: (id: string, updates: Partial<InventoryItem>) => Promise<boolean>;
  deleteInventory: (id: string) => Promise<boolean>;
  savePlayer: (player: Player) => void;
  // Modals
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  aiModalData: { isOpen: boolean; type: 'predict' | 'scout' | 'xi'; payload?: any };
  openAiModal: (type: 'predict' | 'scout' | 'xi', payload?: any) => void;
  closeAiModal: () => void;
  isLabReportOpen: boolean;
  setIsLabReportOpen: (open: boolean) => void;
}

const CricketContext = createContext<CricketContextType | undefined>(undefined);

export const CricketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRole] = useState<RoleType>('Super Admin');
  const [currentView, setCurrentView] = useState<ActiveView>('dashboard');
  const [theme, setTheme] = useState<AppTheme>('blue-white'); // User specifically requested "blue and white theme"
  const [tournaments, setTournaments] = useState<Tournament[]>(INITIAL_TOURNAMENTS);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>('tour-t20wc-2026');
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [activeMatchId, setActiveMatchId] = useState<string>('match-t20-final');
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [drsReview, setDrsReview] = useState<DrsReview>(INITIAL_DRS_REVIEW);
  const [jumbotronMode, setJumbotronMode] = useState<JumbotronMode>('STANDARD');
  const [pitchAssessments] = useState<PitchAssessment[]>(INITIAL_PITCH_ASSESSMENTS);
  const [groundFeatures] = useState<GroundFeatures>(INITIAL_GROUND_FEATURES);
  const [cricketRules] = useState<CricketRule[]>(CRICKET_RULES_DATABASE);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isLabReportOpen, setIsLabReportOpen] = useState<boolean>(false);
  const [aiModalData, setAiModalData] = useState<{ isOpen: boolean; type: 'predict' | 'scout' | 'xi'; payload?: any }>({
    isOpen: false,
    type: 'predict'
  });

  // Client-side DSA Stack instance
  const [localStack] = useState(() => new CricketStack<InventoryItem>(50, INITIAL_INVENTORY_ITEMS));
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(localStack.toArray());
  const [inventoryLogs, setInventoryLogs] = useState<StackOperationLog[]>(localStack.getOperationLogs());
  const [inventorySize, setInventorySize] = useState<number>(localStack.size());

  // HTML class updates
  useEffect(() => {
    document.documentElement.classList.remove('dark', 'theme-blue-white');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'blue-white') {
      document.documentElement.classList.add('theme-blue-white');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === 'blue-white') return 'dark';
      if (prev === 'dark') return 'light';
      return 'blue-white';
    });
  };

  const addToast = (type: 'success' | 'error' | 'info' | 'wicket', title: string, message: string) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => removeToast(id), 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const openAiModal = (type: 'predict' | 'scout' | 'xi', payload?: any) => {
    setAiModalData({ isOpen: true, type, payload });
  };

  const closeAiModal = () => {
    setAiModalData((prev) => ({ ...prev, isOpen: false }));
  };

  const activeMatch = matches.find((m) => m.id === activeMatchId);
  const activeTournament = tournaments.find((t) => t.id === selectedTournamentId) || tournaments[0];

  // DRS decision execution
  const executeDrsDecision = (decision: 'OUT' | 'NOT OUT', rationale: string) => {
    setDrsReview((prev) => ({
      ...prev,
      finalDecision: decision,
      thirdUmpireComment: rationale,
      timestamp: new Date().toLocaleTimeString()
    }));

    // Trigger big screen broadcast animation
    setJumbotronMode(decision === 'OUT' ? 'DECISION_OUT' : 'DECISION_NOT_OUT');
    addToast(
      decision === 'OUT' ? 'wicket' : 'info',
      `DRS DECISION: ${decision}`,
      rationale
    );

    setTimeout(() => {
      setJumbotronMode('STANDARD');
    }, 6000);
  };

  // Live scoring transactional method
  const scoreBall = async (params: {
    batterRuns: number;
    extraType?: string;
    extraRuns?: number;
    isWicket?: boolean;
    dismissalType?: string;
    dismissedPlayerId?: string;
    fielderName?: string;
    customCommentary?: string;
  }): Promise<boolean> => {
    if (activeRole !== 'Scorer' && activeRole !== 'Super Admin') {
      addToast('error', 'Permission Denied', `Role "${activeRole}" does not have Live Scorer permissions.`);
      return false;
    }

    try {
      const res = await fetch(`/api/matches/${activeMatchId}/score-ball`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });

      if (res.ok) {
        const data = await res.json();
        setMatches((prev) => prev.map((m) => (m.id === activeMatchId ? data.match : m)));

        if (soundEnabled) {
          if (params.isWicket) soundEngine.playWicket();
          else if (params.batterRuns === 4 || params.batterRuns === 6) soundEngine.playBoundary();
          else soundEngine.playBatHit();
        }

        // Trigger Jumbotron LCD Big Screen Alert
        if (params.isWicket) {
          setJumbotronMode('OUT');
          addToast('wicket', 'WICKET DOWN!', `${data.ball.dismissedPlayerName || 'Batter'} dismissed!`);
          setTimeout(() => setJumbotronMode('STANDARD'), 4500);
        } else if (params.batterRuns === 6) {
          setJumbotronMode('SIX');
          addToast('success', 'MAXIMUM SIX!', 'Ball dispatched over the boundary rope!');
          setTimeout(() => setJumbotronMode('STANDARD'), 4500);
        } else if (params.batterRuns === 4) {
          setJumbotronMode('FOUR');
          addToast('success', 'FOUR RUNS!', 'Crisp boundary struck!');
          setTimeout(() => setJumbotronMode('STANDARD'), 4000);
        }

        return true;
      } else {
        const err = await res.json();
        addToast('error', 'Scoring Transaction Failed', err.error || 'Server error occurred');
        return false;
      }
    } catch {
      // Local fallback
      return false;
    }
  };

  // Undo ball (POP operation)
  const undoBall = async (): Promise<boolean> => {
    if (activeRole !== 'Scorer' && activeRole !== 'Super Admin') {
      addToast('error', 'Permission Denied', 'Only Scorers can undo balls.');
      return false;
    }

    try {
      const res = await fetch(`/api/matches/${activeMatchId}/undo-ball`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setMatches((prev) => prev.map((m) => (m.id === activeMatchId ? data.match : m)));
        if (soundEnabled) soundEngine.playStackClick(true);
        addToast('info', 'Ball Reverted (Stack POP)', `Ball #${data.poppedBall?.ballNumber} rolled back.`);
        return true;
      }
    } catch {
      // Ignore
    }
    return false;
  };

  // Stack Inventory
  const syncInventoryState = () => {
    setInventoryItems(localStack.toArray());
    setInventoryLogs(localStack.getOperationLogs());
    setInventorySize(localStack.size());
  };

  const pushInventory = async (item: Partial<InventoryItem>): Promise<boolean> => {
    if (activeRole !== 'Club Admin' && activeRole !== 'Super Admin') {
      addToast('error', 'Permission Denied', `Role "${activeRole}" cannot modify inventory.`);
      return false;
    }

    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      sku: item.sku || `SKU-${Date.now().toString(36).toUpperCase()}`,
      name: item.name || 'Cricket Equipment Batch',
      category: item.category || 'Cricket Balls',
      grade: item.grade || 'Grade 1 International',
      brand: item.brand || 'Kookaburra',
      batchNumber: item.batchNumber || `BCH-${Math.floor(100 + Math.random() * 900)}`,
      quantity: item.quantity || 6,
      unitCost: item.unitCost || 120,
      location: item.location || 'Pavilion Storage Bay',
      addedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      condition: item.condition || 'Brand New',
      notes: item.notes || 'Added to stack inventory.'
    };

    const success = localStack.push(newItem);
    syncInventoryState();

    if (success) {
      if (soundEnabled) soundEngine.playStackClick(false);
      addToast('success', 'Stack PUSH Operation', `Pushed "${newItem.name}" onto top of stack.`);
      try {
        await fetch('/api/inventory/push', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem)
        });
      } catch {
        // sync handled locally
      }
      return true;
    } else {
      addToast('error', 'Stack Overflow', 'Inventory stack capacity reached!');
      return false;
    }
  };

  const popInventory = async (): Promise<InventoryItem | undefined> => {
    if (activeRole !== 'Club Admin' && activeRole !== 'Super Admin') {
      addToast('error', 'Permission Denied', `Role "${activeRole}" cannot dispatch equipment.`);
      return undefined;
    }

    if (localStack.isEmpty()) {
      addToast('error', 'Stack Underflow', 'Inventory stack is currently empty!');
      return undefined;
    }

    const popped = localStack.pop();
    syncInventoryState();

    if (popped) {
      if (soundEnabled) soundEngine.playStackClick(true);
      addToast('info', 'Stack POP Operation', `Popped and dispatched: "${popped.name}".`);
      try {
        await fetch('/api/inventory/pop', { method: 'POST' });
      } catch {
        // sync handled locally
      }
    }
    return popped;
  };

  const updateInventory = async (id: string, updates: Partial<InventoryItem>): Promise<boolean> => {
    const success = localStack.update(
      (item) => item.id === id,
      (item) => ({ ...item, ...updates })
    );
    syncInventoryState();
    if (success) {
      addToast('success', 'Stack Update Complete', 'Modified item via auxiliary stack unwind & rewind.');
      try {
        await fetch('/api/inventory/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, updates })
        });
      } catch {
        // sync handled
      }
    }
    return success;
  };

  const deleteInventory = async (id: string): Promise<boolean> => {
    const deleted = localStack.deleteWhere((item) => item.id === id);
    syncInventoryState();
    if (deleted) {
      addToast('info', 'Item Removed', `Removed "${deleted.name}" using stack unwind.`);
      try {
        await fetch('/api/inventory/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
      } catch {
        // sync handled
      }
      return true;
    }
    return false;
  };

  const savePlayer = (player: Player) => {
    const exists = players.some((p) => p.id === player.id);
    if (exists) {
      setPlayers((prev) => prev.map((p) => (p.id === player.id ? player : p)));
      addToast('success', 'Player Profile Updated', `Updated stats for ${player.name}`);
    } else {
      setPlayers((prev) => [player, ...prev]);
      addToast('success', 'Player Registered', `Added ${player.name} to roster.`);
    }
  };

  return (
    <CricketContext.Provider
      value={{
        activeRole,
        setActiveRole,
        currentView,
        setCurrentView,
        theme,
        setTheme,
        toggleTheme,
        tournaments,
        selectedTournamentId,
        setSelectedTournamentId,
        activeTournament,
        matches,
        activeMatchId,
        setActiveMatchId,
        activeMatch,
        players,
        teams,
        drsReview,
        setDrsReview,
        executeDrsDecision,
        jumbotronMode,
        setJumbotronMode,
        pitchAssessments,
        groundFeatures,
        cricketRules,
        inventoryItems,
        inventoryLogs,
        inventorySize,
        inventoryCapacity: localStack.getCapacity(),
        inventoryPeek: localStack.peek(),
        soundEnabled,
        setSoundEnabled,
        toasts,
        addToast,
        removeToast,
        scoreBall,
        undoBall,
        pushInventory,
        popInventory,
        updateInventory,
        deleteInventory,
        savePlayer,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        aiModalData,
        openAiModal,
        closeAiModal,
        isLabReportOpen,
        setIsLabReportOpen
      }}
    >
      {children}
    </CricketContext.Provider>
  );
};

export const useCricket = () => {
  const context = useContext(CricketContext);
  if (!context) throw new Error('useCricket must be used within CricketProvider');
  return context;
};
