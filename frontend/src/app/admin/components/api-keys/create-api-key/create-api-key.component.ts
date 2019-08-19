import { Component, OnInit } from '@angular/core';
import { ApiKeysService } from '../../../../service/api-keys.service';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { ApiKey } from '../../../../model/api-key';
import { handleErrorSnackbar } from '../../../../utils/network';

@Component({
  selector: 'app-create-api-key',
  templateUrl: './create-api-key.component.html',
  styleUrls: ['./create-api-key.component.scss']
})
export class CreateApiKeyComponent implements OnInit {

  apiKey: ApiKey = new ApiKey();

  constructor(private apiKeysService: ApiKeysService,
              private dialogRef: MatDialogRef<CreateApiKeyComponent>,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    this.apiKeysService.createKey(this.apiKey).subscribe(newKey => this.dialogRef.close(newKey),
        error => handleErrorSnackbar(error, this.snackBar));
  }
}
