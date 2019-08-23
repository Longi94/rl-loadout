import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemListComponent } from '../../item-list/item-list.component';
import { CreateAntennaComponent } from '../../dialog/create-antenna/create-antenna.component';
import { AntennasService } from '../../../../service/items/antennas.service';

@Component({
  selector: 'app-antennas',
  templateUrl: '../items.component.html',
  styleUrls: ['../items.component.scss']
})
export class AntennasComponent implements OnInit {

  @ViewChild('itemListComponent', {static: true})
  itemListComponent: ItemListComponent;

  dialogComponent = CreateAntennaComponent;

  constructor(public itemService: AntennasService) {
  }

  ngOnInit() {
  }
}
