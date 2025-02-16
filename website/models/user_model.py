
from website import db
from sqlalchemy.sql import func
from pytz import timezone
from datetime import datetime,time
from flask_login import UserMixin

manila_tz = timezone('Asia/Manila')

#------------Define database models---------------------

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)