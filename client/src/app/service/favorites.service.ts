import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl = 'http://localhost:777/post/favorites';

  constructor(private http: HttpClient) {}

  getFavorites(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addFavorite(postId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${postId}`, {});
  }

  removeFavorite(postId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${postId}`);
  }
}
