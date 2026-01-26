const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Aero Clic - Business API',
      version: '1.0.0',
      description: 'API de gestion des scores et sessions de jeu pour Aero Clic',
      contact: {
        name: 'Aero Clic Team',
        email: 'contact@aeroclic.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'Serveur Business API (accès direct - dev only)'
      },
      {
        url: 'http://localhost:5000/api',
        description: 'Via API Gateway (recommandé)'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT fourni par l\'API Gateway'
        }
      },
      schemas: {
        Score: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID unique du score'
            },
            user_id: {
              type: 'integer',
              description: 'ID de l\'utilisateur'
            },
            game_id: {
              type: 'integer',
              description: 'ID du jeu'
            },
            score: {
              type: 'integer',
              description: 'Score obtenu'
            },
            played_at: {
              type: 'string',
              format: 'date-time',
              description: 'Date et heure du score'
            }
          }
        },
        SubmitScoreRequest: {
          type: 'object',
          required: ['score'],
          properties: {
            gameId: {
              type: 'integer',
              default: 1,
              description: 'ID du jeu (1=ClickGame, 2=MemoryGame, 3=ReflexGame)'
            },
            score: {
              type: 'integer',
              description: 'Score obtenu'
            }
          }
        },
        LeaderboardEntry: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              description: 'Nom d\'utilisateur'
            },
            best_score: {
              type: 'integer',
              description: 'Meilleur score'
            },
            games_played: {
              type: 'integer',
              description: 'Nombre de parties jouées'
            }
          }
        },
        PersonalBest: {
          type: 'object',
          properties: {
            bestScore: {
              type: 'integer',
              description: 'Meilleur score personnel'
            },
            gamesPlayed: {
              type: 'integer',
              description: 'Nombre total de parties jouées'
            }
          }
        },
        GameSession: {
          type: 'object',
          properties: {
            sessionId: {
              type: 'string',
              description: 'ID unique de la session'
            },
            userId: {
              type: 'integer',
              description: 'ID de l\'utilisateur'
            },
            gameId: {
              type: 'integer',
              description: 'ID du jeu'
            },
            startedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de début de session'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Message d\'erreur'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

module.exports = swaggerSpec;
