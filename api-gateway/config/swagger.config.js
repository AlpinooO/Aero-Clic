const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Aero Clic - API Gateway',
      version: '1.0.0',
      description: 'API d\'authentification et proxy pour Aero Clic - Gym Virtuel',
      contact: {
        name: 'Aero Clic Team',
        email: 'contact@aeroclic.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Serveur de développement'
      },
      {
        url: 'http://localhost:80',
        description: 'Serveur de production'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT pour l\'authentification'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID unique de l\'utilisateur'
            },
            username: {
              type: 'string',
              description: 'Nom d\'utilisateur'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Adresse email'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création du compte'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              description: 'Nom d\'utilisateur'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Mot de passe'
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['username', 'password', 'email'],
          properties: {
            username: {
              type: 'string',
              description: 'Nom d\'utilisateur (unique)'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Mot de passe (min 6 caractères)'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Adresse email (unique)'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'Token JWT pour l\'authentification'
            },
            user: {
              $ref: '#/components/schemas/User'
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
