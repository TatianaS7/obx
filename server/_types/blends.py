from enum import Enum
from marshmallow import Schema, fields

class ProductType(Enum):
    HAIR = "HAIR"
    FRAGRANCE = "FRAGRANCE"

class BlendCategory(Enum):
    PREMADE = "PREMADE"
    CUSTOM = "CUSTOM"
    BASE_CUSTOM = "CUSTOM"
    FULLY_CUSTOM = "CUSTOM"

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
    
    def get_base_price(self, blend_category: BlendCategory):
        if blend_category in (BlendCategory.CUSTOM, BlendCategory.BASE_CUSTOM, BlendCategory.FULLY_CUSTOM):
            return 9
        if blend_category == BlendCategory.PREMADE:
            return 9
        return 9

class BottleType(Enum):
    DROPPER = "DROPPER"
    # SQUEEZE = "SQUEEZE"
