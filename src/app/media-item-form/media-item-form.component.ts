import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'media-item-form',
  templateUrl: './media-item-form.component.html',
  styleUrls: ['./media-item-form.component.css']
})
export class MediaItemFormComponent implements OnInit {
  // constructor() { }
  onSubmit(mediaItem) {
      console.log(mediaItem);
  }
  ngOnInit() {
  }

}
