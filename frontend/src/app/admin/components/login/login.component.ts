import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../../auth/auth.service";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material";

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
              private snackBar: MatSnackBar) { }

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
        this.snackBar.open('Invalid username of password', null, {
          duration: 2000
        });
      } else {
        this.snackBar.open(error.error.msg, null, {
          duration: 2000
        });
      }
    });
  }
}
