import { Component, OnInit } from '@angular/core';
import { ApiKeysService } from "../../../service/api-keys.service";
import { ApiKey } from "../../../model/api-key";
import { MatDialog } from "@angular/material";
import { CreateApiKeyComponent } from "./create-api-key/create-api-key.component";

@Component({
  selector: 'app-api-keys',
  templateUrl: './api-keys.component.html',
  styleUrls: ['./api-keys.component.scss']
})
export class ApiKeysComponent implements OnInit {

  keys: ApiKey[] = [];

  constructor(private apiKeysService: ApiKeysService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.apiKeysService.getKeys().subscribe(keys => this.keys = keys);
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(CreateApiKeyComponent, {width: '500px'});
    dialogRef.afterClosed().subscribe(newKey => {
      if (newKey != undefined) {
        this.keys.push(newKey);
      }
    })
  }
}
