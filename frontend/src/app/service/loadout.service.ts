import { Injectable } from '@angular/core';
import { Decal } from '../model/decal';
import { Observable, Subject } from 'rxjs';
import { Wheel } from '../model/wheel';
import { Body } from '../model/body';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Item } from '../model/item';
import { COLOR_MAPLE_BLUE, DEFAULT_ACCENT, DEFAULT_BLUE_TEAM } from '../utils/color';
import { Topper } from '../model/topper';
import { Antenna } from '../model/antenna';
import { BODY_MAPLE_ID, BODY_SLIME_ID } from '../utils/ids';

const HOST = `${environment.backend}/internal`;

@Injectable({
  providedIn: 'root'
})
export class LoadoutService {

  body: Body;
  private bodySubject: Subject<Body> = new Subject<Body>();
  bodyChanged$: Observable<Body> = this.bodySubject.asObservable();

  decal: Decal = Decal.NONE;
  private decalSubject: Subject<Decal> = new Subject<Decal>();
  decalChanged$: Observable<Decal> = this.decalSubject.asObservable();

  paints = {
    primary: DEFAULT_BLUE_TEAM,
    accent: DEFAULT_ACCENT,
    body: undefined,
    decal: undefined,
    wheel: undefined,
    topper: undefined
  };
  private paintSubject: Subject<any> = new Subject();
  paintChanged$: Observable<any> = this.paintSubject.asObservable();

  wheel: Wheel;
  private wheelSubject: Subject<Wheel> = new Subject<Wheel>();
  wheelChanged$: Observable<Wheel> = this.wheelSubject.asObservable();

  topper: Topper = Topper.NONE;
  private topperSubject: Subject<Topper> = new Subject<Topper>();
  topperChanged$: Observable<Topper> = this.topperSubject.asObservable();

  antenna: Antenna = Antenna.NONE;
  private antennaSubject: Subject<Antenna> = new Subject<Antenna>();
  antennaChanged$: Observable<Antenna> = this.antennaSubject.asObservable();

  constructor(private httpClient: HttpClient) {
  }

  selectDecal(decal: Decal) {
    this.decal = decal;
    this.decalSubject.next(decal);
  }

  setPaint(type: string, color: string) {
    this.paints[type] = color;
    this.paintSubject.next({type, color});
  }

  selectWheel(wheel: Wheel) {
    this.wheel = wheel;
    this.wheelSubject.next(wheel);
  }

  selectBody(body: Body) {
    this.body = body;
    this.decal = Decal.NONE;

    switch (body.id) {
      case BODY_MAPLE_ID:
      case BODY_SLIME_ID:
        this.paints.primary = COLOR_MAPLE_BLUE;
        break;
    }

    this.bodySubject.next(body);
  }

  selectTopper(topper: Topper) {
    this.topper = topper;
    this.topperSubject.next(topper);
  }

  selectAntenna(antenna: Antenna) {
    this.antenna = antenna;
    this.antennaSubject.next(antenna);
  }

  loadDefaults(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.httpClient.get<{ [type: string]: Item }>(`${HOST}/defaults`).subscribe(defaults => {
        this.body = defaults.body as Body;
        this.wheel = defaults.wheel as Wheel;
        resolve();
      }, reject);
    });
  }
}
