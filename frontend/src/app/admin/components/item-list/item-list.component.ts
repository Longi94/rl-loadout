import { Component, Input, OnInit } from '@angular/core';
import { Item } from "../../../model/item";
import { environment } from "../../../../environments/environment";
import { ItemService } from "../../../service/item.service";

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {

  assetHost = environment.assetHost;
  items: Item[] = [];

  @Input('type')
  type: string;

  constructor(private itemService: ItemService) { }

  ngOnInit() {
  }

  deleteItem(item: Item) {
    switch (this.type) {
      case 'body':
        this.itemService.deleteBody(item.id).subscribe(() => this.items.splice(this.items.indexOf(item), 1));
        break;
      default:
        console.warn(`Unknown item type: ${this.type}`);
        break;
    }
  }
}
