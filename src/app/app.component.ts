import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { debounceTime, distinctUntilChanged } from "rxjs";

import { KanbanService } from "./domain";
import { ColumnComponent } from "./components/column/column.component";

@Component({
  selector: "app-root",
  standalone: true,
  template: `
    <main class="p-4 flex flex-col space-y-4 h-screen overflow-hidden md:p-8">
      <div class="flex flex-row space-x-4 items-center justify-between">
        <div class="flex-1">
          <input
            type="text"
            class="w-full border-none text-2xl rounded-lg font-semibold invalid:outline invalid:outline-red-300 invalid:ring invalid:ring-red-100 md:text-3xl hover:outline hover:outline-purple-300 focus:outline-purple-300 focus:ring-4 focus:ring-purple-100 focus:ring-offset-4"
            placeholder="Untitled Board"
            [formControl]="boardTitleCtrl"
          />
        </div>

        <div class="hidden md:block">
          <button
            (click)="viewModel.createColumn()"
            class="px-6 py-2 rounded-lg bg-black text-white text-sm btn-scaling focus:ring focus:ring-purple-200 focus:ring-offset-4"
          >
            New
          </button>
        </div>
      </div>

      <section
        class="flex-1 flex flex-row space-x-2 p-2 rounded-xl border border-gray-300 border-dashed overflow-x-auto snap-x overflow-y-hidden md:space-x-4 md:p-4"
      >
        <ng-container *ngIf="columns$ | async as columns">
          @for(column of columns; track column.id) {
            <div class="snap-start scroll-ml-2 md:scroll-m-4">
              <column
                [column]="column"
                (delete)="viewModel.deleteColumn($event)"
                (updateColumnTitle)="
                    viewModel.updateColumnTitle($event, column.id)
                  "
                (addTask)="viewModel.createTask(column.id)"
                (updateTaskContent)="
                    viewModel.updateTaskContent(
                      $event.columnId,
                      $event.taskId,
                      $event.content
                    )
                  "
                (moveTask)="
                    viewModel.moveTask(
                      $event.taskId,
                      $event.fromColumnId,
                      $event.toColumnId
                    )
                  "
                (deleteTask)="
                    viewModel.deleteTask($event.columnId, $event.taskId)
                  "
              ></column>
            </div>
          } @empty {
            <div
              class="w-full h-fit p-4 rounded-lg bg-gray-100 border border-gray-200"
            >
              <span class="text-sm  text-gray-400"
              >New board? Add a column to get started.</span
              >
            </div>
          }
        </ng-container>
      </section>

      <footer class="flex flex-row space-x-2 items-center justify-between">
        <span class="text-xs font-medium"
        >Kanban board built with ❤️ by
          <a
            href="https://benruwel.vercel.app/"
            class="underline underline-offset-1medium"
          >Ben</a
          >
        </span>
        <div class="block md:hidden">
          <button
            (click)="viewModel.createColumn()"
            class="px-6 py-2 rounded-lg bg-black text-white text-sm transform ease-in-out duration-200 hover:scale-110 focus:scale-90 focus:ring focus:ring-purple-200 focus:ring-offset-4"
          >
            New
          </button>
        </div>
      </footer>
    </main>
  `,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    NgIf,
    NgForOf,
    ColumnComponent
  ]
})
export class AppComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  public viewModel = inject(KanbanService);

  public columns$ = this.viewModel.columns$;

  public boardTitleCtrl = new FormControl('', [
    Validators.required,
    Validators.maxLength(50),
  ]);

  ngOnInit() {
    const title = this.viewModel.init().title;
    this.boardTitleCtrl.setValue(title);
    this.boardTitleCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef),debounceTime(1000), distinctUntilChanged())
      .subscribe({
        next: (value) => {
          if (value !== '' && value !== null) {
            this.viewModel.updateBoardTitle(value);
          }
        },
      });
  }
}
