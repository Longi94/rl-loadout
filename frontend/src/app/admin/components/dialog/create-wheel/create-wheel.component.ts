import { Component, Inject } from '@angular/core';
import { Wheel, Quality } from 'rl-loadout-lib';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CloudStorageService } from '../../../../service/cloud-storage.service';
import { CreateDialog } from '../create-dialog';
import { WheelsService } from '../../../../service/items/wheels.service';
import { ProductService } from '../../../../service/product.service';

@Component({
  selector: 'app-create-wheel',
  templateUrl: './create-wheel.component.html',
  styleUrls: ['./create-wheel.component.scss']
})
export class CreateWheelComponent extends CreateDialog<Wheel> {

  productType = 'wheel';

  constructor(dialogRef: MatDialogRef<CreateWheelComponent>,
              cloudService: CloudStorageService,
              wheelsService: WheelsService,
              snackBar: MatSnackBar,
              productService: ProductService,
              @Inject(MAT_DIALOG_DATA) data: Wheel) {
    super(dialogRef, cloudService, snackBar, data, productService, wheelsService);
    this.item = new Wheel(
      undefined, undefined, '', Quality.COMMON, false
    );
  }

  selectProduct($event: string) {
    super.selectProduct($event);

    const model = this.selectedObjects.find(value => !value.endsWith('draco.glb') && value.endsWith('.glb'));
    if (model != undefined) {
      this.item.model = model;
    }
  }
}
