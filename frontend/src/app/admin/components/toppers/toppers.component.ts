import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemListComponent } from '../item-list/item-list.component';
import { MatDialog } from '@angular/material';
import { ItemService } from '../../../service/item.service';
import { CreateTopperComponent } from '../dialog/create-topper/create-topper.component';

@Component({
  selector: 'app-toppers',
  templateUrl: './toppers.component.html',
  styleUrls: ['./toppers.component.scss']
})
export class ToppersComponent implements OnInit {

  @ViewChild('itemListComponent', {static: true})
  itemListComponent: ItemListComponent;

  constructor(private dialog: MatDialog,
              private itemService: ItemService) {
  }

  ngOnInit() {
    this.itemListComponent.createDialog = CreateTopperComponent;
    this.itemService.getToppers().subscribe(items => this.itemListComponent.items = items);
  }
}
