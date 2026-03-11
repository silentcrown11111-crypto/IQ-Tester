-- PakAuctions Database Schema
-- Focus: Realistic Product Data & Angular Images

CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    category_id INT,
    condition ENUM('New', 'Used', 'Certified Pre-Owned') DEFAULT 'Used',
    location VARCHAR(255) NOT NULL,
    length_cm DECIMAL(10, 2),
    weight_kg DECIMAL(10, 2),
    original_parts VARCHAR(500) DEFAULT 'Factory Standard',
    legal_flag BOOLEAN DEFAULT TRUE,
    description LONGTEXT NOT NULL,
    starting_bid DECIMAL(15, 2) NOT NULL,
    current_bid DECIMAL(15, 2) NOT NULL,
    seller_name VARCHAR(255) DEFAULT 'Verified Seller',
    seller_rating DECIMAL(3, 2) DEFAULT 4.8,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE product_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    image_path VARCHAR(500) NOT NULL,
    angle_type ENUM('Front', 'Back', 'Side-Left', 'Side-Right', 'Top', 'Bottom', 'Close-up') NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Optimized query for filtered marketplace grid
-- Parameters: :min_price, :max_price, :category_id, :status
-- SELECT p.*, pi.image_path as primary_image
-- FROM products p
-- LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
-- WHERE p.current_bid BETWEEN :min_price AND :max_price
-- AND (:category_id IS NULL OR p.category_id = :category_id)
-- ORDER BY p.created_at DESC;
