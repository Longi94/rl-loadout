import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemListComponent } from '../../item-list/item-list.component';
import { CreateDecalDetailComponent } from '../../dialog/create-decal-detail/create-decal-detail.component';
import { DecalDetailsService } from '../../../../service/items/decal-details.service';

@Component({
  selector: 'app-decal-details',
  templateUrl: '../items.component.html',
  styleUrls: ['../items.component.scss']
})
export class DecalDetailsComponent implements OnInit {

  @ViewChild('itemListComponent', {static: true})
  itemListComponent: ItemListComponent;

  dialogComponent = CreateDecalDetailComponent;

  constructor(public itemService: DecalDetailsService) {
  }

  ngOnInit() {
  }
}
