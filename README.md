# Consultation Manager

Consultation Manager is a system for health facilities to manage patient consultations.
Build with Django and Angular.

## Overview

The system allows health facility staff to:

- Create/book consultations for patients
- View and filter all consultations by date, patient name, healthcare provider, consultation type, and medical condition
- Patients can view their own consultation details

It consists of a REST API backend in **Django/Python** (`enigma`) and an **Angular** frontend (`synergy`).

## Backend (enigma)

The backend is a REST API built with:

- Django/Python
- Django REST Framework
- PostgreSQL database

### API Routes:
#### Authentication:
- `POST /api/v1/login` - Login
- `POST /api/v1/refresh` - Refresh authentication token
- `POST /api/v1/signup` - Register
- `GET /api/v1/profile` - Get user profile
- `POST /api/v1/password_change_request` - Request to change password
- `POST /api/v1/password_change_confirm` - Confirm password change
- `POST /api/v1/password_change` - Change password

#### Consultation:
- `POST /api/consultations` - Create consultation
- `GET /api/consultations` - Filtered consultations
- `GET /api/consultations/:id` - Get a single consultation
- `PUT /api/consultations/:id` - Update a single consultation

### Models:

- `User` - first name, last name, email, phone number, user type.
- `Consultation` - Date, patient, officer, type, condition, health care provider.

## Frontend (synergy)

The Angular frontend allows officers to manage consultations, and patients to view them.

Built with:

- Angular
- Angular Material

### Components:

- Consultation management
- Consultation booking
- Patient consultation view
- Login
- Register

## Running Locally

Clone the repo:

```shell
git clone https://github.com/baasare/medpharma
