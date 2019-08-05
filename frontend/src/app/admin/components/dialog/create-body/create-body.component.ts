import { Component } from '@angular/core';
import { Body } from "../../../../model/body";
import { Quality } from "../../../../model/quality";
import { MatDialogRef, MatSnackBar } from "@angular/material";
import { CloudStorageService } from "../../../../service/cloud-storage.service";
import { ItemService } from "../../../../service/item.service";
import { handleErrorSnackbar } from "../../../../utils/network";
import { CreateDialog } from "../create-dialog";

@Component({
  selector: 'app-create-body',
  templateUrl: './create-body.component.html',
  styleUrls: ['./create-body.component.scss']
})
export class CreateBodyComponent extends CreateDialog {

  body: Body = new Body(
    undefined, undefined, '', Quality.COMMON, false
  );

  constructor(dialogRef: MatDialogRef<CreateBodyComponent>,
              cloudService: CloudStorageService,
              private itemService: ItemService,
              private snackBar: MatSnackBar) {
    super(dialogRef, cloudService)
  }

  save() {
    this.itemService.addBody(this.body).subscribe(newBody => {
      this.dialogRef.close(newBody);
    }, error => handleErrorSnackbar(error, this.snackBar));
  }
}
