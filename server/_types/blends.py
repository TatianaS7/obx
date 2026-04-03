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
    
    def get_base_price(self, blend_category: BlendCategory):
        if self == BottleSize.SMALL and BlendCategory.PREMADE:
            return 9
        elif self == BottleSize.SMALL and BlendCategory.BASE_CUSTOM:
            return 11
        elif self == BottleSize.SMALL and BlendCategory.FULLY_CUSTOM:
            return 15
        elif self == BottleSize.MEDIUM and BlendCategory.PREMADE:
            return 13
        elif self == BottleSize.MEDIUM and BlendCategory.BASE_CUSTOM:
            return 16
        elif self == BottleSize.MEDIUM and BlendCategory.FULLY_CUSTOM:
            return 20
        elif self == BottleSize.LARGE and BlendCategory.PREMADE:
            return 18
        elif self == BottleSize.LARGE and BlendCategory.BASE_CUSTOM:
            return 20
        elif self == BottleSize.LARGE and BlendCategory.FULLY_CUSTOM:
            return 24

class BottleType(Enum):
    DROPPER = "DROPPER"
    # SQUEEZE = "SQUEEZE"
