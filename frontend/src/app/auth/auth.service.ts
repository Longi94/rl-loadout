import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { tap } from "rxjs/operators";
import { parseJwt } from "../utils/network";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient,
              private router: Router) {
  }

  login(username: string, password: string): Observable<any> {
    const json = JSON.stringify({
      username: username,
      password: password
    });

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    return this.httpClient.post(`${environment.backend}/auth`, json, {headers: headers}).pipe(
      tap(
        response => {
          localStorage.setItem('username', username);
          localStorage.setItem('token', response.access_token);
        },
        () => {
          localStorage.clear();
        }
      )
    );
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/']).then();
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');

    if (token == undefined) {
      return false;
    }

    const jwt = parseJwt(token);
    return Date.now() < jwt.exp * 1000;
  }

  getUsername(): string {
    return localStorage.getItem('username');
  }

  getToken(): string {
    return localStorage.getItem('token');
  }
}
