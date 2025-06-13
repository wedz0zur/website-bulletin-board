import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../service/post.service';
import { Location } from '@angular/common';
import { LoginService } from '../service/login.service';
import { NgIf, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CommentResponse {
  message: string;
  post: any; 
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
  post: any = {};
  user: any = {};
  showDeleteModal = false;
  showEditModal = false;
  showDeleteCommentModal = false;
  showEditCommentModal = false;
  isAuthor = false;
  showDescription = false;
  activeImage: number = 0;
  newComment: string = '';
  commentToDelete: string | null = null;
  commentToEdit: string | null = null;
  editCommentText: string = '';

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
        this.post = data;
        this.loginService.getProfile().subscribe({
          next: (res) => {
            this.user = res;
            this.isAuthor = this.user._id === this.post.author;
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

  isCommentAuthorOrAdmin(comment: any): boolean {
    return this.isAuthenticated() && (comment.author._id === this.user._id || this.user.roles?.includes('ADMIN'));
  }

  goBack() {
    this.location.back();
  }

  toggleDescription() {
    this.showDescription = !this.showDescription;
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
    this.title = this.post.title;
    this.price = this.post.price;
    this.description = this.post.description;
    this.showEditModal = true;
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
      this.post = { ...this.post, ...updated };
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