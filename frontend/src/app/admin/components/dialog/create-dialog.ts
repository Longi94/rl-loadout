import { OnInit } from "@angular/core";
import { Quality } from "../../../model/quality";
import { CloudObject, CloudStorageService } from "../../../service/cloud-storage.service";
import { MatDialogRef } from "@angular/material";
import { Hitbox } from "../../../model/hitbox";

export abstract class CreateDialog implements OnInit {

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
