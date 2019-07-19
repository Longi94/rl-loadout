import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Body } from "../model/body";
import { Wheel } from "../model/wheel";
import { Decal } from "../model/decal";

const HOST = `${environment.backend}/api`;

@Injectable({
  providedIn: 'root'
})
export class LoadoutStoreService {

  bodies: Body[] = [];
  decals: Decal[] = [];
  wheels: Wheel[] = [];

  constructor(private httpClient: HttpClient) {
  }

  /**
   * Load the list of bodies and store them.
   */
  initBodies(): Promise<any> {
    return new Promise((resolve) => {
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

  /**
   * Load the list of bodies and store them.
   */
  initWheels(): Promise<any> {
    return new Promise((resolve) => {
      this.httpClient.get<Wheel[]>(`${HOST}/wheels`).subscribe(
        wheels => {
          this.wheels = wheels;
          resolve();
        },
        error => {
          console.error(error);
          resolve();
        }
      )
    });
  }

  /**
   * Load decals for a body.
   * @param bodyId
   */
  loadDecals(bodyId: number) {
    return new Promise((resolve) => {
      let params = new HttpParams().set('body', bodyId.toString());
      this.httpClient.get<Decal[]>(`${HOST}/decals`, {params: params}).subscribe(
        decals => {
          this.decals = decals;
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
