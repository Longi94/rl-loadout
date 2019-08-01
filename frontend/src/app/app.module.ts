import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { ColorPickerModule } from "ngx-color-picker";
import { HomeComponent } from './components/home/home.component';
import { LoadoutToolbarComponent } from './components/loadout-toolbar/loadout-toolbar.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
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
  MatSelectModule
} from "@angular/material";
import { LoadoutGridSelectorComponent } from './components/loadout-grid-selector/loadout-grid-selector.component';
import { ColorSelectorComponent } from './components/color-selector/color-selector.component';
import { HttpClientModule } from "@angular/common/http";
import { AboutDialogComponent } from './components/about-dialog/about-dialog.component';
import { TextureViewerComponent } from './components/debug/texture-viewer/texture-viewer.component';
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    HomeComponent,
    LoadoutToolbarComponent,
    LoadoutGridSelectorComponent,
    ColorSelectorComponent,
    AboutDialogComponent,
    TextureViewerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ColorPickerModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatProgressBarModule,
    MatRippleModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    LoadoutGridSelectorComponent,
    ColorSelectorComponent,
    AboutDialogComponent,
    TextureViewerComponent
  ]
})
export class AppModule { }
