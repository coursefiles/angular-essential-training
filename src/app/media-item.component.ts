import { Component, Input } from '@angular/core';

@Component({
  selector: 'mw-media-item',
  templateUrl: './media-item.component.html',
  styleUrls: ['./media-item.component.css']
})
export class MediaItemComponent {
<<<<<<< Updated upstream
  @Input() mediaItem;
=======
  @Input() mediaItem; 
>>>>>>> Stashed changes

  onDelete() {
    console.log('deleted');
  }
}
