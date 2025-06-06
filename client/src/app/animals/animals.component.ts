import { Component } from '@angular/core';
import { PostsComponent } from "../posts/posts.component";
import { PostService } from '../service/post.service';
import { Router } from '@angular/router';
import { CategoriesComponent } from "../categories/categories.component";

@Component({
  selector: 'app-animals',
  imports: [PostsComponent, CategoriesComponent],
  templateUrl: './animals.component.html',
  styleUrl: './animals.component.css'
})
export class AnimalsComponent {
 posts: any = [];

  constructor(private postService: PostService, private router: Router) {}

  async ngOnInit() {
    const allPosts = await this.postService.getPosts();
    this.posts = allPosts.filter((post: any) => post.category === 'Животные');
  }

  goToProduct(id: number) {
    this.router.navigate(['/post', id]);
  }
}
