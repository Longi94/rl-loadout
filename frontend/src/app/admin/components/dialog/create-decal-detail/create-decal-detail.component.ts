import { Component } from '@angular/core';
import { DecalDetail } from "../../../../model/decal";
import { Quality } from "../../../../model/quality";
import { MatDialogRef, MatSnackBar } from "@angular/material";
import { CloudStorageService } from "../../../../service/cloud-storage.service";
import { ItemService } from "../../../../service/item.service";
import { handleErrorSnackbar } from "../../../../utils/network";
import { CreateDialog } from "../create-dialog";

@Component({
  selector: 'app-create-decal-detail',
  templateUrl: './create-decal-detail.component.html',
  styleUrls: ['./create-decal-detail.component.scss']
})
export class CreateDecalDetailComponent extends CreateDialog {

  decalDetail: DecalDetail = new DecalDetail(
    undefined, undefined, '', Quality.COMMON, false
  );

  constructor(dialogRef: MatDialogRef<CreateDecalDetailComponent>,
              cloudService: CloudStorageService,
              private itemService: ItemService,
              private snackBar: MatSnackBar) {
    super(dialogRef, cloudService)
  }

  save() {
    this.itemService.addDecalDetail(this.decalDetail).subscribe(newItem => {
      this.dialogRef.close(newItem);
    }, error => handleErrorSnackbar(error, this.snackBar));
  }
}
