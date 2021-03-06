import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AboutDialogComponent } from '../about-dialog/about-dialog.component';
import { environment } from '../../../../environments/environment';
import { TextureViewerComponent } from '../debug/texture-viewer/texture-viewer.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isDev = !environment.production;

  constructor(private dialog: MatDialog,
              public router: Router) { }

  ngOnInit() {
  }

  openAbout() {
    this.dialog.open(AboutDialogComponent, {
      width: '400px'
    });
  }

  openTextureViewer() {
    this.dialog.open(TextureViewerComponent, {
      width: '1000px'
    });
  }
}
