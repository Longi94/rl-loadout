import { BodyModel } from './body-model';
import { Decal } from '../../model/decal';
import { Body } from '../../model/body';
import {
  BODY_BERRY_ID,
  BODY_DARK_CAR_ID,
  BODY_EGGPLANT_ID,
  BODY_FELINE_ID,
  BODY_GREY_CAR_ID,
  BODY_MAPLE_ID,
  BODY_SLIME_ID
} from '../../utils/ids';
import { MapleModel } from './maple-model';
import { DarkCarModel } from './dark-car-model';
import { EggplantModel } from './eggplant-model';
import { SlimeModel } from './slime-model';
import { FelineModel } from './feline-model';
import { PaintConfig } from '../../service/loadout.service';
import { GreyCarModel } from './grey-car-model';

export function createBodyModel(body: Body, decal: Decal, paints: PaintConfig): BodyModel {
  switch (body.id) {
    case BODY_MAPLE_ID:
      return new MapleModel(body, decal, paints);
    case BODY_DARK_CAR_ID:
      return new DarkCarModel(body, decal, paints);
    case BODY_EGGPLANT_ID:
      return new EggplantModel(body, decal, paints);
    case BODY_SLIME_ID:
      return new SlimeModel(body, decal, paints);
    case BODY_BERRY_ID:
      return new EggplantModel(body, decal, paints);
    case BODY_FELINE_ID:
      return new FelineModel(body, decal, paints);
    case BODY_GREY_CAR_ID:
      return new GreyCarModel(body, decal, paints);
    default:
      return new BodyModel(body, decal, paints);
  }
}
