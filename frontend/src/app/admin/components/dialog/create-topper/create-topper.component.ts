import { Component, Inject } from '@angular/core';
import { Topper, Quality } from 'rl-loadout-lib';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CloudStorageService } from '../../../../service/cloud-storage.service';
import { CreateDialog } from '../create-dialog';
import { ToppersService } from '../../../../service/items/toppers.service';
import { ProductService } from '../../../../service/product.service';

@Component({
  selector: 'app-create-topper',
  templateUrl: './create-topper.component.html',
  styleUrls: ['./create-topper.component.scss']
})
export class CreateTopperComponent extends CreateDialog<Topper> {

  productType = 'topper';

  constructor(dialogRef: MatDialogRef<CreateTopperComponent>,
              cloudService: CloudStorageService,
              toppersService: ToppersService,
              snackBar: MatSnackBar,
              productService: ProductService,
              @Inject(MAT_DIALOG_DATA) data: Topper) {
    super(dialogRef, cloudService, snackBar, data, productService, toppersService);
    this.item = new Topper(
      undefined, undefined, '', Quality.COMMON, false, undefined, undefined, undefined
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
