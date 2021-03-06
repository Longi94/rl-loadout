import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedMaterialModule } from '../shared-material/shared-material.module';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { RouterModule } from '@angular/router';
import { BodiesComponent } from './components/items/bodies/bodies.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { CreateBodyComponent } from './components/dialog/create-body/create-body.component';
import { SharedModule } from '../shared/shared.module';
import { DecalsComponent } from './components/items/decals/decals.component';
import { WheelsComponent } from './components/items/wheels/wheels.component';
import { ToppersComponent } from './components/items/toppers/toppers.component';
import { AntennasComponent } from './components/items/antennas/antennas.component';
import { AntennaSticksComponent } from './components/items/antenna-sticks/antenna-sticks.component';
import { CreateAntennaComponent } from './components/dialog/create-antenna/create-antenna.component';
import { CreateAntennaStickComponent } from './components/dialog/create-antenna-stick/create-antenna-stick.component';
import { CreateDecalComponent } from './components/dialog/create-decal/create-decal.component';
import { CreateTopperComponent } from './components/dialog/create-topper/create-topper.component';
import { CreateWheelComponent } from './components/dialog/create-wheel/create-wheel.component';
import { ApiKeysComponent } from './components/api-keys/api-keys.component';
import { CreateApiKeyComponent } from './components/api-keys/create-api-key/create-api-key.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ProductUploadComponent } from './components/product-upload/product-upload.component';



@NgModule({
  declarations: [
    LoginComponent,
    MainComponent,
    BodiesComponent,
    ItemListComponent,
    CreateBodyComponent,
    DecalsComponent,
    WheelsComponent,
    ToppersComponent,
    AntennasComponent,
    AntennaSticksComponent,
    CreateAntennaComponent,
    CreateAntennaStickComponent,
    CreateDecalComponent,
    CreateTopperComponent,
    CreateWheelComponent,
    ApiKeysComponent,
    CreateApiKeyComponent,
    ProductUploadComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AdminRoutingModule,
    SharedModule,
    SharedMaterialModule
  ],
  entryComponents: [
    CreateBodyComponent,
    CreateAntennaComponent,
    CreateAntennaStickComponent,
    CreateDecalComponent,
    CreateTopperComponent,
    CreateWheelComponent,
    CreateApiKeyComponent
  ]
})
export class AdminModule { }
