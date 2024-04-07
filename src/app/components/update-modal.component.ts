import { Component } from "@angular/core";

@Component({
  standalone: true,
  selector: "update-modal",
  template: `

    <div class="fixed top-0 left-0 w-full h-full bg-black/10 backdrop-blur-lg flex justify-center items-center backdrop-filter">

      <div class="bg-white rounded-xl border border-gray-200 shadow-2xl">

        <p>Update Available</p>

      </div>

    </div>

  `
})

export class UpdateModalComponent {
}
