import pytest
from datetime import datetime
from unittest.mock import patch, MagicMock
from freezegun import freeze_time
from marshmallow import ValidationError
from server._types import BottleSize, BottleType, BlendCategory
from server.utils.calculate_pricing import (
    is_employee,
    is_birthday,
    validate_discount_stack,
    is_refill_exhange,
    is_first_purchase,
    get_user_discounts
)

# Create a mock user
class MockUser:
    def __init__(self, is_employee=False, birthday=None, reward_points=0):
        self.is_employee = is_employee
        self.birthday = birthday
        self.rewards_points = reward_points


@pytest.fixture
def user_id():
    return 1

@pytest.fixture
def mock_user_query():
    with patch('server.utils.calculate_pricing.User') as MockUserModel:
        mock_query = MagicMock()
        MockUserModel.query = mock_query
        yield mock_query



def test_is_employee(user_id, mock_user_query):
    user = MockUser(is_employee=True)
    mock_user_query.get.return_value = user
    assert is_employee(user_id) is True


@freeze_time("2025-10-17")
def test_is_birthday(user_id, mock_user_query):
    user = MockUser(birthday=datetime(1990, 10, 1))
    mock_user_query.get.return_value = user
    assert is_birthday(user_id) is True


def test_validate_discount_stack():
    discounts = {
        "refill_exchange": True,
        "employee_discount": True,
        "birthday_discount": True,
        "first_purchase_discount": True,
        "rewards_points": 276.50
    }

    result = validate_discount_stack(discounts)
    assert result["refill_discount"] == 0.1
    assert result["exclusive_discount"] == 0.2
    assert result["reward_dollars"] == 2.765