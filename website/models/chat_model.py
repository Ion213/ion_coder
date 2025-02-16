
from website import db
from sqlalchemy.sql import func
from pytz import timezone
from datetime import datetime,time
from flask_login import UserMixin

manila_tz = timezone('Asia/Manila')

#------------Define database models---------------------

class ChatHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.now(manila_tz).replace(second=0,microsecond=0))