import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { ApiKey } from "../model/api-key";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";

const HOST = `${environment.backend}/api`;
const HEADERS = new HttpHeaders({'Content-Type': 'application/json'});

@Injectable({
  providedIn: 'root'
})
export class ApiKeysService {

  constructor(private httpClient: HttpClient) {
  }

  getKeys(): Observable<ApiKey[]> {
    return this.httpClient.get<ApiKey[]>(`${HOST}/api-keys`);
  }

  createKey(apiKey: ApiKey): Observable<ApiKey> {
    return this.httpClient.post<ApiKey>(`${HOST}/api-keys`, apiKey, {headers: HEADERS});
  }

  deleteKey(id: number): Observable<any> {
    return this.httpClient.delete(`${HOST}/api-keys/${id}`);
  }
}
