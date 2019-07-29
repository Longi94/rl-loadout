import { Component, Input, OnInit } from '@angular/core';
import { getTextColor, PAINT_COLORS } from "../../../utils/color";
import { LoadoutService } from "../../../service/loadout.service";

@Component({
  selector: 'app-painted-selector',
  templateUrl: './painted-selector.component.html',
  styleUrls: ['./painted-selector.component.scss']
})
export class PaintedSelectorComponent implements OnInit {

  @Input('color')
  color;

  @Input('type')
  type: string;

  paintColors = PAINT_COLORS;

  constructor(private loadoutService: LoadoutService) { }

  ngOnInit() {
  }

  colorChanged(color) {
    this.color.textColor = getTextColor(this.color.value);
    this.loadoutService.setPaint(this.type, color);
  }

  selectColor(color) {
    this.color.value = color;
    this.colorChanged(color)
  }

  clearColor() {

  }
}
