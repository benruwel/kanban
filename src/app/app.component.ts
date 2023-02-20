import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <main class="p-4 flex flex-col space-y-4 h-screen overflow-hidden md:p-8">
      <div class="flex flex-row space-x-4 items-start justify-between">
        <h1>Untitled Board</h1>

        <button
          class="px-6 py-2 rounded-lg bg-black text-white text-sm transform ease-in-out duration-200 hover:scale-110 focus:scale-90 focus:ring focus:ring-gray-200 focus:ring-offset-4"
        >
          New
        </button>
      </div>

      <section
        class="flex-1 flex flex-row space-x-2 p-2 rounded-xl border border-gray-200 border-dashed overflow-x-auto overflow-y-hidden md:space-x-4 md:p-4"
      >
        <ng-container *ngFor="let column of columns">
          <column></column>
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
export class AppComponent {
  title = 'kanban';

  columns = ['Column 1', 'Column 2', 'Column 3', 'Column 4'];
}
