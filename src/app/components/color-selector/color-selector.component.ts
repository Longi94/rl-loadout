import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadoutService } from "../../service/loadout.service";
import { BLUE_PRIMARY_COLORS, ORANGE_PRIMARY_COLORS } from "../../utils/color";
import { MatMenuTrigger } from "@angular/material";

@Component({
  selector: 'app-color-selector',
  templateUrl: './color-selector.component.html',
  styleUrls: ['./color-selector.component.scss']
})
export class ColorSelectorComponent implements OnInit {
  objectKeys = Object.keys;

  blueColors = BLUE_PRIMARY_COLORS;
  orangeColors = ORANGE_PRIMARY_COLORS;

  @ViewChild('primaryMenu', {static: true})
  primaryMenu: MatMenuTrigger;

  colors = {
    primary: {
      label: 'Primary',
      value: ''
    },
    accent: {
      label: 'Accent',
      value: ''
    },
    body: {
      label: 'Body Paint',
      value: ''
    },
    decal: {
      label: 'Decal Paint',
      value: ''
    },
    wheel: {
      label: 'Wheel Paint',
      value: ''
    }
  };

  constructor(private loadoutService: LoadoutService) {

  }

  ngOnInit() {
    for (let key of Object.keys(this.loadoutService.paints)) {
      this.colors[key].value = this.loadoutService.paints[key]
    }
  }

  colorChanged(color: string, type: string) {
    this.loadoutService.setPaint(type, color);
  }

  selectColor(event, key, color) {
    this.colors[key].value = color;
    this.colorChanged(color, key);
    event.stopPropagation();
  }
}
