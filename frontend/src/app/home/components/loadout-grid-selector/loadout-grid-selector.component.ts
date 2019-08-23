import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../../model/item';
import { Quality } from '../../../model/quality';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-loadout-grid-selector',
  templateUrl: './loadout-grid-selector.component.html',
  styleUrls: ['./loadout-grid-selector.component.scss']
})
export class LoadoutGridSelectorComponent implements OnInit {

  assetHost = environment.assetHost;

  items: Item[];

  onSelect: (item: Item) => void;

  qCommon = Quality.COMMON;
  qUncommon = Quality.UNCOMMON;
  qRare = Quality.RARE;
  qVeryRare = Quality.VERY_RARE;
  qImport = Quality.IMPORT;
  qExotic = Quality.EXOTIC;
  qBlackMarket = Quality.BLACK_MARKET;
  qLimited = Quality.LIMITED;
  qPremium = Quality.PREMIUM;

  selectedItem: Item = new Item(0, '', '', 0, false);

  filter: string;

  constructor() { }

  ngOnInit() {
  }

  selectItem(item: Item) {
    this.selectedItem = item;
    if (this.onSelect) {
      this.onSelect(item);
    }
  }
}
