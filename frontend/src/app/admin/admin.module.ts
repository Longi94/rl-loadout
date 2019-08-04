import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedMaterialModule } from "../shared-material/shared-material.module";
import { LoginComponent } from './components/login/login.component';



@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    SharedMaterialModule
  ]
})
export class AdminModule { }
