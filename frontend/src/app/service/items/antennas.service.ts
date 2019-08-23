import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractItemService } from '../abstract-item-service';
import { Antenna } from '../../model/antenna';

@Injectable({
  providedIn: 'root'
})
export class AntennasService extends AbstractItemService<Antenna> {
  constructor(httpClient: HttpClient) {
    super('antennas', httpClient);
  }
}
