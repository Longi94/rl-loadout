import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../../auth/auth.service";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material";
import { handleErrorSnackbar } from "../../../utils/network";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;

  constructor(private authService: AuthService,
              private router: Router,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['admin']).then();
    }
  }

  login() {
    this.authService.login(this.username, this.password).subscribe(() => {
      this.router.navigate(['admin']).then();
    }, error => {
      if (error.status === 401) {
        handleErrorSnackbar(error, this.snackBar, 'Invalid username of password');
      } else {
        handleErrorSnackbar(error, this.snackBar);
      }
    });
  }
}
