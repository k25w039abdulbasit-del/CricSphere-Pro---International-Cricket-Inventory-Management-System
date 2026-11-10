/**
 * CricSphere Pro - Academic Open Ended Lab Report Modal
 * Fully compliant with Mehran University of Engineering & Technology (MUET)
 * Course: SW 212 - Data Structure & Algorithms (Batch K25SW)
 * Instructor: Engr. Asmatullah Zubair · Group B: Stack Inventory System
 */

import React, { useState } from 'react';
import { useCricket } from '../../context/CricketContext';
import { FileText, X, Printer, CheckCircle, Copy, Award, BookOpen } from 'lucide-react';

export const AcademicReportModal: React.FC = () => {
  const { isLabReportOpen, setIsLabReportOpen, inventorySize, inventoryCapacity, inventoryItems } = useCricket();
  const [copied, setCopied] = useState(false);

  if (!isLabReportOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    const reportText = `================================================================================
DEPARTMENT OF SOFTWARE ENGINEERING
MEHRAN UNIVERSITY OF ENGINEERING AND TECHNOLOGY
Shaheed Zulfiqar Ali Bhutto Campus, Khairpur Mir's
================================================================================
Course: SW 212 - Data Structures & Algorithms
Batch: K25SW (2nd Year, 3rd Semester)
Student Name: Abdul Basit
Roll Number: 25SW039 (K25SW-039)
Instructor: Engr. Asmatullah Zubair
Due Date: 11 November 2026
Assessment Weightage: 10 Marks (Cognitive Level: C3 / C4 | PLO 1 & PLO 2)
Lab Assignment: Open Ended Lab (OEL) - Group B: Stack Data Structure

================================================================================
PROJECT TITLE:
CRICSPHERE PRO — INTERNATIONAL CRICKET MANAGEMENT SYSTEM & 
LIFO STACK EQUIPMENT INVENTORY REPOSITORY
================================================================================

1. EXECUTIVE SUMMARY & PROBLEM STATEMENT:
This Open Ended Lab project addresses two challenging software engineering domains:
a) Designing and implementing a memory-efficient, hardware-simulated Last-In-First-Out 
   (LIFO) Stack Data Structure to manage high-value international cricket equipment 
   (Kookaburra Turf Balls, Masuri Helmets, English Willow Bats, Zing Stumps) strictly 
   adhering to FIFO/LIFO stack invariants.
b) Integrating this data structure into an ICC-grade International Cricket Management 
   System supporting ODI & T20 World Cups, 11 international national squads, 
   transactional live ball-by-ball scoring, DRS Hawk-Eye reviews, and stadium LCD broadcasts.

2. SYSTEM CHOSEN:
International Cricket Equipment Vault & Live Scoring Transaction Engine.
- Vault Capacity: 10 Batches (Fixed contiguous memory array representation).
- Top Pointer (topPtr): Tracks the index of the topmost active equipment element.
- Overflow Protection: Blocks pushes when topPtr == capacity - 1.
- Underflow Protection: Blocks pops when topPtr == -1.

3. CRUD OPERATIONS IMPLEMENTATION VIA STACK DISCIPLINE:
- CREATE (Push): Inserts new equipment batch onto the Top of the Stack in O(1) time complexity.
- READ (Peek & Traverse): Inspects the topmost batch in O(1) time without state mutation.
  Deep traversal calculates linear depth from topPtr.
- UPDATE (Auxiliary Stack Unwinding): To update an element at depth K without violating 
  LIFO integrity, elements are popped onto a temporary stack, the target is modified, and 
  all items are rewound onto the primary stack in O(N) time and O(N) space.
- DELETE (Pop): Removes and dispatches the most recently stocked batch from the top in O(1).

4. TIME & SPACE COMPLEXITY ANALYSIS:
+-------------------+-----------------+------------------+---------------------+
| Operation         | Time Complexity | Space Complexity | Stack Invariant     |
+-------------------+-----------------+------------------+---------------------+
| push(item)        | O(1)            | O(1)             | topPtr increments   |
| pop()             | O(1)            | O(1)             | topPtr decrements   |
| peek()            | O(1)            | O(1)             | topPtr unchanged    |
| isEmpty()/isFull()| O(1)            | O(1)             | Pure comparison     |
| search(query)     | O(N)            | O(1)             | Non-destructive read|
| updateAuxiliary() | O(N)            | O(N)             | LIFO Restored       |
+-------------------+-----------------+------------------+---------------------+

5. ATOMIC TRANSACTION IN LIVE MATCH SCORING (STACK POP UNDO):
Cricket scoring demands transactional atomicity: when a wicket or boundary is entered, 
dismissal details and score tallies must commit together. If an umpire's call is overturned 
or a scorer makes a typo, a stack POP operation pops the last ball event from the ballStack 
and atomically reverses the batter runs, bowler figures, extras, and wickets.

6. CONCLUSION:
The system satisfies all rubrics of the MUET SW 212 Open Ended Lab for Group B (Stack), 
demonstrating practical real-world mastery over LIFO operations, algorithm complexities, 
and full-stack software architecture.
================================================================================`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 md:p-8 max-h-[90vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5 text-blue-600 dark:text-blue-400 font-bold text-sm">
            <BookOpen className="w-5 h-5" />
            <span>MUET Department of Software Engineering · SW 212 OEL Report</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold hover:bg-slate-100 flex items-center gap-1.5 text-slate-700 dark:text-slate-300"
            >
              {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={() => setIsLabReportOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Report Content Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-6 text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-sans pr-2">
          {/* Institutional Header Banner */}
          <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 text-center space-y-1">
            <div className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              Department of Software Engineering
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
              Mehran University of Engineering and Technology, Shaheed Zulfiqar Ali Bhutto Campus, Khairpur Mir's
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-blue-100 dark:border-blue-900/40 grid grid-cols-2 md:grid-cols-3 gap-2 text-left mt-2">
              <div><strong>Student Name:</strong> Abdul Basit</div>
              <div><strong>Roll Number:</strong> 25SW039 (K25SW)</div>
              <div><strong>Instructor:</strong> Engr. Asmatullah Zubair</div>
              <div><strong>Course:</strong> SW 212 - DSA</div>
              <div><strong>Batch:</strong> K25SW (3rd Semester)</div>
              <div><strong>Lab Assignment:</strong> OEL Group B (Stack)</div>
            </div>
          </div>

          {/* Section 1: Objective & Rubrics Alignment */}
          <div>
            <h4 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wide border-b pb-1.5 border-slate-200 dark:border-slate-800">
              1. Task Objective &amp; Learning Outcomes
            </h4>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              The goal of this Open Ended Lab (OEL) is to apply core principles of <strong>Data Structures and Algorithms</strong> to solve a real-world inventory management problem using the assigned data structure for <strong>Group B: Stack (LIFO Discipline)</strong>.
            </p>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border">
                <strong>CLO 1 (Cognitive C3, PLO 1):</strong> Demonstrate Stack operations (push, pop, peek, memory pointer).
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border">
                <strong>CLO 2 (Cognitive C4, PLO 2):</strong> Examine algorithmic time/space complexities: O(1) push/pop vs O(n) search/update.
              </div>
            </div>
          </div>

          {/* Section 2: Chosen System */}
          <div>
            <h4 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wide border-b pb-1.5 border-slate-200 dark:border-slate-800">
              2. Chosen System: International Cricket Equipment Inventory
            </h4>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Our project, <strong>CricSphere Pro</strong>, models the official ICC World Cup Equipment Vault. Equipment items (Kookaburra White Balls, Red Duke Balls, English Willow Bats, Masuri Titanium Helmets, and Zing LED Stumps) are stored in stacked batches. The referee and teams always dispatch or draw the most recently approved gear from the <strong>Top of the Stack (TOS)</strong>, strictly satisfying LIFO mechanics.
            </p>
            <div className="mt-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 text-[11px]">
              <strong>Live Stack Status:</strong> Current size: <strong>{inventorySize}</strong> elements / Capacity: <strong>{inventoryCapacity}</strong>. Top of stack: <strong>"{inventoryItems[0]?.name || 'N/A'}"</strong>.
            </div>
          </div>

          {/* Section 3: CRUD Implementation via Stack */}
          <div>
            <h4 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wide border-b pb-1.5 border-slate-200 dark:border-slate-800">
              3. CRUD Operations via Stack Mechanics
            </h4>
            <div className="mt-2 space-y-2 text-[11px]">
              <div className="p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-800">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">CREATE (Push):</span> Adds new cricket gear batch onto TOS. Checks for <code>isFull()</code> to prevent Stack Overflow. <em>Time Complexity: O(1)</em>.
              </div>

              <div className="p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-800">
                <span className="font-bold text-blue-600 dark:text-blue-400">READ (Peek &amp; Traverse):</span> Returns the element at the top using <code>peek()</code> in O(1) time without mutating stack state. A search algorithm traverses from TOS computing depth from the stack pointer.
              </div>

              <div className="p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-800">
                <span className="font-bold text-amber-600 dark:text-amber-400">UPDATE (Stack-Preserving Aux Stack):</span> To modify an item deeper in the stack without breaking LIFO integrity, elements are popped into an auxiliary stack (<code>tempStack</code>) until the target is reached, updated, and then all items are popped back into the main stack. <em>Time Complexity: O(N), Space: O(N)</em>.
              </div>

              <div className="p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-800">
                <span className="font-bold text-red-600 dark:text-red-400">DELETE (Pop):</span> Dispatches and removes the topmost equipment batch. Checks for <code>isEmpty()</code> to prevent Stack Underflow. <em>Time Complexity: O(1)</em>.
              </div>
            </div>
          </div>

          {/* Section 4: Live Scoring Transactional Stack */}
          <div>
            <h4 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wide border-b pb-1.5 border-slate-200 dark:border-slate-800">
              4. Application in Live Match Transactional Undo
            </h4>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              In addition to physical equipment inventory, the application implements a <strong>Ball Event Transaction Stack</strong> for live scoring. Every scored ball is pushed to the stack. If a scorer makes a mistake or needs to roll back a dismissal, executing <code>undoBall()</code> pops the latest ball from the stack and atomically reverses striker runs, bowler figures, extras, and wicket counts simultaneously.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Mehran University of Engineering and Technology · SW 212 OEL</span>
          <button
            onClick={() => setIsLabReportOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
