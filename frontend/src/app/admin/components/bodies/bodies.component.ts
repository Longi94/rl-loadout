import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadoutStoreService } from "../../../service/loadout-store.service";
import { ItemListComponent } from "../item-list/item-list.component";
import { MatDialog } from "@angular/material";
import { CreateBodyComponent } from "../dialog/create-body/create-body.component";
import { Body } from "../../../model/body";
import { ItemService } from "../../../service/item.service";

@Component({
  selector: 'app-bodies',
  templateUrl: './bodies.component.html',
  styleUrls: ['./bodies.component.scss']
})
export class BodiesComponent implements OnInit {

  @ViewChild('itemListComponent', {static: true})
  itemListComponent: ItemListComponent;

  constructor(private loadoutStore: LoadoutStoreService,
              private dialog: MatDialog,
              private itemService: ItemService) {
  }

  ngOnInit() {
    this.loadoutStore.initBodies().then(() => {
      this.itemListComponent.items = this.loadoutStore.bodies;
    });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(CreateBodyComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(newBody => {
      if (newBody != undefined) {
        this.itemListComponent.items.push(newBody);
      }
    });
  }
}
