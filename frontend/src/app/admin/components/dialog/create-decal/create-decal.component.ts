import { Component, Inject, OnInit } from '@angular/core';
import { Body, Decal, Quality } from 'rl-loadout-lib';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { CloudStorageService } from '../../../../service/cloud-storage.service';
import { CreateDialog } from '../create-dialog';
import { DecalsService } from '../../../../service/items/decals.service';
import { BodiesService } from '../../../../service/items/bodies.service';

@Component({
  selector: 'app-create-decal',
  templateUrl: './create-decal.component.html',
  styleUrls: ['./create-decal.component.scss']
})
export class CreateDecalComponent extends CreateDialog<Decal> implements OnInit {

  productType = 'decal';

  bodies: Body[];

  constructor(dialogRef: MatDialogRef<CreateDecalComponent>,
              cloudService: CloudStorageService,
              decalsService: DecalsService,
              private bodiesService: BodiesService,
              snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) data: Decal) {
    super(dialogRef, cloudService, snackBar, data, decalsService);
    this.item = new Decal(
      undefined, undefined, '', Quality.COMMON, false
    );
  }

  ngOnInit() {
    super.ngOnInit();
    this.bodiesService.getAll().subscribe(bodies => this.bodies = bodies);
  }

}
