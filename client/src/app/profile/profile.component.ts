import { Component, OnInit } from '@angular/core';
import { LoginService } from '../service/login.service';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Pipe({
  name: 'userAvatar',
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
  imports: [NgIf, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  constructor(private profile: LoginService, private router: Router) {}
  user: any;
  name: string = '';
  userlogin: string = '';
  email: string = '';
  userPosts: any[] = [];
  showLogoutModal: boolean = false;
  editMode = false;

  setProfile() {
    if (this.user) {
      this.editMode = true;
    }
  }

  cancelEdit() {
    this.editMode = false;
  }

  clearEditProfile() {
    if (this.user) {
      this.name = "";
      this.userlogin = "";
      this.email = "";
    }
  }

  editProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Нет доступа');
      return;
    }
    this.profile.editProfile(
      {
        _id: this.user._id,
        name: this.name,
        userlogin: this.userlogin,
        email: this.email,
      },
      token
    );
    this.ngOnInit();
    this.cancelEdit();
    this.clearEditProfile();
  }

  ngOnInit() {
    this.profile.getProfile().subscribe({
      next: (res: any) => {
        this.user = res;
      },
      error: (error: any) => {
        console.error('Error fetching profile:', error);
      },
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

  showUserAds() {}

  contactUser() {}
}
