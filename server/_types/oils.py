from enum import Enum
from marshmallow import Schema, fields

class OilType(Enum):
    BASE = "BASE",
    SECONDARY = "SECONDARY",
    OTHER = "OTHER",
    PREMIUM = "PREMIUM"