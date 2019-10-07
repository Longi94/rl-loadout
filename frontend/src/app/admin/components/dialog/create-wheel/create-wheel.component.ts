import { Component, Inject } from '@angular/core';
import { Wheel, Quality } from '../../../../rl-loadout-lib';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { CloudStorageService } from '../../../../service/cloud-storage.service';
import { CreateDialog } from '../create-dialog';
import { WheelsService } from '../../../../service/items/wheels.service';

@Component({
  selector: 'app-create-wheel',
  templateUrl: './create-wheel.component.html',
  styleUrls: ['./create-wheel.component.scss']
})
export class CreateWheelComponent extends CreateDialog<Wheel> {

  constructor(dialogRef: MatDialogRef<CreateWheelComponent>,
              cloudService: CloudStorageService,
              wheelsService: WheelsService,
              snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) data: Wheel) {
    super(dialogRef, cloudService, snackBar, data, wheelsService);
    this.item = new Wheel(
      undefined, undefined, '', Quality.COMMON, false
    );
  }
}
