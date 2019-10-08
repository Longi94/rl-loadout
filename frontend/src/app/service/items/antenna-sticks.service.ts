import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractItemService } from '../abstract-item-service';
import { AntennaStick } from 'rl-loadout-lib';

@Injectable({
  providedIn: 'root'
})
export class AntennaSticksService extends AbstractItemService<AntennaStick> {
  constructor(httpClient: HttpClient) {
    super('antenna-sticks', httpClient);
  }
}
