import { Component, Input } from '@angular/core';
import { PostService } from '../service/post.service';
import { Router } from '@angular/router';
import { TruncatePipe } from '../truncate.pipe';
import { CommonModule, NgIf } from '@angular/common';
import { FavoritesService } from '../service/favorites.service';
import { LoginService } from '../service/login.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-posts',
  imports: [TruncatePipe, NgIf, CommonModule, FormsModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css',
})
export class PostsComponent {
  @Input() category: string | null = null;
  posts: any = [];
  favorites: string[] = [];
  user: any;

  constructor(private postService: PostService, private loginService: LoginService, private favoritesService: FavoritesService, private router: Router) {}

  async ngOnInit() {
      this.loginService.getProfile().subscribe({
        next: (res: any) => {
          this.user = res;
          console.log(this.user);
        },
        error: (error: any) => {
          console.error('Error fetching profile:', error);
        },
      });

    const allPosts = await this.postService.getPosts();
    this.posts = this.category
      ? allPosts.filter((post: any) => post.category === this.category)
      : allPosts;

    try {
      const favoritePosts = await this.favoritesService.getFavorites().toPromise();
      this.favorites = (favoritePosts ?? []).map((p: any) => p._id);
    } catch (e) {
      console.error('Ошибка при загрузке избранных постов:', e);
      this.favorites = [];
    }
  }
  toggleFavorite(postId: string) {
    if (this.isFavorite(postId)) {
      this.favoritesService.removeFavorite(postId).subscribe(() => {
        this.favorites = this.favorites.filter(id => id !== postId);
      });
    } else {
      this.favoritesService.addFavorite(postId).subscribe(() => {
        this.favorites.push(postId);
      });
    }
  }

  isFavorite(postId: string): boolean {
    return this.favorites.includes(postId);
  }


  goToProduct(id: number) {
    this.router.navigate(['/post', id]);
  }
}
