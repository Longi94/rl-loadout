import { OnInit } from "@angular/core";
import { Quality } from "../../../model/quality";
import { CloudObject, CloudStorageService } from "../../../service/cloud-storage.service";
import { MatDialogRef } from "@angular/material";

export abstract class CreateDialog implements OnInit {

  qualities = [
    {value: Quality.COMMON, name: 'Common'},
    {value: Quality.RARE, name: 'Rare'},
    {value: Quality.VERY_RARE, name: 'Very rare'},
    {value: Quality.IMPORT, name: 'Import'},
    {value: Quality.EXOTIC, name: 'Exotic'},
    {value: Quality.BLACK_MARKET, name: 'Black market'},
    {value: Quality.LIMITED, name: 'Limited'},
    {value: Quality.PREMIUM, name: 'Premium'}
  ];

  objects: { [key: string]: CloudObject[] } = {
    icons: [],
    textures: [],
    models: []
  };

  protected constructor(protected dialogRef: MatDialogRef<any>,
                        private cloudService: CloudStorageService) {
  }

  ngOnInit() {
    this.cloudService.getObjects().subscribe(value => this.objects = value);
  }

  abstract save();

  cancel() {
    this.dialogRef.close();
  }
}
