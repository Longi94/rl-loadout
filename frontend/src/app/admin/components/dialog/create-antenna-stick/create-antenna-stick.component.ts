import { Component } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { CloudStorageService } from '../../../../service/cloud-storage.service';
import { AntennaStick } from '../../../../model/antenna';
import { handleErrorSnackbar } from '../../../../utils/network';
import { CreateDialog } from '../create-dialog';
import { AntennaSticksService } from '../../../../service/items/antenna-sticks.service';

@Component({
  selector: 'app-create-antenna-stick',
  templateUrl: './create-antenna-stick.component.html',
  styleUrls: ['./create-antenna-stick.component.scss']
})
export class CreateAntennaStickComponent extends CreateDialog {

  antennaStick: AntennaStick = new AntennaStick();

  constructor(dialogRef: MatDialogRef<CreateAntennaStickComponent>,
              cloudService: CloudStorageService,
              private antennaSticksService: AntennaSticksService,
              private snackBar: MatSnackBar) {
    super(dialogRef, cloudService);
  }

  save() {
    this.antennaSticksService.add(this.antennaStick).subscribe(newItem => {
      this.dialogRef.close(newItem);
    }, error => handleErrorSnackbar(error, this.snackBar));
  }
}
