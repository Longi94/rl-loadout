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
import { CreateAntennaComponent } from './components/dialog/create-antenna/create-antenna.component';
import { CreateAntennaStickComponent } from './components/dialog/create-antenna-stick/create-antenna-stick.component';
import { CreateDecalComponent } from './components/dialog/create-decal/create-decal.component';
import { CreateDecalDetailComponent } from './components/dialog/create-decal-detail/create-decal-detail.component';
import { CreateTopperComponent } from './components/dialog/create-topper/create-topper.component';
import { CreateWheelComponent } from './components/dialog/create-wheel/create-wheel.component';
import { ApiKeysComponent } from './components/api-keys/api-keys.component';
import { CreateApiKeyComponent } from './components/api-keys/create-api-key/create-api-key.component';



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
    AntennaSticksComponent,
    CreateAntennaComponent,
    CreateAntennaStickComponent,
    CreateDecalComponent,
    CreateDecalDetailComponent,
    CreateTopperComponent,
    CreateWheelComponent,
    ApiKeysComponent,
    CreateApiKeyComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    SharedMaterialModule
  ],
  entryComponents: [
    CreateBodyComponent,
    CreateAntennaComponent,
    CreateAntennaStickComponent,
    CreateDecalComponent,
    CreateDecalDetailComponent,
    CreateTopperComponent,
    CreateWheelComponent,
    CreateApiKeyComponent
  ]
})
export class AdminModule { }
