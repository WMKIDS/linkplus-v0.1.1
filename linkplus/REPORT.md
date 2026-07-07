# LinkPlus Technical Report (Version V0.1.7)

## 1. Executive Summary
LinkPlus is a comprehensive full-stack Point of Sale (POS), Enterprise Resource Planning (ERP), and E-commerce platform designed to help merchants manage their business operations, inventory, debts, and online presence from a single unified interface. This report outlines the current architecture (Version V0.1.7) and establishes the roadmap for the upcoming feature enhancements.

## 2. Current Architecture & Tech Stack (V0.1.7)
The current version of LinkPlus is built on a robust, lightweight stack suitable for rapid development and deployment.

### Technology Stack
*   **Backend:** Python 3.12, Flask, Flask-Login, Flask-SQLAlchemy, Flask-WTF
*   **Database:** SQLite (Default for development)
*   **Frontend:** HTML5 (Jinja2 templating), Tailwind CSS, Vanilla JavaScript, FontAwesome
*   **Authentication & Roles:** Flask-Login handles session management, distinguishing between Super Admin and Merchant roles.

### Current Core Features
1.  **Super Admin Dashboard:** Overall platform statistics, merchant management (add, filter), and oversight.
2.  **Merchant Dashboard (POS & ERP):**
    *   POS system for processing cash and credit sales.
    *   Real-time Inventory Management (view, add, delete products).
    *   Debt Book for managing customer accounts.
    *   Sales Statistics.
3.  **Online Shop (Customer View):** Dedicated e-commerce storefront for each merchant (`/shop/<store_id>`) with category filtering, a shopping cart, and direct order submission.

## 3. Roadmap & Groundwork for Upcoming Features
The following features are scheduled for implementation to enhance functionality, improve user experience, and provide advanced management tools.

### 3.1 Merchant Account & POS Enhancements
*   **Invoicing & Discounts:** Introduce a discount field (supporting both percentage `%` and fixed amount `e.g., 100`) within the invoice/cart interface.
*   **Hardware Integration:** Implement support for Barcode Printers and Receipt Printers (Ticket de caisse), enabling printing via dedicated separate POPUP windows.
*   **Barcode Scanner Integration:** Allow instant product lookup and loading by scanning barcodes from tickets.
*   **Employee Management:** Enable merchants to create employee accounts with specific roles and Role-Based Access Control (RBAC) (e.g., Sales Worker, Cashier/Money Manager).
*   **Financial Tracking:** Introduce detailed financial accounts categorizing Income, Purchases, and Debts, along with a dedicated "Bons d'achat" (Purchase Orders) page.
*   **E-commerce Sync:** Establish real-time synchronization so that all orders and invoices from the online shop appear instantly in the merchant's dashboard.

### 3.2 Product & Inventory Management Upgrades
*   **Product Images:** Support uploading and managing images for products.
*   **Comprehensive Edit Capability:** Introduce a global "Edit" button to modify all product details, including online store visibility.
*   **Advanced Pricing Fields:** Expand product schema to include Purchase Price, Supplier Price, and Reseller (Revendeur) Price.
*   **Dynamic Categories:** Replace static categories with a fully dynamic system, allowing merchants to freely create, edit, rename, and manage categories (e.g., Men, Women, Kids).

### 3.3 UI/UX & Settings Modernization
*   **Multi-language & i18n:** Add a language toggle button to seamlessly switch the application between Arabic (AR), English (EN), and French (FR), implementing automatic LTR/RTL layout switching.
*   **Comprehensive Merchant Settings Page:**
    *   Security: Change password and personal information.
    *   Store Identity: Update store logo and name.
    *   Localization: Configure pricing settings and select active currency (e.g., DZD with symbol, USD, EUR).

### 3.4 Super Admin Privileges Expansion
*   **Subscription Control:** Grant Super Admins the ability to enable, disable, or lock a merchant's account based on subscription payment status.
*   **Account Recovery:** Allow Super Admins to securely edit or reset a merchant's username and password (with encrypted data handling) in case of recovery needs.
*   **Overarching Control:** Ensure the Super Admin maintains comprehensive control and visibility across the entire platform.

## 4. Implementation Strategy
To maintain application stability during this significant upgrade phase, the implementation should be phased. Modifications to the database schema (e.g., adding pricing fields, dynamic categories, product images, employee roles, financial tables) will be prioritized first. This ensures the data foundation is solid before building the corresponding UI and logic layers.
