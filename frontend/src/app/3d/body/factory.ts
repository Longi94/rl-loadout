import { BodyModel } from './body-model';
import { Decal } from '../../model/decal';
import { Body } from '../../model/body';
import { BODY_MAPLE_ID, MapleModel } from './maple-model';

export function createBodyModel(body: Body, decal: Decal, paints: {}): BodyModel {
  switch (body.id) {
    case BODY_MAPLE_ID:
      return new MapleModel(body, decal, paints);
    default:
      return new BodyModel(body, decal, paints);
  }
}
