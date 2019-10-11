import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractItemService } from '../abstract-item-service';
import { Topper } from 'rl-loadout-lib';

@Injectable({
  providedIn: 'root'
})
export class ToppersService extends AbstractItemService<Topper> {
  constructor(httpClient: HttpClient) {
    super('toppers', httpClient);
  }
}
