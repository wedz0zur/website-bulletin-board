import { Component, OnInit } from '@angular/core';
import { FavoritesService } from '../service/favorites.service';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { TruncatePipe } from '../truncate.pipe';

@Component({
  selector: 'app-favorites',
  imports: [NgIf, NgFor, TruncatePipe],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {
  favoritePosts: any[] = [];
  loading = false;
  error = '';

  showConfirmModal = false;
  confirmedPostId: string | null = null;

  constructor(private favoritesService: FavoritesService, private router: Router) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.loading = true;
    this.favoritesService.getFavorites().subscribe({
      next: (posts) => {
        this.favoritePosts = posts;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Ошибка загрузки избранных постов';
        this.loading = false;
      }
    });
  }

  goToProduct(id: string) {
    this.router.navigate(['/post', id]);
  }

  confirmDelete(postId: string, event?: MouseEvent) {
    event?.stopPropagation();
    this.confirmedPostId = postId;
    this.showConfirmModal = true;
  }

  cancelDelete() {
    this.confirmedPostId = null;
    this.showConfirmModal = false;
  }

  removeFavorite(postId: string) {
    this.favoritesService.removeFavorite(postId).subscribe({
      next: () => {
        this.favoritePosts = this.favoritePosts.filter(post => post._id !== postId);
        this.cancelDelete();
      },
      error: () => {
        alert('Не удалось удалить пост из избранного');
      }
    });
  }
}
