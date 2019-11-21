import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  prompt: string;

  constructor(private dialogRef: MatDialogRef<ConfirmDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string) {
    this.prompt = data;
  }

  ngOnInit() {
  }

  confirm() {
    this.dialogRef.close(true);
  }
}

export function confirmMaterial(message: string, dialog: MatDialog, yes?: () => void, no?: () => void) {
  const dialogRef = dialog.open(ConfirmDialogComponent, {
    width: '500px',
    data: message
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      if (yes) {
        yes();
      }
    } else {
      if (no) {
        no();
      }
    }
  });
}
