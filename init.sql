-- Base de données pour Aero Clic - Salle de Gym Virtuelle
CREATE DATABASE IF NOT EXISTS aeroclic;
USE aeroclic;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Table des utilisateurs de la salle de gym virtuelle';

-- Table des scores
CREATE TABLE IF NOT EXISTS scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    game_id INT NOT NULL,
    score INT NOT NULL DEFAULT 0,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_game (user_id, game_id),
    INDEX idx_leaderboard (game_id, score DESC),
    INDEX idx_user_scores (user_id, played_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Table des scores des mini-jeux';

-- Table des jeux disponibles (optionnel mais utile pour la cohérence)
CREATE TABLE IF NOT EXISTS games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Liste des mini-jeux disponibles';

-- Données de test pour le développement
-- Mot de passe pour tous les utilisateurs de test : "password123" (hashé avec bcrypt)
INSERT INTO users (username, password, email) VALUES
('admin', '$2a$10$rXQZvXkf9V5w5ZvXkf9V5uE1vF5kD9fHf9fHf9fHf9fHf9fHf9fHe', 'admin@aeroclic.com'),
('athlete1', '$2a$10$rXQZvXkf9V5w5ZvXkf9V5uE1vF5kD9fHf9fHf9fHf9fHf9fHf9fHe', 'athlete1@aeroclic.com'),
('champion', '$2a$10$rXQZvXkf9V5w5ZvXkf9V5uE1vF5kD9fHf9fHf9fHf9fHf9fHf9fHe', 'champion@aeroclic.com')
ON DUPLICATE KEY UPDATE username=username;

-- Jeux disponibles
INSERT INTO games (id, name, description) VALUES
(1, 'Click Game', 'Jeu de clics rapides pour tester la vitesse'),
(2, 'Memory Game', 'Jeu de mémoire pour entraîner la concentration'),
(3, 'Reflex Game', 'Jeu de réflexes pour améliorer les temps de réaction')
ON DUPLICATE KEY UPDATE name=name;

-- Scores de test
INSERT INTO scores (user_id, game_id, score) VALUES
(1, 1, 500),
(1, 1, 750),
(1, 2, 420),
(2, 1, 890),
(2, 2, 650),
(3, 1, 1200),
(3, 2, 980),
(3, 3, 1500)
ON DUPLICATE KEY UPDATE score=score;
