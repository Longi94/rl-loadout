import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  username: string;

  constructor(public router: Router,
              private authService: AuthService) { }

  ngOnInit() {
    this.username = this.authService.getUsername();
  }

  logout() {
    this.authService.logout();
  }
}
