import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';

interface CommentResponse {
  message: string;
  post: any; // Можно уточнить тип, если есть интерфейс для Post
}

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
      const res = await lastValueFrom(this.http.get(`${this.apiUrl}/post/${id}`));
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
      await lastValueFrom(this.http.delete(`${this.apiUrl}/delpost/${id}`, { headers }));
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
      const res = await lastValueFrom(this.http.patch(`${this.apiUrl}/update/${id}`, updatedData, { headers }));
      return res;
    } catch (error) {
      console.error('Ошибка при обновлении поста:', error);
      throw error;
    }
  }

  async addComment(id: string, commentData: { text: string }, token: string): Promise<CommentResponse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    try {
      const res = await lastValueFrom(this.http.post<CommentResponse>(`${this.apiUrl}/comment/${id}`, commentData, { headers }));
      return res;
    } catch (error) {
      console.error('Ошибка при добавлении комментария:', error);
      throw error;
    }
  }

  async deleteComment(postId: string, commentId: string, token: string): Promise<CommentResponse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    try {
      const res = await lastValueFrom(this.http.delete<CommentResponse>(`${this.apiUrl}/comment/${postId}/${commentId}`, { headers }));
      return res;
    } catch (error) {
      console.error('Ошибка при удалении комментария:', error);
      throw error;
    }
  }

  async editComment(postId: string, commentId: string, commentData: { text: string }, token: string): Promise<CommentResponse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    try {
      const res = await lastValueFrom(this.http.patch<CommentResponse>(`${this.apiUrl}/comment/${postId}/${commentId}`, commentData, { headers }));
      return res;
    } catch (error) {
      console.error('Ошибка при редактировании комментария:', error);
      throw error;
    }
  }
}