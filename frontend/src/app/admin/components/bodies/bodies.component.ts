import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemListComponent } from '../item-list/item-list.component';
import { MatDialog } from '@angular/material';
import { CreateBodyComponent } from '../dialog/create-body/create-body.component';
import { ItemService } from '../../../service/item.service';

@Component({
  selector: 'app-bodies',
  templateUrl: './bodies.component.html',
  styleUrls: ['./bodies.component.scss']
})
export class BodiesComponent implements OnInit {

  @ViewChild('itemListComponent', {static: true})
  itemListComponent: ItemListComponent;

  constructor(private dialog: MatDialog,
              private itemService: ItemService) {
  }

  ngOnInit() {
    this.itemListComponent.createDialog = CreateBodyComponent;
    this.itemService.getBodies().subscribe(items => this.itemListComponent.items = items);
  }
}
