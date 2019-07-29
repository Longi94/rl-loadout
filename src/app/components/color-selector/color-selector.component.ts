import { Component, OnInit } from '@angular/core';
import { LoadoutService } from "../../service/loadout.service";
import { ACCENT_COLORS, BLUE_PRIMARY_COLORS, getTextColor, ORANGE_PRIMARY_COLORS } from "../../utils/color";

@Component({
  selector: 'app-color-selector',
  templateUrl: './color-selector.component.html',
  styleUrls: ['./color-selector.component.scss']
})
export class ColorSelectorComponent implements OnInit {
  objectKeys = Object.keys;

  blueColors = BLUE_PRIMARY_COLORS;
  orangeColors = ORANGE_PRIMARY_COLORS;
  accentColors = ACCENT_COLORS;

  colors = {
    primary: {
      label: 'Primary',
      value: '',
      textColor: 'white'
    },
    accent: {
      label: 'Accent',
      value: '',
      textColor: 'white'
    },
    body: {
      label: 'Body Paint',
      value: '',
      textColor: 'white'
    },
    decal: {
      label: 'Decal Paint',
      value: '',
      textColor: 'white'
    },
    wheel: {
      label: 'Wheel Paint',
      value: '',
      textColor: 'white'
    }
  };

  constructor(private loadoutService: LoadoutService) {

  }

  ngOnInit() {
    for (let key of Object.keys(this.loadoutService.paints)) {
      this.colors[key].value = this.loadoutService.paints[key];
      this.colors[key].textColor = getTextColor(this.colors[key].value);
    }
  }

  colorChanged(color: string, type: string) {
    this.colors[type].textColor = getTextColor(color);
    this.loadoutService.setPaint(type, color);
  }

  selectColor(event, key, color) {
    this.colors[key].value = color;
    this.colorChanged(color, key);
    event.stopPropagation();
  }
}
