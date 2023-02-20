import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'column',
  template: `
    <article
      class="relative h-fit w-72 border border-gray-200 bg-gray-100 rounded-xl overflow-hidden"
    >
      <div
        class="sticky top-0 left-0 flex flex-row space-x-4 items-center justify-between w-full py-4 px-2 backdrop-filter backdrop-blur-md"
      >
        <p>Column Title</p>
        <div class="flex flex-row space-x-2">
          <button
            class="flex justify-center items-center p-2 w-6 h-6 bg-gray-200 rounded-md"
          >
            +
          </button>
          <button
            class="flex justify-center items-center p-2 w-6 h-6 bg-red-200 text-red-700 rounded-md"
          >
            -
          </button>
        </div>
      </div>

      <div class="flex flex-col space-y-2 p-2 overflow-auto">
        <ng-container *ngFor="let item of [].constructor(1)">
          <task></task>
        </ng-container>
      </div>
    </article>
  `,
})
export class ColumnComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
