import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

const HOST = `${environment.backend}/internal`;
const HEADERS = new HttpHeaders({'Content-Type': 'application/json'});

export abstract class AbstractItemService<T> {
  protected constructor(private path: string,
                        private httpClient: HttpClient) {
  }

  getAll(): Observable<T[]> {
    return this.httpClient.get<T[]>(`${HOST}/${this.path}`);
  }

  add(item: T): Observable<T> {
    return this.httpClient.post<T>(`${HOST}/${this.path}`, item, {headers: HEADERS});
  }

  delete(id: any): Observable<any> {
    return this.httpClient.delete(`${HOST}/${this.path}/${id}`);
  }

  update(id: any, item: T): Observable<any> {
    return this.httpClient.put(`${HOST}/${this.path}/${id}`, item, {headers: HEADERS});
  }
}
