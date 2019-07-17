import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSnackBar } from "@angular/material";
import { LoadoutGridSelectorComponent } from "../loadout-grid-selector/loadout-grid-selector.component";
import { Quality } from "../../model/quality";
import { Decal } from "../../model/decal";
import { LoadoutService } from "../../service/loadout.service";

@Component({
  selector: 'app-loadout-toolbar',
  templateUrl: './loadout-toolbar.component.html',
  styleUrls: ['./loadout-toolbar.component.scss']
})
export class LoadoutToolbarComponent implements OnInit {

  @ViewChild('loadoutDropdown', {static: true, read: ViewContainerRef})
  loadoutDropdown: ViewContainerRef;

  selected: string = undefined;

  constructor(private _snackBar: MatSnackBar,
              private componentFactoryResolver: ComponentFactoryResolver,
              private loadoutService: LoadoutService) {
  }

  ngOnInit() {
  }

  showUnsupported(type: string) {
    this._snackBar.open(`${type} are not currently supported.`, undefined, {duration: 2000});
  }

  openDecalsComponent() {
    this.closeDropDown();
    if (this.selected === 'decal') {
      this.selected = undefined;
      return;
    }
    this.selected = 'decal';
    const factory = this.componentFactoryResolver.resolveComponentFactory(LoadoutGridSelectorComponent);
    const component = this.loadoutDropdown.createComponent(factory);

    component.instance.items = [
      new Decal(
        'assets/icons/Thumb_Skin_Flames.jpg',
        'Flames',
        Quality.UNCOMMON,
        'assets/textures/MuscleCar_Flames_RGB.tga',
        false
      ),
      new Decal(
        'assets/icons/Thumb_Skin_Comic.jpg',
        'Funnybook',
        Quality.UNCOMMON,
        'assets/textures/Dominus_funnybook.tga',
        true
      )
    ];

    component.instance.onSelect = item => this.loadoutService.selectDecal(<Decal>item);
  }

  closeDropDown() {
    this.loadoutDropdown.clear();
  }
}
