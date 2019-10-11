import { Component, OnInit } from '@angular/core';
import { LoadoutService } from '../../../service/loadout.service';
import { ACCENT_COLORS, getColorsForBody, PAINT_COLORS } from 'rl-loadout-lib';
import { Color } from 'three';
import { getTextColor } from "../../../utils/color";

@Component({
  selector: 'app-color-selector',
  templateUrl: './color-selector.component.html',
  styleUrls: ['./color-selector.component.scss']
})
export class ColorSelectorComponent implements OnInit {

  blueColors: string[];
  orangeColors: string[];
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
    },
    topper: {
      label: 'Topper Paint',
      value: '',
      textColor: 'white'
    }
  };

  paintColors = PAINT_COLORS;
  paintColorTypes = ['body', 'decal', 'wheel', 'topper'];

  constructor(private loadoutService: LoadoutService) {

  }

  ngOnInit() {
    const primaryColors = getColorsForBody(this.loadoutService.body);

    this.orangeColors = primaryColors.orange;
    this.blueColors = primaryColors.blue;

    for (const key of Object.keys(this.loadoutService.paints)) {
      this.colors[key].value = `#${this.loadoutService.paints[key].getHexString()}`;
      this.colors[key].textColor = getTextColor(this.loadoutService.paints[key]);
    }
  }

  colorChanged(color: string, type: string) {
    this.colors[type].textColor = getTextColor(new Color(color));
    this.loadoutService.setPaint(type, color);
  }

  selectColor(key, color) {
    this.colors[key].value = color;
    this.colorChanged(color, key);
  }

  clearColor(key: string) {
    this.colors[key].value = undefined;
    this.colorChanged(undefined, key);
  }
}
