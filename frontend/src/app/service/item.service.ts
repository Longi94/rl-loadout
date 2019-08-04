import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Body } from "../model/body";

const HOST = `${environment.backend}/api`;
const HEADERS = new HttpHeaders({'Content-Type': 'application/json'});

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private httpClient: HttpClient) {
  }

  addBody(body: Body): Observable<Body> {
    return this.httpClient.post<Body>(`${HOST}/bodies`, body, {headers: HEADERS});
  }
}
