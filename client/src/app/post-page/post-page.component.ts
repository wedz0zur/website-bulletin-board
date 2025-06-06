import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../service/post.service';
import { Location } from '@angular/common';
import { LoginService } from '../service/login.service';
import { NgIf, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  isAuthor = false;
  showDescription = false;
  activeImage: number = 0;

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
    }
  }
}
