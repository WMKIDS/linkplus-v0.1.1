# LinkPlus - المنظومة الشاملة

LinkPlus is a comprehensive platform built to help merchants manage their Point of Sale (POS), Inventory, Debts, and Online Shop all from one place. This repository contains the refactored, full-stack version of the application using Python (Flask), SQLAlchemy, and Tailwind CSS.

## Features

1.  **Super Admin Dashboard:**
    *   Overview of platform statistics (total stores, active subscriptions, revenue).
    *   Manage and filter merchants.
    *   Add new merchants to the platform.

2.  **Merchant Dashboard (POS & ERP):**
    *   **POS System:** Process cash or credit sales.
    *   **Inventory Management:** View, add, and delete products in real-time.
    *   **Debt Book:** Manage customer debts.
    *   **Statistics:** View sales metrics.

3.  **Online Shop (Customer View):**
    *   Dedicated e-commerce storefront for each merchant (`/shop/<store_id>`).
    *   Filter products by categories.
    *   Functional shopping cart.
    *   Submit orders directly to the backend.

## Tech Stack

*   **Backend:** Python 3.12, Flask, Flask-Login, Flask-SQLAlchemy, Flask-WTF
*   **Database:** SQLite (default for development)
*   **Frontend:** HTML5 (Jinja2), Tailwind CSS, Vanilla JavaScript, FontAwesome

## Setup Instructions

1.  **Clone the repository and enter the directory:**
    ```bash
    cd linkplus
    ```

2.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Initialize the Database:**
    To seed the database with an Admin account, a Merchant account, and some sample products, run the initialization script:
    ```bash
    python init_db.py
    ```

4.  **Run the Server:**
    ```bash
    flask run
    ```
    The application will be available at `http://localhost:5000`.

## Testing Credentials

*   **Admin Login:**
    *   Username: `admin`
    *   Password: `admin123`
*   **Merchant Login:**
    *   Username: `omar`
    *   Password: `omar123`

## Directory Structure

*   `app.py`: The main Flask application factory and routing logic.
*   `models.py`: SQLAlchemy database schemas (User, Store, Product, Order).
*   `init_db.py`: Script to initialize and seed the database.
*   `templates/`: HTML templates using Jinja2 inheritance.
*   `static/`: CSS styling and client-side JavaScript.