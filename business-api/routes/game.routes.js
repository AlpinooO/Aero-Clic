const express = require('express');
const router = express.Router();
const { getRedisClient } = require('../config/redis.config');

/**
 * @swagger
 * /game/start:
 *   post:
 *     summary: Start a new game session
 *     description: Initialize a new game session for the authenticated user with Redis caching
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Game session started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game started
 *                 session:
 *                   $ref: '#/components/schemas/GameSession'
 *       401:
 *         description: User authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Start new game session
router.post('/start', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const username = req.headers['x-username'];

    if (!userId || !username) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    const gameSession = {
      userId,
      username,
      startTime: Date.now(),
      level: 1,
      score: 0,
      clicks: 0
    };

    const redis = await getRedisClient();
    if (redis) {
      await redis.setEx(`game:${userId}`, 3600, JSON.stringify(gameSession)); // 1 hour expiry
    }

    res.json({
      message: 'Game started',
      session: gameSession
    });
  } catch (error) {
    console.error('Start game error:', error);
    res.status(500).json({ error: 'Failed to start game' });
  }
});

/**
 * @swagger
 * /game/update:
 *   post:
 *     summary: Update game progress
 *     description: Update the current game session with new level, score, or clicks
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               level:
 *                 type: integer
 *                 example: 3
 *               score:
 *                 type: integer
 *                 example: 1500
 *               clicks:
 *                 type: integer
 *                 example: 45
 *     responses:
 *       200:
 *         description: Game updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game updated
 *                 session:
 *                   $ref: '#/components/schemas/GameSession'
 *       401:
 *         description: User authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: No active game session found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       503:
 *         description: Game service unavailable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Update game progress
router.post('/update', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { level, score, clicks } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    const redis = await getRedisClient();
    if (!redis) {
      return res.status(503).json({ error: 'Game service unavailable' });
    }

    const sessionData = await redis.get(`game:${userId}`);
    if (!sessionData) {
      return res.status(404).json({ error: 'No active game session found' });
    }

    const session = JSON.parse(sessionData);
    session.level = level || session.level;
    session.score = score || session.score;
    session.clicks = clicks || session.clicks;
    session.lastUpdate = Date.now();

    await redis.setEx(`game:${userId}`, 3600, JSON.stringify(session));

    res.json({
      message: 'Game updated',
      session
    });
  } catch (error) {
    console.error('Update game error:', error);
    res.status(500).json({ error: 'Failed to update game' });
  }
});

/**
 * @swagger
 * /game/session:
 *   get:
 *     summary: Get current game session
 *     description: Retrieve the active game session for the authenticated user from Redis
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Game session retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 session:
 *                   $ref: '#/components/schemas/GameSession'
 *       401:
 *         description: User authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: No active game session found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       503:
 *         description: Game service unavailable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Get current game session
router.get('/session', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    const redis = await getRedisClient();
    if (!redis) {
      return res.status(503).json({ error: 'Game service unavailable' });
    }

    const sessionData = await redis.get(`game:${userId}`);
    if (!sessionData) {
      return res.status(404).json({ error: 'No active game session found' });
    }

    res.json({
      session: JSON.parse(sessionData)
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ error: 'Failed to fetch game session' });
  }
});

/**
 * @swagger
 * /game/end:
 *   post:
 *     summary: End game session
 *     description: Terminate the current game session and return final game state
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Game session ended successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game ended
 *                 finalSession:
 *                   allOf:
 *                     - $ref: '#/components/schemas/GameSession'
 *                     - nullable: true
 *       401:
 *         description: User authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// End game session
router.post('/end', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    const redis = await getRedisClient();
    if (redis) {
      const sessionData = await redis.get(`game:${userId}`);
      await redis.del(`game:${userId}`);
      
      res.json({
        message: 'Game ended',
        finalSession: sessionData ? JSON.parse(sessionData) : null
      });
    } else {
      res.json({ message: 'Game ended' });
    }
  } catch (error) {
    console.error('End game error:', error);
    res.status(500).json({ error: 'Failed to end game' });
  }
});

module.exports = router;
