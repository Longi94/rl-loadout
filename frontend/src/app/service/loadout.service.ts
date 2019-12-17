import { Injectable } from '@angular/core';
import {
  Antenna,
  Body,
  Decal,
  Topper,
  Wheel,
  COLOR_MAPLE_BLUE,
  DEFAULT_ACCENT,
  DEFAULT_BLUE_TEAM,
  BODY_MAPLE_ID,
  BODY_SLIME_ID
} from 'rl-loadout-lib';
import { Observable, Subject } from 'rxjs';
import { Color } from 'three';

export class PaintConfig {
  primary: Color = new Color(DEFAULT_BLUE_TEAM);
  accent: Color = new Color(DEFAULT_ACCENT);
  body: Color;
  decal: Color;
  wheel: Color;
  topper: Color;
}

@Injectable({
  providedIn: 'root'
})
export class LoadoutService {

  body: Body = Body.DEFAULT;
  private bodySubject: Subject<Body> = new Subject<Body>();
  bodyChanged$: Observable<Body> = this.bodySubject.asObservable();

  decal: Decal = Decal.NONE;
  private decalSubject: Subject<Decal> = new Subject<Decal>();
  decalChanged$: Observable<Decal> = this.decalSubject.asObservable();

  paints = new PaintConfig();
  private paintSubject: Subject<any> = new Subject();
  paintChanged$: Observable<any> = this.paintSubject.asObservable();

  wheel: Wheel = Wheel.DEFAULT;
  private wheelSubject: Subject<Wheel> = new Subject<Wheel>();
  wheelChanged$: Observable<Wheel> = this.wheelSubject.asObservable();

  topper: Topper = Topper.NONE;
  private topperSubject: Subject<Topper> = new Subject<Topper>();
  topperChanged$: Observable<Topper> = this.topperSubject.asObservable();

  antenna: Antenna = Antenna.NONE;
  private antennaSubject: Subject<Antenna> = new Subject<Antenna>();
  antennaChanged$: Observable<Antenna> = this.antennaSubject.asObservable();

  constructor() {
  }

  selectDecal(decal: Decal) {
    if (this.decal === decal) {
      return;
    }
    this.decal = decal;
    this.decalSubject.next(decal);
  }

  setPaint(type: string, colorStr: string) {
    const color = colorStr == undefined ? undefined : new Color(colorStr);
    this.paints[type] = color;
    this.paintSubject.next({type, color});
  }

  selectWheel(wheel: Wheel) {
    if (this.wheel === wheel) {
      return;
    }
    this.wheel = wheel;
    this.wheelSubject.next(wheel);
  }

  selectBody(body: Body) {
    if (this.body === body) {
      return;
    }
    this.body = body;
    this.decal = Decal.NONE;

    switch (body.id) {
      case BODY_MAPLE_ID:
      case BODY_SLIME_ID:
        this.paints.primary = new Color(COLOR_MAPLE_BLUE);
        break;
    }

    this.bodySubject.next(body);
  }

  selectTopper(topper: Topper) {
    if (this.topper === topper) {
      return;
    }
    this.topper = topper;
    this.topperSubject.next(topper);
  }

  selectAntenna(antenna: Antenna) {
    if (this.antenna === antenna) {
      return;
    }
    this.antenna = antenna;
    this.antennaSubject.next(antenna);
  }
}
