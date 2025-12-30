from flask import Blueprint, request, jsonify
from db import get_conn
from auth import require_auth

bp_items = Blueprint("items", __name__)

@bp_items.get("/items")
@require_auth
def list_items():
    user_id = int(request.user["sub"])
    with get_conn().cursor() as cur:
        cur.execute("SELECT id, name, description FROM items WHERE user_id=%s ORDER BY id DESC", (user_id,))
        rows = cur.fetchall()
    return jsonify(rows)

@bp_items.post("/items")
@require_auth
def create_item():
    user_id = int(request.user["sub"])
    data = request.get_json(force=True)
    name = (data.get("name") or "").strip()
    desc = (data.get("description") or "").strip()
    if not name:
        return jsonify({"error": "name required"}), 400

    with get_conn().cursor() as cur:
        cur.execute(
            "INSERT INTO items (name, description, user_id) VALUES (%s,%s,%s)",
            (name, desc, user_id),
        )
    return jsonify({"ok": True})
@bp_items.put("/items/<int:item_id>")
@require_auth
def update_item(item_id):
    user_id = int(request.user["sub"])
    data = request.get_json(force=True)

    name = (data.get("name") or "").strip()
    desc = (data.get("description") or "").strip()

    if not name:
        return jsonify({"error": "name required"}), 400

    with get_conn().cursor() as cur:
        cur.execute(
            """
            UPDATE items
            SET name=%s, description=%s
            WHERE id=%s AND user_id=%s
            """,
            (name, desc, item_id, user_id),
        )

    return jsonify({"ok": True})

@bp_items.delete("/items/<int:item_id>")
@require_auth
def delete_item(item_id):
    user_id = int(request.user["sub"])

    with get_conn().cursor() as cur:
        cur.execute(
            "DELETE FROM items WHERE id=%s AND user_id=%s",
            (item_id, user_id),
        )

    return jsonify({"ok": True})
