import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSnackBar } from "@angular/material";
import { LoadoutGridSelectorComponent } from "../loadout-grid-selector/loadout-grid-selector.component";
import { Quality } from "../../model/quality";

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
              private componentFactoryResolver: ComponentFactoryResolver) {
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
      {
        icon: 'assets/icons/Thumb_Skin_Flames.jpg',
        name: 'Flames',
        quality: Quality.UNCOMMON
      },
      {
        icon: 'assets/icons/Thumb_Skin_Comic.jpg',
        name: 'Funnybook',
        quality: Quality.UNCOMMON
      }
    ]
  }

  closeDropDown() {
    this.loadoutDropdown.clear();
  }
}
