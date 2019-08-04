import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedMaterialModule } from "../shared-material/shared-material.module";
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { RouterModule } from "@angular/router";



@NgModule({
  declarations: [LoginComponent, MainComponent],
  imports: [
    CommonModule,
    RouterModule,
    SharedMaterialModule
  ]
})
export class AdminModule { }
