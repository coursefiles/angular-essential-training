import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<h1 class="desc">Me WL app</h1>
  <p>this is my first angular app</p>
  <app-media-item></app-media-item>
  <app-media-item></app-media-item>
  <app-media-item></app-media-item>
  <app-media-item></app-media-item>
    `,
  styles: [`
  p {color:blue;}
  .desc { color: #00ff00;
  font-style:italic }
  `]

})
export class AppComponent { }
