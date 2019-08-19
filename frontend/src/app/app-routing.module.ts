import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/components/home/home.component';
import { LoginComponent } from './admin/components/login/login.component';
import { MainComponent } from './admin/components/main/main.component';
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';
import { BodiesComponent } from './admin/components/bodies/bodies.component';
import { AntennasComponent } from './admin/components/antennas/antennas.component';
import { AntennaSticksComponent } from './admin/components/antenna-sticks/antenna-sticks.component';
import { DecalsComponent } from './admin/components/decals/decals.component';
import { DecalDetailsComponent } from './admin/components/decal-details/decal-details.component';
import { ToppersComponent } from './admin/components/toppers/toppers.component';
import { WheelsComponent } from './admin/components/wheels/wheels.component';
import { ApiKeysComponent } from './admin/components/api-keys/api-keys.component';


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
      },
      {
        path: 'antennas',
        pathMatch: 'full',
        component: AntennasComponent
      },
      {
        path: 'antenna-sticks',
        pathMatch: 'full',
        component: AntennaSticksComponent
      },
      {
        path: 'decals',
        pathMatch: 'full',
        component: DecalsComponent
      },
      {
        path: 'decal-details',
        pathMatch: 'full',
        component: DecalDetailsComponent
      },
      {
        path: 'toppers',
        pathMatch: 'full',
        component: ToppersComponent
      },
      {
        path: 'wheels',
        pathMatch: 'full',
        component: WheelsComponent
      },
      {
        path: 'api-keys',
        pathMatch: 'full',
        component: ApiKeysComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
