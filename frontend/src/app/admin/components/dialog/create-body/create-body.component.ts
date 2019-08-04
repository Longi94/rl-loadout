import { Component, OnInit } from '@angular/core';
import { Body } from "../../../../model/body";
import { Quality } from "../../../../model/quality";
import { MatDialogRef, MatSnackBar } from "@angular/material";
import { CloudObject, CloudStorageService } from "../../../../service/cloud-storage.service";
import { ItemService } from "../../../../service/item.service";
import { handleErrorSnackbar } from "../../../../utils/network";

@Component({
  selector: 'app-create-body',
  templateUrl: './create-body.component.html',
  styleUrls: ['./create-body.component.scss']
})
export class CreateBodyComponent implements OnInit {

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

  body: Body = new Body(
    undefined, undefined, '', Quality.COMMON, false
  );

  constructor(private dialogRef: MatDialogRef<CreateBodyComponent>,
              private cloudService: CloudStorageService,
              private itemService: ItemService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.cloudService.getObjects().subscribe(value => this.objects = value);
  }

  save() {
    this.itemService.addBody(this.body).subscribe(newBody => {
      this.dialogRef.close(newBody);
    }, error => handleErrorSnackbar(error, this.snackBar));
  }

  cancel() {
    this.dialogRef.close();
  }
}
