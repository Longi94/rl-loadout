import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material";
import { AboutDialogComponent } from "../about-dialog/about-dialog.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  openAbout() {
    this.dialog.open(AboutDialogComponent, {
      width: '400px'
    });
  }
}
