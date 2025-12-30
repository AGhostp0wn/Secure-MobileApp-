import pymysql
from config import Config

def get_conn():
    return pymysql.connect(
        host=Config.DB_HOST,
        port=Config.DB_PORT,
        user=Config.DB_USER,
        password=Config.DB_PASS,
        database=Config.DB_NAME,
        autocommit=True,
        cursorclass=pymysql.cursors.DictCursor,
    )
