import { Component, OnInit } from '@angular/core';
import { ApiKeysService } from '../../../service/api-keys.service';
import { ApiKey } from '../../../model/api-key';
import { MatDialog } from '@angular/material/dialog';
import { CreateApiKeyComponent } from './create-api-key/create-api-key.component';
import { confirmMaterial } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { copyMessage } from '../../../utils/util';

@Component({
  selector: 'app-api-keys',
  templateUrl: './api-keys.component.html',
  styleUrls: ['./api-keys.component.scss']
})
export class ApiKeysComponent implements OnInit {

  keys: ApiKey[] = [];

  copy = copyMessage;

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
    });
  }

  deleteKey(key: ApiKey) {
    confirmMaterial(`Delete API key ${key.name}?`, this.dialog, () => {
      this.apiKeysService.deleteKey(key.id).subscribe(() => {
        this.keys.splice(this.keys.indexOf(key), 1);
      });
    });
  }

  toggleKey(key: ApiKey) {
    let msg = key.active ? 'Deactivate' : 'Activate';
    msg = msg + ` ${key.name}?`;

    confirmMaterial(msg, this.dialog, () => {
      key.active = !key.active;
      this.apiKeysService.updateKey(key).subscribe();
    });
  }
}
