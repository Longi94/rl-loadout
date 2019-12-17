import { Component, Inject, OnInit } from '@angular/core';
import { Quality, Antenna, AntennaStick } from 'rl-loadout-lib';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CloudStorageService } from '../../../../service/cloud-storage.service';
import { CreateDialog } from '../create-dialog';
import { AntennasService } from '../../../../service/items/antennas.service';
import { AntennaSticksService } from '../../../../service/items/antenna-sticks.service';
import { ProductService } from '../../../../service/product.service';

@Component({
  selector: 'app-create-antenna',
  templateUrl: './create-antenna.component.html',
  styleUrls: ['./create-antenna.component.scss']
})
export class CreateAntennaComponent extends CreateDialog<Antenna> implements OnInit {

  productType = 'antenna';

  sticks: AntennaStick[];

  constructor(dialogRef: MatDialogRef<CreateAntennaComponent>,
              cloudService: CloudStorageService,
              antennasService: AntennasService,
              private antennaSticksService: AntennaSticksService,
              productService: ProductService,
              snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) data: Antenna) {
    super(dialogRef, cloudService, snackBar, data, productService, antennasService);
    this.item = new Antenna(
      undefined, undefined, '', Quality.COMMON, false
    );
  }

  ngOnInit() {
    super.ngOnInit();
    this.antennaSticksService.getAll().subscribe(sticks => this.sticks = sticks);
  }

  selectProduct($event: string) {
    super.selectProduct($event);

    const model = this.selectedObjects.find(value => !value.endsWith('draco.glb') && value.endsWith('.glb'));
    if (model != undefined) {
      this.item.model = model;
    }
  }
}
