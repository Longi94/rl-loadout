import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractItemService } from '../abstract-item-service';
import { DecalDetail } from '../../model/decal';

@Injectable({
  providedIn: 'root'
})
export class DecalDetailsService extends AbstractItemService<DecalDetail> {
  constructor(httpClient: HttpClient) {
    super('decal-details', httpClient);
  }
}
