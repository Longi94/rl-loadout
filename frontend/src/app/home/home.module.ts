import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasComponent } from './components/canvas/canvas.component';
import { HomeComponent } from './components/home/home.component';
import { LoadoutToolbarComponent } from './components/loadout-toolbar/loadout-toolbar.component';
import { LoadoutGridSelectorComponent } from './components/loadout-grid-selector/loadout-grid-selector.component';
import { ColorSelectorComponent } from './components/color-selector/color-selector.component';
import { AboutDialogComponent } from './components/about-dialog/about-dialog.component';
import { TextureViewerComponent } from './components/debug/texture-viewer/texture-viewer.component';
import { SharedMaterialModule } from "../shared-material/shared-material.module";
import { ColorPickerModule } from "ngx-color-picker";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    CanvasComponent,
    HomeComponent,
    LoadoutToolbarComponent,
    LoadoutGridSelectorComponent,
    ColorSelectorComponent,
    AboutDialogComponent,
    TextureViewerComponent
  ],
  imports: [
    CommonModule,
    SharedMaterialModule,
    ColorPickerModule
  ],
  entryComponents: [
    LoadoutGridSelectorComponent,
    ColorSelectorComponent,
    AboutDialogComponent,
    TextureViewerComponent
  ]
})
export class HomeModule { }
