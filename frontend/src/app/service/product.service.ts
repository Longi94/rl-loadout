import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/product';

const HOST = `${environment.backend}/internal`;

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient: HttpClient) {
  }

  uploadCsv(file: File): Observable<any> {
    const endpoint = `${HOST}/products/upload`;
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.httpClient.post(endpoint, formData);
  }

  get(id: number): Observable<Product> {
    return this.httpClient.get<Product>(`${HOST}/products/${id}`);
  }

  getAll(id: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${HOST}/products`);
  }
}
