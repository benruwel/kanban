import { Component, DestroyRef, inject, input, OnInit, output } from "@angular/core";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgForOf, NgIf } from "@angular/common";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { debounceTime, distinctUntilChanged } from "rxjs";

import { Column } from "../../domain";
import { TaskComponent } from "./task.component";

@Component({
  selector: "column",
  standalone: true,
  template: `
    <article
      [id]="column().id"
      (drop)="onDrop($event)"
      (dragover)="onDragOver($event)"
      class="relative max-h-full w-72 border border-gray-200 bg-gray-100 rounded-xl overflow-y-scroll"
    >
      <div
        class="sticky top-0 left-0 z-20 flex flex-row space-x-1 items-start justify-between w-full py-2 px-2 bg-gray-100 bg-opacity-95"
      >
        <input
          [formControl]="columnTitleCtrl"
          [id]="column().id"
          type="text"
          name="column-title"
          placeholder="Column Title"
          class="m-0 text-sm font-medium md:text-base outline-none bg-transparent border-none rounded-md hover:outline hover:outline-purple-300 focus:outline-purple-300 focus:ring-1 focus:ring-purple-200"
        />
        <div class="flex-shrink-0 flex flex-row space-x-2">
          <button
            (click)="addTask.emit(column().id)"
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
            (click)="delete.emit(column().id)"
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
          @for(task of column().tasks; track task.id) {
            <task
              [task]="task"
              (updateContent)="updateTaskContent.emit($event)"
              (delete)="deleteTask.emit($event)"
            ></task>
          } @empty {
            <div class="p-4 w-full rounded-lg bg-gray-200 border border-gray-300">
              <p class="text-sm text-gray-500">
                Get started by creating a new task
              </p>
            </div>
          }
      </div>
    </article>
  `,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    TaskComponent
  ]
})
export class ColumnComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  column = input.required<Column>();

  delete = output<string>();
  updateColumnTitle = output<string>();

  addTask = output<string>();
  moveTask = output<{
    taskId: string;
    fromColumnId: string;
    toColumnId: string;
  }>();
  updateTaskContent = output<{
    taskId: string;
    content: string;
    columnId: string;
  }>()
  deleteTask = output<{
    taskId: string;
    columnId: string;
  }>();

  columnTitleCtrl = new FormControl('', [
    Validators.required,
    Validators.maxLength(20),
  ]);

  ngOnInit() {
    this.columnTitleCtrl.setValue(this.column().title);
    this.columnTitleCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef),debounceTime(1000), distinctUntilChanged())
      .subscribe({
        next: (value) => {
          if (value !== '' && value !== null && value !== this.column().title) {
            this.updateColumnTitle.emit(value);
          }
        },
      });
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (!event.dataTransfer) {
      return;
    }
    const taskId = event.dataTransfer.getData('taskId');
    const columnId = event.dataTransfer.getData('columnId');
    this.moveTask.emit({
      taskId: taskId,
      fromColumnId: columnId,
      toColumnId: this.column().id,
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    if (!event.dataTransfer) {
      return;
    }
    event.dataTransfer.dropEffect = 'move';
  }
}
