import { Component } from '@angular/core';
import { PostsComponent } from "../posts/posts.component";
import { PostService } from '../service/post.service';
import { Router } from '@angular/router';
import { CategoriesComponent } from "../categories/categories.component";

@Component({
  selector: 'app-clothes',
  imports: [PostsComponent,CategoriesComponent],
  templateUrl: './clothes.component.html',
  styleUrl: './clothes.component.css'
})
export class ClothesComponent {
  posts: any = [];

  constructor(private postService: PostService, private router: Router) {}

  async ngOnInit() {
    const allPosts = await this.postService.getPosts();
    this.posts = allPosts.filter((post: any) => post.category === 'Одежда, обувь, аксессуары');
  }

  goToProduct(id: number) {
    this.router.navigate(['/post', id]);
  }
}
