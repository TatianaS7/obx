from marshmallow import ValidationError
from .._types import BottleSize, BottleType, BlendCategory

OIL_DENSITY_G_PER_ML = 0.92

custom_specs = {
    BottleSize.MINI.value: {"unit": "g", "capacity": 5, "base_volume": 4, "secondary_volume": 1, "max_add_ons": 1, "add_on_volume": 0.5},
    BottleSize.SMALL.value: {"unit": "g", "capacity": 60, "base_volume": 48, "secondary_volume": 12, "max_add_ons": 2, "add_on_volume": 3},
    BottleSize.MEDIUM.value: {"unit": "g", "capacity": 120, "base_volume": 90, "secondary_volume": 30, "max_add_ons": 3, "add_on_volume": 3},
    BottleSize.LARGE.value: {"unit": "g", "capacity": 240, "base_volume": 168, "secondary_volume": 72, "max_add_ons": 4, "add_on_volume": 3}
}


def ml_to_grams(value_ml: float) -> float:
    return round(value_ml * OIL_DENSITY_G_PER_ML, 2)


def calculate_adjusted_base_volume(base_pct: float, capacity: int, add_on_volume: int, add_ons: list) -> float:
    """
    Calculate the adjusted base volume based on the percentage, capacity, and add-on volumes.
    """
    add_on_total_volume = len(add_ons) * add_on_volume
    adjusted_base_volume = base_pct * capacity - add_on_total_volume
    if adjusted_base_volume < 0:
        raise ValidationError("Add-ons exceed the allowed volume, reducing base oil volume below zero.")
    return adjusted_base_volume, add_on_total_volume


def calculate_volume(ingredients: dict, bottle_size: str, bottle_type: str, blend_category: str) -> any:
    """
    Calculate the total volume of the blend based on the ingredients and bottle size.
    """

    valid_categories = {
        BlendCategory.CUSTOM.value,
        "BASE_CUSTOM",
        "FULLY_CUSTOM",
    }

    if bottle_type not in [bt.value for bt in BottleType] or blend_category not in valid_categories:
        raise ValidationError("Invalid bottle type or blend category.")

    total_volume = 0
    specs = []
    
    # Separate ingredients into groups
    base_oil = ingredients.get("base_oil", [])
    secondary_oils = ingredients.get("secondary_oil", [])
    add_ons = ingredients.get("add_on_oil", [])

    if blend_category in {BlendCategory.CUSTOM.value, "BASE_CUSTOM", "FULLY_CUSTOM"}:
        specs = custom_specs.get(bottle_size)
        if not specs:
            raise ValidationError("Invalid bottle size.")

        if len(base_oil) < 1:
            raise ValidationError("At least one base oil is required for custom blends.")

        additional_oil_count = len(secondary_oils) + len(add_ons)
        if additional_oil_count < 1:
            raise ValidationError(
                "Select at least one additional oil (secondary or add-on) for custom blends."
            )

        secondary_volume = specs["secondary_volume"]
        max_add_ons = specs["max_add_ons"]

        if len(add_ons) > max_add_ons:
            raise ValidationError(f"Too many add-ons. Maximum allowed is {max_add_ons}.")

        base_pct = specs["base_volume"] / specs["capacity"]
        adjusted_base_volume, add_on_total_volume = calculate_adjusted_base_volume(
            base_pct, specs["capacity"], specs["add_on_volume"], add_ons
        )

        total_volume = adjusted_base_volume + secondary_volume + add_on_total_volume

    else:
        raise ValidationError("Invalid bottle type or blend category.")

    if total_volume > specs["capacity"]:
        raise ValidationError(
            f"Total amount ({ml_to_grams(total_volume)} g) exceeds bottle capacity ({ml_to_grams(specs['capacity'])} g)."
        )

    base_grams = ml_to_grams(adjusted_base_volume)
    secondary_grams = ml_to_grams(secondary_volume)
    add_on_grams = ml_to_grams(add_on_total_volume)
    total_grams = ml_to_grams(total_volume)

    return {
        "unit": "g",
        "base_grams": base_grams,
        "secondary_grams": secondary_grams,
        "add_on_grams": add_on_grams,
        "total_grams": total_grams,
        # Backward-compatible keys retained for routes still expecting these names.
        "base_volume": base_grams,
        "secondary_volume": secondary_grams,
        "add_on_volume": add_on_grams,
        "total_volume": total_grams
    }
