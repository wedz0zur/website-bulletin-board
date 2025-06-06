import { Component } from '@angular/core';
import { PostService } from '../service/post.service';
import { Router } from '@angular/router';
import { TruncatePipe } from '../truncate.pipe';
import { NgIf } from '@angular/common';
import { PostsComponent } from "../posts/posts.component";
import { CategoriesComponent } from "../categories/categories.component";

@Component({
  selector: 'app-transport-posts',
  standalone: true,
  imports: [PostsComponent, CategoriesComponent],
  templateUrl: './car.component.html',
  styleUrl: './car.component.scss',
})
export class CarComponent {
  posts: any = [];

  constructor(private postService: PostService, private router: Router) {}

  async ngOnInit() {
    const allPosts = await this.postService.getPosts();
    this.posts = allPosts.filter((post: any) => post.category === 'Транспорт');
  }

  goToProduct(id: number) {
    this.router.navigate(['/post', id]);
  }
}
