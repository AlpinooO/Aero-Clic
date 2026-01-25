const express = require('express');
const router = express.Router();
const { getRedisClient } = require('../config/redis.config');

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
