import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedMaterialModule } from "../shared-material/shared-material.module";
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { RouterModule } from "@angular/router";
import { BodiesComponent } from './components/bodies/bodies.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { CreateBodyComponent } from './components/dialog/create-body/create-body.component';



@NgModule({
  declarations: [
    LoginComponent,
    MainComponent,
    BodiesComponent,
    ItemListComponent,
    CreateBodyComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedMaterialModule
  ],
  entryComponents: [
    CreateBodyComponent
  ]
})
export class AdminModule { }
