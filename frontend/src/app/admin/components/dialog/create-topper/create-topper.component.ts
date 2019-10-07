import { Component, Inject } from '@angular/core';
import { Topper, Quality } from '../../../../rl-loadout-lib';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { CloudStorageService } from '../../../../service/cloud-storage.service';
import { CreateDialog } from '../create-dialog';
import { ToppersService } from '../../../../service/items/toppers.service';

@Component({
  selector: 'app-create-topper',
  templateUrl: './create-topper.component.html',
  styleUrls: ['./create-topper.component.scss']
})
export class CreateTopperComponent extends CreateDialog<Topper> {

  constructor(dialogRef: MatDialogRef<CreateTopperComponent>,
              cloudService: CloudStorageService,
              toppersService: ToppersService,
              snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) data: Topper) {
    super(dialogRef, cloudService, snackBar, data, toppersService);
    this.item = new Topper(
      undefined, undefined, '', Quality.COMMON, false, undefined, undefined, undefined
    );
  }

}
