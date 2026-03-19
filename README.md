# OBX

OBX is a full-stack custom oil blend application with a React frontend and a Flask backend. Users can browse oils, create custom blend cards, and authenticate through register/login flows.

## Table of Contents

2. Tech Stack
3. Repository Structurek
4. Prerequisites
5. Quick Start
6. Running the Project
7. Testing
8. API Reference
9. Blend Rules and Validation
10. Environment Variables
11. Deployment Workflow
12. Known Behaviors and Caveats
13. Troubleshooting
14. Future Improvements

## 1. Overview

Core capabilities currently implemented:

- User registration and login
- Oil catalog retrieval and browsing
- Blend card creation with volume validation logic
- Discount data retrieval
- Backend unit tests for blend validation and discount stacking logic

## 2. Tech Stack

Frontend:

- React 19
- Vite
- TypeScript (mixed TS/JS in parts of client)
- Material UI
- Axios

Backend:

- Flask
- Flask-SQLAlchemy
- Flask-JWT-Extended
- Flask-CORS
- Marshmallow (validation exceptions)
- SQLite (local development)
- Pytest

## 3. Repository Structure

Top-level layout:

- client: React frontend
- server: Flask API, models, routes, utilities, and tests
- deploy.sh: primary workflow script for start, test, and deploy modes
- pytest.ini: pytest configuration

Important frontend areas:

- client/src/pages: route-level pages
- client/src/components: feature-organized UI components
- client/src/components/auth: auth modals/forms
- client/src/components/layout: navbar/footer
- client/src/components/order: ordering flow components
- client/src/components/catalog: browse oil card UI
- client/src/components/createBlend: blend-builder subcomponents and logic
- client/src/api: API base URL and context

Important backend areas:

- server/app.py: Flask app factory and blueprint registration
- server/routes: API endpoints (auth, oils, discounts, blend cards)
- server/models: SQLAlchemy models
- server/\_types: enums for oils, blends, and discount codes
- server/utils: validation/pricing logic
- server/data: seed JSON and population helpers
- server/tests: pytest coverage for core rules

## 4. Prerequisites

- Python 3.10+
- Node.js 18+
- npm 9+
- Bash shell available (Git Bash, WSL, or equivalent) for deploy.sh

## 5. Quick Start

1. Clone and enter the repository.
2. Create and activate a Python virtual environment.
3. Install backend dependencies.
4. Install frontend dependencies.
5. Start both backend and frontend dev servers.

Example commands:

```bash
# from repo root
python -m venv .venv

# Windows PowerShell
.\.venv\Scripts\Activate.ps1

# macOS/Linux
source .venv/bin/activate

pip install -r server/requirements.txt
cd client && npm install && cd ..

# start frontend + backend together
bash ./deploy.sh --start
```

Default local URLs:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 6. Running the Project

Recommended entrypoint:

- bash ./deploy.sh --start

Other workflow modes:

- bash ./deploy.sh --test
- bash ./deploy.sh --deploy

Useful deploy options:

- --skip-tests
- --backend-only
- --frontend-only

## 7. Testing

Run backend tests:

```bash
pytest
```

Or via deploy script:

```bash
bash ./deploy.sh --test
```

Current test modules:

- server/tests/test_blend_validation.py
- server/tests/test_calculate_pricing.py

## 8. API Reference

Base URL:

- http://localhost:5000/api

### Auth

- POST /auth/register
- POST /auth/login

Register request body:

```json
{
	"first_name": "Ari",
	"last_name": "Brown",
	"email": "ari@example.com",
	"phone_number": "5551234567",
	"password": "strong-password"
}
```

Login request body:

```json
{
	"email": "ari@example.com",
	"password": "strong-password"
}
```

### Oils

- GET /oils/all
- GET /oils/{oil_id}
- POST /oils/create
- PUT /oils/{oil_id}/update

Allowed oil_type values:

- BASE
- SECONDARY
- OTHER
- PREMIUM

### Blend Cards

- GET /blend_cards/all
- GET /blend_cards/{blend_card_id}
- POST /blend_cards/create

Create blend card request body:

```json
{
	"name": "Growth Blend",
	"description": "Scalp-focused custom blend",
	"product_type": "HAIR",
	"category": "BASE_CUSTOM",
	"bottle_size": "SMALL",
	"bottle_type": "SQUEEZE",
	"oils": [
		{ "oil_id": 1, "oil_type": "BASE" },
		{ "oil_id": 7, "oil_type": "SECONDARY" },
		{ "oil_id": 16, "oil_type": "OTHER" }
	]
}
```

Allowed enum values:

- product_type: HAIR, FRAGRANCE
- category: PREMADE, BASE_CUSTOM, FULLY_CUSTOM
- bottle_size keys for creation: SMALL, MEDIUM, LARGE
- bottle_type: DROPPER, SQUEEZE

### Discounts

- GET /discounts/all
- GET /discounts/{discount_id}

## 9. Blend Rules and Validation

Blend validation logic is centralized in server/utils/blend_validation.py and is enforced during blend card creation.

Highlights:

- Different specs for BASE_CUSTOM and FULLY_CUSTOM categories
- Capacity-aware volume calculation by bottle size
- Add-on limits by bottle size/category
- Secondary oil count limits in BASE_CUSTOM
- Validation errors returned as 400 responses

## 10. Environment Variables

Set these in your shell or a local env loader before starting backend:

- JWT_SECRET: required for JWT token creation

Example:

```bash
export JWT_SECRET="replace-with-a-long-random-secret"
```

Windows PowerShell:

```powershell
$env:JWT_SECRET = "replace-with-a-long-random-secret"
```

## 11. Deployment Workflow

The deploy script supports optional command hooks:

- BACKEND_DEPLOY_CMD
- FRONTEND_DEPLOY_CMD

Example:

```bash
BACKEND_DEPLOY_CMD="echo Deploy backend" \
FRONTEND_DEPLOY_CMD="echo Deploy frontend" \
bash ./deploy.sh --deploy
```

## 12. Known Behaviors and Caveats

- On backend startup, tables are dropped and recreated in create_app. This resets local data every run.
- Seed data is repopulated from server/data/oils_data.json and server/data/discounts_data.json on app boot.
- Client API URL is currently hardcoded to http://localhost:5000/api in client/src/api/api.js.
- Some routes include commented JWT protection placeholders; endpoint protection is not fully enforced yet.

## 13. Troubleshooting

Backend fails to start:

- Ensure virtual environment is active.
- Ensure dependencies are installed from server/requirements.txt.
- Ensure JWT_SECRET is set.

Frontend cannot reach API:

- Confirm backend is running on port 5000.
- Confirm client/src/api/api.js points to your backend URL.
- Check browser console/network for CORS or connection errors.

deploy.sh command not found or fails on Windows:

- Run via Git Bash or WSL.
- From PowerShell use: bash .\deploy.sh --start

## 14. Future Improvements

- Remove automatic db.drop_all/db.create_all from startup and adopt migrations.
- Move API base URL to environment-based frontend config.
- Enforce JWT protection and role-based access on write endpoints.
- Expand test coverage to endpoint and integration tests.
- Add OpenAPI/Swagger documentation for API contracts.
