import { Component, OnInit } from '@angular/core';
import { Quality } from '../../../../model/quality';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { CloudStorageService } from '../../../../service/cloud-storage.service';
import { handleErrorSnackbar } from '../../../../utils/network';
import { Antenna, AntennaStick } from '../../../../model/antenna';
import { CreateDialog } from '../create-dialog';
import { AntennasService } from '../../../../service/items/antennas.service';
import { AntennaSticksService } from '../../../../service/items/antenna-sticks.service';

@Component({
  selector: 'app-create-antenna',
  templateUrl: './create-antenna.component.html',
  styleUrls: ['./create-antenna.component.scss']
})
export class CreateAntennaComponent extends CreateDialog implements OnInit {

  antenna: Antenna = new Antenna(
    undefined, undefined, '', Quality.COMMON, false, undefined, undefined, undefined, undefined
  );

  sticks: AntennaStick[];

  constructor(dialogRef: MatDialogRef<CreateAntennaComponent>,
              cloudService: CloudStorageService,
              private antennasService: AntennasService,
              private antennaSticksService: AntennaSticksService,
              private snackBar: MatSnackBar) {
    super(dialogRef, cloudService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.antennaSticksService.getAll().subscribe(sticks => this.sticks = sticks);
  }

  save() {
    this.antennasService.add(this.antenna).subscribe(newItem => {
      this.dialogRef.close(newItem);
    }, error => handleErrorSnackbar(error, this.snackBar));
  }
}
