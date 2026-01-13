from flask import Blueprint, request, jsonify
import jwt

from db import get_conn
from auth import issue_token, issue_refresh_token
from config import Config

bp_auth = Blueprint("auth", __name__)

# ---------------------------
# LOGIN
# ---------------------------
@bp_auth.post("/login")
def login():
    data = request.get_json(force=True)
    username = (data.get("username") or "").strip()
    password = (data.get("password") or "")

    if not username or not password:
        return jsonify({"error": "username/password required"}), 400

    sql = "SELECT id, username FROM users WHERE username=%s AND password=%s LIMIT 1"
    with get_conn().cursor() as cur:
        cur.execute(sql, (username, password))
        user = cur.fetchone()

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = issue_token(user["id"], user["username"])
    refresh_token = issue_refresh_token(user["id"])

    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": user
    })


# ---------------------------
# REFRESH TOKEN
# ---------------------------
@bp_auth.post("/refresh")
def refresh():
    data = request.get_json(force=True)
    refresh_token = data.get("refresh_token")

    if not refresh_token:
        return jsonify({"error": "refresh_token required"}), 400

    try:
        claims = jwt.decode(
            refresh_token,
            Config.JWT_SECRET,
            algorithms=["HS256"],
            issuer=Config.JWT_ISSUER,
            audience=Config.JWT_AUDIENCE
        )

        # Asegura que sea refresh y no access
        if claims.get("type") != "refresh":
            return jsonify({"error": "Invalid token type"}), 401

        new_access_token = issue_token(
            claims["sub"],
            claims.get("username", "")
        )

        return jsonify({
            "access_token": new_access_token
        })

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Refresh token expired"}), 401
    except Exception:
        return jsonify({"error": "Invalid refresh token"}), 401
