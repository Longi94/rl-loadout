import { Component } from '@angular/core';
import { Topper } from '../../../../model/topper';
import { Quality } from '../../../../model/quality';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { CloudStorageService } from '../../../../service/cloud-storage.service';
import { handleErrorSnackbar } from '../../../../utils/network';
import { CreateDialog } from '../create-dialog';
import { ToppersService } from '../../../../service/items/toppers.service';

@Component({
  selector: 'app-create-topper',
  templateUrl: './create-topper.component.html',
  styleUrls: ['./create-topper.component.scss']
})
export class CreateTopperComponent extends CreateDialog {

  topper: Topper = new Topper(
    undefined, undefined, '', Quality.COMMON, false, undefined, undefined, undefined
  );

  constructor(dialogRef: MatDialogRef<CreateTopperComponent>,
              cloudService: CloudStorageService,
              private toppersService: ToppersService,
              private snackBar: MatSnackBar) {
    super(dialogRef, cloudService);
  }

  save() {
    this.toppersService.add(this.topper).subscribe(newItem => {
      this.dialogRef.close(newItem);
    }, error => handleErrorSnackbar(error, this.snackBar));
  }
}
