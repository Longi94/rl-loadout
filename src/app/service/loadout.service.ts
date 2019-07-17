import { Injectable } from '@angular/core';
import { Decal } from "../model/decal";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadoutService {

  private decal: Decal;
  private decalSubject: Subject<Decal> = new Subject<Decal>();
  decalChanged$: Observable<Decal> = this.decalSubject.asObservable();

  constructor() { }

  selectDecal(decal: Decal) {
    this.decal = decal;
    this.decalSubject.next(decal)
  }
}
