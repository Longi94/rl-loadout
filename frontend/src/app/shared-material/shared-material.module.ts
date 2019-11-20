import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatAutocompleteModule,
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
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    MatAutocompleteModule,
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
    MatCheckboxModule,
    NgxMatSelectSearchModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    MatAutocompleteModule,
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
    MatCheckboxModule,
    NgxMatSelectSearchModule
  ]
})
export class SharedMaterialModule {
}
