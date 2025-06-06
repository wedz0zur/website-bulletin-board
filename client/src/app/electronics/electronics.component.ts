import { Component } from '@angular/core';
import { PostsComponent } from "../posts/posts.component";
import { PostService } from '../service/post.service';
import { Router } from '@angular/router';
import { CategoriesComponent } from "../categories/categories.component";
@Component({
  selector: 'app-electronics',
  imports: [PostsComponent, CategoriesComponent],
  templateUrl: './electronics.component.html',
  styleUrl: './electronics.component.css'
})
export class ElectronicsComponent {
  posts: any = [];

  constructor(private postService: PostService, private router: Router) {}

  async ngOnInit() {
    const allPosts = await this.postService.getPosts();
    this.posts = allPosts.filter((post: any) => post.category === 'Электроника');
  }

  goToProduct(id: number) {
    this.router.navigate(['/post', id]);
  }
}
