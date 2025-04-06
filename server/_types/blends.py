from enum import Enum
from marshmallow import Schema, fields

class BlendType(Enum):
    HAIR = "hair",
    FRAGRANCE = "fragrance"

class BlendCategory(Enum):
    PREMADE = "premade",
    BASE_CUSTOM = "base_custom",
    FULLY_CUSTOM = "fully_custom"

class BottleSize(Enum):
    SMALL = "60mL",  
    MEDIUM = "120mL",
    LARGE = "240mL"

class BottleType(Enum):
    DROPPER = "dropper",
    SQUEEZE = "squeeze"