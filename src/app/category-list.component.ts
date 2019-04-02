import { Component, Input } from "@angular/core";
import { MediaItem } from "./media-item.service";

@Component({
  selector: "category-list",
  template: `
    <span class="label" *ngFor="let category of categories">
      {{ category }}
    </span>
  `,
  styles: [
    `
      :host {
        display: block;
        margin-bottom: 20px;
      }
      :host-context(.medium-movies) span {
        background-color: #53ace4;
      }
      :host-context(.medium-series) span {
        background-color: #45bf94;
      }
      .label {
        background-color: #999999;
        color: #ffffff;
        border-radius: 4px;
        padding: 2px 6px;
      }
      span {
        display: inline-block;
        margin-right: 4px;
        margin-bottom: 4px;
        font-style: italic;
      }
    `
  ]
})
export class CategoryListComponent {
  @Input() categories: string[];
}
