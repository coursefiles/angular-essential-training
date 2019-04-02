import { HttpEvent, HttpRequest, HttpResponse, HttpBackend } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';

export class MockXHRBackend implements HttpBackend {
  private mediaItems = [
    {
      id: 1,
      name: 'Firebug',
      medium: 'Series',
      category: 'Science Fiction',
      year: 2010,
      watchedOn: 1294166565384,
      isFavorite: false
    },
    {
      id: 2,
      name: 'The Small Tall',
      medium: 'Movies',
      category: 'Comedy',
      year: 2015,
      watchedOn: null,
      isFavorite: true
    }, {
      id: 3,
      name: 'The Redemption',
      medium: 'Movies',
      category: 'Action',
      year: 2016,
      watchedOn: null,
      isFavorite: false
    }, {
      id: 4,
      name: 'Hoopers',
      medium: 'Series',
      category: 'Drama',
      year: null,
      watchedOn: null,
      isFavorite: true
    }, {
      id: 5,
      name: 'Happy Joe: Cheery Road',
      medium: 'Movies',
      category: 'Action',
      year: 2015,
      watchedOn: 1457166565384,
      isFavorite: false
    }
  ];

  handle(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    return new Observable((responseObserver: Observer<HttpResponse<any>>) => {
      let responseOptions;
      switch (request.method) {
        case 'GET':
          if (request.urlWithParams.indexOf('mediaitems?medium=') >= 0 || request.url === 'mediaitems') {
            let medium;
            if (request.urlWithParams.indexOf('?') >= 0) {
              medium = request.urlWithParams.split('=')[1];
              if (medium === 'undefined') { medium = ''; }
            }
            let mediaItems;
            if (medium) {
              mediaItems = this.mediaItems.filter(i => i.medium === medium);
            } else {
              mediaItems = this.mediaItems;
            }
            responseOptions = {
              body: {mediaItems: JSON.parse(JSON.stringify(mediaItems))},
              status: 200
            };
          } else {
            let mediaItems;
            const idToFind = parseInt(request.url.split('/')[1], 10);
            mediaItems = this.mediaItems.filter(i => i.id === idToFind);
            responseOptions = {
              body: JSON.parse(JSON.stringify(mediaItems[0])),
              status: 200
            };
          }
          break;
        case 'POST':
          const mediaItem = request.body;
          mediaItem.id = this._getNewId();
          this.mediaItems.push(mediaItem);
          responseOptions = {status: 201};
          break;
        case 'DELETE':
          const id = parseInt(request.url.split('/')[1], 10);
          this._deleteMediaItem(id);
          responseOptions = {status: 200};
      }

      const responseObject = new HttpResponse(responseOptions);
      responseObserver.next(responseObject);
      responseObserver.complete();
      return () => {
      };
    });
  }

  _deleteMediaItem(id) {
    const mediaItem = this.mediaItems.find(i => i.id === id);
    const index = this.mediaItems.indexOf(mediaItem);
    if (index >= 0) {
      this.mediaItems.splice(index, 1);
    }
  }

  _getNewId() {
    if (this.mediaItems.length > 0) {
      return Math.max.apply(Math, this.mediaItems.map(mediaItem => mediaItem.id)) + 1;
    } else {
      return 1;
    }
  }
}
