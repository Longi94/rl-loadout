from typing import List
from rocket.paint import *

BLUE_PRIMARY_COLORS = [
    0x507F39,
    0x397F3F,
    0x397F64,
    0x397D7F,
    0x396B7F,
    0x395D7F,
    0x394F7F,
    0x39427F,
    0x4C397F,
    0x51397F,
    0x65B23E,
    0x3EB248,
    0x3EB286,
    0x3EAEB2,
    0x3E91B2,
    0x3E7AB2,
    0x3E63B2,
    0x3E4DB2,
    0x5D3EB2,
    0x673EB2,
    0x72E539,
    0x39E547,
    0x39E5A3,
    0x39DFE5,
    0x39B4E5,
    0x3992E5,
    0x396FE5,
    0x3950E5,
    0x6739E5,
    0x7539E5,
    0x5CFC0C,
    0x0CFC20,
    0x0CFCA0,
    0x0CF4FC,
    0x0CB8FC,
    0x0C88FC,
    0x0C58FC,
    0x0C2CFC,
    0x4C0CFC,
    0x600CFC,
    0x4ACC0A,
    0x0ACC1A,
    0x0ACC81,
    0x0AC5CC,
    0x0A95CC,
    0x0A6ECC,
    0x0A47CC,
    0x0A24CC,
    0x3D0ACC,
    0x4E0ACC,
    0x3CA508,
    0x08A515,
    0x08A569,
    0x08A0A5,
    0x0879A5,
    0x0859A5,
    0x083AA5,
    0x081DA5,
    0x3208A5,
    0x3F08A5,
    0x2E7F06,
    0x067F10,
    0x067F51,
    0x067B7F,
    0x065D7F,
    0x06447F,
    0x062C7F,
    0x06167F,
    0x26067F,
    0x30067F
]

ORANGE_PRIMARY_COLORS = [
    0x7F7F39,
    0x7F7039,
    0x7F6339,
    0x7F5A39,
    0x7F5439,
    0x7F4E39,
    0x7F4739,
    0x7F3939,
    0x7F3951,
    0x7F395C,
    0xB2B23E,
    0xB2993E,
    0xB2843E,
    0xB2743E,
    0xB26A3E,
    0xB2613E,
    0xB2553E,
    0xB23E3E,
    0xB23E67,
    0xB23E78,
    0xE5E539,
    0xE5C039,
    0xE5A039,
    0xE58939,
    0xE57B39,
    0xE56D39,
    0xE55B39,
    0xE53939,
    0xE53975,
    0xE5398F,
    0xFCFC0C,
    0xFCC80C,
    0xFC9C0C,
    0xFC7C0C,
    0xFC680C,
    0xFC540C,
    0xFC3C0C,
    0xFC0C0C,
    0xFC0C60,
    0xFC0C84,
    0xCCCC0A,
    0xCCA20A,
    0xCC7E0A,
    0xCC640A,
    0xCC540A,
    0xCC440A,
    0xCC300A,
    0xCC0A0A,
    0xCC0A4E,
    0xCC0A6B,
    0xA5A508,
    0xA58308,
    0xA56608,
    0xA55108,
    0xA54408,
    0xA53708,
    0xA52708,
    0xA50808,
    0xA5083F,
    0xA50857,
    0x7F7F06,
    0x7F6506,
    0x7F4F06,
    0x7F3E06,
    0x7F3406,
    0x7F2A06,
    0x7F1E06,
    0x7F0606,
    0x7F0630,
    0x7F0642
]

ACCENT_COLORS = [
    0xE5E5E5,
    0xFF7F7F,
    0xFF9F7F,
    0xFFCF7F,
    0xEFFF7F,
    0xAFFF7F,
    0x7FFF7F,
    0x7FFFB2,
    0x7FE9FF,
    0x7FB0FF,
    0x7F88FF,
    0xAE7FFF,
    0xE57FFF,
    0xFF7FD0,
    0xFF7F94,
    0xBFBFBF,
    0xFF5959,
    0xFF8259,
    0xFFC059,
    0xEAFF59,
    0x97FF59,
    0x59FF59,
    0x59FF9B,
    0x59E3FF,
    0x5998FF,
    0x5964FF,
    0x9659FF,
    0xDD59FF,
    0xFF59C2,
    0xFF5974,
    0x999999,
    0xFF3232,
    0xFF6532,
    0xFFB232,
    0xE5FF32,
    0x7FFF32,
    0x32FF32,
    0x32FF84,
    0x32DCFF,
    0x3281FF,
    0x3240FF,
    0x7D32FF,
    0xD632FF,
    0xFF32B4,
    0xFF3255,
    0x666666,
    0xFF0000,
    0xFF3F00,
    0xFF9F00,
    0xDFFF00,
    0x5FFF00,
    0x00FF00,
    0x00FF66,
    0x00D4FF,
    0x0061FF,
    0x0011FF,
    0x5D00FF,
    0xCC00FF,
    0xFF00A1,
    0xFF002A,
    0x3F3F3F,
    0xB20000,
    0xB22C00,
    0xB26F00,
    0x9CB200,
    0x42B200,
    0x00B200,
    0x00B247,
    0x0094B2,
    0x0044B2,
    0x000BB2,
    0x4100B2,
    0x8E00B2,
    0xB20071,
    0xB2001D,
    0x262626,
    0x660000,
    0x661900,
    0x663F00,
    0x596600,
    0x266600,
    0x006600,
    0x006628,
    0x005466,
    0x002766,
    0x000666,
    0x250066,
    0x510066,
    0x660040,
    0x660011,
    0x000000,
    0x330000,
    0x330C00,
    0x331F00,
    0x2C3300,
    0x133300,
    0x003300,
    0x003314,
    0x002A33,
    0x001333,
    0x000333,
    0x120033,
    0x280033,
    0x330020,
    0x330008
]

PAINT_COLORS = [0] * 14
PAINT_COLORS[PAINT_BLACK] = 0x000000  # black
PAINT_COLORS[PAINT_TITANIUM_WHITE] = 0xffffff  # titanium white
PAINT_COLORS[PAINT_GREY] = 0x8f8f8f  # grey
PAINT_COLORS[PAINT_CRIMSON] = 0xff0000  # crimson
PAINT_COLORS[PAINT_ORANGE] = 0xff5d00  # orange
PAINT_COLORS[PAINT_SAFFRON] = 0xe3e300  # saffron
PAINT_COLORS[PAINT_LIME] = 0xa9ff00  # lime
PAINT_COLORS[PAINT_FOREST_GREEN] = 0x00ba09  # forest green
PAINT_COLORS[PAINT_SKY_BLUE] = 0x00b5e8  # sky blue
PAINT_COLORS[PAINT_COBALT] = 0x0048ed  # cobalt
PAINT_COLORS[PAINT_PINK] = 0xff38f8  # pink
PAINT_COLORS[PAINT_PURPLE] = 0x8800cc  # purple
PAINT_COLORS[PAINT_BURNT_SIENNA] = 0x843d00  # burnt sienna

DEFAULT_BLUE_TEAM = BLUE_PRIMARY_COLORS[35]
DEFAULT_ORANGE_TEAM = ORANGE_PRIMARY_COLORS[33]
DEFAULT_ACCENT = ACCENT_COLORS[0]


def int_to_rgb_array(n: int) -> List[int] or None:
    if n is None:
        return None
    return (
        n >> 16 & 255,
        n >> 8 & 255,
        n & 255,
        255
    )
