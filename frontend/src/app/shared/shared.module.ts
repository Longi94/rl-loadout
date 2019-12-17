import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { SharedMaterialModule } from '../shared-material/shared-material.module';



@NgModule({
  declarations: [ConfirmDialogComponent],
  imports: [
    CommonModule,
    SharedMaterialModule
  ],
  entryComponents: [ConfirmDialogComponent]
})
export class SharedModule { }
