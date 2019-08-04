import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemListComponent } from "../item-list/item-list.component";
import { MatDialog } from "@angular/material";
import { ItemService } from "../../../service/item.service";
import { CreateDecalComponent } from "../dialog/create-decal/create-decal.component";

@Component({
  selector: 'app-decals',
  templateUrl: './decals.component.html',
  styleUrls: ['./decals.component.scss']
})
export class DecalsComponent implements OnInit {

  @ViewChild('itemListComponent', {static: true})
  itemListComponent: ItemListComponent;

  constructor(private dialog: MatDialog,
              private itemService: ItemService) {
  }

  ngOnInit() {
    this.itemListComponent.createDialog = CreateDecalComponent;
    this.itemService.getDecals().subscribe(items => this.itemListComponent.items = items);
  }
}
