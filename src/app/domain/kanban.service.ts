import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { nanoid } from 'nanoid';

import { KanbanRepository } from './kanban.repository';
import { Column, Task } from './kanban';

@Injectable({ providedIn: 'root' })
export class KanbanService {
  private title = new BehaviorSubject<string | null>(null);
  title$ = this.title.asObservable();

  private columns = new BehaviorSubject<Array<Column>>([]);
  columns$ = this.columns.asObservable();

  repository = inject(KanbanRepository);

  init() {
    const columns = this.repository.getColumns();
    if (columns.length) {
      const sortedColumns = this.sort(columns) as Array<Column>;
      this.columns.next(sortedColumns);
    } else {
      this.columns.next(columns);
    }
    const title = this.repository.getTitle();
    this.title.next(title);
    return {
      columns,
      title,
    };
  }

  updateBoardTitle(title: string) {
    this.repository.updateBoardTitle(title);
    this.title.next(title);
  }

  createColumn() {
    const columns = this.repository.createColumn(
      this.columns.getValue().length
    );
    this.columns.next(columns);
  }

  updateColumnTitle(newTitle: string, columnId: string) {
    const columns = this.columns.getValue();
    const index = columns.findIndex((c) => c.id === columnId);
    if (index === -1) {
      return;
    }
    const subjColumn = columns[index];
    subjColumn.title = newTitle;
    subjColumn.updatedAt = new Date();
    const updatedColumns = this.repository.updateColumn(subjColumn);
    this.columns.next(this.sort(updatedColumns) as Array<Column>);
  }

  deleteColumn(columnId: string) {
    const columns = this.columns.getValue();
    const index = columns.findIndex((c) => c.id === columnId);
    if (index === -1) {
      return;
    }
    const updatedColumns = this.repository.deleteColumn(columnId);
    this.columns.next(this.sort(updatedColumns) as Array<Column>);
  }

  createTask(columnId: string) {
    const columns = this.columns.getValue();
    const index = columns.findIndex((c) => c.id === columnId);
    if (index === -1) {
      return;
    }
    const subjColumn = columns[index];
    const newTaskId = nanoid(10);
    const newTask: Task = {
      id: newTaskId,
      columnId,
      position: subjColumn.tasks.length,
      content: 'New Task',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    subjColumn.tasks.push(newTask);
    const updatedColumns = this.repository.updateColumn(subjColumn);
    this.columns.next(this.sort(updatedColumns) as Array<Column>);
  }

  updateTaskContent(columnId: string, taskId: string, content: string) {
    const columns = this.columns.getValue();
    const index = columns.findIndex((c) => c.id === columnId);
    if (index === -1) {
      return;
    }
    const subjColumn = columns[index];
    const taskIndex = subjColumn.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
      return;
    }
    const subjTask = subjColumn.tasks[taskIndex];
    const newTask: Task = {
      ...subjTask,
      content,
      updatedAt: new Date(),
    };

    subjColumn.tasks[taskIndex] = newTask;
    const updatedColumns = this.repository.updateColumn(subjColumn);
    this.columns.next(this.sort(updatedColumns) as Array<Column>);
  }

  deleteTask(columnId: string, taskId: string) {
    const columns = this.columns.getValue();
    const index = columns.findIndex((c) => c.id === columnId);
    if (index === -1) {
      return;
    }
    const subjColumn = columns[index];
    subjColumn.tasks = subjColumn.tasks.filter((task) => task.id !== taskId);
    const updatedColumns = this.repository.updateColumn(subjColumn);
    this.columns.next(this.sort(updatedColumns) as Array<Column>);
  }

  private sort(list: Column[] | Task[]): Array<Column> | Array<Task> {
    return list.sort((a, b) => a.position - b.position);
  }
}
