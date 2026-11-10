/**
 * CricketStack<T> - Data Structure Implementation
 * Course: SW 212 - Data Structures & Algorithms
 * Open Ended Lab: Implement Data Structure in Inventory Management System (Group B: Stack)
 * 
 * Demonstrates:
 * - LIFO (Last-In-First-Out) stack discipline
 * - Time Complexity: O(1) for Push, Pop, Peek, IsEmpty
 * - O(N) for Search and Stack-preserving Update using an auxiliary stack
 * - Memory simulation with Stack Pointer (TOP)
 */

import { StackOperationLog } from '../types/cricket';

export interface StackMemoryFrame<T> {
  memoryAddress: string;
  slotIndex: number;
  isTop: boolean;
  data: T;
}

export class CricketStack<T extends { id: string; name?: string; sku?: string }> {
  private items: T[] = [];
  private readonly maxCapacity: number;
  private operationLogs: StackOperationLog[] = [];

  constructor(maxCapacity: number = 50, initialItems: T[] = []) {
    this.maxCapacity = maxCapacity;
    if (initialItems.length > 0) {
      this.items = [...initialItems];
    }
  }

  /**
   * PUSH: Adds a new item to the top of the stack
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  public push(item: T): boolean {
    if (this.isFull()) {
      this.logOperation('PUSH', item, `Stack Overflow! Cannot push item. Max capacity (${this.maxCapacity}) reached.`, 'O(1)');
      return false;
    }

    this.items.push(item);
    this.logOperation(
      'PUSH', 
      item, 
      `Pushed "${item.name || item.id}" to TOP of stack (Index: ${this.items.length - 1}).`,
      'O(1)'
    );
    return true;
  }

  /**
   * POP: Removes and returns the item from the top of the stack
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  public pop(): T | undefined {
    if (this.isEmpty()) {
      this.logOperation('POP', undefined, 'Stack Underflow! Attempted to pop from empty stack.', 'O(1)');
      return undefined;
    }

    const popped = this.items.pop();
    if (popped) {
      this.logOperation(
        'POP', 
        popped, 
        `Popped "${popped.name || popped.id}" from TOP of stack. New TOP at Index ${this.items.length - 1}.`,
        'O(1)'
      );
    }
    return popped;
  }

  /**
   * PEEK: Returns the top element without removing it
   * Time Complexity: O(1)
   */
  public peek(): T | undefined {
    if (this.isEmpty()) return undefined;
    return this.items[this.items.length - 1];
  }

  /**
   * IS_EMPTY: Checks if stack has zero elements
   * Time Complexity: O(1)
   */
  public isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * IS_FULL: Checks if stack reached capacity
   * Time Complexity: O(1)
   */
  public isFull(): boolean {
    return this.items.length >= this.maxCapacity;
  }

  /**
   * SIZE: Returns current element count
   * Time Complexity: O(1)
   */
  public size(): number {
    return this.items.length;
  }

  public getCapacity(): number {
    return this.maxCapacity;
  }

  /**
   * SEARCH: Finds an item and reports its depth from TOP
   * Time Complexity: O(N)
   */
  public search(predicate: (item: T) => boolean): { found: boolean; depthFromTop: number; item?: T } {
    for (let i = this.items.length - 1; i >= 0; i--) {
      if (predicate(this.items[i])) {
        const depth = (this.items.length - 1) - i;
        this.logOperation(
          'SEARCH', 
          this.items[i], 
          `Search found "${this.items[i].name || this.items[i].id}" at depth ${depth} below TOP.`,
          'O(N)'
        );
        return { found: true, depthFromTop: depth, item: this.items[i] };
      }
    }
    return { found: false, depthFromTop: -1 };
  }

  /**
   * UPDATE (STACK-PRESERVING ALGORITHM):
   * Modifies an existing item while strictly respecting stack invariants
   * Algorithm:
   * 1. Create an auxiliary temporary stack (TempStack).
   * 2. Pop elements from main stack into TempStack until target is at TOP.
   * 3. Pop target, apply updater function, and push updated item back.
   * 4. Pop elements from TempStack and push them back into main stack.
   * 
   * Time Complexity: O(N)
   * Space Complexity: O(N) auxiliary stack
   */
  public update(predicate: (item: T) => boolean, updater: (item: T) => T): boolean {
    const tempStack: T[] = [];
    let updated = false;
    let targetItem: T | undefined;

    // Phase 1: Unwind stack to find target
    while (!this.isEmpty()) {
      const top = this.items.pop()!;
      if (!updated && predicate(top)) {
        const modified = updater(top);
        targetItem = modified;
        tempStack.push(modified);
        updated = true;
        break;
      } else {
        tempStack.push(top);
      }
    }

    // Phase 2: Rewind stack back to original order
    while (tempStack.length > 0) {
      this.items.push(tempStack.pop()!);
    }

    if (updated && targetItem) {
      this.logOperation(
        'UPDATE', 
        targetItem, 
        `Updated item "${targetItem.name || targetItem.id}" via auxiliary stack unwind & rewind.`,
        'O(N)'
      );
    }
    return updated;
  }

  /**
   * DELETE WHERE (STACK-PRESERVING ALGORITHM):
   * Deletes a specific item in the stack by unwinding to auxiliary stack and skipping the target.
   */
  public deleteWhere(predicate: (item: T) => boolean): T | undefined {
    const tempStack: T[] = [];
    let deletedItem: T | undefined;

    while (!this.isEmpty()) {
      const top = this.items.pop()!;
      if (!deletedItem && predicate(top)) {
        deletedItem = top;
        break; // skip pushing to tempStack
      } else {
        tempStack.push(top);
      }
    }

    while (tempStack.length > 0) {
      this.items.push(tempStack.pop()!);
    }

    if (deletedItem) {
      this.logOperation(
        'POP', 
        deletedItem, 
        `Deleted item "${deletedItem.name || deletedItem.id}" from stack depth.`,
        'O(N)'
      );
    }
    return deletedItem;
  }

  /**
   * Returns copy of stack items from TOP to BOTTOM (LIFO order)
   */
  public toArray(): T[] {
    return [...this.items].reverse();
  }

  /**
   * Returns items in raw storage order (bottom to top, index 0 to size-1)
   */
  public getRawStorage(): T[] {
    return [...this.items];
  }

  /**
   * Clears stack
   */
  public clear(): void {
    this.items = [];
    this.logOperation('CLEAR', undefined, 'Stack cleared. All frames deallocated.', 'O(1)');
  }

  public getOperationLogs(): StackOperationLog[] {
    return [...this.operationLogs].reverse();
  }

  /**
   * Simulates hardware memory addresses for academic lab visualization
   */
  public getMemoryFrames(): StackMemoryFrame<T>[] {
    const baseAddress = 0x7FFE00;
    return this.items.map((item, index) => {
      const hexAddr = '0x' + (baseAddress + index * 16).toString(16).toUpperCase();
      return {
        memoryAddress: hexAddr,
        slotIndex: index,
        isTop: index === this.items.length - 1,
        data: item
      };
    }).reverse(); // Display TOP at first row
  }

  private logOperation(
    operation: 'PUSH' | 'POP' | 'PEEK' | 'UPDATE' | 'SEARCH' | 'CLEAR',
    itemSnapshot?: any,
    description: string = '',
    timeComplexity: string = 'O(1)'
  ) {
    const log: StackOperationLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      operation,
      targetSku: itemSnapshot?.sku,
      itemSnapshot: itemSnapshot ? { ...itemSnapshot } : undefined,
      description,
      timestamp: new Date().toLocaleTimeString(),
      stackSizeAfter: this.items.length,
      timeComplexity
    };
    this.operationLogs.push(log);
    if (this.operationLogs.length > 60) {
      this.operationLogs.shift();
    }
  }
}
