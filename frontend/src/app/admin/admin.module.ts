import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedMaterialModule } from "../shared-material/shared-material.module";
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { RouterModule } from "@angular/router";
import { BodiesComponent } from './components/bodies/bodies.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { CreateBodyComponent } from './components/dialog/create-body/create-body.component';
import { SharedModule } from "../shared/shared.module";
import { DecalDetailsComponent } from './components/decal-details/decal-details.component';
import { DecalsComponent } from './components/decals/decals.component';
import { WheelsComponent } from './components/wheels/wheels.component';
import { ToppersComponent } from './components/toppers/toppers.component';
import { AntennasComponent } from './components/antennas/antennas.component';
import { AntennaSticksComponent } from './components/antenna-sticks/antenna-sticks.component';



@NgModule({
  declarations: [
    LoginComponent,
    MainComponent,
    BodiesComponent,
    ItemListComponent,
    CreateBodyComponent,
    DecalDetailsComponent,
    DecalsComponent,
    WheelsComponent,
    ToppersComponent,
    AntennasComponent,
    AntennaSticksComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    SharedMaterialModule
  ],
  entryComponents: [
    CreateBodyComponent
  ]
})
export class AdminModule { }
