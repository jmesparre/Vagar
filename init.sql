-- Crear la tabla Properties
CREATE TABLE IF NOT EXISTS Properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    latitude DECIMAL(11, 8),
    longitude DECIMAL(11, 8),
    category VARCHAR(100),
    guests TINYINT UNSIGNED,
    bedrooms TINYINT UNSIGNED,
    beds TINYINT UNSIGNED,
    bathrooms TINYINT UNSIGNED,
    rating DECIMAL(3, 2),
    price_high DECIMAL(10, 2),
    price_mid DECIMAL(10, 2),
    price_low DECIMAL(10, 2),
    featured BOOLEAN DEFAULT FALSE,
    video_url TEXT,
    optional_services TEXT,
    map_node_id VARCHAR(255) UNIQUE
);

-- Crear la tabla Experiences
CREATE TABLE IF NOT EXISTS Experiences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(100),
    short_description TEXT,
    long_description TEXT,
    what_to_know JSON
);

-- Crear la tabla Images
CREATE TABLE IF NOT EXISTS Images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(255) NOT NULL UNIQUE,
    alt_text VARCHAR(255),
    entity_type ENUM('property', 'experience'),
    entity_id INT,
    `order` TINYINT,
    image_category ENUM('gallery', 'blueprint') DEFAULT 'gallery'
);

-- Crear la tabla Amenities
CREATE TABLE IF NOT EXISTS Amenities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(100),
    icon VARCHAR(100)
);

-- Crear la tabla intermedia PropertyAmenities
CREATE TABLE IF NOT EXISTS PropertyAmenities (
    property_id INT,
    amenity_id INT,
    PRIMARY KEY (property_id, amenity_id),
    FOREIGN KEY (property_id) REFERENCES Properties(id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES Amenities(id) ON DELETE CASCADE
);

-- Crear la tabla PropertyRules
CREATE TABLE IF NOT EXISTS PropertyRules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT,
    rule_text TEXT NOT NULL,
    FOREIGN KEY (property_id) REFERENCES Properties(id) ON DELETE CASCADE
);

-- Crear la tabla Bookings
CREATE TABLE IF NOT EXISTS Bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT,
    client_name VARCHAR(255),
    client_phone VARCHAR(50),
    client_email VARCHAR(255),
    check_in_date DATE,
    check_out_date DATE,
    guests TINYINT UNSIGNED,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    source VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES Properties(id) ON DELETE SET NULL
);

-- Crear la tabla Testimonials
CREATE TABLE IF NOT EXISTS Testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_name VARCHAR(255) NOT NULL,
    author_image_url VARCHAR(255),
    testimonial_text TEXT NOT NULL,
    rating INT NOT NULL DEFAULT 5,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear la tabla Users para administradores
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
