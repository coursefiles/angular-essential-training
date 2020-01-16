import { Routes, RouterModule } from '@angular/router';
import { MediaItemFormComponent } from './media-item-form.component';

const newItemRoutes: Routes = [
  { path: '', component: MediaItemFormComponent }
];

export const newItemRouting = RouterModule.forChild(newItemRoutes);