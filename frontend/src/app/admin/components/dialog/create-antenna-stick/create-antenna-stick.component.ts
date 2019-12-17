import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CloudStorageService } from '../../../../service/cloud-storage.service';
import { AntennaStick } from 'rl-loadout-lib';
import { CreateDialog } from '../create-dialog';
import { AntennaSticksService } from '../../../../service/items/antenna-sticks.service';
import { ProductService } from '../../../../service/product.service';

@Component({
  selector: 'app-create-antenna-stick',
  templateUrl: './create-antenna-stick.component.html',
  styleUrls: ['./create-antenna-stick.component.scss']
})
export class CreateAntennaStickComponent extends CreateDialog<AntennaStick> {

  constructor(dialogRef: MatDialogRef<CreateAntennaStickComponent>,
              cloudService: CloudStorageService,
              antennaSticksService: AntennaSticksService,
              snackBar: MatSnackBar,
              productService: ProductService,
              @Inject(MAT_DIALOG_DATA) data: AntennaStick) {
    super(dialogRef, cloudService, snackBar, data, productService, antennaSticksService);
    this.item = new AntennaStick();
  }

}
