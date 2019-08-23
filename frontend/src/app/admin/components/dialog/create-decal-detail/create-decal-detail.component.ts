import { Component, Inject } from '@angular/core';
import { DecalDetail } from '../../../../model/decal';
import { Quality } from '../../../../model/quality';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { CloudStorageService } from '../../../../service/cloud-storage.service';
import { CreateDialog } from '../create-dialog';
import { DecalDetailsService } from '../../../../service/items/decal-details.service';

@Component({
  selector: 'app-create-decal-detail',
  templateUrl: './create-decal-detail.component.html',
  styleUrls: ['./create-decal-detail.component.scss']
})
export class CreateDecalDetailComponent extends CreateDialog<DecalDetail> {

  constructor(dialogRef: MatDialogRef<CreateDecalDetailComponent>,
              cloudService: CloudStorageService,
              decalDetailsService: DecalDetailsService,
              snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) data: DecalDetail) {
    super(dialogRef, cloudService, snackBar, data, decalDetailsService);
    this.item = new DecalDetail(
      undefined, undefined, '', Quality.COMMON, false
    );
  }

}
