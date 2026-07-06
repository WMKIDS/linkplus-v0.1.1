# LinkPlus Full-Stack Project

LinkPlus is an all-in-one centralized management, POS (Point of Sale), and e-commerce platform built with Flask.

## Features
- Super Admin Dashboard (Manage merchants, monitor platform health)
- Merchant Point of Sale (POS) & ERP (Cart, Inventory, Debt)
- Customer E-commerce Shop (Browse products, add to cart)
- Light/Dark Mode toggle
- Simulated interactive cart and toast notifications

## Tech Stack
- Backend: Python, Flask, Flask-SQLAlchemy, Flask-WTF
- Frontend: HTML5, Tailwind CSS, FontAwesome, JavaScript

## Setup Instructions

1. **Clone the repository and enter the directory**:
   ```bash
   cd linkplus
   ```

2. **Create a virtual environment (optional but recommended)**:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

3. **Install the dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Flask application**:
   ```bash
   python app.py
   ```

5. **Open your browser** and navigate to `http://localhost:5000` to view the application.
