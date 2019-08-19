import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemListComponent } from '../item-list/item-list.component';
import { MatDialog } from '@angular/material';
import { ItemService } from '../../../service/item.service';
import { CreateAntennaStickComponent } from '../dialog/create-antenna-stick/create-antenna-stick.component';

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
    this.itemListComponent.createDialog = CreateAntennaStickComponent;
    this.itemService.getAntennaSticks().subscribe(items => this.itemListComponent.items = items);
  }
}
