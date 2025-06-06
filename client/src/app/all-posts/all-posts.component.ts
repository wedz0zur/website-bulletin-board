import { Component } from '@angular/core';
import { PostService } from '../service/post.service';
import { Router } from '@angular/router';
import { PostsComponent } from "../posts/posts.component"; 

@Component({
  selector: 'app-all-posts',
  standalone: true,
  imports: [PostsComponent],
  templateUrl: './all-posts.component.html',
  styleUrl: './all-posts.component.scss',
})
export class AllPostsComponent {
  posts: any = [];
  constructor(private postService: PostService, private router: Router) {}
  async ngOnInit() {
    this.posts = await this.postService.getPosts();
  }

  goToProduct(id: number) {
    this.router.navigate(['/post', id]);
  }
}

