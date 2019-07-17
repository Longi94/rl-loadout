import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from "@angular/material";

@Component({
  selector: 'app-loadout-toolbar',
  templateUrl: './loadout-toolbar.component.html',
  styleUrls: ['./loadout-toolbar.component.scss']
})
export class LoadoutToolbarComponent implements OnInit {

  constructor(private _snackBar: MatSnackBar) {
  }

  ngOnInit() {
  }

  showUnsupported(type: string) {
    this._snackBar.open(`${type} are not currently supported.`, undefined, {duration: 2000});
  }
}
