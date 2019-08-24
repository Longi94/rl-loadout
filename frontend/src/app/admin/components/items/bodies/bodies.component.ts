import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemListComponent } from '../../item-list/item-list.component';
import { CreateBodyComponent } from '../../dialog/create-body/create-body.component';
import { BodiesService } from '../../../../service/items/bodies.service';

@Component({
  selector: 'app-bodies',
  templateUrl: '../items.component.html',
  styleUrls: ['../items.component.scss']
})
export class BodiesComponent implements OnInit {

  @ViewChild('itemListComponent', {static: true})
  itemListComponent: ItemListComponent;

  dialogComponent = CreateBodyComponent;

  constructor(public itemService: BodiesService) {
  }

  ngOnInit() {
  }
}
