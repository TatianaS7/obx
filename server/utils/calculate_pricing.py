from datetime import datetime
from marshmallow import ValidationError
from .._types import BottleSize, BottleType, BlendCategory, DiscountCode
from ..models import User, Order

def is_refill_exhange(user_id: int) -> bool:
    """
    Check if the user is eligible for refill exchange discount
    """
    # Placeholder for actual implementation
    return False


def is_employee(user_id: int) -> bool:
    """
    Check if the user is an employee
    """
    user = User.query.get(user_id)
    if not user:
        raise ValidationError("User not found")
    
    return user.is_employee


def is_birthday(user_id: int) -> bool:
    """
    Check if the user is eligible for birthday discount
    """
    user = User.query.get(user_id)
    if not user:
        raise ValidationError("User not found")
    
    if not user.birthday:
        return False
    
    current_month = datetime.now().month
    print("user birthday:", user.birthday.month)
    print("current month:", current_month)
    return user.birthday.month == current_month


def is_first_purchase(user_id: int) -> bool:
    """
    Check if the user is a first-time purchaser
    """
    user = User.query.get(user_id)
    if not user:
        raise ValidationError("User not found")
    
    first_order = Order.query.filter_by(user_id=user_id).first()
    return first_order is None


def get_user_discounts(user_id: int) -> dict:
    """
    Retrieve all applicable discounts for the user.
    """
    user = User.query.get(user_id)
    if not user:
        raise ValidationError("User not found")

    return {
        "refill_exchange": is_refill_exhange(user_id),
        "employee_discount": is_employee(user_id),
        "birthday_discount": is_birthday(user_id),
        "first_purchase_discount": is_first_purchase(user_id),
        "rewards_points": user.rewards_points or 0
    }


def validate_discount_stack(discounts: dict) -> dict:
    """
    Apply stacking logic:
      - Refill (10%) can stack with Rewards or Birthday
      - Only the highest exclusive discount (Employee, Birthday, First Purchase) is used
      - Reward points apply after discounts (100 pts = $1)    
      """

    result = {
        "refill_discount": 0.0,
        "exclusive_discount": 0.0,
        "reward_dollars": 0.0
    }

    if discounts.get("refill_exchange"):
        result["refill_discount"] = 0.10
    
    exclusive_discounts = {
        "employee_discount": 0.20 if discounts.get("employee_discount") else 0.0,
        "birthday_discount": 0.15 if discounts.get("birthday_discount") else 0.0,
        "first_purchase_discount": 0.15 if discounts.get("first_purchase_discount") else 0.0
    }

    result["exclusive_discount"] = max(exclusive_discounts.values())
    
    rewards_points = discounts.get("rewards_points", 0)
    if rewards_points:
        result["reward_dollars"] = rewards_points / 100.0
    
    return result


def calculate_add_on_price(add_on_oils: list, category: BlendCategory) -> float:
    """
    Calculate additional cost for add-ons.
    """
    return False





def calculate_blend_price(blend: dict, user_id:int) -> float:
    """
    Main function to calculate the price of a blend based on its ingredients and eligible discounts.
    """
    base_price = blend.bottle_size.get_base_price(blend['blend_category'])
    add_on_price = calculate_add_on_price(blend)

    subtotal = base_price + add_on_price

    discounts = get_user_discounts(user_id)
    applied = validate_discount_stack(discounts)

    applied_refill = subtotal * (1 - applied["refill_discount"])
    applied_exclusive = applied_refill * (1 - applied["exclusive_discount"])

    final_total = round(max(applied_exclusive - applied["reward_dollars"], 0), 2)
    
    return {
        "base_price": base_price,
        "add_on_price": add_on_price,
        "subtotal": subtotal,
        "applied_discounts": applied,
        "final_total": final_total,
    }