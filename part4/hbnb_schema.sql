-- Suppression des tables existantes
DROP TABLE IF EXISTS place_amenity;
DROP TABLE IF EXISTS amenities;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS places;
DROP TABLE IF EXISTS users;

-- Création de la table User
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table Place
CREATE TABLE IF NOT EXISTS places (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    owner_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Création de la table Review
CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    rating INTEGER,
    user_id TEXT NOT NULL,
    place_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (place_id) REFERENCES places(id),
    UNIQUE (user_id, place_id)
);

-- Création de la table Amenity
CREATE TABLE IF NOT EXISTS amenities (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table Place_Amenity (Relation Many-to-Many)
CREATE TABLE IF NOT EXISTS place_amenity (
    place_id TEXT NOT NULL,
    amenity_id TEXT NOT NULL,
    PRIMARY KEY (place_id, amenity_id),
    FOREIGN KEY (place_id) REFERENCES places(id),
    FOREIGN KEY (amenity_id) REFERENCES amenities(id)
);

-- Insertion des données initiales dans la table User
--INSERT INTO users (id, first_name, last_name, email, password, is_admin) VALUES
--    ('36c9050e-ddd3-4c3b-9731-9f487208bbc1', 'Admin', 'HBnB', 'admin@hbnb.io',
--    '$2b$12$zYlf3H2L9D1R8rTc99lC2uLfB4XflbJFtANjFHvkjy1K7U5TAFDDG', TRUE);

-- Insertion des équipements initiaux dans la table Amenity
INSERT INTO amenities (id, name) VALUES
    ('1', 'WiFi'),
    ('2', 'Swimming Pool'),
    ('3', 'Air Conditioning');


-- Insertion de 5 logements
INSERT INTO places (id, title, description, price, latitude, longitude, owner_id)
VALUES
('a1e23f45-1111-aaaa-bbbb-000000000001', 'Appartement cosy Paris', 'Charmant petit appartement dans le Marais', 120.0, 48.859, 2.352, '36c9050e-ddd3-4c3b-9731-9f487208bbc1'),

('a1e23f45-1111-aaaa-bbbb-000000000002', 'Villa avec piscine', 'Grande villa avec piscine et vue sur mer', 280.0, 43.710, 7.262, '36c9050e-ddd3-4c3b-9731-9f487208bbc1'),

('a1e23f45-1111-aaaa-bbbb-000000000003', 'Studio moderne Lyon', 'Studio bien équipé proche centre-ville', 90.0, 45.757, 4.835, '36c9050e-ddd3-4c3b-9731-9f487208bbc1'),

('a1e23f45-1111-aaaa-bbbb-000000000004', 'Chalet à la montagne', 'Chalet rustique avec cheminée et neige !', 150.0, 45.899, 6.129, '36c9050e-ddd3-4c3b-9731-9f487208bbc1'),

('a1e23f45-1111-aaaa-bbbb-000000000005', 'Maison de campagne', 'Maison calme avec grand jardin', 110.0, 47.000, 0.120, '36c9050e-ddd3-4c3b-9731-9f487208bbc1');
