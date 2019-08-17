import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Body } from "../model/body";
import { Wheel } from "../model/wheel";
import { Decal } from "../model/decal";
import { Item } from "../model/item";
import { Topper } from "../model/topper";
import { Antenna } from "../model/antenna";

const HOST = `${environment.backend}/internal`;

@Injectable({
  providedIn: 'root'
})
export class LoadoutStoreService {

  bodies: Body[] = [];
  decals: Decal[] = [];
  wheels: Wheel[] = [];
  toppers: Topper[] = [];
  antennas: Antenna[] = [];

  constructor(private httpClient: HttpClient) {
  }

  initAll(bodyId?: number): Promise<any> {
    let params = new HttpParams();
    if (bodyId != undefined) {
      params = params.set('body', bodyId.toString())
    }
    return new Promise((resolve) => {
      this.httpClient.get<any>(`${HOST}/all`, {params: params}).subscribe(
        response => {
          this.bodies = response['bodies'];
          this.bodies.sort(itemCompare);

          this.wheels = response['wheels'];
          this.wheels.sort(itemCompare);

          this.toppers = response['toppers'];
          this.toppers.sort(itemCompare);

          this.antennas = response['antennas'];
          this.antennas.sort(itemCompare);

          if ('decals' in response) {
            this.decals = response['decals'];
            this.decals.sort(itemCompare);
          }

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
  initBodies(): Promise<any> {
    return new Promise((resolve) => {
      this.httpClient.get<Body[]>(`${HOST}/bodies`).subscribe(
        bodies => {
          this.bodies = bodies;
          this.bodies.sort(itemCompare);
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
          this.wheels.sort(itemCompare);
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
   * Load the list of toppers and store them.
   */
  initToppers(): Promise<any> {
    return new Promise((resolve) => {
      this.httpClient.get<Topper[]>(`${HOST}/toppers`).subscribe(
        toppers => {
          this.toppers = toppers;
          this.toppers.sort(itemCompare);
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
   * Load the list of toppers and store them.
   */
  initAntennas(): Promise<any> {
    return new Promise((resolve) => {
      this.httpClient.get<Antenna[]>(`${HOST}/antennas`).subscribe(
        antennas => {
          this.antennas = antennas;
          this.antennas.sort(itemCompare);
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
          this.decals.sort(itemCompare);
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

function itemCompare(a: Item, b: Item) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
}
