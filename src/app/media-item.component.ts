import { Component, Input } from '@angular/core';

@Component({
  selector: 'mw-media-item',
  templateUrl: './media-item.component.html',
  styleUrls: ['./media-item.component.css']
})
export class MediaItemComponent {
  @Input('mediaItemToWatch') mediaItem;
  onDelete () {
    console.log ('delete');
  }
}



