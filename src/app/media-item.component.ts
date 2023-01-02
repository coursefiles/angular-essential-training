import { DomElementSchemaRegistry } from '@angular/compiler';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'media-item',
  templateUrl: './media-item.component.html',
  styleUrls: ['./media-item.component.css']
})

export class MediaItemComponent implements OnInit {
  // constructor() { }
  @Input() mediaItem;
  @Output() delete = new EventEmitter();

  onDelete() {
    this.delete.emit(this.mediaItem);
  }

  onWatch() {
  }
  ngOnInit() {
  }

}
