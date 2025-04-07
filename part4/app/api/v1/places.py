from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.place import Place
from app.models.review import Review
from app.extensions import db

places_bp = Blueprint('places', __name__)

@places_bp.route('/places', methods=['GET'])
def get_places():
    max_price = request.args.get('max_price', type=float)

    query = Place.query
    if max_price is not None:
        query = query.filter(Place.price <= max_price)

    places = query.all()
    return jsonify([{
        'id': place.id,
        'title': place.title,
        'description': place.description,
        'price': place.price,
        'latitude': place.latitude,
        'longitude': place.longitude,
        'owner_id': place.owner_id,
    } for place in places]), 200

@places_bp.route('/places/<place_id>', methods=['GET'])
def get_place(place_id):
    place = Place.query.get(place_id)
    if not place:
        return jsonify({'message': 'Place not found'}), 404

    return jsonify({
        'id': place.id,
        'title': place.title,
        'description': place.description,
        'price': place.price,
        'latitude': place.latitude,
        'longitude': place.longitude,
        'owner_id': place.owner_id,
    }), 200

@places_bp.route('/places/<place_id>/reviews', methods=['GET'])
def get_place_reviews(place_id):
    place = Place.query.get(place_id)
    if not place:
        return jsonify({'message': 'Place not found'}), 404

    reviews = Review.query.filter_by(place_id=place_id).all()
    return jsonify([{
        'id': review.id,
        'text': review.text,
        'rating': review.rating,
        'user_id': review.user_id,
    } for review in reviews]), 200

@places_bp.route('/places/<place_id>/reviews', methods=['POST'])
@jwt_required()
def create_review(place_id):
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data or 'text' not in data or 'rating' not in data:
        return jsonify({'message': 'Missing text or rating'}), 400

    place = Place.query.get(place_id)
    if not place:
        return jsonify({'message': 'Place not found'}), 404

    if Review.query.filter_by(place_id=place_id, user_id=user_id).first():
        return jsonify({'message': 'You have already reviewed this place'}), 400

    review = Review(
        text=data['text'],
        rating=data['rating'],
        place_id=place_id,
        user_id=user_id
    )

    db.session.add(review)
    db.session.commit()

    return jsonify({
        'id': review.id,
        'text': review.text,
        'rating': review.rating,
        'user_id': review.user_id,
        'place_id': review.place_id,
    }), 201
