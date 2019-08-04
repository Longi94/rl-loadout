import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from "@angular/material";
import { CloudStorageService } from "../../../../service/cloud-storage.service";
import { ItemService } from "../../../../service/item.service";
import { AntennaStick } from "../../../../model/antenna";
import { handleErrorSnackbar } from "../../../../utils/network";
import { CreateDialog } from "../create-dialog";

@Component({
  selector: 'app-create-antenna-stick',
  templateUrl: './create-antenna-stick.component.html',
  styleUrls: ['./create-antenna-stick.component.scss']
})
export class CreateAntennaStickComponent extends CreateDialog implements OnInit {

  antennaStick: AntennaStick = new AntennaStick();

  constructor(dialogRef: MatDialogRef<CreateAntennaStickComponent>,
              cloudService: CloudStorageService,
              private itemService: ItemService,
              private snackBar: MatSnackBar) {
    super(dialogRef, cloudService)
  }

  ngOnInit() {
  }

  save() {
    this.itemService.addAntennaStick(this.antennaStick).subscribe(newItem => {
      this.dialogRef.close(newItem);
    }, error => handleErrorSnackbar(error, this.snackBar));
  }
}
