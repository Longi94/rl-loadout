import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemListComponent } from '../../item-list/item-list.component';
import { CreateWheelComponent } from '../../dialog/create-wheel/create-wheel.component';
import { WheelsService } from '../../../../service/items/wheels.service';

@Component({
  selector: 'app-wheels',
  templateUrl: '../items.component.html',
  styleUrls: ['../items.component.scss']
})
export class WheelsComponent implements OnInit {

  @ViewChild('itemListComponent', {static: true})
  itemListComponent: ItemListComponent;

  dialogComponent = CreateWheelComponent;

  constructor(private itemService: WheelsService) {
  }

  ngOnInit() {
  }
}
