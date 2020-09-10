import { Component } from '@angular/core';
import { TimeoutError } from 'rxjs';

@Component({
  selector: 'mw-media-item',
  templateUrl: './media-item.component.html',
  styleUrls: ['./media-item.component.css']
})
export class MediaItemComponent {
  name='The Redemption';

  wasWatched() {
    return true
  };
}