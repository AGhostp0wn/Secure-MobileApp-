import time
import jwt
from functools import wraps
from flask import request, jsonify
from config import Config

def issue_token(user_id: int, username: str) -> str:
    now = int(time.time())      #com
    payload = {
        "sub": str(user_id),
        "username": username,
        "iat": now,
        "nbf": now,
        "exp": now + Config.JWT_TTL_SECONDS,
        "iss": Config.JWT_ISSUER,
        "aud": Config.JWT_AUDIENCE,
    }
    return jwt.encode(payload, Config.JWT_SECRET, algorithm="HS256")

def decode_token(token: str) -> dict:
    return jwt.decode(
        token,
        Config.JWT_SECRET,
        algorithms=["HS256"],
        issuer=Config.JWT_ISSUER,
        audience=Config.JWT_AUDIENCE,
        options={"require": ["exp", "iat", "nbf", "iss", "aud", "sub"]},
    )

def require_auth(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing Bearer token"}), 401

        token = auth_header.split(" ", 1)[1].strip()
        try:
            claims = decode_token(token)
        except Exception:
            return jsonify({"error": "Invalid token"}), 401

        request.user = claims
        return f(*args, **kwargs)
    return wrapper
