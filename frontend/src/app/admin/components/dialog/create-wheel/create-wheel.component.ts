import { Component } from '@angular/core';
import { Wheel } from '../../../../model/wheel';
import { Quality } from '../../../../model/quality';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { CloudStorageService } from '../../../../service/cloud-storage.service';
import { handleErrorSnackbar } from '../../../../utils/network';
import { CreateDialog } from '../create-dialog';
import { WheelsService } from '../../../../service/items/wheels.service';

@Component({
  selector: 'app-create-wheel',
  templateUrl: './create-wheel.component.html',
  styleUrls: ['./create-wheel.component.scss']
})
export class CreateWheelComponent extends CreateDialog {

  wheel: Wheel = new Wheel(
    undefined, undefined, '', Quality.COMMON, false
  );

  constructor(dialogRef: MatDialogRef<CreateWheelComponent>,
              cloudService: CloudStorageService,
              private wheelsService: WheelsService,
              private snackBar: MatSnackBar) {
    super(dialogRef, cloudService);
  }

  save() {
    this.wheelsService.add(this.wheel).subscribe(newItem => {
      this.dialogRef.close(newItem);
    }, error => handleErrorSnackbar(error, this.snackBar));
  }
}
