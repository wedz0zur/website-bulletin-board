import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../service/post.service';
import { Location } from '@angular/common';
import { LoginService } from '../service/login.service';
import { NgIf, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CommentResponse {
  message: string;
  post: Post;
}

interface ChatUser {
  _id: string;
  name: string;
}

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

interface User {
  _id: string;
  name: string;
  roles?: string[];
}

@Component({
  selector: 'app-post-page',
  standalone: true,
  imports: [NgIf, CommonModule, FormsModule],
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss']
})
export class PostPageComponent {
  id: string = '';
  post: Post | null = null;
  user: User | null = null;
  showDeleteModal = false;
  showEditModal = false;
  showDeleteCommentModal = false;
  showEditCommentModal = false;
  showChat = false;
  isAuthor = false;
  showDescription = false;
  activeImage: number = 0;
  newComment: string = '';
  newMessage: string = '';
  commentToDelete: string | null = null;
  commentToEdit: string | null = null;
  editCommentText: string = '';
  selectedChatUser: string | null = null;

  title = '';
  price = 0;
  description = '';

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private loginService: LoginService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id) {
      this.postService.getPost(this.id).then((data) => {
        this.post = data as Post;
        this.loginService.getProfile().subscribe({
          next: (res) => {
            this.user = res as User;
            this.isAuthor = this.user._id === this.post?.author;
          },
          error: (err) => console.error('Ошибка получения профиля', err)
        });
      });
    }
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj || {});
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  isCommentAuthorOrAdmin(comment: Comment): boolean {
    if (!this.isAuthenticated() || !this.user) {
      return false;
    }
    return comment.author._id === this.user._id || (this.user.roles?.includes('ADMIN') ?? false);
  }

  goBack() {
    this.location.back();
  }

  toggleDescription() {
    this.showDescription = !this.showDescription;
  }

  toggleChat() {
    this.showChat = !this.showChat;
    if (!this.showChat) {
      this.selectedChatUser = null;
    }
  }

  getChatUsers(): ChatUser[] {
    if (!this.post?.messages || !this.isAuthor) return [];
    const userIds: string[] = [...new Set(this.post.messages.map(msg => msg.sender._id).filter(id => id !== this.user?._id))];
    return userIds.map(id => ({
      _id: id,
      name: this.post!.messages.find(msg => msg.sender._id === id)?.sender.name || 'Неизвестный пользователь'
    }));
  }

  selectChatUser(userId: string) {
    this.selectedChatUser = userId;
  }

  getFilteredMessages(): Message[] {
    if (!this.post?.messages || !this.user?._id) return [];
    if (!this.isAuthor) {
      return this.post.messages.filter(
        (msg) =>
          (msg.sender._id === this.user!._id && msg.recipient._id === this.post!.author) ||
          (msg.sender._id === this.post!.author && msg.recipient._id === this.user!._id)
      );
    } else if (this.selectedChatUser) {
      return this.post.messages.filter(
        (msg) =>
          (msg.sender._id === this.selectedChatUser && msg.recipient._id === this.user!._id) ||
          (msg.sender._id === this.user!._id && msg.recipient._id === this.selectedChatUser)
      );
    }
    return [];
  }

  async sendMessage() {
    const token = localStorage.getItem('token');
    if (!token || !this.newMessage.trim() || (this.isAuthor && !this.selectedChatUser)) return;

    try {
      const messageData: { text: string; recipientId?: string } = { text: this.newMessage };
      if (this.isAuthor) {
        messageData.recipientId = this.selectedChatUser!;
      }
      const response: CommentResponse = await this.postService.sendMessage(this.id, messageData, token);
      this.post = response.post;
      this.newMessage = '';
    } catch (e) {
      console.error('Ошибка при отправке сообщения:', e);
      alert('Не удалось отправить сообщение');
    }
  }

  confirmDelete() {
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
  }

  async delPost(id: string) {
    const token = localStorage.getItem('token');
    if (token) {
      await this.postService.delPost(id, token);
      this.location.back();
    }
  }

  openEditModal() {
    if (this.post) {
      this.title = this.post.title;
      this.price = this.post.price;
      this.description = this.post.description;
      this.showEditModal = true;
    }
  }

  cancelEdit() {
    this.showEditModal = false;
  }

  async saveEdit() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const updatedPost = {
      title: this.title,
      price: this.price,
      description: this.description
    };

    try {
      const updated = await this.postService.updatePost(this.id, updatedPost, token);
      this.post = { ...this.post!, ...updated };
      this.showEditModal = false;
      this.ngOnInit();
    } catch (e) {
      console.error('Ошибка при обновлении поста:', e);
      alert('Не удалось обновить пост');
    }
  }

  async addComment() {
    const token = localStorage.getItem('token');
    if (!token || !this.newComment.trim()) return;

    try {
      const updatedPost: CommentResponse = await this.postService.addComment(this.id, { text: this.newComment }, token);
      this.post = updatedPost.post;
      this.newComment = '';
    } catch (e) {
      console.error('Ошибка при добавлении комментария:', e);
      alert('Не удалось добавить комментарий');
    }
  }

  confirmDeleteComment(commentId: string) {
    this.commentToDelete = commentId;
    this.showDeleteCommentModal = true;
  }

  cancelDeleteComment() {
    this.commentToDelete = null;
    this.showDeleteCommentModal = false;
  }

  async deleteComment() {
    const token = localStorage.getItem('token');
    if (!token || !this.commentToDelete) return;

    try {
      const updatedPost: CommentResponse = await this.postService.deleteComment(this.id, this.commentToDelete, token);
      this.post = updatedPost.post;
      this.cancelDeleteComment();
    } catch (e) {
      console.error('Ошибка при удалении комментария:', e);
      alert('Не удалось удалить комментарий');
    }
  }

  openEditCommentModal(commentId: string, currentText: string) {
    this.commentToEdit = commentId;
    this.editCommentText = currentText;
    this.showEditCommentModal = true;
  }

  cancelEditComment() {
    this.commentToEdit = null;
    this.editCommentText = '';
    this.showEditCommentModal = false;
  }

  async saveEditComment() {
    const token = localStorage.getItem('token');
    if (!token || !this.commentToEdit || !this.editCommentText.trim()) return;

    try {
      const updatedPost: CommentResponse = await this.postService.editComment(this.id, this.commentToEdit, { text: this.editCommentText }, token);
      this.post = updatedPost.post;
      this.cancelEditComment();
    } catch (e) {
      console.error('Ошибка при редактировании комментария:', e);
      alert('Не удалось отредактировать комментарий');
    }
  }
}