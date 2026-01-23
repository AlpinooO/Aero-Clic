CREATE DATABASE IF NOT EXISTS aeroclic;
USE aeroclic;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    username VARCHAR(50) NOT NULL,
    score INT NOT NULL,
    level INT NOT NULL,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);



INSERT INTO users (username, email, password) VALUES
('admin', 'admin@aeroclic.com', 'password123'),
('player1', 'player1@aeroclic.com', 'password123'),
('player2', 'player2@aeroclic.com', 'password123');

INSERT INTO scores (user_id, username, score, level) VALUES
(1, 'admin', 500, 10),
(1, 'admin', 750, 15),
(2, 'player1', 420, 8),
(2, 'player1', 890, 18),
(3, 'player2', 650, 12),
(3, 'player2', 1200, 22);

