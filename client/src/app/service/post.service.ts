import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';

interface Message {
  text: string;
  sender: { _id: string; name: string };
  recipient: { _id: string; name: string };
  createdAt: string;
}

interface Comment {
  _id: string;
  author: { _id: string; name: string };
  text: string;
  createdAt: string;
  updatedAt?: string;
}

interface Post {
  _id: string;
  title: string;
  price: number;
  description: string;
  author: string;
  messages: Message[];
  comments?: Comment[];
  image: string[];
  location?: string;
  category?: string;
  subcategory?: string;
  subsubcategory?: string;
  contact_name: string;
  contact_methods: string[];
  additional_fields?: { [key: string]: string };
  createdAt: string;
}

interface SellerChat {
  postId: string;
  postTitle: string;
  userId: string;
  userName: string;
  messages: Message[];
}

interface UpdatePostData {
  title?: string;
  price?: number;
  description?: string;
  [key: string]: any;
}

interface CommentResponse {
  message: string;
  post: Post;
}

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = 'http://localhost:777/post';

  constructor(private http: HttpClient) {}

  addPost(formData: FormData, token: string): Observable<Post> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<Post>(`${this.apiUrl}/addPost`, formData, { headers });
  }

  async getPosts(): Promise<Post[]> {
    try {
      const res = await fetch(`${this.apiUrl}/posts`)
        .then((res) => res.json())
        .then((data) => data);
      return res as Post[];
    } catch {
      console.error('Ошибка получения постов');
      return [];
    }
  }

  async getPost(id: string): Promise<Post> {
    try {
      const res = await lastValueFrom(this.http.get(`${this.apiUrl}/post/${id}`));
      return res as Post;
    } catch (error) {
      console.error('Ошибка получения поста:', error);
      throw error;
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

  async updatePost(id: string, updatedData: UpdatePostData, token: string) {
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

  async sendMessage(id: string, messageData: { text: string; recipientId?: string }, token: string): Promise<CommentResponse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    try {
      const res = await lastValueFrom(this.http.post<CommentResponse>(`${this.apiUrl}/message/${id}`, messageData, { headers }));
      return res;
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
      throw error;
    }
  }

  async getSellerChats(token: string): Promise<SellerChat[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    try {
      const res = await lastValueFrom(this.http.get<SellerChat[]>(`${this.apiUrl}/seller-chats`, { headers }));
      return res;
    } catch (error) {
      console.error('Ошибка при получении чатов:', error);
      throw error;
    }
  }
}