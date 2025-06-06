import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = 'http://localhost:777/post';

  constructor(private http: HttpClient) {}

  addPost(formData: FormData, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/addPost`, formData, { headers });
  }

  async getPosts() {
    try {
      const res = await fetch(`${this.apiUrl}/posts`)
        .then((res) => res.json())
        .then((data) => data);
      return res;
    } catch {
      console.error('Ошибка получения постов');
      return [];
    }
  }

  async getPost(id: string) {
    try {
      const res = await this.http.get(`${this.apiUrl}/post/${id}`).toPromise();
      return res;
    } catch (error) {
      console.error('Ошибка получения поста:', error);
      return error;
    }
  }

  async delPost(id: string, token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    try {
      await this.http.delete(`${this.apiUrl}/delpost/${id}`, { headers }).toPromise();
    } catch (error) {
      console.error('Ошибка удаления поста:', error);
    }
  }

  async updatePost(id: string, updatedData: any, token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    try {
      const res = await this.http.patch(`${this.apiUrl}/update/${id}`, updatedData, { headers }).toPromise();
      return res;
    } catch (error) {
      console.error('Ошибка при обновлении поста:', error);
      throw error;
    }
  }
}