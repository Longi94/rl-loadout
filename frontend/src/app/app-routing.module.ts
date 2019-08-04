import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from "./home/components/home/home.component";
import { LoginComponent } from "./admin/components/login/login.component";
import { MainComponent } from "./admin/components/main/main.component";
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';
import { BodiesComponent } from "./admin/components/bodies/bodies.component";


const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginComponent
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    component: MainComponent,
    children: [
      {
        path: 'bodies',
        pathMatch: 'full',
        component: BodiesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
