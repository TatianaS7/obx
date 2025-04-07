from enum import Enum
from marshmallow import Schema, fields

class ProductType(Enum):
    HAIR = "HAIR"
    FRAGRANCE = "FRAGRANCE"

class BlendCategory(Enum):
    PREMADE = "PREMADE"
    BASE_CUSTOM= "BASE_CUSTOM"
    FULLY_CUSTOM = "FULLY_CUSTOM"

class BottleSize(Enum):
    SMALL = "60mL"  
    MEDIUM = "120mL"
    LARGE = "240mL"

    def to_ml(self):
        if self == BottleSize.SMALL:
            return 60
        elif self == BottleSize.MEDIUM:
            return 120
        elif self == BottleSize.LARGE:
            return 240

class BottleType(Enum):
    DROPPER = "DROPPER"
    SQUEEZE = "SQUEEZE"