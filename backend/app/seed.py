
import secrets
from decimal import Decimal

from pwdlib import PasswordHash

from app.database import SessionLocal

from app.models import (
    Department,
    User,
    Category,
    Project,
    Trip,
    Currency,
    ApprovalPolicy,
)


password_hasher = PasswordHash.recommended()


# =======================================
# 1. DEPARTMENTS
# =======================================

DEPARTMENTS = [
    {"id": "DEP-001", "name": "Operations"},
    {"id": "DEP-002", "name": "Management"},
    {"id": "DEP-003", "name": "Finance"},
    {"id": "DEP-004", "name": "IT"},
]


# =======================================
# 2. EMPLOYEES
# =======================================

USERS = [

    {
        "id": "EMP-002",
        "name": "Nadia Frost",
        "email": "nadia@orvane.test",
        "role": "APPROVER",
        "department": "Management",
        "manager_id": None,
    },

    {
        "id": "EMP-001",
        "name": "John Becker",
        "email": "john@orvane.test",
        "role": "MANAGER",
        "department": "Operations",
        "manager_id": "EMP-002",
    },

    {
        "id": "EMP-003",
        "name": "Priya Sharma",
        "email": "priya@orvane.test",
        "role": "EMPLOYEE",
        "department": "Operations",
        "manager_id": "EMP-001",
    },

    {
        "id": "EMP-004",
        "name": "Tom Becker",
        "email": "tom@orvane.test",
        "role": "FINANCE",
        "department": "Finance",
        "manager_id": None,
    },

]


# =======================================
# 3. EXPENDITURE CATEGORIES
# =======================================

CATEGORIES = [

    {
        "id": "CAT-001",
        "name": "IT / Software",
        "is_it": True,
        "requires_project": True,
    },

    {
        "id": "CAT-002",
        "name": "IT / Hardware",
        "is_it": True,
        "requires_project": True,
    },

    {
        "id": "CAT-003",
        "name": "Travel",
        "requires_trip": True,
    },

    {
        "id": "CAT-004",
        "name": "Office Equipment",
    },

    {
        "id": "CAT-005",
        "name": "Consultancy",
    },

    {
        "id": "CAT-006",
        "name": "Training",
    },

    {
        "id": "CAT-007",
        "name": "Other",
    },

]


# =======================================
# 4. PROJECTS
# =======================================

PROJECTS = [

    {
        "id": "PRJ-001",
        "name": "Finance Transformation",
    },

    {
        "id": "PRJ-002",
        "name": "ERP Modernization",
    },

    {
        "id": "PRJ-003",
        "name": "Site Infrastructure",
    },

    {
        "id": "PRJ-004",
        "name": "AI Transformation",
    },

]


# =======================================
# 5. TRIPS
# =======================================

TRIPS = [

    {
        "id": "TRP-001",
        "name": "Mining Conference",
    },

    {
        "id": "TRP-002",
        "name": "London Business Trip",
    },

    {
        "id": "TRP-003",
        "name": "Dubai Technology Conference",
    },

]


# =======================================
# 6. CURRENCIES
# Illustrative rates for demo purposes
# =======================================

CURRENCIES = [

    {
        "code": "USD",
        "name": "US Dollar",
        "usd_rate": Decimal("1.0000"),
    },

    {
        "code": "AED",
        "name": "UAE Dirham",
        "usd_rate": Decimal("0.2723"),
    },

    {
        "code": "EUR",
        "name": "Euro",
        "usd_rate": Decimal("1.1000"),
    },

    {
        "code": "GBP",
        "name": "British Pound",
        "usd_rate": Decimal("1.2500"),
    },

]


# =======================================
# 7. APPROVAL POLICY
# Provisional until stakeholder confirmation
# =======================================

APPROVAL_POLICIES = [

    {
        "id": "POL-001",
        "name": "Default Spend Approval Policy",
        "threshold_usd": Decimal("5000.00"),
        "additional_approver_id": "EMP-002",
        "require_it_approval": True,
    },

]


# =======================================
# GENERIC MASTER DATA SEED FUNCTION
# =======================================

def seed_records(
    db,
    model,
    records,
    primary_key="id",
):

    inserted = 0
    skipped = 0

    for record in records:

        record_id = record[primary_key]

        existing = db.get(model, record_id)

        if existing is not None:
            skipped += 1
            continue

        db.add(model(**record))

        inserted += 1

    db.flush()

    return inserted, skipped


# =======================================
# EMPLOYEE SEED FUNCTION
# =======================================

def seed_users(db):

    credentials = []
    inserted = 0
    skipped = 0

    for record in USERS:

        existing = db.get(
            User,
            record["id"]
        )

        if existing is not None:
            skipped += 1
            continue

        password = secrets.token_urlsafe(18)

        user = User(
            **record,
            password_hash=password_hasher.hash(password),
            active=True,
        )

        db.add(user)

        # Persist each manager before adding
        # their direct reports.
        db.flush()

        credentials.append(
            (record["email"], password)
        )

        inserted += 1

    return inserted, skipped, credentials


# =======================================
# MAIN SEED FUNCTION
# =======================================

def seed_database():

    print("\nStarting Spendora database seeding...\n")

    results = []

    with SessionLocal.begin() as db:

        inserted, skipped = seed_records(
            db, Department, DEPARTMENTS
        )

        results.append(
            ("Departments", inserted, skipped)
        )

        inserted, skipped, credentials = seed_users(db)

        results.append(
            ("Users", inserted, skipped)
        )

        inserted, skipped = seed_records(
            db, Category, CATEGORIES
        )

        results.append(
            ("Categories", inserted, skipped)
        )

        inserted, skipped = seed_records(
            db, Project, PROJECTS
        )

        results.append(
            ("Projects", inserted, skipped)
        )

        inserted, skipped = seed_records(
            db, Trip, TRIPS
        )

        results.append(
            ("Trips", inserted, skipped)
        )

        inserted, skipped = seed_records(
            db,
            Currency,
            CURRENCIES,
            primary_key="code",
        )

        results.append(
            ("Currencies", inserted, skipped)
        )

        inserted, skipped = seed_records(
            db, ApprovalPolicy, APPROVAL_POLICIES
        )

        results.append(
            ("Approval Policies", inserted, skipped)
        )

    # Transaction successfully committed.

    print("-" * 50)
    print("Database seeding completed successfully.")
    print("-" * 50)

    for name, inserted, skipped in results:

        print(
            f"{name}: "
            f"{inserted} inserted, "
            f"{skipped} already existing"
        )

    if credentials:

        print("\nNew demo user credentials")
        print("Save these passwords privately.")
        print("-" * 50)

        for email, password in credentials:

            print(f"Email: {email}")
            print(f"Password: {password}")
            print("-" * 50)

    print("\nSpendora database is ready.")


if __name__ == "__main__":
    seed_database()
