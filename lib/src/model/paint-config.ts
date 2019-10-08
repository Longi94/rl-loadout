import { Color } from 'three';
import { DEFAULT_ACCENT, DEFAULT_BLUE_TEAM } from '../utils/color';

export class PaintConfig {
    primary: Color = new Color(DEFAULT_BLUE_TEAM);
    accent: Color = new Color(DEFAULT_ACCENT);
    body: Color;
    decal: Color;
    wheel: Color;
    topper: Color;
}
