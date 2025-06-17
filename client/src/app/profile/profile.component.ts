import { Component, OnInit } from '@angular/core';
import { LoginService } from '../service/login.service';
import { PostService } from '../service/post.service';
import { FavoritesService } from '../service/favorites.service';
import { Router } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Pipe({
  name: 'userAvatar',
  standalone: true
})
export class UserAvatarPipe implements PipeTransform {
  transform(avatarPath: string | undefined): string {
    if (!avatarPath) {
      return '/assets/default-avatar.png';
    }
    return `http://localhost:777/${avatarPath}`;
  }
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, UserAvatarPipe, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: any = null;
  name: string = '';
  userlogin: string = '';
  email: string = '';
  userPosts: any[] = [];
  favorites: string[] = [];
  showLogoutModal: boolean = false;
  editMode: boolean = false;
  showAllPosts: boolean = false;

  constructor(
    private profile: LoginService,
    private postService: PostService,
    private favoritesService: FavoritesService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.profile.getProfile().subscribe({
      next: (res: any) => {
        this.user = res;
        this.loadUserPosts();
        this.loadFavorites();
      },
      error: (error: any) => {
        console.error('Error fetching profile:', error);
      }
    });
  }

  async loadUserPosts() {
    if (!this.user) return;
    try {
      const allPosts = await this.postService.getPosts();
      this.userPosts = allPosts.filter((post: any) => post.author === this.user._id);
    } catch (error) {
      console.error('Ошибка загрузки постов пользователя:', error);
      this.userPosts = [];
    }
  }

  async loadFavorites() {
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

  toggleShowAllPosts() {
    this.showAllPosts = !this.showAllPosts;
  }

  getDisplayedPosts(): any[] {
    return this.showAllPosts ? this.userPosts : this.userPosts.slice(0, 3);
  }

  setProfile() {
    if (this.user) {
      this.name = this.user.name;
      this.userlogin = this.user.userlogin;
      this.email = this.user.email || '';
      this.editMode = true;
    }
  }

  cancelEdit() {
    this.editMode = false;
    this.clearEditProfile();
  }

  clearEditProfile() {
    this.name = '';
    this.userlogin = '';
    this.email = '';
  }

  editProfile() {
    const token = localStorage.getItem('token');
    if (!token || !this.user) {
      console.error('Нет доступа');
      return;
    }
    this.profile.editProfile(
      {
        _id: this.user._id,
        name: this.name,
        userlogin: this.userlogin,
        email: this.email
      },
      token
    ).subscribe({
      next: () => {
        this.ngOnInit();
        this.cancelEdit();
      },
      error: (error: any) => {
        console.error('Ошибка обновления профиля:', error);
      }
    });
  }

  logout() {
    this.showLogoutModal = true;
  }

  confirmLogout() {
    this.profile.logout();
    this.router.navigate(['/home']);
  }

  cancelLogout() {
    this.showLogoutModal = false;
  }

  showUserAds() {
    this.router.navigate(['/posts'], { queryParams: { author: this.user?._id } });
  }

  goToProduct(id: string) {
    this.router.navigate(['/post', id]);
  }

  contactUser() {}
}