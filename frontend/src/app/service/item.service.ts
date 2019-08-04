import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Body } from "../model/body";
import { Decal, DecalDetail } from "../model/decal";
import { Antenna, AntennaStick } from "../model/antenna";
import { Wheel } from "../model/wheel";
import { Topper } from "../model/topper";

const HOST = `${environment.backend}/api`;
const HEADERS = new HttpHeaders({'Content-Type': 'application/json'});

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private httpClient: HttpClient) {
  }

  getBodies(): Observable<Body[]> {
    return this.httpClient.get<Body[]>(`${HOST}/bodies`);
  }

  addBody(body: Body): Observable<Body> {
    return this.httpClient.post<Body>(`${HOST}/bodies`, body, {headers: HEADERS});
  }

  deleteBody(id: number): Observable<any> {
    return this.httpClient.delete(`${HOST}/bodies/${id}`);
  }

  getDecalDetails(): Observable<DecalDetail[]> {
    return this.httpClient.get<DecalDetail[]>(`${HOST}/decal-details`);
  }

  addDecalDetail(decalDetail: DecalDetail): Observable<DecalDetail> {
    return this.httpClient.post<DecalDetail>(`${HOST}/decal-details`, decalDetail, {headers: HEADERS});
  }

  deleteDecalDetail(id: number): Observable<any> {
    return this.httpClient.delete(`${HOST}/decal-details/${id}`);
  }

  getAntennas(): Observable<Antenna[]> {
    return this.httpClient.get<Antenna[]>(`${HOST}/antennas`);
  }

  addAntenna(antenna: Antenna): Observable<Antenna> {
    return this.httpClient.post<Antenna>(`${HOST}/antennas`, antenna, {headers: HEADERS});
  }

  deleteAntenna(id: number): Observable<any> {
    return this.httpClient.delete(`${HOST}/antennas/${id}`);
  }

  getAntennaSticks(): Observable<AntennaStick[]> {
    return this.httpClient.get<AntennaStick[]>(`${HOST}/antenna-sticks`);
  }

  addAntennaStick(antennaStick: AntennaStick): Observable<AntennaStick> {
    return this.httpClient.post<AntennaStick>(`${HOST}/antenna-sticks`, antennaStick, {headers: HEADERS});
  }

  deleteAntennaStick(id: number): Observable<any> {
    return this.httpClient.delete(`${HOST}/antenna-sticks/${id}`);
  }

  getWheels(): Observable<Wheel[]> {
    return this.httpClient.get<Wheel[]>(`${HOST}/wheels`);
  }

  addWheel(wheel: Wheel): Observable<Wheel> {
    return this.httpClient.post<Wheel>(`${HOST}/wheels`, wheel, {headers: HEADERS});
  }

  deleteWheel(id: number): Observable<any> {
    return this.httpClient.delete(`${HOST}/wheels/${id}`);
  }

  getToppers(): Observable<Topper[]> {
    return this.httpClient.get<Topper[]>(`${HOST}/toppers`);
  }

  addTopper(topper: Topper): Observable<Topper> {
    return this.httpClient.post<Topper>(`${HOST}/toppers`, topper, {headers: HEADERS});
  }

  deleteTopper(id: number): Observable<any> {
    return this.httpClient.delete(`${HOST}/toppers/${id}`);
  }

  getDecals(): Observable<Decal[]> {
    return this.httpClient.get<Decal[]>(`${HOST}/decals`);
  }

  addDecal(decal: Decal): Observable<Decal> {
    return this.httpClient.post<Decal>(`${HOST}/decals`, decal, {headers: HEADERS});
  }

  deleteDecal(id: number): Observable<any> {
    return this.httpClient.delete(`${HOST}/decals/${id}`);
  }

}
