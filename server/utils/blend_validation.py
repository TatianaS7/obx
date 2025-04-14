from marshmallow import ValidationError
from .._types import BottleSize, BottleType, BlendCategory

base_custom_specs = {
        BottleSize.SMALL.value: {"unit": "mL", "capacity": 60, "base_pct": 0.8, "secondary_pct": 0.2, "max_secondary_count": 1, "max_add_ons": 1, "add_on_volume": 1},
        BottleSize.MEDIUM.value: {"unit": "mL", "capacity": 120, "base_pct": 0.75, "secondary_pct": 0.25, "max_secondary_count": 2, "max_add_ons": 1, "add_on_volume": 1},
        BottleSize.LARGE.value: {"unit": "mL", "capacity": 240, "base_pct": 0.7, "secondary_pct": 0.3, "max_secondary_count": 3, "max_add_ons": 1, "add_on_volume": 1}
}

fully_custom_specs = {
        BottleSize.SMALL.value: {"capacity": 60, "base_volume": 48, "secondary_volume": 12, "max_add_ons": 2, "add_on_volume": 3},
        BottleSize.MEDIUM.value: {"capacity": 120, "base_volume": 90, "secondary_volume": 30, "max_add_ons": 3, "add_on_volume": 3},
        BottleSize.LARGE.value: {"capacity": 240, "base_volume": 168, "secondary_volume": 72, "max_add_ons": 4, "add_on_volume": 3}
}


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

    if bottle_type not in [bt.value for bt in BottleType] or blend_category not in [bc.value for bc in BlendCategory]:
        raise ValidationError("Invalid bottle type or blend category.")

    total_volume = 0
    specs = []
    
    # Separate ingredients into groups
    base_oil = ingredients.get("base_oil", [])
    secondary_oils = ingredients.get("secondary_oil", [])
    add_ons = ingredients.get("add_on_oil", [])


    if bottle_type == BottleType.SQUEEZE.value:
        if blend_category == BlendCategory.BASE_CUSTOM.value:
            specs = base_custom_specs[bottle_size]
            total_volume = specs["capacity"]
            max_secondary_count = specs["max_secondary_count"]
            max_add_ons = specs["max_add_ons"]

            # Calculate volumes
            base_volume = specs["capacity"] * specs["base_pct"]
            secondary_volume = specs["capacity"] * specs["secondary_pct"]

            add_on_total_volume = len(add_ons) * 1 # Complimentary volume for base custom oil is 1 mL

            # Get adjusted base volume and add-on total volume
            adjusted_base_volume, add_on_total_volume = calculate_adjusted_base_volume(
                specs["base_pct"], specs["capacity"], specs["add_on_volume"], add_ons
            )
            
            # Validate ingredient counts
            if len(base_oil) > 1:
                raise ValidationError("Too many base oils. Maximum allowed is 1.")
            if len(secondary_oils) > max_secondary_count:
                raise ValidationError(f"Too many secondary oils. Maximum allowed is {max_secondary_count}.")
            if len(add_ons) > max_add_ons:
                raise ValidationError(f"Too many add-ons. Maximum allowed is {max_add_ons}.")

            # Calculate total volume
            total_volume = adjusted_base_volume + secondary_volume + add_on_total_volume

        elif blend_category == BlendCategory.FULLY_CUSTOM.value:
            specs = fully_custom_specs[bottle_size]
            total_volume = specs["capacity"]
            base_volume = specs["base_volume"]
            secondary_volume = specs["secondary_volume"]
            max_add_ons = specs["max_add_ons"]

            add_on_total_volume = len(add_ons) * 3 # Each add-on is 3 mL

            # Check if the add-on volume exceeds the total bottle capacity
            if add_on_total_volume > specs["capacity"]:
                raise ValidationError(f"Add-ons exceed the total bottle capacity of {specs['capacity']} mL.")

            # available_volume = specs["capacity"] - base_volume - secondary_volume
            # if add_on_total_volume > available_volume:
            #     raise ValidationError(f"Add-ons exceed the available volume of {available_volume} mL.")
            
            base_pct = base_volume / specs["capacity"]
            add_on_volume = specs["add_on_volume"]
            
            # Get adjusted base volume and add-on total volume
            adjusted_base_volume, add_on_total_volume = calculate_adjusted_base_volume(
                base_pct, specs["capacity"], add_on_volume, add_ons
            )

            # print(f"Adjusted base volume: {adjusted_base_volume}")
            print(f"Add-on total volume: {add_on_total_volume}")
            print(f"Secondary volume: {secondary_volume}")            


            # Validate ingredient counts
            if len(add_ons) > max_add_ons:
                raise ValidationError(f"Too many add-ons. Maximum allowed is {max_add_ons}.")

            # Calculate total volume
            total_volume = adjusted_base_volume + secondary_volume + add_on_total_volume

        # Final volume validation after adjustments
        if total_volume > specs["capacity"]:
            raise ValidationError(f"Total volume ({total_volume} mL) exceeds bottle capacity ({specs['capacity']} mL).")            

        return {
            "base_volume": adjusted_base_volume,
            "secondary_volume": secondary_volume,
            "add_on_volume": add_on_total_volume,
            "total_volume": total_volume
        }

    raise ValidationError("Invalid bottle type or blend category.")
