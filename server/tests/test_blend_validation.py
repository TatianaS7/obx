import pytest
from marshmallow import ValidationError
from server.utils import calculate_volume
from server._types import BottleSize, BottleType, BlendCategory


def test_base_custom_valid():
    ingredients = {
        "base_oil": ["oil1"],
        "secondary_oil": ["oil2"],
        "add_on_oil": ["addon1"]
    }
    print(f"Testing base_custom_valid with ingredients: {ingredients}")
    result = calculate_volume(
        ingredients,
        BottleSize.SMALL.value,
        BottleType.SQUEEZE.value,
        BlendCategory.BASE_CUSTOM.value
    )
    print(f"Result: {result}")
    assert result["base_volume"] == 47  # Adjusted base volume
    assert result["secondary_volume"] == 12
    assert result["add_on_volume"] == 1
    assert result["total_volume"] == 60

def test_fully_custom_valid():
    ingredients = {
        "base_oil": ["oil1"],
        "secondary_oil": ["oil2"],
        "add_on_oil": ["addon1", "addon2"]
    }
    print(f"Testing fully_custom_valid with ingredients: {ingredients}")
    result = calculate_volume(
        ingredients,
        BottleSize.MEDIUM.value,
        BottleType.SQUEEZE.value,
        BlendCategory.FULLY_CUSTOM.value
    )
    print(f"Result: {result}")
    assert result["base_volume"] == 84  # Adjusted base volume
    assert result["secondary_volume"] == 30
    assert result["add_on_volume"] == 6
    assert result["total_volume"] == 120

def test_exceed_max_add_ons():
    ingredients = {
        "base_oil": ["oil1"],
        "secondary_oil": ["oil2"],
        "add_on_oil": ["addon1", "addon2", "addon3"]
    }
    print(f"Testing exceed_max_add_ons with ingredients: {ingredients}")
    with pytest.raises(ValidationError, match="Too many add-ons. Maximum allowed is 1."):
        calculate_volume(
            ingredients,
            BottleSize.SMALL.value,
            BottleType.SQUEEZE.value,
            BlendCategory.BASE_CUSTOM.value
        )

def test_exceed_max_secondary_oils():
    ingredients = {
        "base_oil": ["oil1"],
        "secondary_oil": ["oil2", "oil3"],
        "add_on_oil": []
    }
    print(f"Testing exceed_max_secondary_oils with ingredients: {ingredients}")
    with pytest.raises(ValidationError, match="Too many secondary oils. Maximum allowed is 1."):
        calculate_volume(
            ingredients,
            BottleSize.SMALL.value,
            BottleType.SQUEEZE.value,
            BlendCategory.BASE_CUSTOM.value
        )


def test_invalid_bottle_type():
    ingredients = {
        "base_oil": ["oil1"],
        "secondary_oil": ["oil2"],
        "add_on_oil": ["addon1"]
    }
    print(f"Testing invalid_bottle_type with ingredients: {ingredients}")
    with pytest.raises(ValidationError, match="Invalid bottle type or blend category."):
        calculate_volume(
            ingredients,
            BottleSize.SMALL.value,
            "INVALID_TYPE",
            BlendCategory.BASE_CUSTOM.value
        )

def test_invalid_blend_category():
    ingredients = {
        "base_oil": ["oil1"],
        "secondary_oil": ["oil2"],
        "add_on_oil": ["addon1"]
    }
    print(f"Testing invalid_blend_category with ingredients: {ingredients}")
    with pytest.raises(ValidationError, match="Invalid bottle type or blend category."):
        calculate_volume(
            ingredients,
            BottleSize.SMALL.value,
            BottleType.SQUEEZE.value,
            "INVALID_CATEGORY"
        )