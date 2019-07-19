import { Injectable } from '@angular/core';
import { Decal } from "../model/decal";
import { Observable, Subject } from "rxjs";
import { Wheel } from "../model/wheel";
import { Body } from "../model/body";

@Injectable({
  providedIn: 'root'
})
export class LoadoutService {

  body: Body = Body.DEFAULT;
  private bodySubject: Subject<Body> = new Subject<Body>();
  bodyChanged$: Observable<Body> = this.bodySubject.asObservable();

  decal: Decal = Decal.DEFAULT;
  private decalSubject: Subject<Decal> = new Subject<Decal>();
  decalChanged$: Observable<Decal> = this.decalSubject.asObservable();

  paints = {
    primary: '#0000FF',
    accent: '#FFFFFF',
    decal: '#FF0000',
    wheel: '#888888'
  };
  private paintSubject: Subject<any> = new Subject();
  paintChanged$: Observable<any> = this.paintSubject.asObservable();

  wheel: Wheel = Wheel.DEFAULT;
  private wheelSubject: Subject<Wheel> = new Subject<Wheel>();
  wheelChanged$: Observable<Wheel> = this.wheelSubject.asObservable();

  constructor() {
  }

  selectDecal(decal: Decal) {
    this.decal = decal;
    this.decalSubject.next(decal);
  }

  setPaint(type: string, color: string) {
    this.paints[type] = color;
    this.paintSubject.next({
      type: type,
      color: color
    })
  }

  selectWheel(wheel: Wheel) {
    this.wheel = wheel;
    this.wheelSubject.next(wheel);
  }

  selectBody(body: Body) {
    this.body = body;
    this.bodySubject.next(body);
  }
}
