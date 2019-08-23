import { Injectable } from '@angular/core';
import { AbstractItemService } from '../abstract-item-service';
import { Body } from '../../model/body';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BodiesService extends AbstractItemService<Body> {
  constructor(httpClient: HttpClient) {
    super('bodies', httpClient);
  }
}
