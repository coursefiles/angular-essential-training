import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaItemService {
  constructor(private http: HttpClient) {}
  
  get(medium: string) {
    let getOptions = {
      params: { medium }
    };
    return this.http.get<MediaItemsResponse>('mediaitems', getOptions)
      .pipe(
        map((response: MediaItemsResponse) => {
          return response.mediaItems;
        }),
        catchError(this.handleError<MediaItem[]>('get media items'))
      );
  }
  
  add(mediaItem: MediaItem) {
    return this.http.post('mediaitems', mediaItem)
      .pipe(
        catchError(this.handleError<MediaItem>('add media item'))
      );
  }
  
  delete(mediaItem: MediaItem) {
    return this.http.delete(`mediaitems/${mediaItem.id}`)
    .pipe(
      catchError(this.handleError<MediaItem>('delete media item'))
    );
  }

  private handleError<T>(operation = 'unknown', result?: T) {
    return (error: any): Observable<T> => {
      console.log(`Call to [${operation}] failed: ${error.message}`);
      return of(result as T);
    };
  }
}

interface MediaItemsResponse {
  mediaItems: MediaItem[]
}

export interface MediaItem {
  id: number;
  name: string;
  medium: string;
  category: string;
  year: number;
  watchedOn: number;
  isFavorite: boolean;
}