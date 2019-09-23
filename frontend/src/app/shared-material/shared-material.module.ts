import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatRippleModule,
  MatTooltipModule,
  MatSnackBarModule,
  MatGridListModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatIconModule,
  MatToolbarModule,
  MatDialogModule,
  MatMenuModule,
  MatExpansionModule,
  MatInputModule,
  MatSelectModule,
  MatCardModule,
  MatListModule,
  MatCheckboxModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatRippleModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatGridListModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatToolbarModule,
    MatDialogModule,
    MatMenuModule,
    MatExpansionModule,
    MatInputModule,
    MatSelectModule,
    MatListModule,
    MatCheckboxModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatRippleModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatGridListModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatToolbarModule,
    MatDialogModule,
    MatMenuModule,
    MatExpansionModule,
    MatInputModule,
    MatSelectModule,
    MatListModule,
    MatCheckboxModule
  ]
})
export class SharedMaterialModule { }
