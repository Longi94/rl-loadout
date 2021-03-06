import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractItemService } from '../abstract-item-service';
import { Wheel } from 'rl-loadout-lib';

@Injectable({
  providedIn: 'root'
})
export class WheelsService extends AbstractItemService<Wheel> {
  constructor(httpClient: HttpClient) {
    super('wheels', httpClient);
  }
}
