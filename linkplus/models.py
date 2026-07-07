from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    role = db.Column(db.String(20), nullable=False, default='merchant') # admin, merchant, customer
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    stores = db.relationship('Store', backref='owner', lazy=True)

class Store(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='active')
    plan = db.Column(db.String(20), nullable=False, default='basic')
    logo_url = db.Column(db.String(255), nullable=True) # New: store logo
    language = db.Column(db.String(10), nullable=False, default='AR') # New: AR, EN, FR
    currency = db.Column(db.String(10), nullable=False, default='DZD') # New: DZD, USD, EUR
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    products = db.relationship('Product', backref='store', lazy=True)
    orders = db.relationship('Order', backref='store', lazy=True)
    categories = db.relationship('Category', backref='store', lazy=True)

class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, unique=True)
    store_id = db.Column(db.Integer, db.ForeignKey('store.id'), nullable=False)
    store_role = db.Column(db.String(50), nullable=False) # e.g., 'sales_worker', 'cashier'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    user = db.relationship('User', backref=db.backref('employee_profile', uselist=False))
    store = db.relationship('Store', backref='employees')

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    store_id = db.Column(db.Integer, db.ForeignKey('store.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    products = db.relationship('Product', backref='category_rel', lazy=True)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    store_id = db.Column(db.Integer, db.ForeignKey('store.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=True) # New: foreign key
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    purchase_price = db.Column(db.Float, nullable=True) # New: purchase price
    supplier_price = db.Column(db.Float, nullable=True) # New: supplier price
    reseller_price = db.Column(db.Float, nullable=True) # New: reseller price
    stock = db.Column(db.Integer, default=0)
    category = db.Column(db.String(50)) # Kept for backward compatibility, will be replaced by category_id
    image_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    store_id = db.Column(db.Integer, db.ForeignKey('store.id'), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    discount_type = db.Column(db.String(20), nullable=True) # 'percentage' or 'fixed'
    discount_value = db.Column(db.Float, nullable=True) # e.g. 10 or 100
    payment_method = db.Column(db.String(50)) # cash, credit
    status = db.Column(db.String(20), default='completed')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Note: Order Items would be another table in a real system.

class FinancialTransaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    store_id = db.Column(db.Integer, db.ForeignKey('store.id'), nullable=False)
    transaction_type = db.Column(db.String(50), nullable=False) # 'income', 'purchase', 'debt_payment'
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship
    store = db.relationship('Store', backref='financial_transactions')

class PurchaseOrder(db.Model): # Bons d'achat
    id = db.Column(db.Integer, primary_key=True)
    store_id = db.Column(db.Integer, db.ForeignKey('store.id'), nullable=False)
    supplier_name = db.Column(db.String(150), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default='pending') # 'pending', 'received', 'paid'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship
    store = db.relationship('Store', backref='purchase_orders')
