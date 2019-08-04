import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemListComponent } from "../item-list/item-list.component";
import { MatDialog } from "@angular/material";
import { ItemService } from "../../../service/item.service";

@Component({
  selector: 'app-antennas',
  templateUrl: './antennas.component.html',
  styleUrls: ['./antennas.component.scss']
})
export class AntennasComponent implements OnInit {

  @ViewChild('itemListComponent', {static: true})
  itemListComponent: ItemListComponent;

  constructor(private dialog: MatDialog,
              private itemService: ItemService) {
  }

  ngOnInit() {
    this.itemListComponent.createDialog = undefined;
    this.itemService.getAntennas().subscribe(items => this.itemListComponent.items = items);
  }
}
