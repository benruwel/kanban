import { distinctUntilChanged, debounceTime } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { Column } from '../../domain/kanban';

@Component({
  selector: 'column',
  template: `
    <article
      class="relative max-h-full w-72 border border-gray-200 bg-gray-100 rounded-xl overflow-y-scroll"
    >
      <div
        class="sticky top-0 left-0 z-20 flex flex-row space-x-1 items-start justify-between w-full py-2 px-2 bg-gray-100 bg-opacity-95"
      >
        <input
          [formControl]="columnTitleCtrl"
          [id]="column.id"
          type="text"
          name="column-title"
          placeholder="Column Title"
          class="m-0 text-sm font-medium md:text-base outline-none bg-transparent border-none rounded-md hover:outline hover:outline-purple-300 focus:outline-purple-300 focus:ring-1 focus:ring-purple-200"
        />
        <div class="flex-shrink-0 flex flex-row space-x-2">
          <button
            (click)="addTask.emit(column.id)"
            class="btn-scaling flex justify-center items-center p-1 w-6 h-6 bg-gray-200 rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="3"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
          <button
            (click)="delete.emit(column.id)"
            class="btn-scaling flex justify-center items-center p-1 w-6 h-6 bg-red-200 text-red-700 rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="3"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <div class="flex flex-col space-y-2 p-2 overflow-y-auto">
        <ng-container *ngIf="!column.tasks.length">
          <div class="p-4 w-full rounded-lg bg-gray-200 border border-gray-300">
            <p class="text-sm text-gray-500">
              Get started by creating a new task
            </p>
          </div>
        </ng-container>
        <ng-container *ngIf="column.tasks.length">
          <ng-container *ngFor="let task of column.tasks">
            <task
              [task]="task"
              (updateContent)="updateTaskContent.emit($event)"
              (delete)="deleteTask.emit($event)"
            ></task>
          </ng-container>
        </ng-container>
      </div>
    </article>
  `,
})
export class ColumnComponent implements OnInit {
  @Input() column!: Column;
  @Output() delete = new EventEmitter<string>();
  @Output() updateColumnTitle = new EventEmitter<string>();

  @Output() addTask = new EventEmitter<string>();
  @Output() updateTaskContent = new EventEmitter<{
    taskId: string;
    content: string;
    columnId: string;
  }>();
  @Output() deleteTask = new EventEmitter<{
    taskId: string;
    columnId: string;
  }>();

  columnTitleCtrl = new FormControl('', [
    Validators.required,
    Validators.maxLength(20),
  ]);

  ngOnInit() {
    this.columnTitleCtrl.setValue(this.column.title);
    this.columnTitleCtrl.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(2000))
      .subscribe({
        next: (value) => {
          if (value !== '' && value !== null && value !== this.column.title) {
            this.updateColumnTitle.emit(value);
          }
        },
      });
  }
}
