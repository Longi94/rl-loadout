import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { ColorPickerModule } from "ngx-color-picker";
import { HomeComponent } from './components/home/home.component';
import { LoadoutToolbarComponent } from './components/loadout-toolbar/loadout-toolbar.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule, MatRippleModule, MatTooltipModule, MatSnackBarModule } from "@angular/material";

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    HomeComponent,
    LoadoutToolbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ColorPickerModule,
    MatButtonModule,
    MatRippleModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
