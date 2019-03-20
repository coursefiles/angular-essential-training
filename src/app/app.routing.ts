import { Routes, RouterModule } from '@angular/router';
import { MediaItemListComponent } from './media-item-list.component';

const appRoutes: Routes = [
  { path: 'add', loadChildren: './new-item/new-item.module#NewItemModule' },
  { path: ':medium', component: MediaItemListComponent },
  { path: '', pathMatch: 'full', redirectTo: 'all' }
];

export const routing = RouterModule.forRoot(appRoutes);