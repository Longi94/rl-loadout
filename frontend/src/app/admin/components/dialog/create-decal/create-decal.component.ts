import { Component } from '@angular/core';
import { Decal, DecalDetail } from "../../../../model/decal";
import { Quality } from "../../../../model/quality";
import { MatDialogRef, MatSnackBar } from "@angular/material";
import { CloudStorageService } from "../../../../service/cloud-storage.service";
import { ItemService } from "../../../../service/item.service";
import { handleErrorSnackbar } from "../../../../utils/network";
import { CreateDialog } from "../create-dialog";
import { getWorkspaceDetails } from "@angular/cli/utilities/project";
import { Body } from "../../../../model/body";

@Component({
  selector: 'app-create-decal',
  templateUrl: './create-decal.component.html',
  styleUrls: ['./create-decal.component.scss']
})
export class CreateDecalComponent extends CreateDialog {

  decal: Decal = new Decal(
    undefined, undefined, '', Quality.COMMON, false, undefined, undefined
  );

  decalDetails: DecalDetail[];
  bodies: Body[];

  constructor(dialogRef: MatDialogRef<CreateDecalComponent>,
              cloudService: CloudStorageService,
              private itemService: ItemService,
              private snackBar: MatSnackBar) {
    super(dialogRef, cloudService)
  }

  ngOnInit() {
    super.ngOnInit();
    this.itemService.getDecalDetails().subscribe(details => this.decalDetails = details);
    this.itemService.getBodies().subscribe(bodies => this.bodies = bodies);
  }

  save() {
    this.itemService.addDecal(this.decal).subscribe(newItem => {
      this.dialogRef.close(newItem);
    }, error => handleErrorSnackbar(error, this.snackBar));
  }
}