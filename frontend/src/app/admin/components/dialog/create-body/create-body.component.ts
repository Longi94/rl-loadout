import { Component, Inject } from '@angular/core';
import { Body, Quality } from 'rl-loadout-lib';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CloudStorageService } from '../../../../service/cloud-storage.service';
import { CreateDialog } from '../create-dialog';
import { BodiesService } from '../../../../service/items/bodies.service';

@Component({
  selector: 'app-create-body',
  templateUrl: './create-body.component.html',
  styleUrls: ['./create-body.component.scss']
})
export class CreateBodyComponent extends CreateDialog<Body> {

  productType = 'body';

  constructor(dialogRef: MatDialogRef<CreateBodyComponent>,
              cloudService: CloudStorageService,
              bodiesService: BodiesService,
              snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) data: Body) {
    super(dialogRef, cloudService, snackBar, data, bodiesService);
    this.item = new Body(
      undefined, undefined, '', Quality.COMMON, false
    );
  }

  selectProduct($event: MatSelectChange) {
    super.selectProduct($event);

    const icon = this.selectedObjects.find(value => value.endsWith('.jpg'));
    if (icon != undefined) {
      this.item.icon = icon;
    }

    const model = this.selectedObjects.find(value => !value.endsWith('draco.glb') && value.endsWith('.glb'));
    if (model != undefined) {
      this.item.model = model;
    }
  }
}
