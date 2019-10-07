import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { CloudStorageService } from '../../../../service/cloud-storage.service';
import { AntennaStick } from '../../../../rl-loadout-lib';
import { CreateDialog } from '../create-dialog';
import { AntennaSticksService } from '../../../../service/items/antenna-sticks.service';

@Component({
  selector: 'app-create-antenna-stick',
  templateUrl: './create-antenna-stick.component.html',
  styleUrls: ['./create-antenna-stick.component.scss']
})
export class CreateAntennaStickComponent extends CreateDialog<AntennaStick> {

  constructor(dialogRef: MatDialogRef<CreateAntennaStickComponent>,
              cloudService: CloudStorageService,
              antennaSticksService: AntennaSticksService,
              snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) data: AntennaStick) {
    super(dialogRef, cloudService, snackBar, data, antennaSticksService);
    this.item = new AntennaStick();
  }

}
