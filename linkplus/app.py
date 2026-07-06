from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_wtf.csrf import CSRFProtect
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
import os

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-for-linkplus')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///linkplus.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    from models import db, User, Store, Product, Order
    db.init_app(app)

    login_manager = LoginManager()
    login_manager.login_view = 'login'
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # CSRF Protection
    csrf = CSRFProtect(app)

    @app.after_request
    def set_secure_headers(response):
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'SAMEORIGIN'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        return response

    @app.route('/')
    def index():
        return redirect(url_for('login'))

    @app.route('/login', methods=['GET', 'POST'])
    def login():
        if current_user.is_authenticated:
            if current_user.role == 'admin':
                return redirect(url_for('admin_dashboard'))
            elif current_user.role == 'merchant':
                return redirect(url_for('merchant_dashboard'))

        if request.method == 'POST':
            username = request.form.get('username')
            password = request.form.get('password')
            user = User.query.filter_by(username=username).first()
            if user and user.check_password(password):
                login_user(user)
                if user.role == 'admin':
                    return redirect(url_for('admin_dashboard'))
                else:
                    return redirect(url_for('merchant_dashboard'))
            else:
                flash('اسم المستخدم أو كلمة المرور غير صحيحة', 'error')
        return render_template('login.html')

    @app.route('/logout')
    @login_required
    def logout():
        logout_user()
        return redirect(url_for('login'))

    @app.route('/admin')
    @login_required
    def admin_dashboard():
        if current_user.role != 'admin':
            return redirect(url_for('login'))
        stores = Store.query.all()
        active_stores_count = Store.query.filter_by(status='active').count()
        return render_template('admin.html', stores=stores, active_stores_count=active_stores_count)

    @app.route('/admin/add_merchant', methods=['POST'])
    @login_required
    def add_merchant():
        if current_user.role != 'admin':
            return jsonify({'success': False, 'message': 'Unauthorized'}), 403

        data = request.get_json()
        store_name = data.get('storeName')
        merchant_name = data.get('merchantName')
        plan = data.get('plan')

        # Check if username exists
        if User.query.filter_by(username=merchant_name).first():
            return jsonify({'success': False, 'message': 'اسم المستخدم موجود بالفعل'})

        new_user = User(username=merchant_name, email=f"{merchant_name}@example.com", role='merchant')
        new_user.set_password('default123') # In real app, generate or send email
        db.session.add(new_user)
        db.session.commit()

        new_store = Store(name=store_name, user_id=new_user.id, plan=plan)
        db.session.add(new_store)
        db.session.commit()

        return jsonify({'success': True, 'message': 'تمت إضافة التاجر بنجاح', 'store_id': new_store.id})

    @app.route('/merchant')
    @login_required
    def merchant_dashboard():
        if current_user.role != 'merchant':
            return redirect(url_for('login'))
        store = Store.query.filter_by(user_id=current_user.id).first()
        if not store:
            flash("لم يتم العثور على متجر لهذا التاجر", "error")
            return redirect(url_for('logout'))

        products = Product.query.filter_by(store_id=store.id).all()
        return render_template('merchant.html', store=store, products=products)

    @app.route('/merchant/add_product', methods=['POST'])
    @login_required
    def add_product():
        if current_user.role != 'merchant':
            return jsonify({'success': False, 'message': 'Unauthorized'}), 403

        store = Store.query.filter_by(user_id=current_user.id).first()
        data = request.get_json()

        new_product = Product(
            store_id=store.id,
            name=data.get('name'),
            category=data.get('category'),
            price=float(data.get('price')),
            stock=int(data.get('stock'))
        )
        db.session.add(new_product)
        db.session.commit()

        return jsonify({'success': True, 'message': 'تمت إضافة المنتج بنجاح', 'product_id': new_product.id})

    @app.route('/merchant/delete_product/<int:product_id>', methods=['DELETE'])
    @login_required
    def delete_product(product_id):
        if current_user.role != 'merchant':
            return jsonify({'success': False, 'message': 'Unauthorized'}), 403
        store = Store.query.filter_by(user_id=current_user.id).first()
        product = Product.query.filter_by(id=product_id, store_id=store.id).first()
        if product:
            db.session.delete(product)
            db.session.commit()
            return jsonify({'success': True})
        return jsonify({'success': False}), 404

    @app.route('/shop/<int:store_id>')
    def shop_view(store_id):
        store = Store.query.get_or_404(store_id)
        products = Product.query.filter_by(store_id=store.id).all()
        return render_template('shop.html', store=store, products=products)

    @app.route('/shop/<int:store_id>/checkout', methods=['POST'])
    def shop_checkout(store_id):
        store = Store.query.get_or_404(store_id)
        data = request.get_json()

        total = data.get('total', 0)
        cart = data.get('cart', [])

        # Create an order
        new_order = Order(store_id=store.id, total_amount=total, payment_method='cash_on_delivery')
        db.session.add(new_order)

        # Deduct stock
        for item in cart:
            product = Product.query.filter_by(name=item['name'], store_id=store.id).first()
            if product and product.stock >= item['qty']:
                product.stock -= item['qty']

        db.session.commit()
        return jsonify({'success': True, 'message': 'تم استلام طلبك بنجاح'})

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
