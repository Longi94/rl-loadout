import { Component, Inject } from '@angular/core';
import { Body } from '../../../../model/body';
import { Quality } from '../../../../model/quality';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { CloudStorageService } from '../../../../service/cloud-storage.service';
import { CreateDialog } from '../create-dialog';
import { BodiesService } from '../../../../service/items/bodies.service';

@Component({
  selector: 'app-create-body',
  templateUrl: './create-body.component.html',
  styleUrls: ['./create-body.component.scss']
})
export class CreateBodyComponent extends CreateDialog<Body> {

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

}
