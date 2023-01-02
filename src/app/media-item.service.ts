import { Injectable } from '@angular/core';

@Injectable( {
  providedIn: 'root'
})

export class MediaItemService {

mediaItems = [
  {
    id: 1,
    name: 'Firebug',
    medium: 'Series',
    category: 'Science Fiction',
    year: 2020,
    watchedOn: 1234567,
    isFavorite: false
  }, {
    id: 2,
    name: 'The Small Test',
    medium: 'Movies',
    category: 'Comedy',
    year: 2001,
    watchedOn: null,
    isFavorite: true
  }, {
    id: 3,
    name: 'The Godfather',
    medium: 'Movies',
    category: 'Thriller',
    year: 1991,
    watchedOn: 134563456,
    isFavorite: true
  }, {
    id: 4,
    name: 'Die Hard',
    medium: 'Movies',
    category: 'Action',
    year: 1996,
    watchedOn: null,
    isFavorite: false
  }, {
    id: 5,
    name: 'White Lotus',
    medium: 'Series',
    category: 'Drama',
    year: 2022,
    watchedOn: 1231455,
    isFavorite: false
  }
];

get() {
  return this.mediaItems;
}

add(mediaItem) {
  this.mediaItems.push(mediaItem);
}

delete(mediaItem) {
  const index = this.mediaItems.indexOf(mediaItem);
  if (index >= 0) {
    this.mediaItems.splice(index, 1);
  }
}

}

