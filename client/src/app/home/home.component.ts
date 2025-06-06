import { Component } from '@angular/core';
import { CategoriesComponent } from "../categories/categories.component";
import { AllPostsComponent } from '../all-posts/all-posts.component';

@Component({
  selector: 'app-home',
  imports: [CategoriesComponent, AllPostsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
