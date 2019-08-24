import { OnInit } from '@angular/core';
import { Quality } from '../../../model/quality';
import { CloudObject, CloudStorageService } from '../../../service/cloud-storage.service';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { Hitbox } from '../../../model/hitbox';
import { AbstractItemService } from '../../../service/abstract-item-service';
import { handleErrorSnackbar } from '../../../utils/network';

export abstract class CreateDialog<T> implements OnInit {

  qualities = [
    {value: Quality.COMMON, name: 'Common'},
    {value: Quality.UNCOMMON, name: 'Uncommon'},
    {value: Quality.RARE, name: 'Rare'},
    {value: Quality.VERY_RARE, name: 'Very rare'},
    {value: Quality.IMPORT, name: 'Import'},
    {value: Quality.EXOTIC, name: 'Exotic'},
    {value: Quality.BLACK_MARKET, name: 'Black market'},
    {value: Quality.LIMITED, name: 'Limited'},
    {value: Quality.PREMIUM, name: 'Premium'}
  ];

  hitboxes = [
    {value: Hitbox.OCTANE, name: 'Octane'},
    {value: Hitbox.DOMINUS, name: 'Dominus'},
    {value: Hitbox.PLANK, name: 'Plank'},
    {value: Hitbox.BREAKOUT, name: 'Breakout'},
    {value: Hitbox.HYBRID, name: 'Hybrid'},
    {value: Hitbox.BATMOBILE, name: 'Batmobile'}
  ];

  objects: { [key: string]: CloudObject[] } = {
    icons: [],
    textures: [],
    models: []
  };

  item: T;
  isNew = true;

  protected constructor(protected dialogRef: MatDialogRef<any>,
                        private cloudService: CloudStorageService,
                        private snackBar: MatSnackBar,
                        private data: T,
                        protected itemService: AbstractItemService<T>) {
  }

  ngOnInit() {
    this.cloudService.getObjects().subscribe(value => this.objects = value);
    this.isNew = this.data == undefined;

    if (!this.isNew) {
      this.item = this.data;
    }
  }

  save() {
    if (this.isNew) {
      this.itemService.add(this.item).subscribe(newItem => {
        this.dialogRef.close(newItem);
      }, error => handleErrorSnackbar(error, this.snackBar));
    } else {
      // @ts-ignore
      this.itemService.update(this.item.id, this.item).subscribe(() => {
        this.dialogRef.close(this.item);
      }, error => handleErrorSnackbar(error, this.snackBar));
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
