import { Injectable } from '@angular/core';
import { nanoid } from 'nanoid';

import { Column, Task } from './kanban';

@Injectable({ providedIn: 'root' })
export class KanbanRepository {
  private readonly KANBAN_KEY = 'kanban';
  private readonly BOARD_TITLE_KEY = 'boardTitle';

  constructor() {
    const kanbanDb = localStorage.getItem(this.KANBAN_KEY);
    if (!kanbanDb) {
      localStorage.setItem(this.KANBAN_KEY, JSON.stringify([]));
    }
    const boardTitle = localStorage.getItem(this.BOARD_TITLE_KEY);
    if (!boardTitle) {
      localStorage.setItem(this.BOARD_TITLE_KEY, 'Untitled Board');
    }
  }

  getTitle(): string {
    return localStorage.getItem(this.BOARD_TITLE_KEY) || 'Untitled Board';
  }

  updateBoardTitle(title: string): string {
    localStorage.setItem(this.BOARD_TITLE_KEY, title);
    return this.getTitle();
  }

  createColumn(position: number): Column[] {
    const id = nanoid(10);
    const newColumn: Column = {
      id,
      title: 'Untitled Column',
      position,
      createdAt: new Date(),
      updatedAt: new Date(),
      tasks: [],
    };
    const allColumns = this.getColumns();
    allColumns.push(newColumn);
    localStorage.setItem(this.KANBAN_KEY, JSON.stringify(allColumns));
    return allColumns;
  }

  getColumns(): Column[] {
    const columns = localStorage.getItem(this.KANBAN_KEY);
    if (!columns) {
      return [];
    }
    try {
      return JSON.parse(columns);
    } catch {
      /*  
          parse error possibly due to corrupted input
          solution: nuke local storage and reset
      */
      localStorage.setItem(this.KANBAN_KEY, JSON.stringify([]));
      return [];
    }
  }

  updateColumn(column: Column): Column[] {
    const allColumns = this.getColumns();
    const index = allColumns.findIndex((c) => c.id === column.id);
    if (index === -1) {
      return allColumns;
    }
    allColumns[index] = column;
    localStorage.setItem(this.KANBAN_KEY, JSON.stringify(allColumns));
    return allColumns;
  }

  deleteColumn(columnId: string): Column[] {
    const allColumns = this.getColumns();
    const newColumns = allColumns.filter((column) => column.id !== columnId);
    localStorage.setItem(this.KANBAN_KEY, JSON.stringify(newColumns));
    return newColumns;
  }

  deleteTask(columnId: string, taskId: string): Column[] {
    const allColumns = this.getColumns();
    const column = allColumns.find((column) => column.id === columnId);
    if (!column) {
      return allColumns;
    }
    const newTasks = column.tasks.filter((task) => task.id !== taskId);
    column.tasks = newTasks;
    localStorage.setItem(this.KANBAN_KEY, JSON.stringify(allColumns));
    return allColumns;
  }
}
