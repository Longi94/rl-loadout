import { Body } from '../model/body';
import { doRequest } from '../utils/network';
import { Wheel } from '../model/wheel';

const HOST_PROD = 'https://rocket-loadout.com';
const PATH_V1 = '/api/v1';

export class RocketLoadoutService {

  private readonly baseUrl: string;

  constructor(host?: string) {
    if (host == undefined) {
      host = HOST_PROD;
    }
    this.baseUrl = `${host}${PATH_V1}`;
  }

  getBody(id: number): Promise<Body> {
    return doRequest<Body>(`${this.baseUrl}/bodies/${id}`);
  }

  getWheel(id: number): Promise<Wheel> {
    return doRequest<Wheel>(`${this.baseUrl}/wheels/${id}`);
  }
}
