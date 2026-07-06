from app import create_app
from models import db, User, Store, Product

app = create_app()

with app.app_context():
    db.create_all()

    # Create Admin
    admin = User.query.filter_by(username='admin').first()
    if not admin:
        admin = User(username='admin', email='admin@linkplus.com', role='admin')
        admin.set_password('admin123')
        db.session.add(admin)

    # Create test merchant
    merchant = User.query.filter_by(username='omar').first()
    if not merchant:
        merchant = User(username='omar', email='omar@boutique.com', role='merchant')
        merchant.set_password('omar123')
        db.session.add(merchant)
        db.session.commit() # Commit so we can use merchant.id

        # Create Store for merchant
        store = Store(name='Boutique El Anik', user_id=merchant.id, plan='Pro')
        db.session.add(store)
        db.session.commit()

        # Add some products
        products = [
            Product(store_id=store.id, name='قميص كلاسيكي أسود', price=3500, stock=12, category='ألبسة رجال'),
            Product(store_id=store.id, name='حذاء رياضي نايك', price=8500, stock=5, category='أحذية'),
            Product(store_id=store.id, name='ساعة ذكية رياضية', price=5200, stock=2, category='إكسسوارات'),
            Product(store_id=store.id, name='سروال جينز أزرق', price=4200, stock=24, category='ألبسة رجال')
        ]
        db.session.add_all(products)

    db.session.commit()
    print("Database initialized successfully with test data!")
