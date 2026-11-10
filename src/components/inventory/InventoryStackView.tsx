/**
 * CricSphere Pro - Equipment Stack Inventory (Open Ended Lab SW 212)
 * Group B: Use a Stack to manage the inventory (MUET Department of Software Engineering)
 * Visualizes LIFO Stack mechanics, memory blocks, pointer TOP, and CRUD operations.
 */

import React, { useState } from 'react';
import { useCricket } from '../../context/CricketContext';
import { 
  Layers, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  Search, 
  Edit3, 
  Trash2, 
  FileCode2, 
  Info, 
  Check, 
  Terminal,
  Cpu,
  PackagePlus,
  RefreshCw
} from 'lucide-react';
import { EquipmentCategory, InventoryItem, QualityGrade } from '../../types/cricket';

export const InventoryStackView: React.FC = () => {
  const { 
    inventoryItems, 
    inventoryLogs, 
    inventorySize, 
    inventoryCapacity, 
    inventoryPeek, 
    pushInventory, 
    popInventory, 
    updateInventory, 
    deleteInventory, 
    activeRole,
    setIsLabReportOpen
  } = useCricket();

  const [activeTab, setActiveTab] = useState<'visualizer' | 'crud-table' | 'algorithm' | 'logs'>('visualizer');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPushModalOpen, setIsPushModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<InventoryItem | null>(null);

  // New item form state for PUSH
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<EquipmentCategory>('Cricket Balls');
  const [newItemGrade, setNewItemGrade] = useState<QualityGrade>('Grade 1 International');
  const [newItemBrand, setNewItemBrand] = useState('Kookaburra');
  const [newItemQty, setNewItemQty] = useState(12);
  const [newItemCost, setNewItemCost] = useState(150);
  const [newItemLocation, setNewItemLocation] = useState('Pavilion Equipment Locker 1');
  const [newItemNotes, setNewItemNotes] = useState('');

  // Stack Search State
  const [searchResult, setSearchResult] = useState<{ found: boolean; depth?: number; item?: InventoryItem } | null>(null);

  const handlePushSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    await pushInventory({
      name: newItemName,
      category: newItemCategory,
      grade: newItemGrade,
      brand: newItemBrand,
      quantity: newItemQty,
      unitCost: newItemCost,
      location: newItemLocation,
      notes: newItemNotes
    });

    setIsPushModalOpen(false);
    setNewItemName('');
    setNewItemNotes('');
  };

  const handlePop = async () => {
    await popInventory();
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResult(null);
      return;
    }
    const q = searchQuery.toLowerCase();
    const idx = inventoryItems.findIndex((it) => it.name.toLowerCase().includes(q) || it.sku.toLowerCase().includes(q));
    if (idx !== -1) {
      setSearchResult({
        found: true,
        depth: idx, // index from top (0 = TOP)
        item: inventoryItems[idx]
      });
    } else {
      setSearchResult({ found: false });
    }
  };

  const openEdit = (item: InventoryItem) => {
    setItemToEdit(item);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemToEdit) return;

    await updateInventory(itemToEdit.id, {
      name: itemToEdit.name,
      quantity: itemToEdit.quantity,
      location: itemToEdit.location,
      notes: itemToEdit.notes
    });
    setIsEditModalOpen(false);
  };

  const isClubAdmin = activeRole === 'Club Admin' || activeRole === 'Super Admin';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner with Course Rubrics metadata */}
      <div className="p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
            <Layers className="w-4 h-4" />
            <span>MUET SW 212 DSA · Open Ended Lab (Group B: Stack)</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500 dark:text-slate-400">Instructor: Engr. Asmatullah Zubair</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Stack Data Structure Inventory Engine
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manages international cricket equipment using Last-In-First-Out (LIFO) stack discipline, auxiliary unwind-rewind updates, and hardware memory simulation.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsLabReportOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors flex items-center gap-1.5"
          >
            <FileCode2 className="w-4 h-4" />
            <span>OEL Lab Report</span>
          </button>

          <button
            onClick={() => setIsPushModalOpen(true)}
            disabled={!isClubAdmin || inventorySize >= inventoryCapacity}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <ArrowUp className="w-4 h-4" />
            <span>Push Equipment (Create)</span>
          </button>

          <button
            onClick={handlePop}
            disabled={!isClubAdmin || inventorySize === 0}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <ArrowDown className="w-4 h-4" />
            <span>Pop Equipment (Dispatch)</span>
          </button>
        </div>
      </div>

      {/* DSA Complexity & Metrics HUD */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Stack Size / Capacity</div>
          <div className="text-xl font-black text-slate-900 dark:text-white tabular-nums mt-0.5">
            {inventorySize} <span className="text-xs font-normal text-slate-400">/ {inventoryCapacity}</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-300" 
              style={{ width: `${(inventorySize / inventoryCapacity) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Stack Top (TOS)</div>
          <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 truncate mt-1">
            {inventoryPeek ? inventoryPeek.sku : 'None (Empty)'}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            Pointer: Index {inventorySize > 0 ? inventorySize - 1 : -1}
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Push / Pop Time</div>
          <div className="text-xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
            O(1)
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">
            Constant time access
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Stack-Preserving Update</div>
          <div className="text-xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
            O(N)
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Auxiliary stack rewind
          </div>
        </div>

        <div className="col-span-2 md:col-span-1 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Operations Logged</div>
          <div className="text-xl font-black text-slate-900 dark:text-white tabular-nums mt-0.5">
            {inventoryLogs.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
            Audit trail active
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl w-fit text-xs font-semibold">
        <button
          onClick={() => setActiveTab('visualizer')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'visualizer'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Interactive Stack Visualizer
        </button>
        <button
          onClick={() => setActiveTab('crud-table')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'crud-table'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          CRUD Inventory Ledger ({inventorySize})
        </button>
        <button
          onClick={() => setActiveTab('algorithm')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'algorithm'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Stack Algorithm Code
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'logs'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          LIFO Audit Logs
        </button>
      </div>

      {/* TAB 1: INTERACTIVE STACK VISUALIZER */}
      {activeTab === 'visualizer' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visual Stack Tower (LIFO) */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  LIFO Memory Stack Visualization
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                TOP-OF-STACK [TOS] AT INDEX {inventorySize - 1}
              </span>
            </div>

            {/* Stack Blocks Container */}
            <div className="mt-4 space-y-2.5 max-h-[520px] overflow-y-auto pr-2">
              {inventoryItems.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs">
                  Stack Underflow: The inventory stack is currently empty. Click "Push Equipment" to allocate stack memory.
                </div>
              ) : (
                inventoryItems.map((item, idx) => {
                  const isTop = idx === 0; // index 0 in toArray() is TOP
                  const memoryAddress = `0x7FFE${(0x1000 + (inventoryItems.length - idx) * 0x10).toString(16).toUpperCase()}`;

                  return (
                    <div
                      key={item.id}
                      className={`relative p-3.5 rounded-xl border transition-all ${
                        isTop
                          ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 shadow-md ring-1 ring-emerald-500/30'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50'
                      }`}
                    >
                      {/* Top indicator badge */}
                      {isTop && (
                        <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-emerald-600 text-white font-mono font-bold text-[10px] tracking-wider shadow">
                          ▲ TOP OF STACK (TOS)
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-3 text-xs">
                        <div className="flex items-start gap-3">
                          <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold shrink-0">
                            [{inventoryItems.length - 1 - idx}]
                          </span>

                          <div>
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              <span>{item.name}</span>
                              <span className="text-[10px] text-slate-500 font-mono font-normal">
                                {memoryAddress}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              SKU: <span className="font-mono">{item.sku}</span> · Brand: {item.brand} · Qty: <span className="font-bold text-slate-900 dark:text-white">{item.quantity}</span> units
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              Location: {item.location} · Added: {item.addedAt}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {isTop ? (
                            <button
                              onClick={handlePop}
                              disabled={!isClubAdmin}
                              className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-[11px] font-semibold transition-colors flex items-center gap-1"
                              title="POP item from TOP of stack"
                            >
                              <ArrowDown className="w-3 h-3" />
                              <span>POP</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => openEdit(item)}
                              disabled={!isClubAdmin}
                              className="p-1 rounded text-slate-400 hover:text-emerald-500 transition-colors"
                              title="Update via auxiliary stack"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Stack Base Marker */}
            <div className="mt-4 pt-3 border-t border-dashed border-slate-200 dark:border-slate-800 text-center text-[11px] font-mono text-slate-400">
              ═══════ BASE OF STACK (INDEX 0) ═══════
            </div>
          </div>

          {/* Right Column: Search & Equipment Photo */}
          <div className="space-y-4">
            {/* Equipment Search in Stack */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2">
                Stack Search (Linear Traversal)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                Traverses elements from TOP to compute depth distance below the stack pointer.
              </p>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, SKU, or brand..."
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <button
                  onClick={handleSearch}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shrink-0"
                >
                  Search
                </button>
              </div>

              {searchResult && (
                <div className={`mt-3 p-3 rounded-xl text-xs ${
                  searchResult.found 
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
                }`}>
                  {searchResult.found ? (
                    <div>
                      <div className="font-bold">Item Found in Stack!</div>
                      <div className="mt-0.5 text-[11px]">
                        Depth from TOP: <span className="font-mono font-bold">{searchResult.depth}</span> positions down.
                      </div>
                      <div className="mt-0.5 text-[11px] opacity-80">
                        "{searchResult.item?.name}" (SKU: {searchResult.item?.sku})
                      </div>
                    </div>
                  ) : (
                    <div>Item not found in current stack frames.</div>
                  )}
                </div>
              )}
            </div>

            {/* Equipment Gear Preview Photo */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm bg-slate-900">
              <div className="relative h-44">
                <img
                  src="/src/assets/images/cricket_match_gear_1793767170188.jpg"
                  alt="Cricket Match Gear"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="text-xs font-bold">Grade 1 International Inventory</div>
                  <div className="text-[10px] text-slate-300">
                    Kookaburra Willow, Masuri Titanium, Dukes Test Balls
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CRUD TABLE */}
      {activeTab === 'crud-table' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Full Equipment Stack Ledger (All CRUD Operations)
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Total Stack Depth: {inventorySize}
            </span>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[11px]">
                  <th className="text-left py-2 font-medium">Stack Pos</th>
                  <th className="text-left py-2 font-medium">Item Name &amp; SKU</th>
                  <th className="text-left py-2 font-medium">Category</th>
                  <th className="text-right py-2 font-medium">Qty</th>
                  <th className="text-right py-2 font-medium">Unit Cost</th>
                  <th className="text-left py-2 font-medium">Storage Bay</th>
                  <th className="text-right py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {inventoryItems.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 font-mono text-[11px] text-slate-400">
                      {idx === 0 ? (
                        <span className="text-emerald-500 font-bold">TOP (0)</span>
                      ) : (
                        `Depth ${idx}`
                      )}
                    </td>
                    <td className="py-2.5">
                      <div className="font-semibold text-slate-900 dark:text-white">{item.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.sku}</div>
                    </td>
                    <td className="py-2.5 text-slate-600 dark:text-slate-300">
                      {item.category}
                    </td>
                    <td className="py-2.5 text-right font-bold tabular-nums text-slate-900 dark:text-white">
                      {item.quantity}
                    </td>
                    <td className="py-2.5 text-right font-mono tabular-nums text-slate-600 dark:text-slate-300">
                      ${item.unitCost}
                    </td>
                    <td className="py-2.5 text-slate-500 dark:text-slate-400 text-[11px]">
                      {item.location}
                    </td>
                    <td className="py-2.5 text-right space-x-2">
                      <button
                        onClick={() => openEdit(item)}
                        disabled={!isClubAdmin}
                        className="text-emerald-600 dark:text-emerald-400 hover:underline text-xs"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => deleteInventory(item.id)}
                        disabled={!isClubAdmin}
                        className="text-red-600 dark:text-red-400 hover:underline text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DSA STACK CODE FOR REPORT */}
      {activeTab === 'algorithm' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Stack Implementation Code (SW 212 Lab Submission)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">TypeScript / C++ Equivalent</span>
          </div>

          <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
            <pre>{`/**
 * CricketStack<T> Data Structure Implementation
 * Mehran University of Engineering and Technology (MUET)
 * Course: SW 212 - Data Structures & Algorithms (Group B: Stack)
 */
export class CricketStack<T> {
  private items: T[] = [];
  private readonly maxCapacity: number = 50;

  // 1. PUSH: O(1) Time Complexity
  public push(item: T): boolean {
    if (this.isFull()) return false; // Stack Overflow check
    this.items.push(item);
    return true;
  }

  // 2. POP: O(1) Time Complexity
  public pop(): T | undefined {
    if (this.isEmpty()) return undefined; // Stack Underflow check
    return this.items.pop();
  }

  // 3. PEEK: O(1) Time Complexity
  public peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  // 4. STACK-PRESERVING UPDATE: O(N) Time, O(N) Auxiliary Space
  // Unwinds elements to temporary auxiliary stack, updates target, rewinds back
  public update(predicate: (item: T) => boolean, updater: (item: T) => T): boolean {
    const tempStack: T[] = [];
    let updated = false;

    while (!this.isEmpty()) {
      const top = this.items.pop()!;
      if (!updated && predicate(top)) {
        tempStack.push(updater(top));
        updated = true;
        break;
      } else {
        tempStack.push(top);
      }
    }

    // Rewind back to restore strict LIFO order
    while (tempStack.length > 0) {
      this.items.push(tempStack.pop()!);
    }
    return updated;
  }
}`}</pre>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Stack Transaction Logs &amp; Audit Trail
            </h3>
            <span className="text-xs text-slate-400 font-mono">Last 60 Operations</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 mt-2 max-h-96 overflow-y-auto">
            {inventoryLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono font-bold text-[10px] px-1.5 py-0.5 rounded ${
                      log.operation === 'PUSH'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : log.operation === 'POP'
                        ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                        : log.operation === 'UPDATE'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {log.operation}
                  </span>
                  <div>
                    <div className="text-slate-900 dark:text-white font-medium">
                      {log.description}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Complexity: {log.timeComplexity} · Stack size after: {log.stackSizeAfter}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 font-mono">
                  {log.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PUSH MODAL (Add New Item) */}
      {isPushModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm mb-4">
              <ArrowUp className="w-4 h-4" />
              <span>Push Equipment to Stack (O(1) Operation)</span>
            </div>

            <form onSubmit={handlePushSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Equipment Name *
                </label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Kookaburra Turf White Match Balls"
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Category
                  </label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as EquipmentCategory)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Cricket Balls">Cricket Balls</option>
                    <option value="English Willow Bats">English Willow Bats</option>
                    <option value="Protective Gear">Protective Gear</option>
                    <option value="Wicketkeeping">Wicketkeeping</option>
                    <option value="Pitch & Ground">Pitch & Ground</option>
                    <option value="Training & Technology">Training & Technology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={newItemBrand}
                    onChange={(e) => setNewItemBrand(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Quantity (Units)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Unit Cost ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newItemCost}
                    onChange={(e) => setNewItemCost(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Storage Location / Locker Bay
                </label>
                <input
                  type="text"
                  value={newItemLocation}
                  onChange={(e) => setNewItemLocation(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsPushModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Confirm PUSH (TOS)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL (Update via Auxiliary Stack) */}
      {isEditModalOpen && itemToEdit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-4">
              <RefreshCw className="w-4 h-4" />
              <span>Stack-Preserving Update (Auxiliary Stack)</span>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Equipment Name
                </label>
                <input
                  type="text"
                  value={itemToEdit.name}
                  onChange={(e) => setItemToEdit({ ...itemToEdit, name: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={itemToEdit.quantity}
                  onChange={(e) => setItemToEdit({ ...itemToEdit, quantity: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Storage Location
                </label>
                <input
                  type="text"
                  value={itemToEdit.location}
                  onChange={(e) => setItemToEdit({ ...itemToEdit, location: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
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
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Save &amp; Rewind Stack
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
