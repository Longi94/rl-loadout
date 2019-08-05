import { Component } from '@angular/core';
import { Quality } from "../../../../model/quality";
import { MatDialogRef, MatSnackBar } from "@angular/material";
import { CloudStorageService } from "../../../../service/cloud-storage.service";
import { ItemService } from "../../../../service/item.service";
import { handleErrorSnackbar } from "../../../../utils/network";
import { Antenna, AntennaStick } from "../../../../model/antenna";
import { CreateDialog } from "../create-dialog";

@Component({
  selector: 'app-create-antenna',
  templateUrl: './create-antenna.component.html',
  styleUrls: ['./create-antenna.component.scss']
})
export class CreateAntennaComponent extends CreateDialog {

  antenna: Antenna = new Antenna(
    undefined, undefined, '', Quality.COMMON, false, undefined, undefined, undefined, undefined
  );

  sticks: AntennaStick[];

  constructor(dialogRef: MatDialogRef<CreateAntennaComponent>,
              cloudService: CloudStorageService,
              private itemService: ItemService,
              private snackBar: MatSnackBar) {
    super(dialogRef, cloudService)
  }

  ngOnInit() {
    super.ngOnInit();
    this.itemService.getAntennaSticks().subscribe(sticks => this.sticks = sticks);
  }

  save() {
    this.itemService.addAntenna(this.antenna).subscribe(newItem => {
      this.dialogRef.close(newItem);
    }, error => handleErrorSnackbar(error, this.snackBar));
  }
}
