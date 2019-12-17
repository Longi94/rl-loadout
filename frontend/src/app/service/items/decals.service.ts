import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractItemService } from '../abstract-item-service';
import { Decal } from 'rl-loadout-lib';

@Injectable({
  providedIn: 'root'
})
export class DecalsService extends AbstractItemService<Decal> {
  constructor(httpClient: HttpClient) {
    super('decals', httpClient);
  }
}
