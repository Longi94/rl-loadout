import logging
from flask import Flask, jsonify
from config import config
from database import Db

app = Flask(__name__)
database = Db()


@app.route('/api/bodies', methods=['GET'])
def get_bodies():
    bodies = database.get_bodies()
    return jsonify([body.to_dict() for body in bodies])


if __name__ == '__main__':
    port = int(config.get('server', 'port'))
    app.run(host='0.0.0.0', port=port)
