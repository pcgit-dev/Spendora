
from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)

BASE_URL = "/api/v1/master-data"


def test_get_categories():

    response = client.get(
        f"{BASE_URL}/categories"
    )

    assert response.status_code == 200

    categories = response.json()

    assert len(categories) >= 7

    assert all(
        category["active"]
        for category in categories
    )


def test_it_category_configuration():

    response = client.get(
        f"{BASE_URL}/categories"
    )

    assert response.status_code == 200

    categories = response.json()

    category = next(
        category
        for category in categories
        if category["id"] == "CAT-001"
    )

    assert category["is_it"] is True

    assert category["requires_project"] is True


def test_travel_category_configuration():

    response = client.get(
        f"{BASE_URL}/categories"
    )

    assert response.status_code == 200

    categories = response.json()

    category = next(
        category
        for category in categories
        if category["id"] == "CAT-003"
    )

    assert category["requires_trip"] is True


def test_get_projects():

    response = client.get(
        f"{BASE_URL}/projects"
    )

    assert response.status_code == 200

    assert len(response.json()) >= 4


def test_get_trips():

    response = client.get(
        f"{BASE_URL}/trips"
    )

    assert response.status_code == 200

    assert len(response.json()) >= 3


def test_get_currencies():

    response = client.get(
        f"{BASE_URL}/currencies"
    )

    assert response.status_code == 200

    currencies = response.json()

    codes = {
        currency["code"]
        for currency in currencies
    }

    assert {
        "USD", "AED", "EUR", "GBP"
    }.issubset(codes)


def test_get_departments():

    response = client.get(
        f"{BASE_URL}/departments"
    )

    assert response.status_code == 200

    assert len(response.json()) >= 4


def test_get_approval_policy():

    response = client.get(
        f"{BASE_URL}/approval-policy"
    )

    assert response.status_code == 200

    policy = response.json()

    assert policy["id"] == "POL-001"

    assert policy["additional_approver_id"] == "EMP-002"

    assert policy["require_it_approval"] is True
