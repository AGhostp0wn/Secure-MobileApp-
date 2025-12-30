from flask import Flask, jsonify
from flask_cors import CORS
from routes_auth import bp_auth
from routes_items import bp_items

def create_app():
    app = Flask(__name__)
    CORS(app)
    #com
    app.register_blueprint(bp_auth)
    app.register_blueprint(bp_items)

    @app.get("/health")
    def health():
        return jsonify({"ok": True})

    return app

if __name__ == "__main__":
    create_app().run(host="0.0.0.0", port=5000, debug=True) 
