import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    firstMediaItem = {
        id: 1,
        name: 'Firebug',
        medium: 'Series',
        category: 'SF',
        year: 2021,
        watchedOn: 123123,
        isFavorite: false
    }

    onMediaItemDelete(mediaItem) { }
}