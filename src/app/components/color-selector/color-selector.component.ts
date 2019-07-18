import { Component, OnInit } from '@angular/core';
import { LoadoutService } from "../../service/loadout.service";

@Component({
  selector: 'app-color-selector',
  templateUrl: './color-selector.component.html',
  styleUrls: ['./color-selector.component.scss']
})
export class ColorSelectorComponent implements OnInit {
  objectKeys = Object.keys;

  colors = {
    primary: {
      label: 'Primary',
      value: ''
    },
    accent: {
      label: 'Accent',
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
}
