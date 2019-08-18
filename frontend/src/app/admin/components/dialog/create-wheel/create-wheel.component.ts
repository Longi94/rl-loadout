import { Component } from '@angular/core';
import { Wheel } from '../../../../model/wheel';
import { Quality } from '../../../../model/quality';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { CloudStorageService } from '../../../../service/cloud-storage.service';
import { ItemService } from '../../../../service/item.service';
import { handleErrorSnackbar } from '../../../../utils/network';
import { CreateDialog } from '../create-dialog';

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
              private itemService: ItemService,
              private snackBar: MatSnackBar) {
    super(dialogRef, cloudService)
  }

  save() {
    this.itemService.addWheel(this.wheel).subscribe(newItem => {
      this.dialogRef.close(newItem);
    }, error => handleErrorSnackbar(error, this.snackBar));
  }
}
