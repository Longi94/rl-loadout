import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
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
