import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient,
              private router: Router) {
  }

  login(username: string, password: string): Observable<any> {
    const  formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    return this.httpClient.post(`${environment.backend}/auth`, formData).pipe(
      tap(
        () => {
          localStorage.setItem('username', username);
          localStorage.setItem('token', btoa(`${username}:${password}`));
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
    return localStorage.getItem('token') != null;
  }

  getUsername(): string {
    return localStorage.getItem('username');
  }

  getToken(): string {
    return localStorage.getItem('token');
  }
}
