import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationService } from '../service/registration.service';
import { LoginService } from '../service/login.service';
import { PostService } from '../service/post.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import {
  RouterOutlet,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  userName: string = '';
  userLogin: string = '';
  userEmail: string = '';
  userPassword: string = '';
  userCheckPassword: string = '';
  userAvatar: any;
  error: string = '';
  errorValid: string = '';
  errorPassword: string = '';
  activeTab: 'register' | 'login' = 'login';
  modal: boolean = false;
  modal2: boolean = false;
  isSubmitting: boolean = false;
  showSuccessMessage: boolean = false;
  postTitle: string = '';
  postPrice = '';
  postDescription: string = '';
  postImage: any;
  postCategory: string = '';
  author: string = '';
  user: any;

  constructor(
    private registrationService: RegistrationService,
    private loginService: LoginService,
    private postService: PostService,
    private router: Router
  ) {}
  http = inject(HttpClient);

  ngOnInit() {
    this.loginService.getProfile().subscribe({
      next: (res: any) => {
        this.user = res;
        console.log(this.user);
      },
      error: (error: any) => {
        console.error('Error fetching profile:', error);
      },
    });
  }

  routeAdd() {
    this.router.navigate(['/additem']);
  }
  setModal() {
    this.modal = true;
  }
  setModal2() {
    this.modal2 = true;
  }

  closeModal(event: Event) {
    if (event.target === event.currentTarget) {
      this.modal = false;
      this.modal2 = false;
    }
  }

  closeModal2() {
    this.modal2 = false;
  }

  registration() {
    this.errorValid = '';
    this.errorPassword = '';
    this.error = '';

    if (
      !this.userName ||
      !this.userLogin ||
      !this.userEmail ||
      !this.userPassword ||
      !this.userCheckPassword
    ) {
      this.errorValid = 'Пожалуйста, заполните все поля корректно';
      return;
    }

    if (this.userPassword !== this.userCheckPassword) {
      this.errorPassword = 'Пароли должны совпадать';
      return;
    }

    if (this.userPassword.length < 6) {
      this.errorPassword = 'Пароль должен быть не менее 6 символов';
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('name', this.userName);
    formData.append('userlogin', this.userLogin);
    formData.append('email', this.userEmail);
    formData.append('password', this.userPassword);

    if (this.userAvatar instanceof File) {
      formData.append('avatar', this.userAvatar);
    } else {
      formData.append('avatar', this.userAvatar || '');
    }

    this.registrationService.registerUser(formData).subscribe({
      next: (res: any) => {
        if (res === 'Регистрация прошла успешно') {
          this.showSuccessMessage = true;
          this.autoLoginAfterRegistration(this.userLogin, this.userPassword);
          location.reload();
        } else {
          this.error = 'Не удалось зарегистрировать пользователя';
          this.isSubmitting = false;
        }
      },
      error: (e) => {
        this.error = e.error?.message || 'Ошибка регистрации';
        console.error('HTTP error:', e);
        this.isSubmitting = false;
      },
    });
  }
  private autoLoginAfterRegistration(login: string, password: string) {
    const credentials = { userlogin: login, password };

    this.loginService.onLogin(credentials).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        this.showSuccessMessage = true;

        if (res.token) {
          localStorage.setItem('token', res.token);
        }

        setTimeout(() => {
          this.router.navigate(['/profile']).then(() => {
            location.reload();
          });
          this.modal = false;
          this.resetForm();
        }, 1500);
      },
      error: (e: HttpErrorResponse) => {
        this.isSubmitting = false;
        this.error = e.error?.message || 'Ошибка автоматического входа';
        console.error('Ошибка авто-входа:', e);
      },
    });
  }

  private resetForm(): void {
    this.userName = '';
    this.userLogin = '';
    this.userEmail = '';
    this.userPassword = '';
    this.userCheckPassword = '';
    this.userAvatar =
      'https://avatars.mds.yandex.net/i?id=93932abfd430c7aab32a3d45806ea6e6d4d0523a-4944707-images-thumbs&n=13';
    this.error = '';
    this.errorValid = '';
    this.errorPassword = '';
  }

  login() {
    this.error = '';

    if (!this.userLogin || !this.userPassword) {
      this.error = 'Пожалуйста, заполните все поля';
      return;
    }

    this.isSubmitting = true;

    const credentials = {
      userlogin: this.userLogin,
      password: this.userPassword,
    };

    this.loginService.onLogin(credentials).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        this.showSuccessMessage = true;

        if (res.token) {
          localStorage.setItem('token', res.token);
        }

        setTimeout(() => {
          this.router.navigate(['/profile']).then(() => {
            location.reload();
          });
        }, 1500);
      },
      error: (e: HttpErrorResponse) => {
        this.isSubmitting = false;
        this.error = e.error?.message || 'Неверный логин или пароль';
        console.error('Ошибка входа:', e);
      },
    });
  }

  onfileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        this.error = 'Допустимы только изоображения JPEG , JPG или PNG';
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        this.error = 'Размер файла не должен привышать 2МБ';
        return;
      }

      this.postImage = file;
      this.error = ' ';
    }
  }

  onfileAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        this.error = 'Допустимы только изоображения JPEG , JPG или PNG';
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        this.error = 'Размер файла не должен привышать 2МБ';
        return;
      }

      this.userAvatar = file;
      this.error = ' ';
    }
  }
}
