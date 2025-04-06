from enum import Enum
from marshmallow import Schema, fields

class OilType(Enum):
    BASE = "base",
    SECONDARY = "secondary",
    ESSENTIAL = "essential",
    PREMIUM = "premium"