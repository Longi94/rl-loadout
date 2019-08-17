import { Item } from "./item";
import { Hitbox } from "./hitbox";

export class Body extends Item {
  blank_skin: string;
  base_skin: string;
  model: string;
  chassis_base: string;
  chassis_n: string;
  hitbox: Hitbox
}
