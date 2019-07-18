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
  MatGridListModule
} from "@angular/material";
import { LoadoutGridSelectorComponent } from './components/loadout-grid-selector/loadout-grid-selector.component';
import { ColorSelectorComponent } from './components/color-selector/color-selector.component';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    HomeComponent,
    LoadoutToolbarComponent,
    LoadoutGridSelectorComponent,
    ColorSelectorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ColorPickerModule,
    MatButtonModule,
    MatGridListModule,
    MatRippleModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    LoadoutGridSelectorComponent,
    ColorSelectorComponent
  ]
})
export class AppModule { }
