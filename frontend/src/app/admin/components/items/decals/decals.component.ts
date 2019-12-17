import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemListComponent } from '../../item-list/item-list.component';
import { CreateDecalComponent } from '../../dialog/create-decal/create-decal.component';
import { DecalsService } from '../../../../service/items/decals.service';

@Component({
  selector: 'app-decals',
  templateUrl: './decals.component.html',
  styleUrls: ['./decals.component.scss']
})
export class DecalsComponent implements OnInit {

  @ViewChild('itemListComponent', {static: true})
  itemListComponent: ItemListComponent;

  dialogComponent = CreateDecalComponent;

  constructor(public itemService: DecalsService) {
  }

  ngOnInit() {
  }
}
