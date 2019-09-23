import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BodiesComponent } from './components/items/bodies/bodies.component';
import { AntennasComponent } from './components/items/antennas/antennas.component';
import { AntennaSticksComponent } from './components/items/antenna-sticks/antenna-sticks.component';
import { DecalsComponent } from './components/items/decals/decals.component';
import { ToppersComponent } from './components/items/toppers/toppers.component';
import { WheelsComponent } from './components/items/wheels/wheels.component';
import { ApiKeysComponent } from './components/api-keys/api-keys.component';
import { AuthGuardService as AuthGuard } from '../auth/auth-guard.service';
import { MainComponent } from './components/main/main.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginComponent
  },
  {
    path: '',
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
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
