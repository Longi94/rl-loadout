import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Body } from "../model/body";

const HOST = `${environment.backend}/api`;

@Injectable({
  providedIn: 'root'
})
export class LoadoutStoreService {

  bodies: Body[] = [];

  constructor(private httpClient: HttpClient) { }

  /**
   * Load the list of bodies and store them.
   */
  initBodies(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient.get<Body[]>(`${HOST}/bodies`).subscribe(
        bodies => {
          this.bodies = bodies;
          resolve();
        },
        error => {
          console.error(error);
          resolve();
        }
      )
    });
  }
}
