from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from network.decorators import json_required_params, commit_after
from database import database
from entity.body import Body

bodies_blueprint = Blueprint('bodies', __name__, url_prefix='/api/bodies')


@bodies_blueprint.route('/api/bodies', methods=['GET'])
def get_bodies():
    bodies = database.get_bodies()
    return jsonify([body.to_dict() for body in bodies])


@bodies_blueprint.route('/api/bodies', methods=['POST'])
@jwt_required
@json_required_params(['name', 'icon', 'quality', 'paintable', 'model', 'blank_skin'])
def add_body():
    body = Body()
    body.apply_dict(request.json)
    database.add_body(body)
    database.commit()
    return jsonify(body.to_dict())


@bodies_blueprint.route('/api/bodies/<body_id>', methods=['DELETE'])
@jwt_required
@commit_after
def delete_body(body_id):
    database.delete_body(body_id)
    return '', 200
