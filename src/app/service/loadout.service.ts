import { Injectable } from '@angular/core';
import { Decal } from "../model/decal";
import { Observable, Subject } from "rxjs";
import { Wheel } from "../model/wheel";
import { Body } from "../model/body";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Item } from "../model/item";
import { DEFAULT_ACCENT, DEFAULT_BLUE_TEAM } from "../utils/color";

const HOST = `${environment.backend}/api`;

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
    decal: '#FF0000',
    wheel: '#888888'
  };
  private paintSubject: Subject<any> = new Subject();
  paintChanged$: Observable<any> = this.paintSubject.asObservable();

  wheel: Wheel;
  private wheelSubject: Subject<Wheel> = new Subject<Wheel>();
  wheelChanged$: Observable<Wheel> = this.wheelSubject.asObservable();

  constructor(private httpClient: HttpClient) {
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
    this.decal = Decal.NONE;
    this.bodySubject.next(body);
  }

  loadDefaults(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.httpClient.get<{ [type: string]: Item }>(`${HOST}/defaults`).subscribe(defaults => {
        this.body = <Body>defaults['body'];
        this.wheel = <Wheel>defaults['wheel'];
        resolve();
      }, reject);
    });
  }
}
