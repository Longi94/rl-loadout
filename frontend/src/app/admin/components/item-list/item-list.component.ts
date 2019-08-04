import { Component, Input, OnInit } from '@angular/core';
import { Item } from "../../../model/item";
import { environment } from "../../../../environments/environment";

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {

  assetHost = environment.assetHost;
  items: Item[] = [];

  constructor() { }

  ngOnInit() {
  }

}
