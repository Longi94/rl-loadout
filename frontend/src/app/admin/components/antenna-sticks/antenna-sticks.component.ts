import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemListComponent } from "../item-list/item-list.component";
import { LoadoutStoreService } from "../../../service/loadout-store.service";
import { MatDialog } from "@angular/material";
import { ItemService } from "../../../service/item.service";
import { CreateBodyComponent } from "../dialog/create-body/create-body.component";

@Component({
  selector: 'app-antenna-sticks',
  templateUrl: './antenna-sticks.component.html',
  styleUrls: ['./antenna-sticks.component.scss']
})
export class AntennaSticksComponent implements OnInit {

  @ViewChild('itemListComponent', {static: true})
  itemListComponent: ItemListComponent;

  constructor(private dialog: MatDialog,
              private itemService: ItemService) {
  }

  ngOnInit() {
    this.itemListComponent.createDialog = undefined;
    this.itemService.getAntennaSticks().subscribe(items => this.itemListComponent.items = items);
  }
}
