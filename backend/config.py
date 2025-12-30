import os
from dotenv import load_dotenv
load_dotenv()

class Config:
    DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
    DB_PORT = int(os.getenv("DB_PORT", "3306"))
    DB_USER = os.getenv("DB_USER", "demo_user")
    DB_PASS = os.getenv("DB_PASS", "demo_pass")
    DB_NAME = os.getenv("DB_NAME", "vuln_demo")

    JWT_SECRET = os.getenv("JWT_SECRET", "CHANGE_ME_LOCAL_ONLY")
    JWT_ISSUER = os.getenv("JWT_ISSUER", "vuln-demo")
    JWT_AUDIENCE = os.getenv("JWT_AUDIENCE", "vuln-demo-mobile")
    JWT_TTL_SECONDS = int(os.getenv("JWT_TTL_SECONDS", "900"))