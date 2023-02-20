import { Component, inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { KanbanService } from './domain/kanban.service';

@Component({
  selector: 'app-root',
  template: `
    <main class="p-4 flex flex-col space-y-4 h-screen overflow-hidden md:p-8">
      <div class="flex flex-row space-x-4 items-start justify-between">
        <h1>{{ boardTitle$ | async }}</h1>

        <button
          (click)="viewModel.createColumn()"
          class="px-6 py-2 rounded-lg bg-black text-white text-sm transform ease-in-out duration-200 hover:scale-110 focus:scale-90 focus:ring focus:ring-gray-200 focus:ring-offset-4"
        >
          New
        </button>
      </div>

      <section
        class="flex-1 flex flex-row space-x-2 p-2 rounded-xl border border-gray-300 border-dashed overflow-x-auto overflow-y-hidden md:space-x-4 md:p-4"
      >
        <ng-container *ngIf="columns$ | async as columns">
          <ng-container *ngIf="!columns.length">
            <div
              class="w-full h-fit p-4 rounded-lg bg-gray-100 border border-gray-200"
            >
              <span class="text-sm  text-gray-400"
                >New board? Add a column to get started.</span
              >
            </div>
          </ng-container>

          <ng-container *ngIf="columns.length">
            <ng-container *ngFor="let column of columns">
              <column
                [column]="column"
                (delete)="viewModel.deleteColumn($event)"
              ></column>
            </ng-container>
          </ng-container>
        </ng-container>
      </section>

      <footer>
        <span class="text-xs font-medium"
          >Kanban board built with ❤️ by Ben</span
        >
      </footer>
    </main>
  `,
})
export class AppComponent implements OnInit {
  public viewModel = inject(KanbanService);

  public boardTitle$ = this.viewModel.title$;
  public columns$ = this.viewModel.columns$;

  ngOnInit() {
    this.viewModel.init();
  }
}
