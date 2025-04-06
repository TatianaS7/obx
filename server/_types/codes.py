from enum import Enum
from marshmallow import Schema, fields

class DiscountCode(Enum):
    REFILL10 = 'REFILL10'
    BIRTHDAY15 = 'BIRTHDAY15'
    WELCOME15 = 'WELCOME15'
    EMPLOYEE20 = 'EMPLOYEE20'