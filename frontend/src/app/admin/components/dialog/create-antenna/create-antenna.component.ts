import { Component, Inject, OnInit } from '@angular/core';
import { Quality, Antenna, AntennaStick } from 'rl-loadout-lib';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { CloudStorageService } from '../../../../service/cloud-storage.service';
import { CreateDialog } from '../create-dialog';
import { AntennasService } from '../../../../service/items/antennas.service';
import { AntennaSticksService } from '../../../../service/items/antenna-sticks.service';

@Component({
  selector: 'app-create-antenna',
  templateUrl: './create-antenna.component.html',
  styleUrls: ['./create-antenna.component.scss']
})
export class CreateAntennaComponent extends CreateDialog<Antenna> implements OnInit {

  sticks: AntennaStick[];

  constructor(dialogRef: MatDialogRef<CreateAntennaComponent>,
              cloudService: CloudStorageService,
              antennasService: AntennasService,
              private antennaSticksService: AntennaSticksService,
              snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) data: Antenna) {
    super(dialogRef, cloudService, snackBar, data, antennasService);
    this.item = new Antenna(
      undefined, undefined, '', Quality.COMMON, false, undefined, undefined, undefined, undefined
    );
  }

  ngOnInit() {
    super.ngOnInit();
    this.antennaSticksService.getAll().subscribe(sticks => this.sticks = sticks);
  }
}
