import { Injectable } from '@angular/core';
import { Decal } from "../model/decal";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadoutService {

  decal: Decal;
  private decalSubject: Subject<Decal> = new Subject<Decal>();
  decalChanged$: Observable<Decal> = this.decalSubject.asObservable();

  paints = {
    primary: '#0000FF',
    accent: '#FFFFFF',
    decal: '#FF0000'
  };
  private paintSubject: Subject<any> = new Subject();
  paintChanged$: Observable<any> = this.paintSubject.asObservable();

  constructor() {
  }

  selectDecal(decal: Decal) {
    this.decal = decal;
    this.decalSubject.next(decal)
  }

  setPaint(type: string, color: string) {
    this.paints[type] = color;
    this.paintSubject.next({
      type: type,
      color: color
    })
  }
}