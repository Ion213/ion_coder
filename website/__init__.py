from flask import (
    Flask, 
    render_template, 
    request, 
    jsonify, 
    Blueprint
    )

'''
from flask_login import (
    LoginManager, 
    UserMixin, 
    login_user, 
    login_required, 
    current_user
    )
'''

from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os
from datetime import timedelta

from .register_routes import routes_list
# Initialize database
db = SQLAlchemy()
DB_NAME = "database.db"
migrate = Migrate()

# Create Flask app
def flask_app():
    app = Flask(__name__, static_folder='templates/static')
    app.config['SECRET_KEY'] = 'ionGPT'
    db_path = os.path.join(app.root_path, 'database', DB_NAME)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_path
    #app.config['REMEMBER_COOKIE_DURATION'] = timedelta(days=7) #use if you use login
    app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)  # Session lasts for 7 days
    
    # Initialize database and migration
    db.init_app(app)
    migrate.init_app(app, db)

    
    # Initialize login manager #use if you want to login
    '''
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = '/'
    
    from .models.user_model import User
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(user_id)
    '''
    
    
    # Register blueprints
    routes_list(app)
    
    # Create database if not exists
    create_database(app)
    
    return app

# Create database function
def create_database(app):
    if not os.path.exists(os.path.join(app.root_path, 'database', DB_NAME)):
        with app.app_context():
            db.create_all()

