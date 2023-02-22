import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { distinctUntilChanged, debounceTime } from 'rxjs';
import { Task } from 'src/app/domain';

@Component({
  selector: 'task',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- ngClass="{'opacity-50 scale-110 cursor-grabbing': !isDragging, 'cursor-grab scale-100': isDragging}" -->
    <div
      [draggable]="true"
      (dragstart)="onDragStart($event)"
      (dragend)="onDragEnd($event)"
      class="flex flex-col space-y-2 w-full h-36 p-1 rounded-lg border border-gray-200 bg-white cursor-grab transform ease-in-out duration-100 focus-within:ring-4 focus-within:ring-purple-200"
    >
      <textarea
        [id]="task.id"
        [formControl]="contentCtrl"
        name="content"
        cols="30"
        rows="10"
        class="text-xs w-full h-full outline-none bg-transparent border-none focus:ring-0 md:text-sm"
      ></textarea>
      <div class="flex flex-row space-x-1 items-center justify-between">
        <div
          [title]="task.updatedAt | date : 'medium'"
          class="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded-full text-xs"
        >
          {{ task.updatedAt | date : 'shortTime' }} &bull;
          {{ task.updatedAt | date : 'shortDate' }}
        </div>
        <button
          (click)="onDelete()"
          class="btn-scaling flex justify-center items-center p-0.5 w-4 h-4 rounded-md hover:bg-red-200 hover:text-red-700 focus:bg-red-200 focus:text-red-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="3"
            stroke="currentColor"
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
  `,
})
export class TaskComponent implements OnInit, OnChanges {
  @Input() task!: Task;

  @Output() updateContent = new EventEmitter<{
    columnId: string;
    taskId: string;
    content: string;
  }>();
  @Output() delete = new EventEmitter<{
    taskId: string;
    columnId: string;
  }>();

  contentCtrl = new FormControl('', [
    Validators.required,
    Validators.maxLength(250),
  ]);

  isDragging = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['task']) {
      this.contentCtrl.setValue(changes['task'].currentValue.content);
    }
  }

  ngOnInit() {
    this.contentCtrl.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe({
        next: (value) => {
          if (this.contentCtrl.valid && value !== null && value !== '') {
            this.updateContent.emit({
              columnId: this.task.columnId,
              taskId: this.task.id,
              content: value,
            });
          }
        },
      });
  }

  onDragStart(event: DragEvent) {
    this.isDragging = true;
    if (!event.dataTransfer) {
      return;
    }
    event.dataTransfer.setData('taskId', this.task.id);
    event.dataTransfer.setData('columnId', this.task.columnId);
    event.dataTransfer.effectAllowed = 'move';
  }

  onDragEnd(event: DragEvent) {
    this.isDragging = false;
  }

  onDelete() {
    this.delete.emit({
      taskId: this.task.id,
      columnId: this.task.columnId,
    });
  }
}
