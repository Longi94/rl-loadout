import pandas as pd
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from dao import ProductDao
from entity import Product
from database import database
from utils.network.exc import NotFoundException, BadRequestException

products_blueprint = Blueprint('product', __name__, url_prefix='/internal/products')
product_dao = ProductDao()


@products_blueprint.route('upload', methods=['POST'])
@jwt_required
def upload():
    f = request.files['file']
    df = pd.read_csv(f, encoding='ISO-8859-1', header=None, names=['id', 'type', 'product', 'name'])
    df['product'] = df['product'].str.replace('Product_TA ProductsDB.Products.', '')

    for index, row in df.iterrows():
        product_id = int(row['id'])
        product = product_dao.get(product_id)

        if product is None:
            product = Product(id=product_id, type=row['type'], product_name=row['product'], name=row['name'])
            product_dao.add(product)
        else:
            product.type = row['type']
            product.product_name = row['product']
            product.name = row['name']

    database.commit()

    return '', 200


@products_blueprint.route('', methods=['GET'])
@jwt_required
def get_all():
    products = product_dao.get_all()
    return jsonify([product.to_dict() for product in products])


@products_blueprint.route('/<product_id>', methods=['GET'])
@jwt_required
def get(product_id):
    try:
        product_id = int(product_id)
    except ValueError:
        raise BadRequestException('product id must be an integer')

    product = product_dao.get(product_id)

    if product is None:
        raise NotFoundException('Product not found')

    return jsonify(product.to_dict())
