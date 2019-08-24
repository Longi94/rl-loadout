import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractItemService } from '../abstract-item-service';
import { Decal } from '../../model/decal';

@Injectable({
  providedIn: 'root'
})
export class DecalsService extends AbstractItemService<Decal> {
  constructor(httpClient: HttpClient) {
    super('decals', httpClient);
  }
}
