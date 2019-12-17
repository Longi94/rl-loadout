import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/components/home/home.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(mod => mod.AdminModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
