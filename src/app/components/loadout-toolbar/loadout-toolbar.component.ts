import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSnackBar } from "@angular/material";
import { LoadoutGridSelectorComponent } from "../loadout-grid-selector/loadout-grid-selector.component";
import { Decal } from "../../model/decal";
import { LoadoutService } from "../../service/loadout.service";
import { ColorSelectorComponent } from "../color-selector/color-selector.component";
import { Wheel } from "../../model/wheel";
import { LoadoutStoreService } from "../../service/loadout-store.service";
import { Body } from "../../model/body";

@Component({
  selector: 'app-loadout-toolbar',
  templateUrl: './loadout-toolbar.component.html',
  styleUrls: ['./loadout-toolbar.component.scss']
})
export class LoadoutToolbarComponent implements OnInit {

  @ViewChild('loadoutDropdown', {static: true, read: ViewContainerRef})
  loadoutDropdown: ViewContainerRef;

  selected: Toolbar = undefined;

  constructor(private _snackBar: MatSnackBar,
              private componentFactoryResolver: ComponentFactoryResolver,
              private loadoutService: LoadoutService,
              private loadoutStore: LoadoutStoreService) {
  }

  ngOnInit() {
  }

  showUnsupported(type: string) {
    this._snackBar.open(`${type} are not currently supported.`, undefined, {duration: 2000});
  }

  createNewGRidSelector(toolbar: Toolbar): ComponentRef<LoadoutGridSelectorComponent> {
    this.closeDropDown();
    if (this.selected === toolbar) {
      this.selected = undefined;
      return;
    }
    this.selected = toolbar;
    const factory = this.componentFactoryResolver.resolveComponentFactory(LoadoutGridSelectorComponent);
    return this.loadoutDropdown.createComponent(factory);
  }

  openBodiesComponent() {
    const component = this.createNewGRidSelector(Toolbar.BODY);
    component.instance.items = this.loadoutStore.bodies;
    component.instance.selectedItem = this.loadoutService.body;
    component.instance.onSelect = item => this.loadoutService.selectBody(<Body>item);
  }

  openDecalsComponent() {
    const component = this.createNewGRidSelector(Toolbar.DECAL);
    component.instance.items = this.loadoutStore.decals.slice();
    component.instance.items.unshift(Decal.NONE);
    component.instance.selectedItem = this.loadoutService.decal;
    component.instance.onSelect = item => this.loadoutService.selectDecal(<Decal>item);
  }

  openWheelComponent() {
    const component = this.createNewGRidSelector(Toolbar.WHEEL);
    component.instance.items = this.loadoutStore.wheels;
    component.instance.selectedItem = this.loadoutService.wheel;
    component.instance.onSelect = item => this.loadoutService.selectWheel(<Wheel>item);
  }

  openPaintsComponent() {
    this.closeDropDown();
    if (this.selected === Toolbar.PAINT) {
      this.selected = undefined;
      return;
    }
    this.selected = Toolbar.PAINT;
    const factory = this.componentFactoryResolver.resolveComponentFactory(ColorSelectorComponent);
    this.loadoutDropdown.createComponent(factory);
  }

  closeDropDown() {
    this.loadoutDropdown.clear();
  }
}

enum Toolbar {
  BODY, DECAL, PAINT, WHEEL
}
