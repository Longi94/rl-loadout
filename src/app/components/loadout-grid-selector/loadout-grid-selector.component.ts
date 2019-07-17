import { Component, Input, OnInit } from '@angular/core';
import { Item } from "../../model/item";

@Component({
  selector: 'app-loadout-grid-selector',
  templateUrl: './loadout-grid-selector.component.html',
  styleUrls: ['./loadout-grid-selector.component.scss']
})
export class LoadoutGridSelectorComponent implements OnInit {

  @Input('items')
  items: Item[];

  constructor() { }

  ngOnInit() {
  }

}
