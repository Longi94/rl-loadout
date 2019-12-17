import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemListComponent } from '../../item-list/item-list.component';
import { CreateAntennaStickComponent } from '../../dialog/create-antenna-stick/create-antenna-stick.component';
import { AntennaSticksService } from '../../../../service/items/antenna-sticks.service';

@Component({
  selector: 'app-antenna-sticks',
  templateUrl: './antenna-sticks.component.html',
  styleUrls: ['./antenna-sticks.component.scss']
})
export class AntennaSticksComponent implements OnInit {

  @ViewChild('itemListComponent', {static: true})
  itemListComponent: ItemListComponent;

  dialogComponent = CreateAntennaStickComponent;

  constructor(public antennaSticksService: AntennaSticksService) {
  }

  ngOnInit() {
  }
}
