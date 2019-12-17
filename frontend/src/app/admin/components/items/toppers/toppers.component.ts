import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemListComponent } from '../../item-list/item-list.component';
import { CreateTopperComponent } from '../../dialog/create-topper/create-topper.component';
import { ToppersService } from '../../../../service/items/toppers.service';

@Component({
  selector: 'app-toppers',
  templateUrl: '../items.component.html',
  styleUrls: ['../items.component.scss']
})
export class ToppersComponent implements OnInit {

  @ViewChild('itemListComponent', {static: true})
  itemListComponent: ItemListComponent;

  dialogComponent = CreateTopperComponent;

  constructor(public itemService: ToppersService) {
  }

  ngOnInit() {
  }
}
