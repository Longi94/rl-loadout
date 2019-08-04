import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemListComponent } from "../item-list/item-list.component";
import { MatDialog } from "@angular/material";
import { ItemService } from "../../../service/item.service";

@Component({
  selector: 'app-decal-details',
  templateUrl: './decal-details.component.html',
  styleUrls: ['./decal-details.component.scss']
})
export class DecalDetailsComponent implements OnInit {

  @ViewChild('itemListComponent', {static: true})
  itemListComponent: ItemListComponent;

  constructor(private dialog: MatDialog,
              private itemService: ItemService) {
  }

  ngOnInit() {
    this.itemListComponent.createDialog = undefined;
    this.itemService.getDecalDetails().subscribe(items => this.itemListComponent.items = items);
  }
}
