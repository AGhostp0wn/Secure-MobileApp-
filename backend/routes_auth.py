from flask import Blueprint, request, jsonify
from db import get_conn
from auth import issue_token

bp_auth = Blueprint("auth", __name__)

@bp_auth.post("/login")
def login():
    data = request.get_json(force=True)
    username = (data.get("username") or "").strip()
    password = (data.get("password") or "")

    if not username or not password:
        return jsonify({"error": "username/password required"}), 400

    # ✅ Parametrizado (evita SQLi)
    sql = "SELECT id, username FROM users WHERE username=%s AND password=%s LIMIT 1"
    with get_conn().cursor() as cur:
        cur.execute(sql, (username, password))
        user = cur.fetchone()

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    token = issue_token(user["id"], user["username"])
    return jsonify({"token": token, "user": user})
