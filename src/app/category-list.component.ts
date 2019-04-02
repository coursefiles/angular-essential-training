import { Component, Input } from "@angular/core";
import { MediaItem } from "./media-item.service";

@Component({
  selector: "category-list",
  template: `
    <span class="label" *ngFor="let mediaItem of mediaItems">
      {{ mediaItem.category }}
    </span>
  `,
  styles: [
    `
      .label {
        background-color: #999999;
        color: #ffffff;
        border-radius: 4px;
        padding: 2px 6px;
      }
      span {
        margin-left: 4px;
      }
      span:first-child {
        margin: 0;
      }
    `
  ]
})
export class CategoryListComponent {
  @Input() mediaItems: MediaItem[];
}
