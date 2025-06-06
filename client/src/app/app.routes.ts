import { Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { CarComponent } from './car/car.component';
import { PostPageComponent } from './post-page/post-page.component';
import { ClothesComponent } from './clothes/clothes.component';
import { AnimalsComponent } from './animals/animals.component';
import { PartsComponent } from './parts/parts.component';
import { ElectronicsComponent } from './electronics/electronics.component';
import { ServicePageComponent } from './service-page/service-page.component';
import { BeautyComponent } from './beauty/beauty.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { SubsubcategoryDetailComponent } from './subsubcategory-detail/subsubcategory-detail.component';
import { FavoritesComponent } from './favorites/favorites.component';

export const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "profile", component: ProfileComponent },
  { path: "post/:id", component: PostPageComponent },
  { path: "car", component: CarComponent },
  { path: "clothes", component: ClothesComponent },
  { path: "animals", component: AnimalsComponent },
  { path: "parts", component: PartsComponent },
  { path: "electronics", component: ElectronicsComponent },
  { path: "service-page", component: ServicePageComponent },
  { path: "beauty", component: BeautyComponent },
  { path: "additem", component: CreatePostComponent },
  { path: 'subsubcategory-detail', component: SubsubcategoryDetailComponent },
  { path: 'favorites', component: FavoritesComponent }

];
